-- API keys table for public /api/v1 access
CREATE TABLE IF NOT EXISTS api_keys (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT        NOT NULL,
  key_hash     TEXT        NOT NULL UNIQUE,  -- SHA-256 of the plaintext key
  label        TEXT,
  daily_limit  INT         NOT NULL DEFAULT 50,
  used_today   INT         NOT NULL DEFAULT 0,
  active       BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS api_keys_user_id_idx ON api_keys (user_id);
CREATE INDEX IF NOT EXISTS api_keys_key_hash_idx ON api_keys (key_hash);

-- Function to increment daily usage atomically
CREATE OR REPLACE FUNCTION increment_api_key_usage(key_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE api_keys
  SET used_today   = used_today + 1,
      last_used_at = now()
  WHERE id = key_id;
END;
$$;
