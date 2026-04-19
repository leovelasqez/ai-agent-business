-- Public gallery opt-in flag on generations
ALTER TABLE generations ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS generations_public_idx ON generations (is_public, created_at DESC)
  WHERE is_public = TRUE;
