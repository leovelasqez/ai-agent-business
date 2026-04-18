-- Add output kind column to distinguish images from videos
ALTER TABLE generations
  ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'image'
    CHECK (kind IN ('image', 'video'));
