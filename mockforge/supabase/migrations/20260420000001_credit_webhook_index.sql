CREATE UNIQUE INDEX IF NOT EXISTS credit_tx_stripe_session_uidx
  ON credit_transactions (stripe_session)
  WHERE stripe_session IS NOT NULL;
