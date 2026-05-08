CREATE OR REPLACE FUNCTION public.deduct_user_credits(_user_id uuid, _cost integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  remaining integer;
BEGIN
  UPDATE public.user_credits
     SET credits = credits - _cost,
         updated_at = now()
   WHERE user_id = _user_id
     AND credits >= _cost
   RETURNING credits INTO remaining;
  RETURN remaining; -- NULL if insufficient
END;
$$;

REVOKE EXECUTE ON FUNCTION public.deduct_user_credits(uuid, integer) FROM PUBLIC, anon, authenticated;