import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { Client } from "pg";
import { bookSession } from "../../lib/server/booking/book-session";
import { cancelBooking } from "../../lib/server/booking/cancel-booking";
import { joinWaitlist } from "../../lib/server/booking/join-waitlist";
import { prisma } from "../../lib/server/prisma";
import { changeSessionCapacity } from "../../lib/server/scheduling/change-session-capacity";

type Fixture = Awaited<ReturnType<typeof createFixture>>;

test.after(async () => {
  await prisma.$disconnect();
});

async function createFixture(options: { capacity?: number; startsInMs?: number; memberCount?: number } = {}) {
  const token = randomUUID();
  const now = new Date();
  const startsAt = new Date(now.getTime() + (options.startsInMs ?? 7_200_000));
  const ids = { session: randomUUID(), trainerUser: randomUUID(), trainer: randomUUID(), program: randomUUID(), users: Array.from({ length: options.memberCount ?? 5 }, randomUUID), members: Array.from({ length: options.memberCount ?? 5 }, randomUUID) };
  await prisma.user.create({ data: { id: ids.trainerUser, email: `trainer-${token}@example.test`, name: "Race Trainer", role: "TRAINER", passwordHash: "test" } });
  await prisma.trainerProfile.create({ data: { id: ids.trainer, userId: ids.trainerUser, bio: "test", specialties: [] } });
  await prisma.program.create({ data: { id: ids.program, slug: `race-${token}`, name: "Race", description: "test", intensity: "low", durationMinutes: 60 } });
  for (let index = 0; index < ids.members.length; index += 1) {
    await prisma.user.create({ data: { id: ids.users[index], email: `member-${index}-${token}@example.test`, name: `Member ${index}`, role: "MEMBER", passwordHash: "test" } });
    await prisma.memberProfile.create({ data: { id: ids.members[index], userId: ids.users[index], status: "ACTIVE", waiverSignedAt: now } });
  }
  await prisma.classSession.create({ data: { id: ids.session, programId: ids.program, trainerId: ids.trainer, startsAt, endsAt: new Date(startsAt.getTime() + 3_600_000), capacity: options.capacity ?? 1, bookingCutoffMinutes: 0 } });
  return { ids, startsAt };
}

async function destroyFixture(fixture: Fixture) {
  const { ids } = fixture;
  await prisma.booking.deleteMany({ where: { sessionId: ids.session } });
  await prisma.waitlistEntry.deleteMany({ where: { sessionId: ids.session } });
  await prisma.classSession.delete({ where: { id: ids.session } });
  await prisma.memberProfile.deleteMany({ where: { id: { in: ids.members } } });
  await prisma.trainerProfile.delete({ where: { id: ids.trainer } });
  await prisma.user.deleteMany({ where: { id: { in: [...ids.users, ids.trainerUser] } } });
  await prisma.program.delete({ where: { id: ids.program } });
}

async function holdRowLock(table: "class_sessions" | "member_profiles", id: string) {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required for PostgreSQL integration tests.");
  const client = new Client({ connectionString });
  await client.connect(); await client.query("BEGIN");
  await client.query(`SELECT "id" FROM "${table}" WHERE "id" = $1::uuid FOR UPDATE`, [id]);
  let released = false;
  return async () => {
    if (released) return;
    released = true;
    await client.query("ROLLBACK");
    await client.end();
  };
}

async function waitForBlockedWorker(table: "class_sessions" | "member_profiles") {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required for PostgreSQL integration tests.");
  const observer = new Client({ connectionString });
  await observer.connect();
  try {
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const result = await observer.query<{ count: string }>("SELECT count(*)::text AS count FROM pg_stat_activity WHERE datname = current_database() AND wait_event_type = 'Lock' AND query LIKE $1", [`%${table}%`]);
      if (Number(result.rows[0]?.count) > 0) return;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    throw new Error("Expected a PostgreSQL worker to block on the held row lock.");
  } finally { await observer.end(); }
}

async function fixtureFor(t: test.TestContext, options: Parameters<typeof createFixture>[0] = {}) {
  const fixture = await createFixture(options);
  t.after(() => destroyFixture(fixture));
  return fixture;
}

test("synchronized contenders cannot both take the final seat", async (t) => {
  const fixture = await fixtureFor(t); const release = await holdRowLock("class_sessions", fixture.ids.session);
  t.after(release);
  const contenders = fixture.ids.members.slice(0, 2).map((memberId) => bookSession(fixture.ids.session, memberId));
  await waitForBlockedWorker("class_sessions"); await release();
  assert.deepEqual((await Promise.all(contenders)).map((result) => result.code).sort(), ["BOOKED", "SESSION_FULL"]);
  assert.equal(await prisma.booking.count({ where: { sessionId: fixture.ids.session, status: "CONFIRMED" } }), 1);
});

