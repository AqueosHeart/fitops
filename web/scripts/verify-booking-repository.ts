import { findSessionForBooking } from "../lib/server/booking/booking-repository";
import { withBookingLocks } from "../lib/server/booking/with-booking-locks";

const sessionId = "00000000-0000-4000-8000-000000000301";
const memberId = "00000000-0000-4000-8000-000000000021";

async function main() {
    const session = await findSessionForBooking(sessionId);

  if (!session) {
    throw new Error("Fictional seed session was not found.");
  }

  const lockedState = await withBookingLocks(sessionId, memberId, async (tx) => ({
    confirmedBookings: await tx.booking.count({
      where: { sessionId, status: "CONFIRMED" },
    }),
    member: await tx.memberProfile.findUniqueOrThrow({
      where: { id: memberId },
      select: { status: true, waiverSignedAt: true },
    }),
  }));

    console.log({
        session: session.program.name,
        trainer: session.trainer.user.name,
        capacity: session.capacity,
    confirmedBookings: session.bookings.length,
    lockedConfirmedBookings: lockedState.confirmedBookings,
    memberStatus: lockedState.member.status,
        waitlist: session.waitlistEntries.map((entry) => ({
            position: Number(entry.positionKey),
            memberId: entry.memberId,
        })),
    });
}

main();
