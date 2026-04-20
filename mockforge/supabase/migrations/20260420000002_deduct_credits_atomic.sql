CREATE OR REPLACE FUNCTION deduct_credits_atomic(
  p_session_id TEXT,
  p_amount INT,
  p_generation_id UUID DEFAULT NULL
)
RETURNS TABLE(ok BOOLEAN, balance INT)
LANGUAGE sql
AS $$
  WITH ensure_account AS (
    INSERT INTO credit_accounts (session_id, balance)
    VALUES (p_session_id, 0)
    ON CONFLICT (session_id) DO NOTHING
    RETURNING balance
  ),
  updated AS (
    UPDATE credit_accounts
    SET balance = credit_accounts.balance - p_amount
    WHERE credit_accounts.session_id = p_session_id
      AND credit_accounts.balance >= p_amount
    RETURNING credit_accounts.balance
  ),
  tx AS (
    INSERT INTO credit_transactions (session_id, amount, reason, generation_id)
    SELECT p_session_id, -p_amount, 'generation', p_generation_id
    FROM updated
    RETURNING amount
  )
  SELECT
    EXISTS (SELECT 1 FROM updated) AS ok,
    COALESCE(
      (SELECT balance FROM updated),
      (SELECT credit_accounts.balance FROM credit_accounts WHERE credit_accounts.session_id = p_session_id),
      0
    ) AS balance;
$$;
