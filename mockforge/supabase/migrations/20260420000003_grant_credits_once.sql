CREATE OR REPLACE FUNCTION grant_credits_once(
  p_session_id TEXT,
  p_amount INT,
  p_reason TEXT,
  p_stripe_session TEXT
)
RETURNS TABLE(applied BOOLEAN, balance INT)
LANGUAGE sql
AS $$
  WITH ensure_account AS (
    INSERT INTO credit_accounts (session_id, balance)
    VALUES (p_session_id, 0)
    ON CONFLICT (session_id) DO NOTHING
    RETURNING balance
  ),
  existing AS (
    SELECT 1 AS present
    FROM credit_transactions
    WHERE stripe_session = p_stripe_session
    LIMIT 1
  ),
  updated AS (
    UPDATE credit_accounts
    SET balance = credit_accounts.balance + p_amount
    WHERE credit_accounts.session_id = p_session_id
      AND NOT EXISTS (SELECT 1 FROM existing)
    RETURNING credit_accounts.balance
  ),
  inserted_tx AS (
    INSERT INTO credit_transactions (session_id, amount, reason, stripe_session)
    SELECT p_session_id, p_amount, p_reason, p_stripe_session
    FROM updated
    ON CONFLICT (stripe_session) DO NOTHING
    RETURNING amount
  )
  SELECT
    EXISTS (SELECT 1 FROM inserted_tx) AS applied,
    COALESCE(
      (SELECT balance FROM updated),
      (SELECT credit_accounts.balance FROM credit_accounts WHERE credit_accounts.session_id = p_session_id),
      0
    ) AS balance;
$$;
