import { spawnSync } from "node:child_process";
import { log } from "node:console";
import pg from "pg";
import process from "node:process";
import { URL } from "node:url";

const productionOrigin = "https://fitops-sebastian11.vercel.app";
const expectedEmails = [
  "admin@example.test",
  "alex.rivera@example.test",
  "jordan.lee@example.test",
  "casey.morgan@example.test",
  "taylor.chen@example.test",
  "maya.coach@example.test",
].sort();
const expectedSessionIds = [301, 302, 303].map((id) => `00000000-0000-4000-8000-${String(id).padStart(12, "0")}`);

if (process.env.FITOPS_RESET_PRODUCTION_DEMO !== "YES") {
  throw new Error("Set FITOPS_RESET_PRODUCTION_DEMO=YES only when intentionally resetting the fictional Production demo.");
}
if (process.env.BETTER_AUTH_URL !== productionOrigin || process.env.TRUST_PROXY !== "true") {
  throw new Error("Production origin and TRUST_PROXY=true must come from the linked Vercel Production environment.");
}
if (!process.env.DATABASE_URL_UNPOOLED || !process.env.FITOPS_DEMO_PASSWORD || process.env.FITOPS_DEMO_PASSWORD.length < 15) {
  throw new Error("The Vercel unpooled database URL and a private fictional demo password are required.");
}
const databaseHost = new URL(process.env.DATABASE_URL_UNPOOLED).hostname;
if (!databaseHost.endsWith(".neon.tech")) throw new Error("Refusing reset: the database URL is not a Neon host.");

const client = new pg.Client({ connectionString: process.env.DATABASE_URL_UNPOOLED });
await client.connect();
try {
  const users = (await client.query('SELECT "email" FROM "users" ORDER BY "email"')).rows.map((row) => row.email);
  const sessions = (await client.query('SELECT "id" FROM "class_sessions" ORDER BY "id"')).rows.map((row) => row.id);
  if (users.length !== expectedEmails.length || users.some((email, index) => email !== expectedEmails[index])) {
    throw new Error("Refusing reset: Production does not contain exactly the six fictional seeded accounts.");
  }
  if (sessions.length !== expectedSessionIds.length || sessions.some((id, index) => id !== expectedSessionIds[index])) {
    throw new Error("Refusing reset: Production does not contain exactly the three deterministic demo sessions.");
  }
} finally {
  await client.end();
}

const env = { ...process.env, DATABASE_URL: process.env.DATABASE_URL_UNPOOLED };
const seed = spawnSync(process.execPath, ["node_modules/tsx/dist/cli.mjs", "prisma/seed.ts"], { stdio: "inherit", env });
if (seed.error) throw seed.error;
if (seed.status !== 0) process.exit(seed.status ?? 1);

const verify = spawnSync(process.execPath, ["--conditions=react-server", "--import", "tsx", "scripts/verify-database.ts"], { stdio: "inherit", env });
if (verify.error) throw verify.error;
if (verify.status !== 0) process.exit(verify.status ?? 1);

log("Production fictional demo reset and database verification completed.");
