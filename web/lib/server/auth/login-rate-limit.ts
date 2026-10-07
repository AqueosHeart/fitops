import "server-only";

import { createHash, randomUUID } from "node:crypto";

import { prisma } from "@/lib/server/prisma";

const WINDOW_MS = 15 * 60 * 1000;

function key(scope: "email" | "ip", value: string) {
  return createHash("sha256").update(`${scope}:${value}`).digest("hex");
}

function currentIp(headers: Headers) {
  if (process.env.TRUST_PROXY === "true") {
    return headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim() || null;
  }
  return null;
}

async function reserve(scope: "email" | "ip", value: string, max: number) {
  const now = new Date();
  const restartBefore = new Date(now.getTime() - WINDOW_MS);
  const attemptKey = key(scope, value);
  const rows = await prisma.$queryRaw<{ failure_count: number }[]>`
      INSERT INTO "auth_login_attempts" ("id", "key", "failure_count", "window_started_at")
      VALUES (${randomUUID()}::uuid, ${attemptKey}, 1, ${now})
      ON CONFLICT ("key") DO UPDATE
      SET "failure_count" = CASE
            WHEN "auth_login_attempts"."window_started_at" <= ${restartBefore} THEN 1
            ELSE "auth_login_attempts"."failure_count" + 1
          END,
          "window_started_at" = CASE
            WHEN "auth_login_attempts"."window_started_at" <= ${restartBefore} THEN ${now}
            ELSE "auth_login_attempts"."window_started_at"
          END
      RETURNING "failure_count"
    `;
  return (rows[0]?.failure_count ?? max + 1) <= max;
}

export async function reserveLoginAttempt(email: string, headers: Headers) {
  const emailAllowed = await reserve("email", email, 5);
  const ip = currentIp(headers);
  const ipAllowed = ip ? await reserve("ip", ip, 20) : true;
  return emailAllowed && ipAllowed;
}

export async function clearEmailLoginFailures(email: string) {
  await prisma.authLoginAttempt.deleteMany({ where: { key: key("email", email) } });
}

export async function releaseSuccessfulIpReservation(headers: Headers) {
  const ip = currentIp(headers);
  if (!ip) return;
  const attemptKey = key("ip", ip);
  await prisma.$executeRaw`
    UPDATE "auth_login_attempts"
    SET "failure_count" = GREATEST("failure_count" - 1, 0)
    WHERE "key" = ${attemptKey}
  `;
}
