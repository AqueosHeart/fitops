import { NextRequest } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/server/auth";
import { requireSameOrigin } from "@/lib/server/http/origin";

const handlers = toNextJsHandler(auth);

function publiclyAllowed(request: NextRequest) {
  const endpoint = request.nextUrl.pathname.replace("/api/auth", "");
  return endpoint === "/get-session" || endpoint === "/sign-out";
}

export async function GET(request: NextRequest) {
  return publiclyAllowed(request) ? handlers.GET(request) : new Response(null, { status: 404 });
}

export async function POST(request: NextRequest) {
  if (!publiclyAllowed(request)) return new Response(null, { status: 404 });
  const originError = requireSameOrigin(request);
  return originError ?? handlers.POST(request);
}
