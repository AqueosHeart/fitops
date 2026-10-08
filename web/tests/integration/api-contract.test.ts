import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { after, before, test } from "node:test";

import { NextRequest } from "next/server";

process.env.BETTER_AUTH_SECRET = "development-only-better-auth-secret-32chars";
process.env.BETTER_AUTH_URL = "http://localhost:3000";

const password = "contract-test-password-123";
const origin = "http://localhost:3000";
const ids = { program: "00000000-0000-4000-8000-000000000201" };
const state: { cookies: Record<string, string>; users: string[]; userIds: Record<string, string>; memberIds: Record<string, string>; trainerId?: string; secondTrainerId?: string; sessionIds: string[] } = { cookies: {}, users: [], userIds: {}, memberIds: {}, sessionIds: [] };

function request(path: string, init: RequestInit = {}, cookie?: string) {
  const headers = new Headers(init.headers);
  if (cookie) headers.set("cookie", cookie);
  return new NextRequest(new URL(path, origin), { method: init.method, headers, body: init.body ?? undefined });
}

function unsafe(path: string, body: unknown, cookie?: string, requestOrigin = origin) {
  return request(path, { method: "POST", headers: { "content-type": "application/json", origin: requestOrigin }, body: JSON.stringify(body) }, cookie);
}

function rawUnsafe(path: string, body: string, cookie?: string, contentLength?: string) {
  const headers = new Headers({ "content-type": "application/json", origin });
  if (contentLength !== undefined) headers.set("content-length", contentLength);
  return request(path, { method: "POST", headers, body }, cookie);
}

