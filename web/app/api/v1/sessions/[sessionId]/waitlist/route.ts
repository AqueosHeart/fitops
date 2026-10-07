import { NextRequest } from "next/server";
import { z } from "zod";

import { resolveCurrentUser } from "@/lib/server/auth/current-user";
import { joinWaitlist, type JoinWaitlistResult } from "@/lib/server/booking/join-waitlist";
import { requireSameOrigin } from "@/lib/server/http/origin";
import { requireMemberProfile } from "@/lib/server/http/member-guard";
import { jsonData, jsonError } from "@/lib/server/http/response";

const paramsSchema = z.object({ sessionId: z.uuid() });

export async function POST(request: NextRequest, context: { params: Promise<{ sessionId: string }> }) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  const params = paramsSchema.safeParse(await context.params);
  if (!params.success) return jsonError(400, "VALIDATION_FAILED", "Invalid session identifier.");
  const membership = requireMemberProfile(await resolveCurrentUser(request.headers));
  if ("error" in membership) return membership.error;
  const result = await joinWaitlist(params.data.sessionId, membership.memberProfile.id);
  if (result.code === "WAITLIST_JOINED") return jsonData({ entryId: result.entryId, position: result.position.toString() }, 201);
  const cases: Record<Exclude<JoinWaitlistResult["code"], "WAITLIST_JOINED">, [number, string, string]> = {
    SESSION_NOT_FOUND: [404, "SESSION_NOT_FOUND", "The session was not found."], MEMBER_NOT_FOUND: [403, "FORBIDDEN", "A member profile is required."],
    MEMBERSHIP_INACTIVE: [403, "MEMBERSHIP_INACTIVE", "An active membership is required."], WAIVER_REQUIRED: [403, "WAIVER_REQUIRED", "A signed waiver is required."],
    SESSION_UNAVAILABLE: [409, "SESSION_UNAVAILABLE", "This session is unavailable."], BOOKING_CUTOFF_PASSED: [422, "BOOKING_CUTOFF_PASSED", "The booking cutoff has passed."],
    ALREADY_BOOKED: [409, "ALREADY_BOOKED", "You already have a booking for this session."], ALREADY_WAITING: [409, "ALREADY_WAITING", "You are already waiting for this session."],
    SEAT_AVAILABLE: [409, "SEAT_AVAILABLE", "A seat is available; book it instead."], PARTICIPATION_INVARIANT_BROKEN: [500, "PARTICIPATION_INVARIANT_BROKEN", "This participation state requires staff attention."],
  };
  const [status, code, message] = cases[result.code];
  return jsonError(status, code, message);
}
