import { NextRequest } from "next/server";
import { z } from "zod";

import { resolveCurrentUser } from "@/lib/server/auth/current-user";
import { updateClassSession } from "@/lib/server/scheduling/update-class-session";
import { requireSameOrigin } from "@/lib/server/http/origin";
import { parseJsonBody } from "@/lib/server/http/request";
import { jsonData, jsonError, unexpectedError } from "@/lib/server/http/response";

const schema = z.object({
  programId: z.uuid().optional(),
  trainerId: z.uuid().optional(),
  startsAt: z.iso.datetime().optional(),
  endsAt: z.iso.datetime().optional(),
  capacity: z.number().int().positive().optional(),
  bookingCutoffMinutes: z.number().int().nonnegative().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, { message: "At least one session field is required." });

export function mapSessionUpdateResult(result: Exclude<Awaited<ReturnType<typeof updateClassSession>>, { code: "SESSION_UPDATED" }>) {
  if (result.code === "CAPACITY_INCREASE_BLOCKED") return jsonError(409, "WAITLIST_CUTOFF_PASSED", "Waiting members cannot be promoted after cutoff.");
  const cases: Record<string, [number, string]> = {
    SESSION_NOT_FOUND: [404, "The session was not found."],
    SESSION_HAS_PARTICIPANTS: [409, "Only capacity may change after participation has existed."],
    CAPACITY_BELOW_CONFIRMED: [409, "Capacity cannot be below confirmed occupancy."],
    CUTOFF_PASSED: [422, "The booking cutoff has passed."],
    INVALID_CAPACITY: [422, "Invalid capacity."],
    INVALID_INTERVAL: [422, "The session must end after it starts."],
    INVALID_CUTOFF: [422, "Booking cutoff must be non-negative."],
    INVALID_REFERENCE: [422, "The program or trainer was not found."],
    TRAINER_OVERLAP: [409, "The trainer is already assigned during that time."],
    SESSION_UNAVAILABLE: [409, "This session is unavailable."],
  };
  const mapped = cases[result.code];
  return mapped ? jsonError(mapped[0], result.code, mapped[1]) : unexpectedError();
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  const params = z.object({ sessionId: z.uuid() }).safeParse(await context.params);
  if (!params.success) return jsonError(400, "VALIDATION_FAILED", "Invalid session identifier.");
  const user = await resolveCurrentUser(request.headers);
  if (!user) return jsonError(401, "UNAUTHENTICATED", "Authentication is required.");
  if (user.role !== "ADMINISTRATOR") return jsonError(403, "FORBIDDEN", "Administrator access is required.");
  const body = await parseJsonBody(request, schema);
  if (!body.success) return jsonError(400, "VALIDATION_FAILED", "Invalid session update.", body.fields);
  const result = await updateClassSession(params.data.sessionId, {
    ...body.data,
    startsAt: body.data.startsAt === undefined ? undefined : new Date(body.data.startsAt),
    endsAt: body.data.endsAt === undefined ? undefined : new Date(body.data.endsAt),
  });
  if (result.code === "SESSION_UPDATED") return jsonData({ sessionId: result.session.id, programId: result.session.programId, trainerId: result.session.trainerId, startsAt: result.session.startsAt.toISOString(), endsAt: result.session.endsAt.toISOString(), capacity: result.session.capacity, bookingCutoffMinutes: result.session.bookingCutoffMinutes, confirmedCount: result.confirmedCount, waitingCount: result.waitingCount, promotedMemberIds: result.promotedMemberIds });
  return mapSessionUpdateResult(result);
}
