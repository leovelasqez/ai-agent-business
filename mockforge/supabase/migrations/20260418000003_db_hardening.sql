-- DB hardening: soft delete + GDPR retention + read replica hints

-- 1. Soft delete: add deleted_at column to generations
ALTER TABLE generations
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Index to efficiently exclude soft-deleted rows
CREATE INDEX IF NOT EXISTS generations_deleted_at_idx
  ON generations (deleted_at)
  WHERE deleted_at IS NULL;

-- 2. GDPR retention: view that only exposes non-deleted rows
CREATE OR REPLACE VIEW active_generations AS
  SELECT *
  FROM generations
  WHERE deleted_at IS NULL;

-- 3. Function: soft-delete a generation (GDPR right-to-erasure)
CREATE OR REPLACE FUNCTION soft_delete_generation(generation_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE generations
  SET deleted_at = now()
  WHERE id = generation_id;
END;
$$;

-- 4. Purge helper: hard-delete soft-deleted rows older than N days
--    Call this from a scheduled job, e.g. SELECT purge_old_generations(90);
CREATE OR REPLACE FUNCTION purge_old_generations(retention_days INT DEFAULT 90)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
  rows_deleted INT;
BEGIN
  DELETE FROM generations
  WHERE deleted_at IS NOT NULL
    AND deleted_at < now() - make_interval(days => retention_days);
  GET DIAGNOSTICS rows_deleted = ROW_COUNT;
  RETURN rows_deleted;
END;
$$;

-- 5. Add composite index for common read replica queries
CREATE INDEX IF NOT EXISTS generations_session_status_idx
  ON generations (session_id, status)
  WHERE deleted_at IS NULL;
