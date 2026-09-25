import "server-only";

import { withBookingLocks } from "@/lib/server/booking/with-booking-locks";

export type CancelBookingResult =
  | { code: "CANCELLED"; promotedMemberId?: string }
  | { code: "BOOKING_NOT_FOUND" | "BOOKING_CUTOFF_PASSED" | "MEMBERSHIP_INACTIVE" };

export async function cancelBooking(sessionId: string, memberId: string): Promise<CancelBookingResult> {
  return withBookingLocks(sessionId, memberId, async (tx) => {
    const booking = await tx.booking.findFirst({ where: { sessionId, memberId, status: "CONFIRMED" } });
    if (!booking) return { code: "BOOKING_NOT_FOUND" };
    const session = await tx.classSession.findUniqueOrThrow({ where: { id: sessionId } });
    const clock = await tx.$queryRaw<{ now: Date }[]>`SELECT clock_timestamp() AS "now"`;
    const now = clock[0]?.now;
    if (!now) throw new Error("Database clock was not returned.");
    if (now >= new Date(session.startsAt.getTime() - session.bookingCutoffMinutes * 60_000)) return { code: "BOOKING_CUTOFF_PASSED" };

    await tx.booking.update({ where: { id: booking.id }, data: { status: "CANCELLED", cancelledAt: now } });
    const candidate = await tx.waitlistEntry.findFirst({ where: { sessionId, status: "WAITING" }, orderBy: { positionKey: "asc" } });
    if (!candidate) return { code: "CANCELLED" };
    await tx.$queryRaw`SELECT "id" FROM "member_profiles" WHERE "id" = ${candidate.memberId}::uuid FOR UPDATE`;
    const member = await tx.memberProfile.findUniqueOrThrow({ where: { id: candidate.memberId } });
    if (member.status !== "ACTIVE" || !member.waiverSignedAt) {
      await tx.waitlistEntry.update({ where: { id: candidate.id }, data: { status: "EXPIRED", resolvedAt: now } });
      return { code: "CANCELLED" };
    }
    await tx.waitlistEntry.update({ where: { id: candidate.id }, data: { status: "PROMOTED", resolvedAt: now } });
    await tx.booking.create({ data: { memberId: candidate.memberId, sessionId, status: "CONFIRMED", bookedAt: now, sourceWaitlistEntryId: candidate.id } });
    return { code: "CANCELLED", promotedMemberId: candidate.memberId };
  });
}
