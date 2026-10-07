import { prisma } from "../lib/server/prisma";

async function main() {
  const [users, sessions, confirmedBookings, waitingEntries, availableSeedSession, fullSeedSession] = await Promise.all([
    prisma.user.count(),
    prisma.classSession.count(),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.waitlistEntry.count({ where: { status: "WAITING" } }),
    prisma.classSession.findUnique({
      where: { id: "00000000-0000-4000-8000-000000000302" },
      select: { startsAt: true, capacity: true, _count: { select: { bookings: { where: { status: "CONFIRMED" } } } } },
    }),
    prisma.classSession.findUnique({
      where: { id: "00000000-0000-4000-8000-000000000303" },
      select: { startsAt: true, capacity: true, bookingCutoffMinutes: true, _count: { select: { bookings: { where: { status: "CONFIRMED" } }, waitlistEntries: { where: { status: "WAITING" } } } } },
    }),
  ]);

  if (users < 6 || sessions < 3 || confirmedBookings < 4 || waitingEntries < 4 || !availableSeedSession || availableSeedSession.startsAt <= new Date() || availableSeedSession._count.bookings >= availableSeedSession.capacity || !fullSeedSession || fullSeedSession.startsAt <= new Date() || fullSeedSession._count.bookings !== fullSeedSession.capacity || fullSeedSession._count.waitlistEntries < 2) {
    throw new Error("The fictional seed data is incomplete. Run npm run prisma:seed.");
  }

  console.log({ users, sessions, confirmedBookings, waitingEntries, hasUpcomingAvailableSession: true, hasUpcomingFullSessionWithWaitlist: true });
}

main().finally(() => prisma.$disconnect());
