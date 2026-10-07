import "server-only";

import { jsonError } from "@/lib/server/http/response";
import { authOrigin } from "@/lib/server/auth";

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function requireSameOrigin(request: Request) {
  if (!unsafeMethods.has(request.method)) {
    return null;
  }

  const origin = request.headers.get("origin");
  if (!origin || origin !== authOrigin) {
    return jsonError(403, "ORIGIN_FORBIDDEN", "This request must originate from this application.");
  }

  return null;
}
