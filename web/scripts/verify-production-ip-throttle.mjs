import pg from "pg";
import { log } from "node:console";
import { createHash, randomUUID } from "node:crypto";
import process from "node:process";

const origin = "https://fitops-sebastian11.vercel.app";
const demoPassword = process.env.FITOPS_DEMO_PASSWORD;

if (process.env.FITOPS_VERIFY_PRODUCTION_IP_LIMIT !== "YES") {
  throw new Error("Set FITOPS_VERIFY_PRODUCTION_IP_LIMIT=YES only when intentionally running the guarded production check.");
}
if (process.env.BETTER_AUTH_URL !== origin || process.env.TRUST_PROXY !== "true") {
  throw new Error("Production origin and TRUST_PROXY=true must come from the linked Vercel Production environment.");
}
if (!process.env.DATABASE_URL_UNPOOLED || !demoPassword || demoPassword.length < 15) {
  throw new Error("The Vercel unpooled database URL and local fictional demo password are required.");
}

const digest = (value) => createHash("sha256").update(value).digest("hex");
const runId = randomUUID();
const failedEmails = Array.from({ length: 20 }, (_, index) => `production-rate-proof-${runId}-${index}@example.test`);
const fakeAddresses = Array.from({ length: 20 }, (_, index) => `198.51.100.${index + 1}`);
const adminEmail = "admin@example.test";
const knownKeys = new Set([
  ...failedEmails.map((email) => digest(`email:${email}`)),
  digest(`email:${adminEmail}`),
  ...fakeAddresses.map((address) => digest(`ip:${address}`)),
]);
const client = new pg.Client({ connectionString: process.env.DATABASE_URL_UNPOOLED });

await client.connect();
const baselineRows = (await client.query('SELECT "key", "failure_count", "window_started_at" FROM "auth_login_attempts"')).rows;
const baseline = new Map(baselineRows.map((row) => [row.key, row]));
const changedRows = async () => {
  const rows = (await client.query('SELECT "key", "failure_count", "window_started_at" FROM "auth_login_attempts"')).rows;
  return rows.filter((row) => {
    const previous = baseline.get(row.key);
    return !previous
      || previous.failure_count !== row.failure_count
      || new Date(previous.window_started_at).getTime() !== new Date(row.window_started_at).getTime();
  });
};

let proof;
let failure;
let cleanupFailure;
try {
  const requestHeaders = { "content-type": "application/json", origin };
  for (let index = 0; index < failedEmails.length; index += 1) {
    const response = await globalThis.fetch(`${origin}/api/v1/auth/login`, {
      method: "POST",
      headers: { ...requestHeaders, "x-forwarded-for": fakeAddresses[index] },
      body: JSON.stringify({ email: failedEmails[index], password: "Invalid-Demo-Password-999", returnTo: "/app" }),
    });
    if (response.status !== 401) throw new Error(`Invalid demo login ${index + 1} returned HTTP ${response.status}; expected generic denial.`);
  }

  const validLogin = await globalThis.fetch(`${origin}/api/v1/auth/login`, {
    method: "POST",
    headers: { ...requestHeaders, "x-forwarded-for": "203.0.113.222" },
    body: JSON.stringify({ email: adminEmail, password: demoPassword, returnTo: "/admin/sessions" }),
  });
  const candidates = (await changedRows()).filter((row) => !knownKeys.has(row.key) && Number(row.failure_count) >= 21);
  if (candidates.length !== 1) throw new Error("Expected one aggregated client-IP attempt counter at or above the 20-attempt threshold.");
  if (validLogin.status !== 401) throw new Error(`A valid fictional administrator login was not IP-throttled (HTTP ${validLogin.status}).`);
  proof = {
    uniqueSpoofedForwardingHeaders: fakeAddresses.length,
    uniqueInvalidLoginsDenied: failedEmails.length,
    forwardedHeaderSpoofingResisted: true,
    validAdminLoginThrottled: true,
    httpStatus: validLogin.status,
    configuredThreshold: 20,
  };
} catch (error) {
  failure = error;
}

try {
  const changed = await changedRows();
  const highAttemptIpRows = changed.filter((row) => !knownKeys.has(row.key) && Number(row.failure_count) >= 21);
  const otherIpRows = changed.filter((row) => !knownKeys.has(row.key));
  const keysToRestore = new Set([...knownKeys, ...highAttemptIpRows.map((row) => row.key)]);
  if (highAttemptIpRows.length === 0 && otherIpRows.length === 1) keysToRestore.add(otherIpRows[0].key);

  await client.query("BEGIN");
  try {
    for (const key of keysToRestore) {
      const previous = baseline.get(key);
      if (previous) {
        await client.query(
          'UPDATE "auth_login_attempts" SET "failure_count" = $2, "window_started_at" = $3 WHERE "key" = $1',
          [key, previous.failure_count, previous.window_started_at],
        );
      } else {
        await client.query('DELETE FROM "auth_login_attempts" WHERE "key" = $1', [key]);
      }
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    cleanupFailure = error;
  }
} catch (error) {
  cleanupFailure = error;
} finally {
  await client.end();
}

if (failure) throw failure;
if (cleanupFailure) throw cleanupFailure;
log(JSON.stringify(proof));
