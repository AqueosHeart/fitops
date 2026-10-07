import { NextRequest } from "next/server";
import { z } from "zod";

import { resolveCurrentUser } from "@/lib/server/auth/current-user";
import { requireSameOrigin } from "@/lib/server/http/origin";
import { parseJsonBody } from "@/lib/server/http/request";
import { jsonData, jsonError } from "@/lib/server/http/response";
import { prisma } from "@/lib/server/prisma";

const waiverSchema = z.object({ accepted: z.literal(true) }).strict();

export async function POST(request: NextRequest) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  const body = await parseJsonBody(request, waiverSchema);
  if (!body.success) return jsonError(400, "VALIDATION_FAILED", "Explicit waiver acceptance is required.", body.fields);

  const user = await resolveCurrentUser(request.headers);
  if (!user) return jsonError(401, "UNAUTHENTICATED", "Authentication is required.");
  if (!user.memberProfile) return jsonError(403, "FORBIDDEN", "A member profile is required.");

  const profile = user.memberProfile.waiverSignedAt
    ? user.memberProfile
    : await prisma.memberProfile.update({
        where: { id: user.memberProfile.id },
        data: { waiverSignedAt: new Date() },
      });

  return jsonData({ waiverSignedAt: profile.waiverSignedAt?.toISOString() ?? null });
}
