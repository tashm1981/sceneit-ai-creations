
insert into storage.buckets (id, name, public)
values ('scenes', 'scenes', true)
on conflict (id) do nothing;

create policy "scenes_public_read"
on storage.objects for select
using (bucket_id = 'scenes');

create policy "scenes_user_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'scenes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "scenes_user_update"
on storage.objects for update
to authenticated
using (bucket_id = 'scenes' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "scenes_user_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'scenes' and auth.uid()::text = (storage.foldername(name))[1]);
