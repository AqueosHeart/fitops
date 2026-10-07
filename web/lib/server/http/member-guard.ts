import "server-only";

import type { CurrentUser } from "@/lib/server/auth/current-user";
import { jsonError } from "@/lib/server/http/response";

export function requireMemberProfile(user: CurrentUser | null) {
  if (!user) return { error: jsonError(401, "UNAUTHENTICATED", "Authentication is required.") };
  if (!user.memberProfile) return { error: jsonError(403, "FORBIDDEN", "A member profile is required.") };
  return { memberProfile: user.memberProfile };
}
