import { NextRequest } from "next/server";
import { z } from "zod";

import { resolveCurrentUser } from "@/lib/server/auth/current-user";
import { jsonData, jsonError } from "@/lib/server/http/response";
import { prisma } from "@/lib/server/prisma";
import { requireSameOrigin } from "@/lib/server/http/origin";
import { parseJsonBody } from "@/lib/server/http/request";

const createSchema = z.object({ programId: z.uuid(), trainerId: z.uuid(), startsAt: z.iso.datetime(), endsAt: z.iso.datetime(), capacity: z.number().int().positive(), bookingCutoffMinutes: z.number().int().nonnegative() }).strict();

async function requireAdmin(request: NextRequest) {
  const user = await resolveCurrentUser(request.headers);
  if (!user) return { error: jsonError(401, "UNAUTHENTICATED", "Authentication is required.") };
  if (user.role !== "ADMINISTRATOR") return { error: jsonError(403, "FORBIDDEN", "Administrator access is required.") };
  return { user };
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if ("error" in admin) return admin.error;
  const sessions = await prisma.classSession.findMany({ include: { program: true, trainer: { include: { user: { select: { name: true } } } }, bookings: { take: 1, select: { id: true } }, waitlistEntries: { take: 1, select: { id: true } }, _count: { select: { bookings: { where: { status: "CONFIRMED" } }, waitlistEntries: { where: { status: "WAITING" } } } } }, orderBy: { startsAt: "asc" } });
  return jsonData({ sessions: sessions.map((session) => ({ sessionId: session.id, programId: session.programId, trainerId: session.trainerId, program: session.program.name, trainer: session.trainer.user.name, startsAt: session.startsAt.toISOString(), endsAt: session.endsAt.toISOString(), status: session.status.toLowerCase(), capacity: session.capacity, bookingCutoffMinutes: session.bookingCutoffMinutes, confirmedCount: session._count.bookings, waitingCount: session._count.waitlistEntries, hasParticipationHistory: session.bookings.length > 0 || session.waitlistEntries.length > 0 })) });
}

export async function POST(request: NextRequest) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  const admin = await requireAdmin(request);
  if ("error" in admin) return admin.error;
  const body = await parseJsonBody(request, createSchema);
  if (!body.success) return jsonError(400, "VALIDATION_FAILED", "Invalid session payload.", body.fields);
  const startsAt = new Date(body.data.startsAt);
  const endsAt = new Date(body.data.endsAt);
  if (startsAt >= endsAt) return jsonError(422, "INVALID_SESSION_INTERVAL", "The session must end after it starts.");
  const trainer = await prisma.trainerProfile.findUnique({ where: { id: body.data.trainerId }, include: { user: { select: { role: true } } } });
  if (!trainer || trainer.user.role !== "TRAINER") return jsonError(422, "INVALID_TRAINER", "The trainer was not found.");
  try {
    const session = await prisma.classSession.create({ data: { programId: body.data.programId, trainerId: body.data.trainerId, startsAt, endsAt, capacity: body.data.capacity, bookingCutoffMinutes: body.data.bookingCutoffMinutes } });
    return jsonData({ sessionId: session.id }, 201);
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2003") return jsonError(422, "INVALID_REFERENCE", "The program or trainer was not found.");
    if (error instanceof Error && error.message.includes("class_sessions_trainer_interval_exclusion")) {
      return jsonError(409, "TRAINER_OVERLAP", "The trainer is already assigned during that time.");
    }
    throw error;
  }
}
