import "server-only";

import { withBookingLocks } from "@/lib/server/booking/with-booking-locks";
import { reportParticipationInvariant } from "@/lib/server/booking/operational-alert";

export type BookSessionResult =
  | { code: "BOOKED"; bookingId: string }
  | { code: "SESSION_NOT_FOUND" }
  | { code: "MEMBER_NOT_FOUND" }
  | { code: "MEMBERSHIP_INACTIVE" }
  | { code: "WAIVER_REQUIRED" }
  | { code: "SESSION_UNAVAILABLE" }
  | { code: "BOOKING_CUTOFF_PASSED" }
  | { code: "ALREADY_BOOKED" }
  | { code: "ALREADY_WAITING" }
  | { code: "SCHEDULE_OVERLAP" }
  | { code: "SESSION_FULL" }
  | { code: "PARTICIPATION_INVARIANT_BROKEN" };

export async function bookSession(sessionId: string, memberId: string): Promise<BookSessionResult> {
  try {
    return await withBookingLocks(sessionId, memberId, async (tx) => {
      const session = await tx.classSession.findUnique({ where: { id: sessionId } });
      const member = await tx.memberProfile.findUnique({ where: { id: memberId } });
      const databaseClock = await tx.$queryRaw<{ now: Date }[]>`SELECT clock_timestamp() AS "now"`;

      if (!session) return { code: "SESSION_NOT_FOUND" };
      if (!member) return { code: "MEMBER_NOT_FOUND" };
      if (member.status !== "ACTIVE") return { code: "MEMBERSHIP_INACTIVE" };
      if (!member.waiverSignedAt) return { code: "WAIVER_REQUIRED" };
      if (session.status !== "SCHEDULED") return { code: "SESSION_UNAVAILABLE" };

      const now = databaseClock[0]?.now;
      if (!now) throw new Error("Database clock was not returned.");
      const cutoff = new Date(session.startsAt.getTime() - session.bookingCutoffMinutes * 60_000);
      if (now >= cutoff) return { code: "BOOKING_CUTOFF_PASSED" };

      const existingBooking = await tx.booking.findFirst({
        where: { memberId, sessionId, status: "CONFIRMED" },
      });
      const existingWaitlistEntry = await tx.waitlistEntry.findFirst({
        where: { memberId, sessionId, status: "WAITING" },
      });
      const confirmedCount = await tx.booking.count({
        where: { sessionId, status: "CONFIRMED" },
      });
      const waitingCount = await tx.waitlistEntry.count({
        where: { sessionId, status: "WAITING" },
      });
      const overlap = await tx.booking.findFirst({
        where: {
          memberId,
          status: "CONFIRMED",
          session: {
            startsAt: { lt: session.endsAt },
            endsAt: { gt: session.startsAt },
          },
        },
      });

      if (existingBooking) return { code: "ALREADY_BOOKED" };
      if (existingWaitlistEntry) return { code: "ALREADY_WAITING" };
      if (overlap) return { code: "SCHEDULE_OVERLAP" };
      if (waitingCount > 0 && confirmedCount < session.capacity) {
        reportParticipationInvariant({ operation: "book", sessionId, memberId, confirmedCount, waitingCount });
        return { code: "PARTICIPATION_INVARIANT_BROKEN" };
      }
      if (confirmedCount >= session.capacity) return { code: "SESSION_FULL" };

      const booking = await tx.booking.create({
        data: { memberId, sessionId, status: "CONFIRMED", bookedAt: now },
        select: { id: true },
      });

      return { code: "BOOKED", bookingId: booking.id };
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Booking session was not found.") {
      return { code: "SESSION_NOT_FOUND" };
    }
    if (error instanceof Error && error.message === "Member profile was not found.") {
      return { code: "MEMBER_NOT_FOUND" };
    }
    throw error;
  }
}
