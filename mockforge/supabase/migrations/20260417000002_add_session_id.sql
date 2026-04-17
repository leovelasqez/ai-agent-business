-- Add anonymous session tracking to generations
alter table generations
  add column if not exists session_id text;

create index if not exists generations_session_id_idx
  on generations (session_id)
  where session_id is not null;
