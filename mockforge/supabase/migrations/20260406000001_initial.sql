-- MockForge initial schema
-- Run with: supabase db push
-- Or apply via Supabase dashboard SQL editor

-- -------------------------------------------------------
-- Table: generations
-- Records every AI image generation attempt.
-- preview_urls and source_image_url store public paths
-- (local /api/uploads/<file> today, Supabase Storage URLs later).
-- -------------------------------------------------------
create table if not exists generations (
  id               uuid        primary key default gen_random_uuid(),
  preset           text        not null,
  category         text,
  format           text,
  product_name     text,
  variant          text        not null,               -- 'a' | 'b' | 'c' | 'd'
  model            text        not null,
  prompt           text,
  source_image_url text,                               -- path/URL of the uploaded source
  preview_urls     text[]      not null default '{}',  -- generated output paths/URLs
  provider         text        not null default 'fal',
  status           text        not null default 'completed',
  created_at       timestamptz not null default now()
);

-- Index for recency queries
create index if not exists generations_created_at_idx
  on generations (created_at desc);

-- -------------------------------------------------------
-- Storage buckets (create these manually in the dashboard
-- or via `supabase storage create-bucket` until the SDK
-- bucket-creation path is stable).
--
-- Expected buckets:
--   uploads  — user-uploaded source images  (public: false recommended, use signed URLs)
--   outputs  — AI-generated output images   (public: true for easy CDN delivery)
-- -------------------------------------------------------
-- Placeholder: bucket names are declared as constants in
-- src/lib/storage-provider.ts → STORAGE_BUCKETS
