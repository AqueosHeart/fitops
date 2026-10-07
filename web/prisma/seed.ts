import "dotenv/config";
import { randomBytes } from "node:crypto";
import argon2 from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed the local database.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

const ids = {
  trainerUser: "00000000-0000-4000-8000-000000000101",
  trainerProfile: "00000000-0000-4000-8000-000000000102",
  adminUser: "00000000-0000-4000-8000-000000000103",
  program: "00000000-0000-4000-8000-000000000201",
  session: "00000000-0000-4000-8000-000000000301",
  availableSession: "00000000-0000-4000-8000-000000000302",
  fullSession: "00000000-0000-4000-8000-000000000303",
  bookingOne: "00000000-0000-4000-8000-000000000401",
  bookingTwo: "00000000-0000-4000-8000-000000000402",
  waitOne: "00000000-0000-4000-8000-000000000501",
  waitTwo: "00000000-0000-4000-8000-000000000502",
  fullBookingOne: "00000000-0000-4000-8000-000000000403",
  fullBookingTwo: "00000000-0000-4000-8000-000000000404",
  fullWaitOne: "00000000-0000-4000-8000-000000000503",
  fullWaitTwo: "00000000-0000-4000-8000-000000000504",
};

const members = [
  ["00000000-0000-4000-8000-000000000011", "00000000-0000-4000-8000-000000000021", "alex.rivera@example.test", "Alex Rivera"],
  ["00000000-0000-4000-8000-000000000012", "00000000-0000-4000-8000-000000000022", "jordan.lee@example.test", "Jordan Lee"],
  ["00000000-0000-4000-8000-000000000013", "00000000-0000-4000-8000-000000000023", "casey.morgan@example.test", "Casey Morgan"],
  ["00000000-0000-4000-8000-000000000014", "00000000-0000-4000-8000-000000000024", "taylor.chen@example.test", "Taylor Chen"],
] as const;

const demoUserIds = [ids.trainerUser, ids.adminUser, ...members.map(([userId]) => userId)];

