import { NextRequest } from "next/server";

import { resolveCurrentUser } from "@/lib/server/auth/current-user";
import { jsonData, jsonError } from "@/lib/server/http/response";

export async function GET(request: NextRequest) {
  const user = await resolveCurrentUser(request.headers);
  if (!user) return jsonError(401, "UNAUTHENTICATED", "Authentication is required.");
  if (!user.memberProfile) return jsonError(403, "FORBIDDEN", "A member profile is required.");

  return jsonData({
    status: user.memberProfile.status.toLowerCase(),
    selectedPlanCode: user.memberProfile.selectedPlanCode?.toLowerCase() ?? null,
    waiverSignedAt: user.memberProfile.waiverSignedAt?.toISOString() ?? null,
    permittedRoutes: user.memberProfile.status === "ACTIVE" ? ["/app", "/app/schedule", "/app/bookings", "/app/profile/security"] : [],
  });
}
