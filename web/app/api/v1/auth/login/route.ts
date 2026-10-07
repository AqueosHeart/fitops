import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { auth, authBaseUrl, authOrigin } from "@/lib/server/auth";
import { clearEmailLoginFailures, releaseSuccessfulIpReservation, reserveLoginAttempt } from "@/lib/server/auth/login-rate-limit";
import { parseReturnTo } from "@/lib/server/auth/return-to";
import { requireSameOrigin } from "@/lib/server/http/origin";
import { copySetCookies } from "@/lib/server/http/cookies";
import { parseJsonBody } from "@/lib/server/http/request";
import { jsonError } from "@/lib/server/http/response";

const loginSchema = z.object({
  email: z.string().trim().email().max(320),
  password: z.string().min(15).max(128),
  returnTo: z.string().optional(),
}).strict();

const genericFailure = () => jsonError(401, "INVALID_CREDENTIALS", "Invalid email or password.");

export async function POST(request: NextRequest) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;
  const body = await parseJsonBody(request, loginSchema);
  if (!body.success) return jsonError(400, "VALIDATION_FAILED", "Invalid login request.", body.fields);

  const returnTo = body.data.returnTo === undefined ? "/app" : parseReturnTo(body.data.returnTo);
  if (!returnTo) return jsonError(422, "INVALID_RETURN_TO", "The return path is not allowed.");
  const email = body.data.email.toLowerCase();

  if (!await reserveLoginAttempt(email, request.headers)) return genericFailure();

  const signIn = await auth.handler(
    new Request(new URL("/api/auth/sign-in/email", authBaseUrl), {
      method: "POST",
      headers: new Headers({ "content-type": "application/json", origin: authOrigin }),
      body: JSON.stringify({ email, password: body.data.password, rememberMe: true }),
    }),
  );

  if (!signIn.ok) {
    return genericFailure();
  }

  await clearEmailLoginFailures(email);
  await releaseSuccessfulIpReservation(request.headers);
  const response = NextResponse.json({ data: { destination: returnTo } });
  copySetCookies(signIn.headers, response.headers);
  return response;
}
