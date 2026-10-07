import { NextRequest } from "next/server";
import { z } from "zod";

import { jsonData, jsonError } from "@/lib/server/http/response";
import { prisma } from "@/lib/server/prisma";

export async function GET(_request: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  const params = z.object({ sessionId: z.uuid() }).safeParse(await context.params);
  if (!params.success) return jsonError(400, "VALIDATION_FAILED", "Invalid session identifier.");
  const session = await prisma.classSession.findFirst({ where: { id: params.data.sessionId, status: "SCHEDULED", program: { isPublished: true } }, include: { program: true, trainer: { include: { user: { select: { name: true } } } }, _count: { select: { bookings: { where: { status: "CONFIRMED" } } } } } });
  if (!session) return jsonError(404, "SESSION_NOT_FOUND", "The session was not found.");
  return jsonData({ sessionId: session.id, program: session.program.name, trainer: session.trainer.user.name, startsAt: session.startsAt.toISOString(), endsAt: session.endsAt.toISOString(), capacity: session.capacity, confirmedCount: session._count.bookings, availability: session._count.bookings < session.capacity ? "available" : "full", bookingCutoffMinutes: session.bookingCutoffMinutes });
}
