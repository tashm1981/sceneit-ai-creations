
-- Remove client-side credit mutation policies (privilege escalation risk)
DROP POLICY IF EXISTS credits_insert_own ON public.user_credits;
DROP POLICY IF EXISTS credits_update_own ON public.user_credits;

-- Lock down SECURITY DEFINER function (only the auth trigger should call it)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- Restrict storage object listing on the public 'scenes' bucket to owners.
-- Public URLs still resolve because the bucket is public; this only prevents
-- enumerating other users' files via storage.objects SELECT.
DROP POLICY IF EXISTS scenes_public_read ON storage.objects;

CREATE POLICY scenes_owner_read ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'scenes' AND (auth.uid())::text = (storage.foldername(name))[1]);
