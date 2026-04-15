-- Add user rating column to generations
-- rating: 1 = thumbs up, -1 = thumbs down, null = not rated

alter table generations
  add column if not exists rating integer check (rating in (-1, 1));
