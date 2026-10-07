import "server-only";

import argon2 from "argon2";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth/minimal";

import { prisma } from "@/lib/server/prisma";

const secret = process.env.BETTER_AUTH_SECRET;
const baseURL = process.env.BETTER_AUTH_URL;

if (!secret || secret.length < 32) {
  throw new Error("BETTER_AUTH_SECRET must contain at least 32 characters.");
}

if (!baseURL) {
  throw new Error("BETTER_AUTH_URL is required.");
}

export const authBaseUrl = new URL(baseURL);
export const authOrigin = authBaseUrl.origin;

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  secret,
  baseURL: authBaseUrl.toString(),
  trustedOrigins: [authOrigin],
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 15,
    maxPasswordLength: 128,
    password: {
      hash: (password) =>
        argon2.hash(password, {
          type: argon2.argon2id,
          memoryCost: 19 * 1024,
          timeCost: 2,
          parallelism: 1,
        }),
      verify: ({ hash, password }) => argon2.verify(hash, password),
    },
  },
  session: {
    modelName: "AuthSession",
    expiresIn: 60 * 60 * 8,
    updateAge: 60 * 60,
    disableSessionRefresh: true,
    additionalFields: {
      authVersion: {
        type: "number",
        required: true,
        input: false,
      },
    },
  },
  user: {
    modelName: "User",
  },
  account: {
    modelName: "AuthAccount",
  },
  verification: {
    modelName: "AuthVerification",
  },
  // FitOps owns credential limits in its application route so email and trusted-IP
  // counters share one atomic policy. The internal synthetic sign-in request must
  // not activate Better Auth's otherwise shared no-IP bucket.
  rateLimit: { enabled: false },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { authVersion: true },
          });

          if (!user) {
            throw new Error("Cannot create a session for a missing user.");
          }

          return { data: { ...session, authVersion: user.authVersion } };
        },
      },
    },
  },
  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },
});