test("synchronized waitlist contenders receive unique monotonic positions", async (t) => {
  const fixture = await fixtureFor(t);
  await prisma.booking.create({ data: { memberId: fixture.ids.members[0], sessionId: fixture.ids.session, status: "CONFIRMED", bookedAt: new Date() } });
  const release = await holdRowLock("class_sessions", fixture.ids.session); t.after(release);
  const joins = fixture.ids.members.slice(1, 3).map((memberId) => joinWaitlist(fixture.ids.session, memberId));
  await waitForBlockedWorker("class_sessions"); await release();
  assert.deepEqual((await Promise.all(joins)).map((result) => result.code).sort(), ["WAITLIST_JOINED", "WAITLIST_JOINED"]);
  const entries = await prisma.waitlistEntry.findMany({ where: { sessionId: fixture.ids.session }, orderBy: { positionKey: "asc" } });
  assert.deepEqual(entries.map((entry) => entry.positionKey), [1n, 2n]);
});

test("cancellation and booking serialize without bypassing a waiter", async (t) => {
  const fixture = await fixtureFor(t);
  await prisma.booking.create({ data: { memberId: fixture.ids.members[0], sessionId: fixture.ids.session, status: "CONFIRMED", bookedAt: new Date() } });
  await joinWaitlist(fixture.ids.session, fixture.ids.members[1]);
  const release = await holdRowLock("class_sessions", fixture.ids.session);
  t.after(release);
  const cancelled = cancelBooking(fixture.ids.session, fixture.ids.members[0]); const booked = bookSession(fixture.ids.session, fixture.ids.members[2]);
  await waitForBlockedWorker("class_sessions"); await release();
  assert.equal((await cancelled).code, "CANCELLED"); assert.equal((await booked).code, "SESSION_FULL");
  const active = await prisma.booking.findMany({ where: { sessionId: fixture.ids.session, status: "CONFIRMED" } });
  assert.deepEqual(active.map((booking) => booking.memberId), [fixture.ids.members[1]]);
});

test("cancellation and waitlist join leave a released seat available", async (t) => {
  const fixture = await fixtureFor(t);
  await prisma.booking.create({ data: { memberId: fixture.ids.members[0], sessionId: fixture.ids.session, status: "CONFIRMED", bookedAt: new Date() } });
  const release = await holdRowLock("class_sessions", fixture.ids.session);
  t.after(release);
  const cancelled = cancelBooking(fixture.ids.session, fixture.ids.members[0]); const joined = joinWaitlist(fixture.ids.session, fixture.ids.members[1]);
  await waitForBlockedWorker("class_sessions"); await release();
  assert.equal((await cancelled).code, "CANCELLED");
  const joinResult = await joined;
  assert.ok(joinResult.code === "SEAT_AVAILABLE" || joinResult.code === "WAITLIST_JOINED");
  const confirmed = await prisma.booking.findMany({ where: { sessionId: fixture.ids.session, status: "CONFIRMED" } });
  const waiting = await prisma.waitlistEntry.count({ where: { sessionId: fixture.ids.session, status: "WAITING" } });
  assert.ok((confirmed.length === 0 && waiting === 0) || (confirmed.length === 1 && confirmed[0]?.memberId === fixture.ids.members[1] && waiting === 0));
});

test("capacity increase and booking serialize without bypassing FIFO", async (t) => {
  const fixture = await fixtureFor(t);
  await prisma.booking.create({ data: { memberId: fixture.ids.members[0], sessionId: fixture.ids.session, status: "CONFIRMED", bookedAt: new Date() } });
  await joinWaitlist(fixture.ids.session, fixture.ids.members[1]);
  const release = await holdRowLock("class_sessions", fixture.ids.session);
  t.after(release);
  const changed = changeSessionCapacity(fixture.ids.session, 2); const booked = bookSession(fixture.ids.session, fixture.ids.members[2]);
  await waitForBlockedWorker("class_sessions"); await release();
  const changedResult = await changed;
  assert.equal(changedResult.code, "CAPACITY_UPDATED");
  if (changedResult.code === "CAPACITY_UPDATED") assert.deepEqual(changedResult.promotedMemberIds, [fixture.ids.members[1]]);
  assert.equal((await booked).code, "SESSION_FULL");
});

test("capacity increase and cancellation promote the first two persisted waiters", async (t) => {
  const fixture = await fixtureFor(t);
  await prisma.booking.create({ data: { memberId: fixture.ids.members[0], sessionId: fixture.ids.session, status: "CONFIRMED", bookedAt: new Date() } });
  await joinWaitlist(fixture.ids.session, fixture.ids.members[1]); await joinWaitlist(fixture.ids.session, fixture.ids.members[2]);
  const release = await holdRowLock("class_sessions", fixture.ids.session);
  t.after(release);
  const changed = changeSessionCapacity(fixture.ids.session, 2); const cancelled = cancelBooking(fixture.ids.session, fixture.ids.members[0]);
  await waitForBlockedWorker("class_sessions"); await release();
  assert.equal((await changed).code, "CAPACITY_UPDATED"); assert.equal((await cancelled).code, "CANCELLED");
  const confirmed = await prisma.booking.findMany({ where: { sessionId: fixture.ids.session, status: "CONFIRMED" } });
  assert.deepEqual(confirmed.map((booking) => booking.memberId).sort(), fixture.ids.members.slice(1, 3).sort());
});

