import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { auth, authBaseUrl, authOrigin } from "@/lib/server/auth";
import { clearEmailLoginFailures, releaseSuccessfulIpReservation, reserveLoginAttempt } from "@/lib/server/auth/login-rate-limit";
import { parseAdminReturnTo, parseReturnTo } from "@/lib/server/auth/return-to";
import { requireSameOrigin } from "@/lib/server/http/origin";
import { copySetCookies } from "@/lib/server/http/cookies";
import { parseJsonBody } from "@/lib/server/http/request";
import { jsonError } from "@/lib/server/http/response";
import { prisma } from "@/lib/server/prisma";

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

  const requestedReturnTo = body.data.returnTo === undefined ? "/app" : body.data.returnTo;
  const memberReturnTo = parseReturnTo(requestedReturnTo);
  const adminReturnTo = memberReturnTo ? null : parseAdminReturnTo(requestedReturnTo);
  const returnTo = memberReturnTo ?? adminReturnTo;
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

  const user = await prisma.user.findUnique({ where: { email }, select: { role: true } });
  const destination = adminReturnTo && user?.role !== "ADMINISTRATOR" ? "/app" : returnTo;
  await clearEmailLoginFailures(email);
  await releaseSuccessfulIpReservation(request.headers);
  const response = NextResponse.json({ data: { destination } });
  copySetCookies(signIn.headers, response.headers);
  return response;
}
