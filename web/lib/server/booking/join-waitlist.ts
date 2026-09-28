import "server-only";

import { withBookingLocks } from "@/lib/server/booking/with-booking-locks";
import { reportParticipationInvariant } from "@/lib/server/booking/operational-alert";

export type JoinWaitlistResult =
  | { code: "WAITLIST_JOINED"; entryId: string; position: bigint }
  | { code: "SESSION_NOT_FOUND" | "MEMBER_NOT_FOUND" | "MEMBERSHIP_INACTIVE" | "WAIVER_REQUIRED" | "SESSION_UNAVAILABLE" | "BOOKING_CUTOFF_PASSED" | "ALREADY_BOOKED" | "ALREADY_WAITING" | "SEAT_AVAILABLE" | "PARTICIPATION_INVARIANT_BROKEN" };

export async function joinWaitlist(sessionId: string, memberId: string): Promise<JoinWaitlistResult> {
  try {
    return await withBookingLocks(sessionId, memberId, async (tx) => {
      const session = await tx.classSession.findUnique({ where: { id: sessionId } });
      const member = await tx.memberProfile.findUnique({ where: { id: memberId } });
      const clock = await tx.$queryRaw<{ now: Date }[]>`SELECT clock_timestamp() AS "now"`;
      if (!session) return { code: "SESSION_NOT_FOUND" };
      if (!member) return { code: "MEMBER_NOT_FOUND" };
      if (member.status !== "ACTIVE") return { code: "MEMBERSHIP_INACTIVE" };
      if (!member.waiverSignedAt) return { code: "WAIVER_REQUIRED" };
      if (session.status !== "SCHEDULED") return { code: "SESSION_UNAVAILABLE" };
      const now = clock[0]?.now;
      if (!now) throw new Error("Database clock was not returned.");
      if (now >= new Date(session.startsAt.getTime() - session.bookingCutoffMinutes * 60_000)) return { code: "BOOKING_CUTOFF_PASSED" };

      const booking = await tx.booking.findFirst({ where: { memberId, sessionId, status: "CONFIRMED" } });
      const waiting = await tx.waitlistEntry.findFirst({ where: { memberId, sessionId, status: "WAITING" } });
      if (booking) return { code: "ALREADY_BOOKED" };
      if (waiting) return { code: "ALREADY_WAITING" };
      const confirmedCount = await tx.booking.count({ where: { sessionId, status: "CONFIRMED" } });
      const waitingCount = await tx.waitlistEntry.count({ where: { sessionId, status: "WAITING" } });
      if (confirmedCount < session.capacity) {
        if (waitingCount > 0) {
          reportParticipationInvariant({ operation: "waitlist", sessionId, memberId, confirmedCount, waitingCount });
          return { code: "PARTICIPATION_INVARIANT_BROKEN" };
        }
        return { code: "SEAT_AVAILABLE" };
      }

      const position = session.nextPositionKey;
      const entry = await tx.waitlistEntry.create({ data: { memberId, sessionId, status: "WAITING", positionKey: position, joinedAt: now }, select: { id: true } });
      await tx.classSession.update({ where: { id: sessionId }, data: { nextPositionKey: { increment: 1 } } });
      return { code: "WAITLIST_JOINED", entryId: entry.id, position };
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Booking session was not found.") return { code: "SESSION_NOT_FOUND" };
    if (error instanceof Error && error.message === "Member profile was not found.") return { code: "MEMBER_NOT_FOUND" };
    throw error;
  }
}
