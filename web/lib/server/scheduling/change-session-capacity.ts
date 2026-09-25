import "server-only";

import { prisma } from "@/lib/server/prisma";

export type ChangeSessionCapacityResult =
  | { code: "CAPACITY_UPDATED"; promotedMemberIds: string[] }
  | { code: "SESSION_NOT_FOUND" | "INVALID_CAPACITY" | "CAPACITY_BELOW_CONFIRMED" | "CUTOFF_PASSED" | "CAPACITY_INCREASE_BLOCKED" };

export async function changeSessionCapacity(sessionId: string, capacity: number): Promise<ChangeSessionCapacityResult> {
  if (!Number.isInteger(capacity) || capacity < 1) return { code: "INVALID_CAPACITY" };
  try {
    return await prisma.$transaction(async (tx) => {
      const locked = await tx.$queryRaw<{ id: string }[]>`SELECT "id" FROM "class_sessions" WHERE "id" = ${sessionId}::uuid FOR UPDATE`;
      if (locked.length !== 1) return { code: "SESSION_NOT_FOUND" };
      const session = await tx.classSession.findUniqueOrThrow({ where: { id: sessionId } });
      const confirmedCount = await tx.booking.count({ where: { sessionId, status: "CONFIRMED" } });
      if (capacity < confirmedCount) return { code: "CAPACITY_BELOW_CONFIRMED" };
      const waitingCount = await tx.waitlistEntry.count({ where: { sessionId, status: "WAITING" } });
      const now = (await tx.$queryRaw<{ now: Date }[]>`SELECT clock_timestamp() AS "now"`)[0]?.now;
      if (!now) throw new Error("Database clock was not returned.");
      const cutoff = new Date(session.startsAt.getTime() - session.bookingCutoffMinutes * 60_000);
      if (capacity > session.capacity && waitingCount > 0 && now >= cutoff) return { code: "CAPACITY_INCREASE_BLOCKED" };

      await tx.classSession.update({ where: { id: sessionId }, data: { capacity } });
      const promotedMemberIds: string[] = [];
      let seats = capacity - confirmedCount;
      while (seats > 0) {
        const candidate = await tx.waitlistEntry.findFirst({ where: { sessionId, status: "WAITING" }, orderBy: { positionKey: "asc" } });
        if (!candidate) break;
        await tx.$queryRaw`SELECT "id" FROM "member_profiles" WHERE "id" = ${candidate.memberId}::uuid FOR UPDATE`;
        const freshNow = (await tx.$queryRaw<{ now: Date }[]>`SELECT clock_timestamp() AS "now"`)[0]?.now;
        if (!freshNow || freshNow >= cutoff) throw new Error("CUTOFF_PASSED");
        const member = await tx.memberProfile.findUniqueOrThrow({ where: { id: candidate.memberId } });
        const overlap = await tx.booking.findFirst({ where: { memberId: candidate.memberId, status: "CONFIRMED", session: { startsAt: { lt: session.endsAt }, endsAt: { gt: session.startsAt } } } });
        if (member.status !== "ACTIVE" || !member.waiverSignedAt || overlap) {
          await tx.waitlistEntry.update({ where: { id: candidate.id }, data: { status: "EXPIRED", resolvedAt: freshNow } });
          continue;
        }
        await tx.waitlistEntry.update({ where: { id: candidate.id }, data: { status: "PROMOTED", resolvedAt: freshNow } });
        await tx.booking.create({ data: { memberId: candidate.memberId, sessionId, status: "CONFIRMED", bookedAt: freshNow, sourceWaitlistEntryId: candidate.id } });
        promotedMemberIds.push(candidate.memberId);
        seats -= 1;
      }
      return { code: "CAPACITY_UPDATED", promotedMemberIds };
    });
  } catch (error) {
    if (error instanceof Error && error.message === "CUTOFF_PASSED") return { code: "CUTOFF_PASSED" };
    throw error;
  }
}
