import assert from "node:assert/strict";
import test from "node:test";
import { bookSession } from "../../lib/server/booking/book-session";
import { joinWaitlist } from "../../lib/server/booking/join-waitlist";
import { prisma } from "../../lib/server/prisma";

const sessionId = "10000000-0000-4000-8000-000000000001";
const trainerUserId = "10000000-0000-4000-8000-000000000002";
const trainerId = "10000000-0000-4000-8000-000000000003";
const programId = "10000000-0000-4000-8000-000000000004";
const memberIds = ["10000000-0000-4000-8000-000000000011", "10000000-0000-4000-8000-000000000012", "10000000-0000-4000-8000-000000000013"];
const userIds = ["10000000-0000-4000-8000-000000000021", "10000000-0000-4000-8000-000000000022", "10000000-0000-4000-8000-000000000023"];

async function cleanup() {
  await prisma.booking.deleteMany({ where: { sessionId } });
  await prisma.waitlistEntry.deleteMany({ where: { sessionId } });
  await prisma.classSession.deleteMany({ where: { id: sessionId } });
  await prisma.memberProfile.deleteMany({ where: { id: { in: memberIds } } });
  await prisma.trainerProfile.deleteMany({ where: { id: trainerId } });
  await prisma.user.deleteMany({ where: { id: { in: [...userIds, trainerUserId] } } });
  await prisma.program.deleteMany({ where: { id: programId } });
}

test("two members race for the final seat", async () => {
  await cleanup();
  const now = new Date();
  const start = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  await prisma.user.create({ data: { id: trainerUserId, email: "race.trainer@example.test", name: "Race Trainer", role: "TRAINER", passwordHash: "test" } });
  await prisma.trainerProfile.create({ data: { id: trainerId, userId: trainerUserId, bio: "test", specialties: [] } });
  await prisma.program.create({ data: { id: programId, slug: "race-program", name: "Race", description: "test", intensity: "low", durationMinutes: 60 } });
  for (let i = 0; i < 2; i++) { await prisma.user.create({ data: { id: userIds[i], email: `race.member${i}@example.test`, name: `Member ${i}`, role: "MEMBER", passwordHash: "test" } }); await prisma.memberProfile.create({ data: { id: memberIds[i], userId: userIds[i], status: "ACTIVE", waiverSignedAt: now } }); }
  await prisma.classSession.create({ data: { id: sessionId, programId, trainerId, startsAt: start, endsAt: end, capacity: 1, bookingCutoffMinutes: 15 } });
  const results = await Promise.all(memberIds.slice(0, 2).map((id) => bookSession(sessionId, id)));
  assert.deepEqual(results.map((r) => r.code).sort(), ["BOOKED", "SESSION_FULL"]);
  assert.equal(await prisma.booking.count({ where: { sessionId, status: "CONFIRMED" } }), 1);
  await cleanup();
});

test("two members receive unique FIFO waitlist positions", async () => {
  await cleanup();
  const now = new Date(); const start = new Date(now.getTime() + 2 * 60 * 60 * 1000); const end = new Date(start.getTime() + 60 * 60 * 1000);
  await prisma.user.create({ data: { id: trainerUserId, email: "race.trainer@example.test", name: "Race Trainer", role: "TRAINER", passwordHash: "test" } });
  await prisma.trainerProfile.create({ data: { id: trainerId, userId: trainerUserId, bio: "test", specialties: [] } });
  await prisma.program.create({ data: { id: programId, slug: "race-program", name: "Race", description: "test", intensity: "low", durationMinutes: 60 } });
  for (let i = 0; i < 3; i++) { await prisma.user.create({ data: { id: userIds[i], email: `race.member${i}@example.test`, name: `Member ${i}`, role: "MEMBER", passwordHash: "test" } }); await prisma.memberProfile.create({ data: { id: memberIds[i], userId: userIds[i], status: "ACTIVE", waiverSignedAt: now } }); }
  await prisma.classSession.create({ data: { id: sessionId, programId, trainerId, startsAt: start, endsAt: end, capacity: 1, bookingCutoffMinutes: 15 } });
  await prisma.booking.create({ data: { memberId: memberIds[2], sessionId, status: "CONFIRMED", bookedAt: now } });
  const results = await Promise.all(memberIds.slice(0, 2).map((id) => joinWaitlist(sessionId, id)));
  assert.deepEqual(results.map((r) => r.code).sort(), ["WAITLIST_JOINED", "WAITLIST_JOINED"]);
  const entries = await prisma.waitlistEntry.findMany({ where: { sessionId }, orderBy: { positionKey: "asc" } });
  assert.deepEqual(entries.map((entry) => entry.positionKey), [1n, 2n]);
  await cleanup();
});
