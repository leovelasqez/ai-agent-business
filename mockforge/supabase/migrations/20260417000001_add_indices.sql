-- Composite index to speed up filtered queries by preset and variant
create index if not exists generations_preset_variant_idx
  on generations (preset, variant);

-- Index to support rating-based queries (e.g. best results)
create index if not exists generations_rating_idx
  on generations (rating)
  where rating is not null;
