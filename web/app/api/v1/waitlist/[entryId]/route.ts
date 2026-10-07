import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { resolveCurrentUser } from "@/lib/server/auth/current-user";
import { requireSameOrigin } from "@/lib/server/http/origin";
import { requireMemberProfile } from "@/lib/server/http/member-guard";
import { jsonError } from "@/lib/server/http/response";
import { prisma } from "@/lib/server/prisma";
import { cancelWaitlistEntry } from "@/lib/server/booking/cancel-waitlist-entry";

export async function DELETE(request: NextRequest, context: { params: Promise<{ entryId: string }> }) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  const params = z.object({ entryId: z.uuid() }).safeParse(await context.params);
  if (!params.success) return jsonError(400, "VALIDATION_FAILED", "Invalid waitlist identifier.");
  const membership = requireMemberProfile(await resolveCurrentUser(request.headers));
  if ("error" in membership) return membership.error;
  const entry = await prisma.waitlistEntry.findUnique({ where: { id: params.data.entryId } });
  if (!entry) return jsonError(404, "WAITLIST_NOT_FOUND", "The waitlist entry was not found.");
  if (entry.memberId !== membership.memberProfile.id) return jsonError(403, "FORBIDDEN", "You do not own this waitlist entry.");
  const result = await cancelWaitlistEntry(entry.id, membership.memberProfile.id);
  if (result === "PROMOTED") return jsonError(409, "WAITLIST_ALREADY_PROMOTED", "This waitlist entry has already been promoted.");
  if (result === "NOT_CANCELLABLE") return jsonError(409, "WAITLIST_NOT_WAITING", "Only a waiting entry can be cancelled.");
  if (result === "NOT_FOUND") return jsonError(404, "WAITLIST_NOT_FOUND", "The waitlist entry was not found.");
  return new NextResponse(null, { status: 204 });
}
