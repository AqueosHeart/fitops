import "server-only";

import type { Prisma } from "@/src/generated/prisma/client";
import { prisma } from "@/lib/server/prisma";

type LockedRow = { id: string };

export async function withBookingLocks<T>(
  sessionId: string,
  memberId: string,
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(async (tx) => {
    const sessions = await tx.$queryRaw<LockedRow[]>`
      SELECT "id"
      FROM "class_sessions"
      WHERE "id" = ${sessionId}::uuid
      FOR UPDATE
    `;

    if (sessions.length !== 1) {
      throw new Error("Booking session was not found.");
    }

    const members = await tx.$queryRaw<LockedRow[]>`
      SELECT "id"
      FROM "member_profiles"
      WHERE "id" = ${memberId}::uuid
      FOR UPDATE
    `;

    if (members.length !== 1) {
      throw new Error("Member profile was not found.");
    }

        return operation(tx);
      });
    } catch (error) {
      const code = typeof error === "object" && error && "code" in error ? String(error.code) : undefined;
      if ((code === "40P01" || code === "40001") && attempt < 2) continue;
      throw error;
    }
  }
  throw new Error("Unreachable transaction retry state.");
}
