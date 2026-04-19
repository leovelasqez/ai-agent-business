-- Persistent job queue for async generation requests.
-- Replaces the in-memory Map in src/lib/job-queue.ts so jobs survive restarts
-- and are visible across multiple server instances.

create table if not exists generation_jobs (
  id           uuid        primary key default gen_random_uuid(),
  status       text        not null default 'queued',  -- queued | processing | completed | failed
  input_json   jsonb       not null,
  result_json  jsonb,
  error        text,
  region       text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists generation_jobs_status_idx
  on generation_jobs (status);

create index if not exists generation_jobs_created_at_idx
  on generation_jobs (created_at desc);

-- Row-level security: service role only (no public access)
alter table generation_jobs enable row level security;
