-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_source_waitlist_entry_member_session_fkey";

-- DropIndex
DROP INDEX "bookings_member_status_session_idx";

-- DropIndex
DROP INDEX "waitlist_entries_id_member_session_key";

-- AlterTable
ALTER TABLE "auth_sessions" ALTER COLUMN "auth_version" DROP DEFAULT;

-- CreateTable
CREATE TABLE "auth_login_attempts" (
    "id" UUID NOT NULL,
    "key" CHAR(64) NOT NULL,
    "failure_count" INTEGER NOT NULL DEFAULT 0,
    "window_started_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_login_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_login_attempts_key_key" ON "auth_login_attempts"("key");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_source_waitlist_entry_id_fkey" FOREIGN KEY ("source_waitlist_entry_id") REFERENCES "waitlist_entries"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
