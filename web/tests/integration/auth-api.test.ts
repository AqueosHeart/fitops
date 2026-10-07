import assert from "node:assert/strict";
import test from "node:test";

process.env.BETTER_AUTH_SECRET = "development-only-better-auth-secret-32chars";
process.env.BETTER_AUTH_URL = "http://localhost:3000";

const email = "auth-route-proof@example.test";
const password = "test-password-long-enough";

test("registration issues an HTTP-only Better Auth session accepted by protected membership route", async () => {
  const { POST: register } = await import("@/app/api/v1/auth/register/route");
  const { GET: membership } = await import("@/app/api/v1/me/membership/route");
  const { prisma } = await import("@/lib/server/prisma");

  try {
    const registration = await register(
      new Request("http://localhost:3000/api/v1/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "http://localhost:3000" },
        body: JSON.stringify({
          name: "Route Proof",
          email,
          password,
          termsPrivacyAccepted: true,
          waiverAccepted: true,
          selectedPlanCode: "base",
        }),
      }) as never,
    );

    assert.equal(registration.status, 201);
    assert.ok(!JSON.stringify(await registration.clone().json()).match(/password|credential|authVersion|email/i), "registration response excludes identity and credential fields");
    const setCookies = (registration.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.() ?? [registration.headers.get("set-cookie") ?? ""];
    assert.ok(setCookies.some((cookie) => /HttpOnly/i.test(cookie)));
    const cookie = setCookies.map((value) => value.split(";", 1)[0]).join("; ");

    const protectedResponse = await membership(
      new Request("http://localhost:3000/api/v1/me/membership", { headers: { cookie } }) as never,
    );
    assert.equal(protectedResponse.status, 200);
    const body = await protectedResponse.json();
    assert.equal(body.data.status, "active");
    assert.ok(!JSON.stringify(body).includes(password));

    const duplicate = await register(new Request("http://localhost:3000/api/v1/auth/register", { method: "POST", headers: { "content-type": "application/json", origin: "http://localhost:3000" }, body: JSON.stringify({ name: "Duplicate Proof", email, password, termsPrivacyAccepted: true, waiverAccepted: true, selectedPlanCode: "base" }) }) as never);
    assert.equal(duplicate.status, 409);
    assert.equal(await prisma.user.count({ where: { email } }), 1, "duplicate registration creates no second account");
  } finally {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.$transaction([
        prisma.authSession.deleteMany({ where: { userId: user.id } }),
        prisma.authAccount.deleteMany({ where: { userId: user.id } }),
        prisma.memberProfile.deleteMany({ where: { userId: user.id } }),
        prisma.user.delete({ where: { id: user.id } }),
      ]);
    }
    await prisma.$disconnect();
  }
});

test("unsafe registration rejects a cross-origin request without creating a user", async () => {
  const { POST: register } = await import("@/app/api/v1/auth/register/route");
  const { prisma } = await import("@/lib/server/prisma");
  const blockedEmail = "blocked-auth-route-proof@example.test";
  try {
    const response = await register(
      new Request("http://localhost:3000/api/v1/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "https://attacker.example" },
        body: JSON.stringify({ name: "Blocked Route Proof", email: blockedEmail, password, termsPrivacyAccepted: true, waiverAccepted: true, selectedPlanCode: "base" }),
      }) as never,
    );
    assert.equal(response.status, 403);
    assert.equal(await prisma.user.count({ where: { email: blockedEmail } }), 0);
  } finally {
    await prisma.$disconnect();
  }
});

test("unsafe registration rejects an origin that only matches a spoofed request host", async () => {
  const { POST: register } = await import("@/app/api/v1/auth/register/route");
  const response = await register(
    new Request("https://attacker.example/api/v1/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://attacker.example", host: "attacker.example" },
      body: JSON.stringify({}),
    }) as never,
  );
  assert.equal(response.status, 403);
});