function cookieFrom(response: Response) {
  const cookies = (response.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.() ?? [response.headers.get("set-cookie") ?? ""];
  return cookies.map((cookie) => cookie.split(";", 1)[0]).filter(Boolean).join("; ");
}

async function register(label: string) {
  const { POST } = await import("@/app/api/v1/auth/register/route");
  const email = `${label}-${randomUUID()}@example.test`;
  const response = await POST!(unsafe("/api/v1/auth/register", { name: label, email, password, termsPrivacyAccepted: true, waiverAccepted: true, selectedPlanCode: "base" }) as never);
  assert.equal(response.status, 201);
  const { prisma } = await import("@/lib/server/prisma");
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  state.users.push(user.id);
  state.userIds[label] = user.id;
  if (label.startsWith("member-")) state.memberIds[label] = (await prisma.memberProfile.findUniqueOrThrow({ where: { userId: user.id } })).id;
  state.cookies[label] = cookieFrom(response);
  return user;
}

async function createSession(trainerId = state.trainerId) {
  const { POST } = await import("@/app/api/v1/admin/sessions/route");
  const startsAt = new Date(Date.now() + (72 + state.sessionIds.length * 2) * 60 * 60 * 1000);
  startsAt.setUTCMinutes(0, 0, 0);
  const response = (await POST!(unsafe("/api/v1/admin/sessions", { programId: ids.program, trainerId, startsAt: startsAt.toISOString(), endsAt: new Date(startsAt.getTime() + 60 * 60 * 1000).toISOString(), capacity: 1, bookingCutoffMinutes: 30 }, state.cookies.admin) as never))!;
  assert.equal(response.status, 201);
  const body = await response.json();
  state.sessionIds.push(body.data.sessionId);
  return body.data.sessionId as string;
}

before(async () => {
  const { prisma } = await import("@/lib/server/prisma");
  const [memberOne, memberTwo, trainer, secondTrainer, admin] = await Promise.all([register("member-one"), register("member-two"), register("trainer"), register("trainer-two"), register("admin")]);
  await prisma.user.update({ where: { id: trainer.id }, data: { role: "TRAINER" } });
  state.trainerId = (await prisma.trainerProfile.create({ data: { userId: trainer.id, bio: "Fictional contract-test trainer", specialties: ["Testing"] } })).id;
  await prisma.user.update({ where: { id: secondTrainer.id }, data: { role: "TRAINER" } });
  state.secondTrainerId = (await prisma.trainerProfile.create({ data: { userId: secondTrainer.id, bio: "Fictional second contract-test trainer", specialties: ["Testing"] } })).id;
  await prisma.user.update({ where: { id: admin.id }, data: { role: "ADMINISTRATOR" } });
  assert.ok(memberOne.id && memberTwo.id);
});

after(async () => {
  const { prisma } = await import("@/lib/server/prisma");
  await prisma.$transaction(async (tx) => {
    await tx.booking.deleteMany({ where: { sessionId: { in: state.sessionIds } } });
    await tx.waitlistEntry.deleteMany({ where: { sessionId: { in: state.sessionIds } } });
    await tx.classSession.deleteMany({ where: { id: { in: state.sessionIds } } });
    await tx.authSession.deleteMany({ where: { userId: { in: state.users } } });
    await tx.authAccount.deleteMany({ where: { userId: { in: state.users } } });
    await tx.memberProfile.deleteMany({ where: { userId: { in: state.users } } });
    await tx.trainerProfile.deleteMany({ where: { userId: { in: state.users } } });
    await tx.user.deleteMany({ where: { id: { in: state.users } } });
  });
  await prisma.$disconnect();
});

test("public catalog and session routes return contracts and reject malformed identifiers", async () => {
  const plans = await (await import("@/app/api/v1/membership/plans/route")).GET();
  assert.equal(plans.status, 200);
  assert.equal((await plans.json()).data.plans.every((plan: { demoOnly: boolean; paymentCollected: boolean }) => plan.demoOnly && !plan.paymentCollected), true);

  const programs = await (await import("@/app/api/v1/programs/route")).GET();
  assert.equal(programs.status, 200);
  const { GET: listSessions } = await import("@/app/api/v1/sessions/route");
  assert.equal((await listSessions!(request("/api/v1/sessions?availability=unknown") as never)).status, 400);
  assert.equal((await listSessions!(request("/api/v1/sessions") as never)).status, 200);

  const { GET: sessionDetail } = await import("@/app/api/v1/sessions/[sessionId]/route");
  assert.equal((await sessionDetail!(request("/api/v1/sessions/not-a-uuid") as never, { params: Promise.resolve({ sessionId: "not-a-uuid" }) })).status, 400);
  assert.equal((await sessionDetail!(request(`/api/v1/sessions/00000000-0000-4000-8000-000000000301`) as never, { params: Promise.resolve({ sessionId: "00000000-0000-4000-8000-000000000301" }) })).status, 200);
  assert.equal((await sessionDetail!(request(`/api/v1/sessions/${randomUUID()}`) as never, { params: Promise.resolve({ sessionId: randomUUID() }) })).status, 404);
});

test("login, rate-limit reservation, and member profile routes enforce their contracts", async () => {
  const { POST: login } = await import("@/app/api/v1/auth/login/route");
  const { parseAdminReturnTo, parseReturnTo } = await import("@/lib/server/auth/return-to");
  const { getPortalDestination } = await import("@/lib/server/auth/portal-destination");
  const { prisma } = await import("@/lib/server/prisma");
  assert.equal(parseReturnTo("/admin"), null, "registration/member return paths never include admin routes");
  assert.equal(parseAdminReturnTo("/admin/sessions/00000000-0000-4000-8000-000000000301/participants"), "/admin/sessions/00000000-0000-4000-8000-000000000301/participants");
  assert.equal(parseAdminReturnTo("/admin/sessions/not-a-uuid/edit"), null);
  assert.equal(parseAdminReturnTo("//attacker.example"), null);
  assert.equal(getPortalDestination({ role: "MEMBER", memberProfile: {} }, null), "/app");
  assert.equal(getPortalDestination({ role: "MEMBER", memberProfile: {} }, "/app/bookings"), "/app/bookings");
  assert.equal(getPortalDestination({ role: "ADMINISTRATOR", memberProfile: {} }, "/admin/sessions"), "/admin/sessions");
  assert.equal(getPortalDestination({ role: "ADMINISTRATOR", memberProfile: {} }, null), "/app");
  assert.equal(getPortalDestination({ role: "ADMINISTRATOR", memberProfile: null }, null), "/admin");
  assert.equal(getPortalDestination({ role: "TRAINER", memberProfile: null }, null), "/trainer/sessions");
  const member = await prisma.user.findUniqueOrThrow({ where: { id: state.userIds["member-one"] } });
  const rejectedEmail = `csrf-login-${randomUUID()}@example.test`;
  assert.equal((await login!(unsafe("/api/v1/auth/login", { email: rejectedEmail, password }, undefined, "https://attacker.example") as never)).status, 403);
  const { createHash: hash } = await import("node:crypto");
  assert.equal(await prisma.authLoginAttempt.findUnique({ where: { key: hash("sha256").update(`email:${rejectedEmail}`).digest("hex") } }), null, "cross-origin login does not consume a rate-limit attempt");
  const malformedLoginEmail = `malformed-login-${randomUUID()}@example.test`;
  for (const [label, body, contentLength] of [
    ["invalid JSON", "{"],
    ["unknown field", JSON.stringify({ email: malformedLoginEmail, password, unexpected: true })],
    ["oversized body", JSON.stringify({ email: malformedLoginEmail, password, padding: "x".repeat(17_000) })],
    ["oversized declared length", JSON.stringify({ email: malformedLoginEmail, password }), "20000"],
  ] as const) {
    assert.equal((await login!(rawUnsafe("/api/v1/auth/login", body, undefined, contentLength) as never)).status, 400, `${label} login request is rejected`);
    assert.equal(await prisma.authLoginAttempt.findUnique({ where: { key: hash("sha256").update(`email:${malformedLoginEmail}`).digest("hex") } }), null, `${label} login request reserves no limiter attempt`);
  }
  const success = await login!(unsafe("/api/v1/auth/login", { email: member.email, password, returnTo: "/app/bookings" }) as never);
  assert.equal(success.status, 200);
  assert.equal((await success.json()).data.destination, "/app/bookings");
  const admin = await prisma.user.findUniqueOrThrow({ where: { id: state.userIds.admin } });
  const adminSuccess = await login!(unsafe("/api/v1/auth/login", { email: admin.email, password, returnTo: "/admin/sessions/new" }) as never);
  assert.equal(adminSuccess.status, 200);
  assert.equal((await adminSuccess.json()).data.destination, "/admin/sessions/new", "administrator login preserves an explicitly allowlisted admin return path");
  const memberAdminAttempt = await login!(unsafe("/api/v1/auth/login", { email: member.email, password, returnTo: "/admin" }) as never);
  assert.equal(memberAdminAttempt.status, 200);
  assert.equal((await memberAdminAttempt.json()).data.destination, "/app", "a member cannot use an administrator return path");
  assert.equal((await login!(unsafe("/api/v1/auth/login", { email: member.email, password, returnTo: "https://attacker.example" }) as never)).status, 422);
  const wrong = await login!(unsafe("/api/v1/auth/login", { email: member.email, password: "incorrect-password-123" }) as never);
  assert.equal(wrong.status, 401);
  assert.equal((await wrong.json()).error.code, "INVALID_CREDENTIALS");

  const { reserveLoginAttempt } = await import("@/lib/server/auth/login-rate-limit");
  const rateKey = (scope: "email" | "ip", value: string) => createHash("sha256").update(`${scope}:${value}`).digest("hex");
  const outcomes = await Promise.all(Array.from({ length: 6 }, () => reserveLoginAttempt(`atomic-${randomUUID()}@example.test`, new Headers())));
  assert.equal(outcomes.every(Boolean), true, "distinct email reservations should not share a counter");
  const atomicEmail = `atomic-shared-${randomUUID()}@example.test`;
  const shared = await Promise.all(Array.from({ length: 6 }, () => reserveLoginAttempt(atomicEmail, new Headers())));
  assert.equal(shared.filter(Boolean).length, 5);
  const { releaseSuccessfulIpReservation } = await import("@/lib/server/auth/login-rate-limit");
  const originalTrustProxy = process.env.TRUST_PROXY;
  process.env.TRUST_PROXY = "true";
  try {
    const ipHeaders = new Headers({ "x-forwarded-for": `198.51.100.${Math.floor(Math.random() * 200) + 1}` });
    const ipReservations = await Promise.all(Array.from({ length: 20 }, () => reserveLoginAttempt(`ip-${randomUUID()}@example.test`, ipHeaders)));
    assert.equal(ipReservations.every(Boolean), true);
    const ip = ipHeaders.get("x-forwarded-for")!;
    assert.equal((await prisma.authLoginAttempt.findUniqueOrThrow({ where: { key: rateKey("ip", ip) } })).failureCount, 20);
    await releaseSuccessfulIpReservation(ipHeaders);
    assert.equal((await prisma.authLoginAttempt.findUniqueOrThrow({ where: { key: rateKey("ip", ip) } })).failureCount, 19);
    assert.equal(await reserveLoginAttempt(`ip-after-success-${randomUUID()}@example.test`, ipHeaders), true);
    const sharedIp = `198.51.100.${Math.floor(Math.random() * 200) + 1}`;
    const trustedIpResults = await Promise.all(Array.from({ length: 25 }, (_, index) => reserveLoginAttempt(`trusted-ip-${index}-${randomUUID()}@example.test`, new Headers({ "x-forwarded-for": sharedIp }))));
    assert.equal(trustedIpResults.filter(Boolean).length, 20, "concurrent reservations enforce the trusted-IP threshold atomically");
    assert.equal((await prisma.authLoginAttempt.findUniqueOrThrow({ where: { key: rateKey("ip", sharedIp) } })).failureCount, 25);
    await prisma.authLoginAttempt.deleteMany({ where: { key: { in: [rateKey("ip", ip), rateKey("ip", sharedIp)] } } });

    const expiredWindowEmail = `expired-window-${randomUUID()}@example.test`;
    await reserveLoginAttempt(expiredWindowEmail, new Headers());
    await prisma.authLoginAttempt.update({ where: { key: rateKey("email", expiredWindowEmail) }, data: { failureCount: 5, windowStartedAt: new Date(Date.now() - 16 * 60_000) } });
    assert.equal(await reserveLoginAttempt(expiredWindowEmail, new Headers()), true, "an expired limiter window starts a fresh allowance");
    assert.equal((await prisma.authLoginAttempt.findUniqueOrThrow({ where: { key: rateKey("email", expiredWindowEmail) } })).failureCount, 1);
    await prisma.authLoginAttempt.deleteMany({ where: { key: rateKey("email", expiredWindowEmail) } });

    const successfulMember = await prisma.user.findUniqueOrThrow({ where: { id: state.userIds["member-one"] } });
    const successEmail = successfulMember.email.toLowerCase();
    const { clearEmailLoginFailures } = await import("@/lib/server/auth/login-rate-limit");
    await clearEmailLoginFailures(successEmail);
    await reserveLoginAttempt(successEmail, new Headers());
    await reserveLoginAttempt(successEmail, new Headers());
    assert.equal((await prisma.authLoginAttempt.findUniqueOrThrow({ where: { key: rateKey("email", successEmail) } })).failureCount, 2);
    const successfulLogin = await login!(unsafe("/api/v1/auth/login", { email: successEmail, password }) as never);
    assert.equal(successfulLogin.status, 200);
    assert.equal(await prisma.authLoginAttempt.findUnique({ where: { key: rateKey("email", successEmail) } }), null, "successful login clears the email failure counter");
  } finally {
    if (originalTrustProxy === undefined) delete process.env.TRUST_PROXY;
    else process.env.TRUST_PROXY = originalTrustProxy;
  }

  const { GET: membership } = await import("@/app/api/v1/me/membership/route");
  const { GET: bookings } = await import("@/app/api/v1/me/bookings/route");
  const { POST: waiver } = await import("@/app/api/v1/me/waiver/route");
  assert.equal((await membership!(request("/api/v1/me/membership") as never)).status, 401);
  assert.equal((await membership!(request("/api/v1/me/membership", {}, state.cookies["member-one"]) as never)).status, 200);
  assert.equal((await bookings!(request("/api/v1/me/bookings", {}, state.cookies["member-one"]) as never))!.status, 200);
  const memberOneId = state.memberIds["member-one"];
  const waiverBefore = await prisma.memberProfile.findUniqueOrThrow({ where: { id: memberOneId }, select: { waiverSignedAt: true } });
  for (const [label, body] of [
    ["invalid JSON", "{"],
    ["unknown field", JSON.stringify({ accepted: true, unexpected: true })],
    ["oversized body", JSON.stringify({ accepted: true, padding: "x".repeat(17_000) })],
  ] as const) {
    assert.equal((await waiver!(rawUnsafe("/api/v1/me/waiver", body, state.cookies["member-one"]) as never)).status, 400, `${label} waiver request is rejected`);
    assert.deepEqual(await prisma.memberProfile.findUniqueOrThrow({ where: { id: memberOneId }, select: { waiverSignedAt: true } }), waiverBefore, `${label} waiver request leaves the profile unchanged`);
  }
  assert.equal((await waiver!(unsafe("/api/v1/me/waiver", { accepted: true }, state.cookies["member-one"], "https://attacker.example") as never)).status, 403);
  assert.deepEqual(await prisma.memberProfile.findUniqueOrThrow({ where: { id: memberOneId }, select: { waiverSignedAt: true } }), waiverBefore);
  assert.equal((await waiver!(unsafe("/api/v1/me/waiver", { accepted: true }, state.cookies["member-one"]) as never)).status, 200);
  const firstSignature = await prisma.memberProfile.findUniqueOrThrow({ where: { id: memberOneId }, select: { waiverSignedAt: true } });
  assert.equal((await waiver!(unsafe("/api/v1/me/waiver", { accepted: true }, state.cookies["member-one"]) as never)).status, 200);
  assert.deepEqual(await prisma.memberProfile.findUniqueOrThrow({ where: { id: memberOneId }, select: { waiverSignedAt: true } }), firstSignature, "repeated waiver acceptance preserves the original timestamp");
});

test("member booking, waitlist, cancellation, and IDOR routes enforce owner scope", async () => {
  const sessionA = await createSession();
  const { GET: listBookings } = await import("@/app/api/v1/me/bookings/route");
  const { POST: book } = await import("@/app/api/v1/sessions/[sessionId]/bookings/route");
  const { POST: joinWaitlist } = await import("@/app/api/v1/sessions/[sessionId]/waitlist/route");
  const { DELETE: cancelBooking } = await import("@/app/api/v1/bookings/[bookingId]/route");
  const { DELETE: leaveWaitlist } = await import("@/app/api/v1/waitlist/[entryId]/route");

  const bookingContext = { params: Promise.resolve({ sessionId: sessionA }) };
  assert.equal((await book!(unsafe(`/api/v1/sessions/${sessionA}/bookings`, {}, undefined) as never, bookingContext))!.status, 401);
  assert.equal((await book!(unsafe(`/api/v1/sessions/${sessionA}/bookings`, {}, state.cookies["member-one"], "https://attacker.example") as never, bookingContext))!.status, 403);
  assert.equal((await joinWaitlist!(unsafe(`/api/v1/sessions/${sessionA}/waitlist`, {}, state.cookies["member-two"], "https://attacker.example") as never, bookingContext))!.status, 403);
  assert.equal(await (await import("@/lib/server/prisma")).prisma.booking.count({ where: { sessionId: sessionA } }), 0, "cross-origin booking creates no booking");
  assert.equal(await (await import("@/lib/server/prisma")).prisma.waitlistEntry.count({ where: { sessionId: sessionA } }), 0, "cross-origin waitlist creates no entry");
  const missingSessionId = randomUUID();
  for (const [operation, response] of [
    ["booking", await book!(unsafe(`/api/v1/sessions/${missingSessionId}/bookings`, {}, state.cookies["member-one"]) as never, { params: Promise.resolve({ sessionId: missingSessionId }) })],
    ["waitlist", await joinWaitlist!(unsafe(`/api/v1/sessions/${missingSessionId}/waitlist`, {}, state.cookies["member-one"]) as never, { params: Promise.resolve({ sessionId: missingSessionId }) })],
  ] as const) {
    assert.equal(response!.status, 404, `${operation} rejects a missing session`);
    assert.equal((await response!.json()).error.code, "SESSION_NOT_FOUND");
  }
  const booked = (await book!(unsafe(`/api/v1/sessions/${sessionA}/bookings`, {}, state.cookies["member-one"]) as never, bookingContext))!;
  assert.equal(booked.status, 201);
  const bookingId = (await booked.json()).data.bookingId as string;
  const listedReservations = await listBookings!(request("/api/v1/me/bookings", {}, state.cookies["member-one"]) as never);
  const listedBooking = (await listedReservations!.json()).data.bookings.find((item: { bookingId: string }) => item.bookingId === bookingId);
  const cutoffSession = await (await import("@/lib/server/prisma")).prisma.classSession.findUniqueOrThrow({ where: { id: sessionA }, select: { startsAt: true, endsAt: true, bookingCutoffMinutes: true } });
  assert.equal(listedBooking.startsAt, cutoffSession.startsAt.toISOString());
  assert.equal(listedBooking.endsAt, cutoffSession.endsAt.toISOString());
  assert.equal(listedBooking.cancellationCutoffAt, new Date(cutoffSession.startsAt.getTime() - cutoffSession.bookingCutoffMinutes * 60_000).toISOString(), "reservation listing exposes the configured server cutoff for display");
  const waiting = (await joinWaitlist!(unsafe(`/api/v1/sessions/${sessionA}/waitlist`, {}, state.cookies["member-two"]) as never, bookingContext))!;
  assert.equal(waiting.status, 201);
  const waitingEntryId = (await waiting.json()).data.entryId as string;
  const waitingBeforeBook = await (await import("@/lib/server/prisma")).prisma.$transaction(async (tx) => ({ bookings: await tx.booking.count({ where: { sessionId: sessionA } }), entries: await tx.waitlistEntry.count({ where: { sessionId: sessionA } }) }));
  const bookWhileWaiting = await book!(unsafe(`/api/v1/sessions/${sessionA}/bookings`, {}, state.cookies["member-two"]) as never, bookingContext);
  assert.equal(bookWhileWaiting!.status, 409);
  assert.equal((await bookWhileWaiting!.json()).error.code, "ALREADY_WAITING");
  assert.deepEqual(await (await import("@/lib/server/prisma")).prisma.$transaction(async (tx) => ({ bookings: await tx.booking.count({ where: { sessionId: sessionA } }), entries: await tx.waitlistEntry.count({ where: { sessionId: sessionA } }) })), waitingBeforeBook, "booking while already waiting does not change either participation row set");
  assert.equal((await cancelBooking!(request(`/api/v1/bookings/${bookingId}`, { method: "DELETE", headers: { origin: "https://attacker.example" } }, state.cookies["member-one"]) as never, { params: Promise.resolve({ bookingId }) }))!.status, 403);
  assert.equal((await (await import("@/lib/server/prisma")).prisma.booking.findUniqueOrThrow({ where: { id: bookingId } })).status, "CONFIRMED", "cross-origin cancellation does not change booking state");
  assert.equal((await leaveWaitlist!(request(`/api/v1/waitlist/${waitingEntryId}`, { method: "DELETE", headers: { origin: "https://attacker.example" } }, state.cookies["member-two"]) as never, { params: Promise.resolve({ entryId: waitingEntryId }) }))!.status, 403);
  assert.equal((await (await import("@/lib/server/prisma")).prisma.waitlistEntry.findUniqueOrThrow({ where: { id: waitingEntryId } })).status, "WAITING", "cross-origin removal does not change waitlist state");
  assert.equal((await cancelBooking!(request(`/api/v1/bookings/${bookingId}`, { method: "DELETE", headers: { origin } }, state.cookies["member-two"]) as never, { params: Promise.resolve({ bookingId }) }))!.status, 403);
  assert.equal((await cancelBooking!(request(`/api/v1/bookings/${bookingId}`, { method: "DELETE", headers: { origin } }, state.cookies["member-one"]) as never, { params: Promise.resolve({ bookingId }) }))!.status, 204);
  const promoted = await (await import("@/lib/server/prisma")).prisma.waitlistEntry.findUniqueOrThrow({ where: { id: waitingEntryId }, include: { promotedBooking: true } });
  assert.equal(promoted.status, "PROMOTED");
  assert.ok(promoted.promotedBooking);
  const promotedBeforeRemoval = await (await import("@/lib/server/prisma")).prisma.$transaction(async (tx) => ({ entry: await tx.waitlistEntry.findUniqueOrThrow({ where: { id: waitingEntryId } }), booking: await tx.booking.findUniqueOrThrow({ where: { id: promoted.promotedBooking!.id } }) }));
  assert.equal((await leaveWaitlist!(request(`/api/v1/waitlist/${waitingEntryId}`, { method: "DELETE", headers: { origin } }, state.cookies["member-two"]) as never, { params: Promise.resolve({ entryId: waitingEntryId }) }))!.status, 409);
  assert.deepEqual(await (await import("@/lib/server/prisma")).prisma.$transaction(async (tx) => ({ entry: await tx.waitlistEntry.findUniqueOrThrow({ where: { id: waitingEntryId } }), booking: await tx.booking.findUniqueOrThrow({ where: { id: promoted.promotedBooking!.id } }) })), promotedBeforeRemoval, "a promoted waitlist entry cannot be removed or alter its booking");
  const repeatCancel = await cancelBooking!(request(`/api/v1/bookings/${bookingId}`, { method: "DELETE", headers: { origin } }, state.cookies["member-one"]) as never, { params: Promise.resolve({ bookingId }) });
  assert.equal(repeatCancel!.status, 204);
  assert.equal(await (await import("@/lib/server/prisma")).prisma.booking.count({ where: { sessionId: sessionA, status: "CONFIRMED" } }), 1, "repeat cancellation does not promote twice");
  const missingBookingId = randomUUID();
  assert.equal((await cancelBooking!(request(`/api/v1/bookings/${missingBookingId}`, { method: "DELETE", headers: { origin } }, state.cookies["member-one"]) as never, { params: Promise.resolve({ bookingId: missingBookingId }) }))!.status, 404, "unknown cancellation target is not reported as success");

  const sessionB = await createSession();
  const contextB = { params: Promise.resolve({ sessionId: sessionB }) };
  assert.equal((await book!(unsafe(`/api/v1/sessions/${sessionB}/bookings`, {}, state.cookies["member-one"]) as never, contextB))!.status, 201);
  const secondWait = (await joinWaitlist!(unsafe(`/api/v1/sessions/${sessionB}/waitlist`, {}, state.cookies["member-two"]) as never, contextB))!;
  assert.equal(secondWait.status, 201);
  const entryId = (await secondWait.json()).data.entryId as string;
  assert.equal((await leaveWaitlist!(request(`/api/v1/waitlist/${entryId}`, { method: "DELETE", headers: { origin } }, state.cookies["member-one"]) as never, { params: Promise.resolve({ entryId }) }))!.status, 403);
  assert.equal((await leaveWaitlist!(request(`/api/v1/waitlist/${entryId}`, { method: "DELETE", headers: { origin } }, state.cookies["member-two"]) as never, { params: Promise.resolve({ entryId }) }))!.status, 204);
  const afterRemoval = await (await import("@/lib/server/prisma")).prisma.waitlistEntry.findUniqueOrThrow({ where: { id: entryId } });
  assert.equal(afterRemoval.status, "CANCELLED");
  assert.equal((await leaveWaitlist!(request(`/api/v1/waitlist/${entryId}`, { method: "DELETE", headers: { origin } }, state.cookies["member-two"]) as never, { params: Promise.resolve({ entryId }) }))!.status, 204);
  const repeatedRemoval = await (await import("@/lib/server/prisma")).prisma.waitlistEntry.findUniqueOrThrow({ where: { id: entryId } });
  assert.equal(repeatedRemoval.status, "CANCELLED");
});

test("booking and waitlist domain failures preserve database state", async () => {
  const { prisma } = await import("@/lib/server/prisma");
  const { POST: book } = await import("@/app/api/v1/sessions/[sessionId]/bookings/route");
  const { POST: join } = await import("@/app/api/v1/sessions/[sessionId]/waitlist/route");
  const memberId = state.memberIds["member-two"];
  const sessionId = await createSession();
  const context = { params: Promise.resolve({ sessionId }) };
  const profile = await prisma.memberProfile.findUniqueOrThrow({ where: { id: memberId } });

  await prisma.memberProfile.update({ where: { id: memberId }, data: { status: "INACTIVE" } });
  for (const [operation, invoke] of [["book", () => book!(unsafe(`/api/v1/sessions/${sessionId}/bookings`, {}, state.cookies["member-two"]) as never, context)], ["waitlist", () => join!(unsafe(`/api/v1/sessions/${sessionId}/waitlist`, {}, state.cookies["member-two"]) as never, context)]] as const) {
    const before = await prisma.$transaction(async (tx) => ({ session: await tx.classSession.findUniqueOrThrow({ where: { id: sessionId } }), bookings: await tx.booking.count({ where: { sessionId } }), entries: await tx.waitlistEntry.count({ where: { sessionId } }) }));
    const response = await invoke();
    assert.equal(response!.status, 403, `${operation} rejects inactive membership`);
    assert.equal((await response!.json()).error.code, "MEMBERSHIP_INACTIVE");
    const after = await prisma.$transaction(async (tx) => ({ session: await tx.classSession.findUniqueOrThrow({ where: { id: sessionId } }), bookings: await tx.booking.count({ where: { sessionId } }), entries: await tx.waitlistEntry.count({ where: { sessionId } }) }));
    assert.deepEqual(after, before, `${operation} inactive rejection leaves state unchanged`);
  }

  await prisma.memberProfile.update({ where: { id: memberId }, data: { status: "ACTIVE", waiverSignedAt: null } });
  const beforeWaiver = { bookings: await prisma.booking.count({ where: { sessionId } }), entries: await prisma.waitlistEntry.count({ where: { sessionId } }) };
  for (const [operation, invoke] of [["book", () => book!(unsafe(`/api/v1/sessions/${sessionId}/bookings`, {}, state.cookies["member-two"]) as never, context)], ["waitlist", () => join!(unsafe(`/api/v1/sessions/${sessionId}/waitlist`, {}, state.cookies["member-two"]) as never, context)]] as const) {
    const response = await invoke();
    assert.equal((await response!.json()).error.code, "WAIVER_REQUIRED", `${operation} requires a waiver`);
  }
  assert.deepEqual({ bookings: await prisma.booking.count({ where: { sessionId } }), entries: await prisma.waitlistEntry.count({ where: { sessionId } }) }, beforeWaiver);
  await prisma.memberProfile.update({ where: { id: memberId }, data: { status: profile.status, waiverSignedAt: profile.waiverSignedAt } });

  const fullSession = await createSession();
  const fullContext = { params: Promise.resolve({ sessionId: fullSession }) };
  await prisma.booking.create({ data: { memberId: state.memberIds["member-one"], sessionId: fullSession, status: "CONFIRMED", bookedAt: new Date() } });
  const cutoffSession = await createSession(state.secondTrainerId);
  await prisma.classSession.update({ where: { id: cutoffSession }, data: { startsAt: new Date(Date.now() + 10 * 60_000), endsAt: new Date(Date.now() + 70 * 60_000), bookingCutoffMinutes: 30 } });
  const cutoffContext = { params: Promise.resolve({ sessionId: cutoffSession }) };
  const fullBefore = await prisma.booking.count({ where: { sessionId: fullSession } });
  const fullBooking = await book!(unsafe(`/api/v1/sessions/${fullSession}/bookings`, {}, state.cookies["member-two"]) as never, fullContext);
  assert.equal(fullBooking!.status, 409);
  assert.equal((await fullBooking!.json()).error.code, "SESSION_FULL");
  assert.equal(await prisma.booking.count({ where: { sessionId: fullSession } }), fullBefore);
  const fullWait = await join!(unsafe(`/api/v1/sessions/${fullSession}/waitlist`, {}, state.cookies["member-two"]) as never, fullContext);
  assert.equal(fullWait!.status, 201);
  const waitEntryId = (await fullWait!.json()).data.entryId as string;
  const duplicateWait = await join!(unsafe(`/api/v1/sessions/${fullSession}/waitlist`, {}, state.cookies["member-two"]) as never, fullContext);
  assert.equal(duplicateWait!.status, 409);
  assert.equal((await duplicateWait!.json()).error.code, "ALREADY_WAITING");
  assert.equal(await prisma.waitlistEntry.count({ where: { sessionId: fullSession } }), 1, "duplicate waitlist rejection creates no row");
  const bookedWaitlistSession = await createSession();
  const bookedWaitlistContext = { params: Promise.resolve({ sessionId: bookedWaitlistSession }) };
  await prisma.booking.create({ data: { memberId: state.memberIds["member-two"], sessionId: bookedWaitlistSession, status: "CONFIRMED", bookedAt: new Date() } });
  const waitlistForBookedMember = await join!(unsafe(`/api/v1/sessions/${bookedWaitlistSession}/waitlist`, {}, state.cookies["member-two"]) as never, bookedWaitlistContext);
  assert.equal(waitlistForBookedMember!.status, 409);
  assert.equal((await waitlistForBookedMember!.json()).error.code, "ALREADY_BOOKED");
  assert.equal(await prisma.waitlistEntry.count({ where: { sessionId: bookedWaitlistSession } }), 0, "existing booking prevents a waitlist row");
  const waitingState = await prisma.waitlistEntry.findUniqueOrThrow({ where: { id: waitEntryId } });
  assert.equal(waitingState.status, "WAITING");
  for (const response of [await book!(unsafe(`/api/v1/sessions/${cutoffSession}/bookings`, {}, state.cookies["member-two"]) as never, cutoffContext), await join!(unsafe(`/api/v1/sessions/${cutoffSession}/waitlist`, {}, state.cookies["member-two"]) as never, cutoffContext)]) {
    assert.equal(response!.status, 422);
    assert.equal((await response!.json()).error.code, "BOOKING_CUTOFF_PASSED");
  }
  assert.equal(await prisma.booking.count({ where: { sessionId: cutoffSession } }), 0);
  assert.equal(await prisma.waitlistEntry.count({ where: { sessionId: cutoffSession } }), 0);
});

test("trainer and administrator routes enforce role boundaries and return successful contracts", async () => {
  const { GET: trainerSessions } = await import("@/app/api/v1/trainer/sessions/route");
  const { GET: adminSessions, POST: create } = await import("@/app/api/v1/admin/sessions/route");
  const { GET: adminOptions } = await import("@/app/api/v1/admin/options/route");
  const { PATCH, mapSessionUpdateResult } = await import("@/app/api/v1/admin/sessions/[sessionId]/route");
  const { GET: participants } = await import("@/app/api/v1/admin/sessions/[sessionId]/participants/route");
  assert.equal((await trainerSessions!(request("/api/v1/trainer/sessions", {}, state.cookies["member-one"]) as never)).status, 403);
  assert.equal((await trainerSessions!(request("/api/v1/trainer/sessions", {}, state.cookies.trainer) as never)).status, 200);
  const trainerOneSession = await createSession(state.trainerId);
  const trainerTwoSession = await createSession(state.secondTrainerId);
  const trainerOneResponse = await trainerSessions!(request("/api/v1/trainer/sessions", {}, state.cookies.trainer) as never);
  const trainerTwoResponse = await trainerSessions!(request("/api/v1/trainer/sessions", {}, state.cookies["trainer-two"]) as never);
  const trainerOneIds = (await trainerOneResponse.json()).data.sessions.map((session: { sessionId: string }) => session.sessionId);
  const trainerTwoIds = (await trainerTwoResponse.json()).data.sessions.map((session: { sessionId: string }) => session.sessionId);
  assert.ok(trainerOneIds.includes(trainerOneSession));
  assert.ok(!trainerOneIds.includes(trainerTwoSession), "a trainer never sees another trainer's assignment");
  assert.ok(trainerTwoIds.includes(trainerTwoSession));
  assert.ok(!trainerTwoIds.includes(trainerOneSession), "assignment isolation is symmetric");
  assert.equal((await adminSessions!(request("/api/v1/admin/sessions", {}, state.cookies["member-one"]) as never))!.status, 403);
  assert.equal((await adminSessions!(request("/api/v1/admin/sessions", {}, state.cookies.admin) as never))!.status, 200);
  assert.equal((await adminOptions!(request("/api/v1/admin/options", {}, state.cookies["member-one"]) as never)).status, 403);
  assert.equal((await adminOptions!(request("/api/v1/admin/options", {}, state.cookies.admin) as never)).status, 200);
  const sessionsBeforeInvalidPayload = await (await import("@/lib/server/prisma")).prisma.classSession.count();
  for (const [label, body] of [
    ["unknown field", JSON.stringify({ unknown: true })],
    ["invalid JSON", "{"],
    ["oversized body", JSON.stringify({ padding: "x".repeat(17_000) })],
  ] as const) {
    assert.equal((await create!(rawUnsafe("/api/v1/admin/sessions", body, state.cookies.admin) as never))!.status, 400, `${label} administrator create is rejected`);
    assert.equal(await (await import("@/lib/server/prisma")).prisma.classSession.count(), sessionsBeforeInvalidPayload, `${label} administrator create creates no session`);
  }

  const sessionId = await createSession();
  const context = { params: Promise.resolve({ sessionId }) };
  const patched = await PATCH!(request(`/api/v1/admin/sessions/${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json", origin }, body: JSON.stringify({ capacity: 2 }) }, state.cookies.admin) as never, context);
  assert.equal(patched.status, 200);
  const { prisma } = await import("@/lib/server/prisma");
  const beforeInvalidPatch = await prisma.classSession.findUniqueOrThrow({ where: { id: sessionId }, select: { capacity: true, status: true, trainerId: true } });
  assert.equal((await PATCH!(request(`/api/v1/admin/sessions/${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json", origin }, body: JSON.stringify({ capacity: 0 }) }, state.cookies.admin) as never, context)).status, 400);
  assert.equal((await PATCH!(request(`/api/v1/admin/sessions/${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json", origin }, body: JSON.stringify({ capacity: 3, trainerId: "attacker" }) }, state.cookies.admin) as never, context)).status, 400);
  for (const [label, body] of [
    ["invalid JSON", "{"],
    ["unknown field", JSON.stringify({ capacity: 3, status: "CANCELLED" })],
    ["oversized body", JSON.stringify({ capacity: 3, padding: "x".repeat(17_000) })],
  ] as const) {
    assert.equal((await PATCH!(rawUnsafe(`/api/v1/admin/sessions/${sessionId}`, body, state.cookies.admin) as never, context)).status, 400, `${label} administrator PATCH is rejected`);
    assert.deepEqual(await prisma.classSession.findUniqueOrThrow({ where: { id: sessionId }, select: { capacity: true, status: true, trainerId: true } }), beforeInvalidPatch, `${label} administrator PATCH leaves session unchanged`);
  }
  assert.deepEqual(await prisma.classSession.findUniqueOrThrow({ where: { id: sessionId }, select: { capacity: true, status: true, trainerId: true } }), beforeInvalidPatch);
  assert.equal((await participants!(request(`/api/v1/admin/sessions/${sessionId}/participants`, {}, state.cookies["member-one"]) as never, context)).status, 403);
  assert.equal((await participants!(request(`/api/v1/admin/sessions/${sessionId}/participants`, {}, state.cookies.admin) as never, context)).status, 200);
  const unknown = await mapSessionUpdateResult({ code: "UNMAPPED_DOMAIN_RESULT" } as never);
  assert.equal(unknown.status, 500);
  assert.equal((await unknown.json()).error.code, "INTERNAL_ERROR");
});

test("booking maps seat, duplicate, and invariant outcomes without mutating participation", async () => {
  const { prisma } = await import("@/lib/server/prisma");
  const { POST: book } = await import("@/app/api/v1/sessions/[sessionId]/bookings/route");
  const { POST: join } = await import("@/app/api/v1/sessions/[sessionId]/waitlist/route");

  const availableSession = await createSession();
  const availableContext = { params: Promise.resolve({ sessionId: availableSession }) };
  const availableBefore = await prisma.classSession.findUniqueOrThrow({ where: { id: availableSession }, select: { capacity: true, nextPositionKey: true } });
  const seatResponse = await join!(unsafe(`/api/v1/sessions/${availableSession}/waitlist`, {}, state.cookies["member-two"]) as never, availableContext);
  assert.equal(seatResponse!.status, 409);
  assert.equal((await seatResponse!.json()).error.code, "SEAT_AVAILABLE");
  assert.deepEqual(await prisma.classSession.findUniqueOrThrow({ where: { id: availableSession }, select: { capacity: true, nextPositionKey: true } }), availableBefore);
  assert.equal(await prisma.waitlistEntry.count({ where: { sessionId: availableSession } }), 0);

  await prisma.booking.create({ data: { memberId: state.memberIds["member-two"], sessionId: availableSession, status: "CONFIRMED", bookedAt: new Date() } });
  const duplicateBefore = await prisma.booking.count({ where: { sessionId: availableSession, status: "CONFIRMED" } });
  const duplicate = await book!(unsafe(`/api/v1/sessions/${availableSession}/bookings`, {}, state.cookies["member-two"]) as never, availableContext);
  assert.equal(duplicate!.status, 409);
  assert.equal((await duplicate!.json()).error.code, "ALREADY_BOOKED");
  assert.equal(await prisma.booking.count({ where: { sessionId: availableSession, status: "CONFIRMED" } }), duplicateBefore);

  const overlapSession = await createSession(state.secondTrainerId);
  const overlapStart = await prisma.classSession.findUniqueOrThrow({ where: { id: availableSession }, select: { startsAt: true, endsAt: true } });
  await prisma.classSession.update({ where: { id: overlapSession }, data: { startsAt: overlapStart.startsAt, endsAt: overlapStart.endsAt } });
  const overlapContext = { params: Promise.resolve({ sessionId: overlapSession }) };
  const overlapBefore = await prisma.$transaction(async (tx) => ({ session: await tx.classSession.findUniqueOrThrow({ where: { id: overlapSession }, select: { capacity: true, nextPositionKey: true } }), bookings: await tx.booking.count({ where: { sessionId: overlapSession } }) }));
  const bookingConflict = await book!(unsafe(`/api/v1/sessions/${overlapSession}/bookings`, {}, state.cookies["member-two"]) as never, overlapContext);
  assert.equal(bookingConflict!.status, 409);
  assert.equal((await bookingConflict!.json()).error.code, "BOOKING_CONFLICT");
  assert.deepEqual(await prisma.$transaction(async (tx) => ({ session: await tx.classSession.findUniqueOrThrow({ where: { id: overlapSession }, select: { capacity: true, nextPositionKey: true } }), bookings: await tx.booking.count({ where: { sessionId: overlapSession } }) })), overlapBefore);

  const invariantSession = await createSession();
  await prisma.classSession.update({ where: { id: invariantSession }, data: { capacity: 2, nextPositionKey: 2 } });
  await prisma.waitlistEntry.create({ data: { memberId: state.memberIds["member-one"], sessionId: invariantSession, status: "WAITING", positionKey: 1, joinedAt: new Date() } });
  const invariantContext = { params: Promise.resolve({ sessionId: invariantSession }) };
  const invariantBefore = await prisma.$transaction(async (tx) => ({ session: await tx.classSession.findUniqueOrThrow({ where: { id: invariantSession }, select: { capacity: true, nextPositionKey: true } }), bookings: await tx.booking.count({ where: { sessionId: invariantSession } }), entries: await tx.waitlistEntry.count({ where: { sessionId: invariantSession } }) }));
  for (const [operation, response] of [
    ["book", await book!(unsafe(`/api/v1/sessions/${invariantSession}/bookings`, {}, state.cookies["member-two"]) as never, invariantContext)],
    ["waitlist", await join!(unsafe(`/api/v1/sessions/${invariantSession}/waitlist`, {}, state.cookies["member-two"]) as never, invariantContext)],
  ] as const) {
    assert.equal(response!.status, 500, `${operation} rejects the inconsistent free-seat-plus-waiter state`);
    assert.equal((await response!.json()).error.code, "PARTICIPATION_INVARIANT_BROKEN");
    const invariantAfter = await prisma.$transaction(async (tx) => ({ session: await tx.classSession.findUniqueOrThrow({ where: { id: invariantSession }, select: { capacity: true, nextPositionKey: true } }), bookings: await tx.booking.count({ where: { sessionId: invariantSession } }), entries: await tx.waitlistEntry.count({ where: { sessionId: invariantSession } }) }));
    assert.deepEqual(invariantAfter, invariantBefore, `${operation} does not repair or mutate the inconsistent state`);
  }
});

test("administrator reference, occupancy, FIFO promotion, and cutoff writes preserve the contract", async () => {
  const { prisma } = await import("@/lib/server/prisma");
  const { POST: create } = await import("@/app/api/v1/admin/sessions/route");
  const { PATCH } = await import("@/app/api/v1/admin/sessions/[sessionId]/route");
  const makePatch = (sessionId: string, capacity: number, cookie = state.cookies.admin, requestOrigin = origin) => PATCH!(request(`/api/v1/admin/sessions/${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json", origin: requestOrigin }, body: JSON.stringify({ capacity }) }, cookie) as never, { params: Promise.resolve({ sessionId }) });
  const startsAt = new Date(Date.now() + 96 * 60 * 60 * 1000);
  startsAt.setUTCMinutes(0, 0, 0);
  const adminPayload = { programId: ids.program, trainerId: state.trainerId, startsAt: startsAt.toISOString(), endsAt: new Date(startsAt.getTime() + 60 * 60_000).toISOString(), capacity: 1, bookingCutoffMinutes: 30 };
  const sessionsBefore = await prisma.classSession.count();
  const invalidTrainer = await create!(unsafe("/api/v1/admin/sessions", { ...adminPayload, trainerId: randomUUID() }, state.cookies.admin) as never);
  assert.equal(invalidTrainer!.status, 422);
  assert.equal((await invalidTrainer!.json()).error.code, "INVALID_TRAINER");
  const invalidProgram = await create!(unsafe("/api/v1/admin/sessions", { ...adminPayload, programId: randomUUID() }, state.cookies.admin) as never);
  assert.equal(invalidProgram!.status, 422);
  assert.equal((await invalidProgram!.json()).error.code, "INVALID_REFERENCE");
  const invalidInterval = await create!(unsafe("/api/v1/admin/sessions", { ...adminPayload, endsAt: startsAt.toISOString() }, state.cookies.admin) as never);
  assert.equal(invalidInterval!.status, 422);
  assert.equal((await invalidInterval!.json()).error.code, "INVALID_SESSION_INTERVAL");
  const csrfCreate = await create!(unsafe("/api/v1/admin/sessions", adminPayload, state.cookies.admin, "https://attacker.example") as never);
  assert.equal(csrfCreate!.status, 403);
  assert.equal(await prisma.classSession.count(), sessionsBefore, "invalid references and cross-origin create leave no session rows");

  const editable = await createSession(state.secondTrainerId);
  const editableStart = new Date(Date.now() + 120 * 60 * 60_000);
  editableStart.setUTCMinutes(0, 0, 0);
  const editableEnd = new Date(editableStart.getTime() + 75 * 60_000);
  const editResponse = await PATCH!(request(`/api/v1/admin/sessions/${editable}`, { method: "PATCH", headers: { "content-type": "application/json", origin }, body: JSON.stringify({ programId: ids.program, trainerId: state.trainerId, startsAt: editableStart.toISOString(), endsAt: editableEnd.toISOString(), capacity: 2, bookingCutoffMinutes: 45 }) }, state.cookies.admin) as never, { params: Promise.resolve({ sessionId: editable }) });
  assert.equal(editResponse!.status, 200);
  const editBody = (await editResponse!.json()).data;
  assert.equal(editBody.programId, ids.program);
  assert.equal(editBody.trainerId, state.trainerId);
  assert.equal(editBody.capacity, 2);
  assert.equal(editBody.bookingCutoffMinutes, 45);
  assert.equal(editBody.startsAt, editableStart.toISOString());
  assert.equal(editBody.endsAt, editableEnd.toISOString());
  const editableBeforeInvalid = await prisma.classSession.findUniqueOrThrow({ where: { id: editable }, select: { programId: true, trainerId: true, startsAt: true, endsAt: true, capacity: true, bookingCutoffMinutes: true } });
  const invalidEdit = await PATCH!(request(`/api/v1/admin/sessions/${editable}`, { method: "PATCH", headers: { "content-type": "application/json", origin }, body: JSON.stringify({ trainerId: randomUUID() }) }, state.cookies.admin) as never, { params: Promise.resolve({ sessionId: editable }) });
  assert.equal(invalidEdit!.status, 422);
  assert.equal((await invalidEdit!.json()).error.code, "INVALID_REFERENCE");
  assert.deepEqual(await prisma.classSession.findUniqueOrThrow({ where: { id: editable }, select: { programId: true, trainerId: true, startsAt: true, endsAt: true, capacity: true, bookingCutoffMinutes: true } }), editableBeforeInvalid);
  const overlapEditSession = await createSession(state.secondTrainerId);
  const overlapEdit = await PATCH!(request(`/api/v1/admin/sessions/${overlapEditSession}`, { method: "PATCH", headers: { "content-type": "application/json", origin }, body: JSON.stringify({ trainerId: state.trainerId, startsAt: editableStart.toISOString(), endsAt: editableEnd.toISOString() }) }, state.cookies.admin) as never, { params: Promise.resolve({ sessionId: overlapEditSession }) });
  assert.equal(overlapEdit!.status, 409);
  assert.equal((await overlapEdit!.json()).error.code, "TRAINER_OVERLAP");
  assert.equal((await prisma.classSession.findUniqueOrThrow({ where: { id: overlapEditSession } })).trainerId, state.secondTrainerId, "overlap update preserves the original assignment");
  assert.equal((await PATCH!(request(`/api/v1/admin/sessions/${editable}`, { method: "PATCH", headers: { "content-type": "application/json", origin }, body: JSON.stringify({ status: "CANCELLED" }) }, state.cookies.admin) as never, { params: Promise.resolve({ sessionId: editable }) }))!.status, 400, "session cancellation remains outside the PATCH contract");

  const occupied = await createSession();
  assert.equal((await makePatch(occupied, 2))!.status, 200);
  await prisma.booking.createMany({ data: [
    { memberId: state.memberIds["member-one"], sessionId: occupied, status: "CONFIRMED", bookedAt: new Date() },
    { memberId: state.memberIds["member-two"], sessionId: occupied, status: "CONFIRMED", bookedAt: new Date() },
  ] });
  const occupancyBefore = await prisma.classSession.findUniqueOrThrow({ where: { id: occupied }, select: { capacity: true } });
  const belowConfirmed = await makePatch(occupied, 1);
  assert.equal(belowConfirmed!.status, 409);
  assert.equal((await belowConfirmed!.json()).error.code, "CAPACITY_BELOW_CONFIRMED");
  assert.deepEqual(await prisma.classSession.findUniqueOrThrow({ where: { id: occupied }, select: { capacity: true } }), occupancyBefore);
  const participantEdit = await PATCH!(request(`/api/v1/admin/sessions/${occupied}`, { method: "PATCH", headers: { "content-type": "application/json", origin }, body: JSON.stringify({ capacity: 3, trainerId: state.secondTrainerId }) }, state.cookies.admin) as never, { params: Promise.resolve({ sessionId: occupied }) });
  assert.equal(participantEdit!.status, 409);
  assert.equal((await participantEdit!.json()).error.code, "SESSION_HAS_PARTICIPANTS");
  assert.deepEqual(await prisma.classSession.findUniqueOrThrow({ where: { id: occupied }, select: { capacity: true, trainerId: true } }), { ...occupancyBefore, trainerId: state.trainerId });
  const occupiedSession = await prisma.classSession.findUniqueOrThrow({ where: { id: occupied } });
  const overlapCount = await prisma.classSession.count();
  const trainerOverlap = await create!(unsafe("/api/v1/admin/sessions", { ...adminPayload, startsAt: occupiedSession.startsAt.toISOString(), endsAt: occupiedSession.endsAt.toISOString() }, state.cookies.admin) as never);
  assert.equal(trainerOverlap!.status, 409);
  assert.equal((await trainerOverlap!.json()).error.code, "TRAINER_OVERLAP");
  assert.equal(await prisma.classSession.count(), overlapCount, "trainer-overlap rejection creates no session");

  const historical = await createSession();
  const historicNow = new Date();
  await prisma.booking.create({ data: { memberId: state.memberIds["member-one"], sessionId: historical, status: "CANCELLED", bookedAt: historicNow, cancelledAt: historicNow } });
  await prisma.waitlistEntry.create({ data: { memberId: state.memberIds["member-two"], sessionId: historical, status: "CANCELLED", positionKey: 1, joinedAt: historicNow, resolvedAt: historicNow } });
  const historyBefore = await prisma.classSession.findUniqueOrThrow({ where: { id: historical }, select: { trainerId: true, startsAt: true, endsAt: true, bookingCutoffMinutes: true } });
  const historicalEdit = await PATCH!(request(`/api/v1/admin/sessions/${historical}`, { method: "PATCH", headers: { "content-type": "application/json", origin }, body: JSON.stringify({ startsAt: new Date(historyBefore.startsAt.getTime() + 3_600_000).toISOString(), endsAt: new Date(historyBefore.endsAt.getTime() + 3_600_000).toISOString() }) }, state.cookies.admin) as never, { params: Promise.resolve({ sessionId: historical }) });
  assert.equal(historicalEdit!.status, 409);
  assert.equal((await historicalEdit!.json()).error.code, "SESSION_HAS_PARTICIPANTS");
  assert.deepEqual(await prisma.classSession.findUniqueOrThrow({ where: { id: historical }, select: { trainerId: true, startsAt: true, endsAt: true, bookingCutoffMinutes: true } }), historyBefore, "inactive historical participation still freezes scheduling fields");

  const promotionSession = await createSession();
  const inactiveMemberId = state.memberIds["member-two"];
  const inactiveProfile = await prisma.memberProfile.findUniqueOrThrow({ where: { id: inactiveMemberId }, select: { status: true } });
  await prisma.memberProfile.update({ where: { id: inactiveMemberId }, data: { status: "INACTIVE" } });
  const firstWaiter = await prisma.waitlistEntry.create({ data: { memberId: inactiveMemberId, sessionId: promotionSession, status: "WAITING", positionKey: 1, joinedAt: new Date() } });
  const secondWaiter = await prisma.waitlistEntry.create({ data: { memberId: state.memberIds["member-one"], sessionId: promotionSession, status: "WAITING", positionKey: 2, joinedAt: new Date() } });
  try {
    const promotion = await makePatch(promotionSession, 2);
    assert.equal(promotion!.status, 200);
    assert.deepEqual((await promotion!.json()).data.promotedMemberIds, [state.memberIds["member-one"]]);
    assert.equal((await prisma.waitlistEntry.findUniqueOrThrow({ where: { id: firstWaiter.id } })).status, "EXPIRED", "ineligible FIFO candidate expires before the next eligible waiter is promoted");
    assert.equal((await prisma.waitlistEntry.findUniqueOrThrow({ where: { id: secondWaiter.id } })).status, "PROMOTED");
    assert.equal(await prisma.booking.count({ where: { sessionId: promotionSession, status: "CONFIRMED" } }), 1);
  } finally {
    await prisma.memberProfile.update({ where: { id: inactiveMemberId }, data: { status: inactiveProfile.status } });
  }

  const cutoffSession = await createSession();
  const cutoffStart = new Date(Date.now() + 10 * 60_000);
  await prisma.classSession.update({ where: { id: cutoffSession }, data: { startsAt: cutoffStart, endsAt: new Date(cutoffStart.getTime() + 60 * 60_000), bookingCutoffMinutes: 30 } });
  await prisma.booking.create({ data: { memberId: state.memberIds["member-one"], sessionId: cutoffSession, status: "CONFIRMED", bookedAt: new Date() } });
  await prisma.waitlistEntry.create({ data: { memberId: state.memberIds["member-two"], sessionId: cutoffSession, status: "WAITING", positionKey: 1, joinedAt: new Date() } });
  const cutoffBooking = await prisma.booking.findFirstOrThrow({ where: { sessionId: cutoffSession, memberId: state.memberIds["member-one"] } });
  const { DELETE: cancel } = await import("@/app/api/v1/bookings/[bookingId]/route");
  const cutoffCancel = await cancel!(request(`/api/v1/bookings/${cutoffBooking.id}`, { method: "DELETE", headers: { origin } }, state.cookies["member-one"]) as never, { params: Promise.resolve({ bookingId: cutoffBooking.id }) });
  assert.equal(cutoffCancel!.status, 422);
  assert.equal((await cutoffCancel!.json()).error.code, "BOOKING_CUTOFF_PASSED");
  assert.equal((await prisma.booking.findUniqueOrThrow({ where: { id: cutoffBooking.id } })).status, "CONFIRMED", "cutoff rejection preserves the booking");
  const cutoffBefore = await prisma.$transaction(async (tx) => ({ session: await tx.classSession.findUniqueOrThrow({ where: { id: cutoffSession }, select: { capacity: true, startsAt: true } }), entries: await tx.waitlistEntry.count({ where: { sessionId: cutoffSession, status: "WAITING" } }), bookings: await tx.booking.count({ where: { sessionId: cutoffSession, status: "CONFIRMED" } }) }));
  const blockedPromotion = await makePatch(cutoffSession, 2);
  assert.equal(blockedPromotion!.status, 409);
  assert.equal((await blockedPromotion!.json()).error.code, "WAITLIST_CUTOFF_PASSED");
  assert.deepEqual(await prisma.$transaction(async (tx) => ({ session: await tx.classSession.findUniqueOrThrow({ where: { id: cutoffSession }, select: { capacity: true, startsAt: true } }), entries: await tx.waitlistEntry.count({ where: { sessionId: cutoffSession, status: "WAITING" } }), bookings: await tx.booking.count({ where: { sessionId: cutoffSession, status: "CONFIRMED" } }) })), cutoffBefore, "cutoff rejection does not change capacity or queue state");
  const csrfCapacity = await makePatch(cutoffSession, 2, state.cookies.admin, "https://attacker.example");
  assert.equal(csrfCapacity!.status, 403);
  assert.deepEqual(await prisma.classSession.findUniqueOrThrow({ where: { id: cutoffSession }, select: { capacity: true } }), { capacity: cutoffBefore.session.capacity });
});
