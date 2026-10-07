import { NextRequest } from "next/server";
import { z } from "zod";

import { resolveCurrentUser } from "@/lib/server/auth/current-user";
import { jsonData, jsonError } from "@/lib/server/http/response";
import { prisma } from "@/lib/server/prisma";

export async function GET(request: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  const params = z.object({ sessionId: z.uuid() }).safeParse(await context.params);
  if (!params.success) return jsonError(400, "VALIDATION_FAILED", "Invalid session identifier.");
  const user = await resolveCurrentUser(request.headers);
  if (!user) return jsonError(401, "UNAUTHENTICATED", "Authentication is required.");
  if (user.role !== "ADMINISTRATOR") return jsonError(403, "FORBIDDEN", "Administrator access is required.");
  const session = await prisma.classSession.findUnique({ where: { id: params.data.sessionId }, include: { bookings: { where: { status: "CONFIRMED" }, include: { member: { include: { user: { select: { name: true } } } } }, orderBy: { bookedAt: "asc" } }, waitlistEntries: { where: { status: "WAITING" }, include: { member: { include: { user: { select: { name: true } } } } }, orderBy: { positionKey: "asc" } } } });
  if (!session) return jsonError(404, "SESSION_NOT_FOUND", "The session was not found.");
  return jsonData({ bookings: session.bookings.map((booking) => ({ bookingId: booking.id, memberName: booking.member.user.name, bookedAt: booking.bookedAt.toISOString() })), waitlist: session.waitlistEntries.map((entry) => ({ entryId: entry.id, memberName: entry.member.user.name, position: entry.positionKey.toString(), joinedAt: entry.joinedAt.toISOString() })) });
}
