-- Credits system: tracks credit balance and transactions per session/user
CREATE TABLE IF NOT EXISTS credit_accounts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   TEXT        NOT NULL UNIQUE,
  balance      INT         NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS credit_accounts_session_idx ON credit_accounts (session_id);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id     TEXT        NOT NULL,
  amount         INT         NOT NULL,  -- positive = credit, negative = debit
  reason         TEXT        NOT NULL,  -- 'free_trial', 'purchase_single', 'purchase_bundle', 'generation'
  generation_id  UUID,
  stripe_session TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS credit_tx_session_idx ON credit_transactions (session_id);
CREATE INDEX IF NOT EXISTS credit_tx_created_idx ON credit_transactions (created_at DESC);

-- Trigger to keep updated_at in sync
CREATE OR REPLACE FUNCTION update_credit_accounts_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER credit_accounts_updated_at
  BEFORE UPDATE ON credit_accounts
  FOR EACH ROW EXECUTE FUNCTION update_credit_accounts_updated_at();
