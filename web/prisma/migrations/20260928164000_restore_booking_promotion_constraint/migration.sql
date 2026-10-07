-- Prisma cannot represent this existing multi-column promotion provenance relation.
-- Restore the stronger physical constraint after the generated auth migration.
ALTER TABLE "bookings"
  DROP CONSTRAINT "bookings_source_waitlist_entry_id_fkey";

CREATE INDEX "bookings_member_status_session_idx"
  ON "bookings"("member_id", "status", "session_id");

CREATE UNIQUE INDEX "waitlist_entries_id_member_session_key"
  ON "waitlist_entries"("id", "member_id", "session_id");

ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_source_waitlist_entry_member_session_fkey"
  FOREIGN KEY ("source_waitlist_entry_id", "member_id", "session_id")
  REFERENCES "waitlist_entries"("id", "member_id", "session_id")
  ON DELETE RESTRICT ON UPDATE NO ACTION;
