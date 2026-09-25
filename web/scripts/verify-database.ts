import { prisma } from "../lib/server/prisma";

async function main() {
  const [users, sessions, confirmedBookings, waitingEntries] = await Promise.all([
    prisma.user.count(),
    prisma.classSession.count(),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.waitlistEntry.count({ where: { status: "WAITING" } }),
  ]);

  if (users < 6 || sessions < 1 || confirmedBookings < 2 || waitingEntries < 2) {
    throw new Error("The fictional seed data is incomplete. Run npm run prisma:seed.");
  }

  console.log({ users, sessions, confirmedBookings, waitingEntries });
}

main().finally(() => prisma.$disconnect());
