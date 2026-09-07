-- Adds Google Sign-In and self-service vendor/rider capability to existing
-- databases (schema.sql already has these for fresh installs). Additive
-- only: no column is dropped or renamed, no row is deleted.

ALTER TABLE users ADD COLUMN google_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS rider_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  is_active INTEGER NOT NULL DEFAULT 1,
  vehicle_type TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Backfill: every account already registered with role='rider' gets an
-- active rider profile, so the new capability-based checks see them exactly
-- as before.
INSERT INTO rider_profiles (user_id, is_active)
SELECT id, 1 FROM users
WHERE role = 'rider' AND id NOT IN (SELECT user_id FROM rider_profiles);
