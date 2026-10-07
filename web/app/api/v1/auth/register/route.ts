import argon2 from "argon2";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { auth, authBaseUrl, authOrigin } from "@/lib/server/auth";
import { parseReturnTo } from "@/lib/server/auth/return-to";
import { requireSameOrigin } from "@/lib/server/http/origin";
import { copySetCookies } from "@/lib/server/http/cookies";
import { parseJsonBody } from "@/lib/server/http/request";
import { jsonError } from "@/lib/server/http/response";
import { prisma } from "@/lib/server/prisma";

const registerSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(320),
    password: z.string().min(15).max(128),
    termsPrivacyAccepted: z.boolean(),
    waiverAccepted: z.boolean(),
    selectedPlanCode: z.string().max(30),
    returnTo: z.string().optional(),
  })
  .strict();

export async function POST(request: NextRequest) {
  const originError = requireSameOrigin(request);
  if (originError) return originError;

  const body = await parseJsonBody(request, registerSchema);
  if (!body.success) return jsonError(400, "VALIDATION_FAILED", "Invalid registration request.", body.fields);
  if (!body.data.termsPrivacyAccepted || !body.data.waiverAccepted) return jsonError(422, "CONSENT_REQUIRED", "Terms, privacy, and waiver consent are required.");
  if (!(["base", "complete", "training_plus"] as const).includes(body.data.selectedPlanCode as "base" | "complete" | "training_plus")) return jsonError(422, "INVALID_PLAN_CODE", "The selected fictional plan is invalid.");

  const returnTo = body.data.returnTo === undefined ? "/app" : parseReturnTo(body.data.returnTo);
  if (!returnTo) return jsonError(422, "INVALID_RETURN_TO", "The return path is not allowed.");

  const email = body.data.email.toLowerCase();
  const passwordHash = await argon2.hash(body.data.password, {
    type: argon2.argon2id,
    memoryCost: 19 * 1024,
    timeCost: 2,
    parallelism: 1,
  });

  let createdUserId: string;
  try {
    createdUserId = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, name: body.data.name, passwordHash, emailVerified: false },
      });
      await tx.authAccount.create({
        data: { userId: user.id, providerId: "credential", accountId: user.id, password: passwordHash },
      });
      await tx.memberProfile.create({
        data: {
          userId: user.id,
          status: "ACTIVE",
          selectedPlanCode: body.data.selectedPlanCode.toUpperCase() as "BASE" | "COMPLETE" | "TRAINING_PLUS",
          planSelectedAt: new Date(),
          termsPrivacyAcceptedAt: new Date(),
          waiverSignedAt: new Date(),
        },
      });
      return user.id;
    });
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return jsonError(409, "EMAIL_ALREADY_REGISTERED", "An account could not be created with these credentials.");
    }
    throw error;
  }

  const signInRequest = new Request(new URL("/api/auth/sign-in/email", authBaseUrl), {
    method: "POST",
    headers: new Headers({ "content-type": "application/json", origin: authOrigin }),
    body: JSON.stringify({ email, password: body.data.password, rememberMe: true }),
  });
  let signInResponse: Response;
  try {
    signInResponse = await auth.handler(signInRequest);
  } catch {
    await removeIncompleteRegistration(createdUserId);
    return jsonError(500, "INTERNAL_ERROR", "An account could not be created.");
  }
  if (!signInResponse.ok) {
    await removeIncompleteRegistration(createdUserId);
    return jsonError(500, "INTERNAL_ERROR", "An account could not be created.");
  }

  const response = NextResponse.json({ data: { destination: returnTo } }, { status: 201 });
  copySetCookies(signInResponse.headers, response.headers);
  return response;
}

async function removeIncompleteRegistration(userId: string) {
  await prisma.$transaction(async (tx) => {
    await tx.authSession.deleteMany({ where: { userId } });
    await tx.authAccount.deleteMany({ where: { userId } });
    await tx.memberProfile.deleteMany({ where: { userId } });
    await tx.user.delete({ where: { id: userId } });
  });
}
