import { NextRequest } from "next/server";

import { resolveCurrentUser } from "@/lib/server/auth/current-user";
import { jsonData, jsonError } from "@/lib/server/http/response";
import { prisma } from "@/lib/server/prisma";

export async function GET(request: NextRequest) {
  const user = await resolveCurrentUser(request.headers);
  if (!user) return jsonError(401, "UNAUTHENTICATED", "Authentication is required.");
  if (user.role !== "TRAINER" || !user.trainerProfile) return jsonError(403, "FORBIDDEN", "A trainer profile is required.");
  const sessions = await prisma.classSession.findMany({ where: { trainerId: user.trainerProfile.id }, include: { program: true, _count: { select: { bookings: { where: { status: "CONFIRMED" } } } } }, orderBy: { startsAt: "asc" } });
  return jsonData({ sessions: sessions.map((session) => ({ sessionId: session.id, program: session.program.name, startsAt: session.startsAt.toISOString(), endsAt: session.endsAt.toISOString(), status: session.status.toLowerCase(), capacity: session.capacity, confirmedCount: session._count.bookings })) });
}
