-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('member', 'trainer', 'administrator');

-- CreateEnum
CREATE TYPE "member_status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "membership_plan_code" AS ENUM ('base', 'complete', 'training_plus');

-- CreateEnum
CREATE TYPE "session_status" AS ENUM ('scheduled', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "booking_status" AS ENUM ('confirmed', 'cancelled');

-- CreateEnum
CREATE TYPE "waitlist_status" AS ENUM ('waiting', 'promoted', 'cancelled', 'expired');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "role" "user_role" NOT NULL,
    "password_hash" TEXT NOT NULL,
    "auth_version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "status" "member_status" NOT NULL,
    "selected_plan_code" "membership_plan_code",
    "plan_selected_at" TIMESTAMPTZ(3),
    "terms_privacy_accepted_at" TIMESTAMPTZ(3),
    "waiver_signed_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "member_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainer_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "bio" TEXT NOT NULL,
    "specialties" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "trainer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT NOT NULL,
    "intensity" VARCHAR(30) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_sessions" (
    "id" UUID NOT NULL,
    "program_id" UUID NOT NULL,
    "trainer_id" UUID NOT NULL,
    "starts_at" TIMESTAMPTZ(3) NOT NULL,
    "ends_at" TIMESTAMPTZ(3) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "booking_cutoff_minutes" INTEGER NOT NULL,
    "status" "session_status" NOT NULL DEFAULT 'scheduled',
    "next_position_key" BIGINT NOT NULL DEFAULT 1,

    CONSTRAINT "class_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "status" "booking_status" NOT NULL DEFAULT 'confirmed',
    "booked_at" TIMESTAMPTZ(3) NOT NULL,
    "cancelled_at" TIMESTAMPTZ(3),
    "source_waitlist_entry_id" UUID,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waitlist_entries" (
    "id" UUID NOT NULL,
    "member_id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "status" "waitlist_status" NOT NULL DEFAULT 'waiting',
    "position_key" BIGINT NOT NULL,
    "joined_at" TIMESTAMPTZ(3) NOT NULL,
    "resolved_at" TIMESTAMPTZ(3),

    CONSTRAINT "waitlist_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "member_profiles_user_id_key" ON "member_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "trainer_profiles_user_id_key" ON "trainer_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "programs_slug_key" ON "programs"("slug");

-- CreateIndex
CREATE INDEX "class_sessions_start_status_idx" ON "class_sessions"("starts_at", "status");

-- CreateIndex
CREATE INDEX "class_sessions_program_start_idx" ON "class_sessions"("program_id", "starts_at");

-- CreateIndex
CREATE INDEX "class_sessions_trainer_start_idx" ON "class_sessions"("trainer_id", "starts_at");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_source_waitlist_entry_id_key" ON "bookings"("source_waitlist_entry_id");

-- CreateIndex
CREATE INDEX "bookings_session_status_idx" ON "bookings"("session_id", "status");

-- CreateIndex
CREATE INDEX "bookings_member_status_idx" ON "bookings"("member_id", "status");

-- CreateIndex
CREATE INDEX "bookings_member_session_idx" ON "bookings"("member_id", "session_id");

-- CreateIndex
CREATE INDEX "waitlist_session_order_idx" ON "waitlist_entries"("session_id", "status", "position_key");

-- CreateIndex
CREATE INDEX "waitlist_member_session_idx" ON "waitlist_entries"("member_id", "session_id");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_session_position_unique" ON "waitlist_entries"("session_id", "position_key");

-- Required before the composite promotion-provenance foreign key below.
CREATE UNIQUE INDEX "waitlist_entries_id_member_session_key"
  ON "waitlist_entries"("id", "member_id", "session_id");

-- AddForeignKey
ALTER TABLE "member_profiles" ADD CONSTRAINT "member_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trainer_profiles" ADD CONSTRAINT "trainer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_sessions" ADD CONSTRAINT "class_sessions_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_sessions" ADD CONSTRAINT "class_sessions_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "trainer_profiles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member_profiles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "class_sessions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_source_waitlist_entry_member_session_fkey" FOREIGN KEY ("source_waitlist_entry_id", "member_id", "session_id") REFERENCES "waitlist_entries"("id", "member_id", "session_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "member_profiles"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "waitlist_entries" ADD CONSTRAINT "waitlist_entries_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "class_sessions"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- PostgreSQL properties not expressible in the Prisma schema.
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "users"
  ADD CONSTRAINT "users_email_normalized_check" CHECK ("email" = lower(btrim("email"))),
  ADD CONSTRAINT "users_auth_version_check" CHECK ("auth_version" >= 1);

ALTER TABLE "member_profiles"
  ADD CONSTRAINT "member_profiles_plan_pair_check"
    CHECK (("selected_plan_code" IS NULL) = ("plan_selected_at" IS NULL));

ALTER TABLE "programs"
  ADD CONSTRAINT "programs_duration_minutes_check" CHECK ("duration_minutes" > 0);

ALTER TABLE "class_sessions"
  ADD CONSTRAINT "class_sessions_interval_check" CHECK ("starts_at" < "ends_at"),
  ADD CONSTRAINT "class_sessions_capacity_check" CHECK ("capacity" > 0),
  ADD CONSTRAINT "class_sessions_cutoff_check" CHECK ("booking_cutoff_minutes" >= 0),
  ADD CONSTRAINT "class_sessions_next_position_key_check" CHECK ("next_position_key" >= 1),
  ADD CONSTRAINT "class_sessions_trainer_interval_exclusion"
    EXCLUDE USING gist ("trainer_id" WITH =, tstzrange("starts_at", "ends_at", '[)') WITH &&);

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_status_timestamp_check"
    CHECK (("status" = 'confirmed' AND "cancelled_at" IS NULL)
      OR ("status" = 'cancelled' AND "cancelled_at" IS NOT NULL AND "cancelled_at" >= "booked_at"));

ALTER TABLE "waitlist_entries"
  ADD CONSTRAINT "waitlist_entries_position_key_check" CHECK ("position_key" > 0),
  ADD CONSTRAINT "waitlist_entries_status_timestamp_check"
    CHECK (("status" = 'waiting' AND "resolved_at" IS NULL)
      OR ("status" IN ('promoted', 'cancelled', 'expired') AND "resolved_at" IS NOT NULL AND "resolved_at" >= "joined_at"));

CREATE UNIQUE INDEX "bookings_member_session_confirmed_unique"
  ON "bookings"("member_id", "session_id") WHERE "status" = 'confirmed';

CREATE UNIQUE INDEX "waitlist_entries_member_session_waiting_unique"
  ON "waitlist_entries"("member_id", "session_id") WHERE "status" = 'waiting';