test("a changed auth version invalidates an already-issued session", async () => {
  const { POST: register } = await import("@/app/api/v1/auth/register/route");
  const { GET: membership } = await import("@/app/api/v1/me/membership/route");
  const { prisma } = await import("@/lib/server/prisma");
  const staleEmail = "stale-auth-route-proof@example.test";
  try {
    const response = await register(new Request("http://localhost:3000/api/v1/auth/register", { method: "POST", headers: { "content-type": "application/json", origin: "http://localhost:3000" }, body: JSON.stringify({ name: "Stale Proof", email: staleEmail, password, termsPrivacyAccepted: true, waiverAccepted: true, selectedPlanCode: "base" }) }) as never);
    const cookies = ((response.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie?.() ?? [response.headers.get("set-cookie") ?? ""]).map((value) => value.split(";", 1)[0]).join("; ");
    await prisma.user.update({ where: { email: staleEmail }, data: { authVersion: { increment: 1 } } });
    const protectedResponse = await membership(new Request("http://localhost:3000/api/v1/me/membership", { headers: { cookie: cookies } }) as never);
    assert.equal(protectedResponse.status, 401);
  } finally {
    const user = await prisma.user.findUnique({ where: { email: staleEmail } });
    if (user) await prisma.$transaction([prisma.authSession.deleteMany({ where: { userId: user.id } }), prisma.authAccount.deleteMany({ where: { userId: user.id } }), prisma.memberProfile.deleteMany({ where: { userId: user.id } }), prisma.user.delete({ where: { id: user.id } })]);
    await prisma.$disconnect();
  }
});

test("registration returns contract consent, plan, and return-path failures", async () => {
  const { POST: register } = await import("@/app/api/v1/auth/register/route");
  const { auth } = await import("@/lib/server/auth");
  const { prisma } = await import("@/lib/server/prisma");
  const requestFor = async (overrides: Record<string, unknown>) => {
    const email = `contract-${crypto.randomUUID()}@example.test`;
    const response = await register(new Request("http://localhost:3000/api/v1/auth/register", { method: "POST", headers: { "content-type": "application/json", origin: "http://localhost:3000" }, body: JSON.stringify({ name: "Contract Proof", email, password, termsPrivacyAccepted: true, waiverAccepted: true, selectedPlanCode: "base", ...overrides }) }) as never);
    assert.equal(await prisma.user.count({ where: { email } }), 0, "rejected registration creates no user");
    return response;
  };
  assert.equal((await requestFor({ waiverAccepted: false })).status, 422);
  assert.equal((await requestFor({ selectedPlanCode: "unknown" })).status, 422);
  assert.equal((await requestFor({ returnTo: "https://attacker.example" })).status, 422);
  assert.equal((await requestFor({ unexpected: true })).status, 400, "unknown registration fields are rejected without creating the supplied account");
  const usersBeforeMalformed = await prisma.user.count();
  const malformed = await register(new Request("http://localhost:3000/api/v1/auth/register", { method: "POST", headers: { "content-type": "application/json", origin: "http://localhost:3000" }, body: "{" }) as never);
  assert.equal(malformed.status, 400);
  assert.equal(await prisma.user.count(), usersBeforeMalformed, "invalid JSON registration creates no user");
  const originalHandler = Object.getOwnPropertyDescriptor(auth, "handler");
  assert.ok(originalHandler, "Better Auth handler is available for failure-path injection");
  try {
    for (const [label, failingHandler] of [
      ["non-success response", async () => new Response(null, { status: 503 })],
      ["thrown error", async () => { throw new Error("injected session failure"); }],
    ] as const) {
      Object.defineProperty(auth, "handler", { configurable: true, writable: true, value: failingHandler });
      const email = `session-failure-${crypto.randomUUID()}@example.test`;
      const failedSession = await register(new Request("http://localhost:3000/api/v1/auth/register", { method: "POST", headers: { "content-type": "application/json", origin: "http://localhost:3000" }, body: JSON.stringify({ name: "Session Failure", email, password, termsPrivacyAccepted: true, waiverAccepted: true, selectedPlanCode: "base" }) }) as never);
      assert.equal(failedSession.status, 500, `${label} returns a generic server error`);
      assert.equal((await prisma.user.count({ where: { email } })), 0, `${label} rolls back the new user`);
      assert.equal(await prisma.memberProfile.count({ where: { user: { email } } }), 0, `${label} rolls back the member profile`);
      assert.equal(await prisma.authAccount.count({ where: { user: { email } } }), 0, `${label} rolls back the credential account`);
    }
  } finally {
    Object.defineProperty(auth, "handler", originalHandler);
  }
  const oversizedEmail = `oversized-${crypto.randomUUID()}@example.test`;
  const oversizedBody = JSON.stringify({ name: "x".repeat(17_000), email: oversizedEmail, password, termsPrivacyAccepted: true, waiverAccepted: true, selectedPlanCode: "base" });
  const oversized = await register(new Request("http://localhost:3000/api/v1/auth/register", { method: "POST", headers: { "content-type": "application/json", origin: "http://localhost:3000" }, body: oversizedBody }) as never);
  assert.equal(oversized.status, 400);
  assert.equal(await prisma.user.count({ where: { email: oversizedEmail } }), 0, "oversized registration creates no user");
  await prisma.$disconnect();
});
