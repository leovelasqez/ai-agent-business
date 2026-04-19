-- Per-region latency statistics for multi-region routing decisions.
-- Aggregated samples are written periodically from region.ts to allow
-- multiple server instances to share latency observations.

create table if not exists region_latency_stats (
  region        text        primary key,  -- 'us-east' | 'eu-west' | 'ap-southeast' | 'global'
  sample_count  integer     not null default 0,
  p50_ms        integer     not null default 0,
  p95_ms        integer     not null default 0,
  updated_at    timestamptz not null default now()
);

insert into region_latency_stats (region) values
  ('us-east'), ('eu-west'), ('ap-southeast'), ('global')
on conflict (region) do nothing;
