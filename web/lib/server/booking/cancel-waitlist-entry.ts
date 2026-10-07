import "server-only";

import { withBookingLocks } from "@/lib/server/booking/with-booking-locks";
import { prisma } from "@/lib/server/prisma";

export type CancelWaitlistEntryResult = "CANCELLED" | "PROMOTED" | "NOT_CANCELLABLE" | "NOT_FOUND";

export async function cancelWaitlistEntry(entryId: string, memberId: string): Promise<CancelWaitlistEntryResult> {
  const entry = await prisma.waitlistEntry.findUnique({ where: { id: entryId }, select: { sessionId: true, memberId: true } });
  if (!entry || entry.memberId !== memberId) return "NOT_FOUND";
  return withBookingLocks(entry.sessionId, memberId, async (tx) => {
    const locked = await tx.waitlistEntry.findFirst({ where: { id: entryId, memberId } });
    if (!locked) return "NOT_FOUND";
    if (locked.status === "PROMOTED") return "PROMOTED";
    if (locked.status !== "WAITING" && locked.status !== "CANCELLED") return "NOT_CANCELLABLE";
    if (locked.status === "WAITING") {
      const now = (await tx.$queryRaw<{ now: Date }[]>`SELECT clock_timestamp() AS "now"`)[0]?.now;
      if (!now) throw new Error("Database clock was not returned.");
      await tx.waitlistEntry.update({ where: { id: entryId }, data: { status: "CANCELLED", resolvedAt: now } });
    }
    return "CANCELLED";
  });
}