async function main() {
  const now = new Date();
  const startsAt = new Date(now.getTime() + 48 * 60 * 60 * 1000);
  startsAt.setUTCMinutes(0, 0, 0);
  const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);
  const availableStartsAt = new Date(startsAt.getTime() + 72 * 60 * 60 * 1000);
  const availableEndsAt = new Date(availableStartsAt.getTime() + 60 * 60 * 1000);
  const fullStartsAt = new Date(availableStartsAt.getTime() + 24 * 60 * 60 * 1000);
  const fullEndsAt = new Date(fullStartsAt.getTime() + 60 * 60 * 1000);
  const configuredDemoPassword = process.env.FITOPS_DEMO_PASSWORD;
  if (configuredDemoPassword && (configuredDemoPassword.length < 15 || configuredDemoPassword.length > 128)) {
    throw new Error("FITOPS_DEMO_PASSWORD must be 15-128 characters when set.");
  }
  const passwordHash = await argon2.hash(configuredDemoPassword || randomBytes(32).toString("base64url"), { type: argon2.argon2id });

  await prisma.$transaction(async (tx) => {
    // Credentials are rebuilt below. Remove all old sessions so reseeding cannot
    // retain authority authenticated with a previous generated credential hash.
    await tx.authSession.deleteMany({ where: { userId: { in: demoUserIds } } });

    // Reset every participation row for the deterministic demo session first.
    // Delete bookings before waitlist rows because promoted bookings reference them.
    await tx.booking.deleteMany({ where: { sessionId: ids.session } });
    await tx.waitlistEntry.deleteMany({ where: { sessionId: ids.session } });
    await tx.booking.deleteMany({ where: { sessionId: ids.fullSession } });
    await tx.waitlistEntry.deleteMany({ where: { sessionId: ids.fullSession } });

    await tx.user.upsert({
      where: { email: "maya.coach@example.test" },
      update: { name: "Maya Coach", role: "TRAINER", passwordHash },
      create: { id: ids.trainerUser, email: "maya.coach@example.test", name: "Maya Coach", role: "TRAINER", passwordHash },
    });
    await tx.authAccount.upsert({
      where: { providerId_accountId: { providerId: "credential", accountId: ids.trainerUser } },
      update: { password: passwordHash },
      create: { userId: ids.trainerUser, providerId: "credential", accountId: ids.trainerUser, password: passwordHash },
    });
    await tx.user.upsert({
      where: { email: "admin@example.test" },
      update: { name: "Practice Admin", role: "ADMINISTRATOR", passwordHash },
      create: { id: ids.adminUser, email: "admin@example.test", name: "Practice Admin", role: "ADMINISTRATOR", passwordHash },
    });
    await tx.authAccount.upsert({
      where: { providerId_accountId: { providerId: "credential", accountId: ids.adminUser } },
      update: { password: passwordHash },
      create: { userId: ids.adminUser, providerId: "credential", accountId: ids.adminUser, password: passwordHash },
    });
    await tx.trainerProfile.upsert({
      where: { userId: ids.trainerUser },
      update: { bio: "Fictional strength coach for the FitOps demo.", specialties: ["Strength", "Mobility"] },
      create: { id: ids.trainerProfile, userId: ids.trainerUser, bio: "Fictional strength coach for the FitOps demo.", specialties: ["Strength", "Mobility"] },
    });

    for (const [userId, profileId, email, name] of members) {
      await tx.user.upsert({ where: { email }, update: { name, role: "MEMBER", passwordHash }, create: { id: userId, email, name, role: "MEMBER", passwordHash } });
      await tx.authAccount.upsert({
        where: { providerId_accountId: { providerId: "credential", accountId: userId } },
        update: { password: passwordHash },
        create: { userId, providerId: "credential", accountId: userId, password: passwordHash },
      });
      await tx.memberProfile.upsert({ where: { userId }, update: { status: "ACTIVE", selectedPlanCode: "COMPLETE", planSelectedAt: now, termsPrivacyAcceptedAt: now, waiverSignedAt: now }, create: { id: profileId, userId, status: "ACTIVE", selectedPlanCode: "COMPLETE", planSelectedAt: now, termsPrivacyAcceptedAt: now, waiverSignedAt: now } });
    }

    await tx.program.upsert({ where: { slug: "strength-foundations" }, update: { name: "Strength Foundations", description: "Fictional beginner strength class.", intensity: "Moderate", durationMinutes: 60, isPublished: true }, create: { id: ids.program, slug: "strength-foundations", name: "Strength Foundations", description: "Fictional beginner strength class.", intensity: "Moderate", durationMinutes: 60 } });
    await tx.classSession.upsert({ where: { id: ids.session }, update: { programId: ids.program, trainerId: ids.trainerProfile, startsAt, endsAt, capacity: 2, bookingCutoffMinutes: 30, status: "SCHEDULED", nextPositionKey: 3n }, create: { id: ids.session, programId: ids.program, trainerId: ids.trainerProfile, startsAt, endsAt, capacity: 2, bookingCutoffMinutes: 30, status: "SCHEDULED", nextPositionKey: 3n } });
    await tx.classSession.upsert({ where: { id: ids.availableSession }, update: { programId: ids.program, trainerId: ids.trainerProfile, startsAt: availableStartsAt, endsAt: availableEndsAt, capacity: 6, bookingCutoffMinutes: 30, status: "SCHEDULED", nextPositionKey: 1n }, create: { id: ids.availableSession, programId: ids.program, trainerId: ids.trainerProfile, startsAt: availableStartsAt, endsAt: availableEndsAt, capacity: 6, bookingCutoffMinutes: 30, status: "SCHEDULED", nextPositionKey: 1n } });
    await tx.classSession.upsert({ where: { id: ids.fullSession }, update: { programId: ids.program, trainerId: ids.trainerProfile, startsAt: fullStartsAt, endsAt: fullEndsAt, capacity: 2, bookingCutoffMinutes: 30, status: "SCHEDULED", nextPositionKey: 3n }, create: { id: ids.fullSession, programId: ids.program, trainerId: ids.trainerProfile, startsAt: fullStartsAt, endsAt: fullEndsAt, capacity: 2, bookingCutoffMinutes: 30, status: "SCHEDULED", nextPositionKey: 3n } });
    await tx.booking.upsert({ where: { id: ids.bookingOne }, update: { memberId: members[0][1], sessionId: ids.session, status: "CONFIRMED", bookedAt: now, cancelledAt: null }, create: { id: ids.bookingOne, memberId: members[0][1], sessionId: ids.session, status: "CONFIRMED", bookedAt: now } });
    await tx.booking.upsert({ where: { id: ids.bookingTwo }, update: { memberId: members[1][1], sessionId: ids.session, status: "CONFIRMED", bookedAt: now, cancelledAt: null }, create: { id: ids.bookingTwo, memberId: members[1][1], sessionId: ids.session, status: "CONFIRMED", bookedAt: now } });
    await tx.waitlistEntry.upsert({ where: { id: ids.waitOne }, update: { memberId: members[2][1], sessionId: ids.session, status: "WAITING", positionKey: 1n, joinedAt: now, resolvedAt: null }, create: { id: ids.waitOne, memberId: members[2][1], sessionId: ids.session, status: "WAITING", positionKey: 1n, joinedAt: now } });
    await tx.waitlistEntry.upsert({ where: { id: ids.waitTwo }, update: { memberId: members[3][1], sessionId: ids.session, status: "WAITING", positionKey: 2n, joinedAt: now, resolvedAt: null }, create: { id: ids.waitTwo, memberId: members[3][1], sessionId: ids.session, status: "WAITING", positionKey: 2n, joinedAt: now } });
    await tx.booking.upsert({ where: { id: ids.fullBookingOne }, update: { memberId: members[0][1], sessionId: ids.fullSession, status: "CONFIRMED", bookedAt: now, cancelledAt: null }, create: { id: ids.fullBookingOne, memberId: members[0][1], sessionId: ids.fullSession, status: "CONFIRMED", bookedAt: now } });
    await tx.booking.upsert({ where: { id: ids.fullBookingTwo }, update: { memberId: members[1][1], sessionId: ids.fullSession, status: "CONFIRMED", bookedAt: now, cancelledAt: null }, create: { id: ids.fullBookingTwo, memberId: members[1][1], sessionId: ids.fullSession, status: "CONFIRMED", bookedAt: now } });
    await tx.waitlistEntry.upsert({ where: { id: ids.fullWaitOne }, update: { memberId: members[2][1], sessionId: ids.fullSession, status: "WAITING", positionKey: 1n, joinedAt: now, resolvedAt: null }, create: { id: ids.fullWaitOne, memberId: members[2][1], sessionId: ids.fullSession, status: "WAITING", positionKey: 1n, joinedAt: now } });
    await tx.waitlistEntry.upsert({ where: { id: ids.fullWaitTwo }, update: { memberId: members[3][1], sessionId: ids.fullSession, status: "WAITING", positionKey: 2n, joinedAt: now, resolvedAt: null }, create: { id: ids.fullWaitTwo, memberId: members[3][1], sessionId: ids.fullSession, status: "WAITING", positionKey: 2n, joinedAt: now } });
  });

  console.log("Fictional FitOps seed data is ready.");
}

main().finally(() => prisma.$disconnect());
