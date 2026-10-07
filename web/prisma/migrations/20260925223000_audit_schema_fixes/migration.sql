ALTER TABLE "trainer_profiles"
  ALTER COLUMN "specialties" SET NOT NULL;

CREATE INDEX "bookings_member_status_session_idx"
  ON "bookings"("member_id", "status", "session_id");
