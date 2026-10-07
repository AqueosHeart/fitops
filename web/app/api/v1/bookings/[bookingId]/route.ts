import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { resolveCurrentUser } from "@/lib/server/auth/current-user";
import { cancelBooking } from "@/lib/server/booking/cancel-booking";
import { requireSameOrigin } from "@/lib/server/http/origin";
import { requireMemberProfile } from "@/lib/server/http/member-guard";
import { jsonError } from "@/lib/server/http/response";
import { prisma } from "@/lib/server/prisma";

export async function DELETE(request: NextRequest, context: { params: Promise<{ bookingId: string }> }) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  const params = z.object({ bookingId: z.uuid() }).safeParse(await context.params);
  if (!params.success) return jsonError(400, "VALIDATION_FAILED", "Invalid booking identifier.");
  const membership = requireMemberProfile(await resolveCurrentUser(request.headers));
  if ("error" in membership) return membership.error;
  const booking = await prisma.booking.findUnique({ where: { id: params.data.bookingId }, select: { memberId: true, sessionId: true } });
  if (!booking) return jsonError(404, "BOOKING_NOT_FOUND", "The booking was not found.");
  if (booking.memberId !== membership.memberProfile.id) return jsonError(403, "FORBIDDEN", "You do not own this booking.");
  const result = await cancelBooking(booking.sessionId, membership.memberProfile.id, params.data.bookingId);
  if (result.code === "CANCELLED") return new NextResponse(null, { status: 204 });
  if (result.code === "BOOKING_CUTOFF_PASSED") return jsonError(422, result.code, "The booking cutoff has passed.");
  if (result.code === "SESSION_UNAVAILABLE") return jsonError(409, result.code, "This session is unavailable.");
  return jsonError(404, "BOOKING_NOT_FOUND", "The booking was not found.");
}