test("capacity increase expires an ineligible waiter then fills multiple seats FIFO", async (t) => {
  const fixture = await fixtureFor(t);
  await prisma.booking.create({ data: { memberId: fixture.ids.members[0], sessionId: fixture.ids.session, status: "CONFIRMED", bookedAt: new Date() } });
  for (const memberId of fixture.ids.members.slice(1, 4)) await joinWaitlist(fixture.ids.session, memberId);
  await prisma.memberProfile.update({ where: { id: fixture.ids.members[1] }, data: { status: "INACTIVE" } });
  assert.deepEqual(await changeSessionCapacity(fixture.ids.session, 3), { code: "CAPACITY_UPDATED", promotedMemberIds: fixture.ids.members.slice(2, 4) });
  assert.equal((await prisma.waitlistEntry.findFirstOrThrow({ where: { sessionId: fixture.ids.session }, orderBy: { positionKey: "asc" } })).status, "EXPIRED");
});

test("an injected failure after promotion rolls back the capacity edit and queue", async (t) => {
  const fixture = await fixtureFor(t);
  await prisma.booking.create({ data: { memberId: fixture.ids.members[0], sessionId: fixture.ids.session, status: "CONFIRMED", bookedAt: new Date() } });
  await joinWaitlist(fixture.ids.session, fixture.ids.members[1]);
  const suffix = randomUUID().replaceAll("-", "");
  const functionName = `fitops_test_fail_${suffix}`;
  const triggerName = `fitops_test_trigger_${suffix}`;
  await prisma.$executeRawUnsafe(`CREATE FUNCTION ${functionName}() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.session_id = '${fixture.ids.session}'::uuid THEN RAISE EXCEPTION 'injected promotion failure'; END IF; RETURN NEW; END; $$`);
  await prisma.$executeRawUnsafe(`CREATE TRIGGER ${triggerName} BEFORE INSERT ON bookings FOR EACH ROW EXECUTE FUNCTION ${functionName}()`);
  t.after(async () => {
    await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS ${triggerName} ON bookings`);
    await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS ${functionName}()`);
  });
  await assert.rejects(() => changeSessionCapacity(fixture.ids.session, 2));
  assert.equal((await prisma.classSession.findUniqueOrThrow({ where: { id: fixture.ids.session } })).capacity, 1);
  assert.equal((await prisma.booking.findMany({ where: { sessionId: fixture.ids.session, status: "CONFIRMED" } })).length, 1);
  assert.equal((await prisma.waitlistEntry.findFirstOrThrow({ where: { sessionId: fixture.ids.session } })).status, "WAITING");
});

test("cutoff crossing while promotion waits rolls back cancellation", async (t) => {
  const fixture = await fixtureFor(t, { startsInMs: 3_000 });
  await prisma.booking.create({ data: { memberId: fixture.ids.members[0], sessionId: fixture.ids.session, status: "CONFIRMED", bookedAt: new Date() } });
  await joinWaitlist(fixture.ids.session, fixture.ids.members[1]);
  const release = await holdRowLock("member_profiles", fixture.ids.members[1]); const cancelling = cancelBooking(fixture.ids.session, fixture.ids.members[0]);
  t.after(release);
  await waitForBlockedWorker("member_profiles"); while (Date.now() < fixture.startsAt.getTime() + 50) await new Promise((resolve) => setTimeout(resolve, 10)); await release();
  assert.equal((await cancelling).code, "BOOKING_CUTOFF_PASSED");
  assert.equal(await prisma.booking.count({ where: { sessionId: fixture.ids.session, status: "CONFIRMED" } }), 1);
  assert.equal((await prisma.waitlistEntry.findFirstOrThrow({ where: { sessionId: fixture.ids.session } })).status, "WAITING");
});

test("cutoff crossing while capacity promotion waits rolls back the capacity edit", async (t) => {
  const fixture = await fixtureFor(t, { startsInMs: 3_000 });
  await prisma.booking.create({ data: { memberId: fixture.ids.members[0], sessionId: fixture.ids.session, status: "CONFIRMED", bookedAt: new Date() } });
  await joinWaitlist(fixture.ids.session, fixture.ids.members[1]);
  const release = await holdRowLock("member_profiles", fixture.ids.members[1]); const changing = changeSessionCapacity(fixture.ids.session, 2);
  t.after(release);
  await waitForBlockedWorker("member_profiles"); while (Date.now() < fixture.startsAt.getTime() + 50) await new Promise((resolve) => setTimeout(resolve, 10)); await release();
  assert.equal((await changing).code, "CUTOFF_PASSED");
  assert.equal((await prisma.classSession.findUniqueOrThrow({ where: { id: fixture.ids.session } })).capacity, 1);
  assert.equal((await prisma.waitlistEntry.findFirstOrThrow({ where: { sessionId: fixture.ids.session } })).status, "WAITING");
});
