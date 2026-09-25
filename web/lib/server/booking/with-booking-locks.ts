import "server-only";

import type { Prisma } from "@/src/generated/prisma/client";
import { prisma } from "@/lib/server/prisma";

type LockedRow = { id: string };

export async function withBookingLocks<T>(
  sessionId: string,
  memberId: string,
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
) {
  return prisma.$transaction(async (tx) => {
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
}
