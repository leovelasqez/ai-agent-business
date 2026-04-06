-- MockForge Storage buckets and policies
-- Apply with: supabase db push
-- Or paste into the Supabase dashboard SQL editor.
--
-- Both buckets are PUBLIC so:
--   • fal.ai can read source images by URL during generation
--   • Generated outputs are served directly as CDN URLs (no signed-URL overhead)
--
-- If you need private uploads in the future, change public=true to false
-- and switch to signed URLs in storage-provider.ts supabaseSaveUpload().

-- ---- Buckets ----

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values (
    'mockforge-inputs',
    'mockforge-inputs',
    true,
    10485760,  -- 10 MB
    array['image/jpeg', 'image/png', 'image/webp']
  )
  on conflict (id) do update
    set public             = excluded.public,
        file_size_limit    = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values (
    'mockforge-outputs',
    'mockforge-outputs',
    true,
    20971520,  -- 20 MB
    array['image/jpeg', 'image/png', 'image/webp']
  )
  on conflict (id) do update
    set public             = excluded.public,
        file_size_limit    = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;

-- ---- RLS policies ----
-- Allow anyone (anon / public) to read objects from both buckets.
-- Writes are restricted to the service role (bypasses RLS by design).

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename  = 'objects'
      and policyname = 'public read mockforge-inputs'
  ) then
    create policy "public read mockforge-inputs"
      on storage.objects
      for select
      using (bucket_id = 'mockforge-inputs');
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename  = 'objects'
      and policyname = 'public read mockforge-outputs'
  ) then
    create policy "public read mockforge-outputs"
      on storage.objects
      for select
      using (bucket_id = 'mockforge-outputs');
  end if;
end $$;
