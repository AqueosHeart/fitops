import assert from "node:assert/strict";
import test from "node:test";
import { prisma } from "../../lib/server/prisma";

const sessionId = "00000000-0000-4000-8000-000000000301";
const bookedMemberId = "00000000-0000-4000-8000-000000000021";

test.before(async () => {
  // A connection failure also rejects a write. Prove the database is reachable
  // first so assert.rejects below demonstrates a constraint, not an outage.
  await prisma.$queryRaw`SELECT 1`;
});

test.after(async () => {
  await prisma.$disconnect();
});

test("database rejects non-positive capacity", async () => {
  await assert.rejects(() => prisma.$executeRaw`
    UPDATE "class_sessions"
    SET "capacity" = 0
    WHERE "id" = ${sessionId}::uuid
  `);
});

test("database rejects a second active booking for the same member and session", async () => {
  await assert.rejects(() => prisma.$executeRaw`
    INSERT INTO "bookings" ("member_id", "session_id", "status", "booked_at")
    VALUES (${bookedMemberId}::uuid, ${sessionId}::uuid, 'confirmed'::"booking_status", clock_timestamp())
  `);
});
