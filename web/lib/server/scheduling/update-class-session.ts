import "server-only";

import { prisma } from "@/lib/server/prisma";
import { withTransactionRetry } from "@/lib/server/booking/with-transaction-retry";

export type ClassSessionChanges = {
  programId?: string;
  trainerId?: string;
  startsAt?: Date;
  endsAt?: Date;
  capacity?: number;
  bookingCutoffMinutes?: number;
};

export type UpdateClassSessionResult =
  | { code: "SESSION_UPDATED"; session: { id: string; programId: string; trainerId: string; startsAt: Date; endsAt: Date; capacity: number; bookingCutoffMinutes: number }; confirmedCount: number; waitingCount: number; promotedMemberIds: string[] }
  | { code: "SESSION_NOT_FOUND" | "SESSION_UNAVAILABLE" | "INVALID_CAPACITY" | "INVALID_INTERVAL" | "INVALID_CUTOFF" | "INVALID_REFERENCE" | "TRAINER_OVERLAP" | "SESSION_HAS_PARTICIPANTS" | "CAPACITY_BELOW_CONFIRMED" | "CUTOFF_PASSED" | "CAPACITY_INCREASE_BLOCKED" };

export async function updateClassSession(sessionId: string, changes: ClassSessionChanges): Promise<UpdateClassSessionResult> {
  if (changes.capacity !== undefined && (!Number.isInteger(changes.capacity) || changes.capacity < 1)) return { code: "INVALID_CAPACITY" };
  if (changes.bookingCutoffMinutes !== undefined && (!Number.isInteger(changes.bookingCutoffMinutes) || changes.bookingCutoffMinutes < 0)) return { code: "INVALID_CUTOFF" };
  if (changes.startsAt && changes.endsAt && changes.startsAt >= changes.endsAt) return { code: "INVALID_INTERVAL" };

  try {
    return await withTransactionRetry(() => prisma.$transaction(async (tx) => {
      const locked = await tx.$queryRaw<{ id: string }[]>`SELECT "id" FROM "class_sessions" WHERE "id" = ${sessionId}::uuid FOR UPDATE`;
      if (locked.length !== 1) return { code: "SESSION_NOT_FOUND" };
      const current = await tx.classSession.findUniqueOrThrow({ where: { id: sessionId } });
      if (current.status !== "SCHEDULED") return { code: "SESSION_UNAVAILABLE" };

      const hasParticipation = (await tx.booking.count({ where: { sessionId } })) > 0
        || (await tx.waitlistEntry.count({ where: { sessionId } })) > 0;
      const schedulingFieldsChanged = changes.programId !== undefined
        || changes.trainerId !== undefined
        || changes.startsAt !== undefined
        || changes.endsAt !== undefined
        || changes.bookingCutoffMinutes !== undefined;
      if (hasParticipation && schedulingFieldsChanged) return { code: "SESSION_HAS_PARTICIPANTS" };

      const startsAt = changes.startsAt ?? current.startsAt;
      const endsAt = changes.endsAt ?? current.endsAt;
      const trainerId = changes.trainerId ?? current.trainerId;
      const programId = changes.programId ?? current.programId;
      const capacity = changes.capacity ?? current.capacity;
      const bookingCutoffMinutes = changes.bookingCutoffMinutes ?? current.bookingCutoffMinutes;
      if (startsAt >= endsAt) return { code: "INVALID_INTERVAL" };

      if (schedulingFieldsChanged) {
        const trainerLock = await tx.$queryRaw<{ id: string }[]>`SELECT "id" FROM "trainer_profiles" WHERE "id" = ${trainerId}::uuid FOR UPDATE`;
        if (trainerLock.length !== 1) return { code: "INVALID_REFERENCE" };
        const trainer = await tx.trainerProfile.findUnique({ where: { id: trainerId }, include: { user: { select: { role: true } } } });
        const program = await tx.program.findUnique({ where: { id: programId }, select: { id: true } });
        if (!trainer || trainer.user.role !== "TRAINER" || !program) return { code: "INVALID_REFERENCE" };
        const overlap = await tx.classSession.findFirst({
          where: { id: { not: sessionId }, trainerId, startsAt: { lt: endsAt }, endsAt: { gt: startsAt } },
          select: { id: true },
        });
        if (overlap) return { code: "TRAINER_OVERLAP" };
      }

      const confirmedCount = await tx.booking.count({ where: { sessionId, status: "CONFIRMED" } });
      if (capacity < confirmedCount) return { code: "CAPACITY_BELOW_CONFIRMED" };
      const waitingCount = await tx.waitlistEntry.count({ where: { sessionId, status: "WAITING" } });
      const now = (await tx.$queryRaw<{ now: Date }[]>`SELECT clock_timestamp() AS "now"`)[0]?.now;
      if (!now) throw new Error("Database clock was not returned.");
      const cutoff = new Date(startsAt.getTime() - bookingCutoffMinutes * 60_000);
      if (capacity > current.capacity && waitingCount > 0 && now >= cutoff) return { code: "CAPACITY_INCREASE_BLOCKED" };

      const updated = await tx.classSession.update({
        where: { id: sessionId },
        data: { programId, trainerId, startsAt, endsAt, capacity, bookingCutoffMinutes },
        select: { id: true, programId: true, trainerId: true, startsAt: true, endsAt: true, capacity: true, bookingCutoffMinutes: true },
      });

      const promotedMemberIds: string[] = [];
      let seats = capacity - confirmedCount;
      while (capacity > current.capacity && seats > 0) {
        const candidate = await tx.waitlistEntry.findFirst({ where: { sessionId, status: "WAITING" }, orderBy: { positionKey: "asc" } });
        if (!candidate) break;
        await tx.$queryRaw`SELECT "id" FROM "member_profiles" WHERE "id" = ${candidate.memberId}::uuid FOR UPDATE`;
        const freshNow = (await tx.$queryRaw<{ now: Date }[]>`SELECT clock_timestamp() AS "now"`)[0]?.now;
        if (!freshNow || freshNow >= cutoff) throw new Error("CUTOFF_PASSED");
        const member = await tx.memberProfile.findUniqueOrThrow({ where: { id: candidate.memberId } });
        const overlap = await tx.booking.findFirst({ where: { memberId: candidate.memberId, status: "CONFIRMED", session: { startsAt: { lt: endsAt }, endsAt: { gt: startsAt } } } });
        if (member.status !== "ACTIVE" || !member.waiverSignedAt || overlap) {
          await tx.waitlistEntry.update({ where: { id: candidate.id }, data: { status: "EXPIRED", resolvedAt: freshNow } });
          continue;
        }
        await tx.waitlistEntry.update({ where: { id: candidate.id }, data: { status: "PROMOTED", resolvedAt: freshNow } });
        await tx.booking.create({ data: { memberId: candidate.memberId, sessionId, status: "CONFIRMED", bookedAt: freshNow, sourceWaitlistEntryId: candidate.id } });
        promotedMemberIds.push(candidate.memberId);
        seats -= 1;
      }
      const finalConfirmedCount = await tx.booking.count({ where: { sessionId, status: "CONFIRMED" } });
      const finalWaitingCount = await tx.waitlistEntry.count({ where: { sessionId, status: "WAITING" } });
      return { code: "SESSION_UPDATED", session: updated, confirmedCount: finalConfirmedCount, waitingCount: finalWaitingCount, promotedMemberIds };
    }));
  } catch (error) {
    if (error instanceof Error && error.message === "CUTOFF_PASSED") return { code: "CUTOFF_PASSED" };
    if (error instanceof Error && error.message.includes("class_sessions_trainer_interval_exclusion")) return { code: "TRAINER_OVERLAP" };
    throw error;
  }
}
