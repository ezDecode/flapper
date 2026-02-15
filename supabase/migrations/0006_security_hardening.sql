-- Security hardening:
-- 1) enforce invite-only signup in DB trigger
-- 2) prevent self-privilege escalation in users table
-- 3) remove beta code enumeration from client-side RLS
-- 4) scope dashboard stats function to caller
-- 5) make post media bucket private by default

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  provided_code TEXT;
BEGIN
  provided_code := NULLIF(BTRIM(COALESCE(NEW.raw_user_meta_data->>'beta_code', '')), '');

  IF provided_code IS NULL THEN
    RAISE EXCEPTION 'Invite code required';
  END IF;

  UPDATE public.beta_codes
  SET
    used_by = NEW.id,
    used_at = NOW()
  WHERE
    code = provided_code
    AND used_by IS NULL;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or already used invite code';
  END IF;

  INSERT INTO public.users (id, email, name, avatar_url, is_beta_user)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    TRUE
  ) ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    is_beta_user = TRUE,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

DROP POLICY IF EXISTS "users_own" ON public.users;
CREATE POLICY "users_select_own" ON public.users
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

REVOKE ALL ON TABLE public.users FROM anon;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.users FROM authenticated;
GRANT SELECT ON TABLE public.users TO authenticated;
GRANT UPDATE (name, avatar_url, onboarding_step, updated_at) ON TABLE public.users TO authenticated;

DROP POLICY IF EXISTS "beta_codes_read" ON public.beta_codes;
REVOKE ALL ON TABLE public.beta_codes FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_dashboard_stats(user_id_input UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public AS $$
DECLARE
  target_user_id UUID := COALESCE(user_id_input, auth.uid());
  output JSONB;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF target_user_id <> auth.uid() THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  WITH post_counts AS (
    SELECT
      COUNT(*) FILTER (WHERE status = 'SCHEDULED')::INT AS scheduled_count,
      COUNT(*) FILTER (WHERE status = 'PUBLISHED')::INT AS published_count,
      COUNT(*) FILTER (WHERE status = 'FAILED')::INT AS failed_count
    FROM public.posts
    WHERE user_id = target_user_id
  ),
  plug_counts AS (
    SELECT COUNT(*) FILTER (WHERE status = 'FIRED')::INT AS fired_count
    FROM public.auto_plugs ap
    JOIN public.posts p ON p.id = ap.post_id
    WHERE p.user_id = target_user_id
  ),
  recent_posts AS (
    SELECT COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', id,
          'content', content,
          'status', status,
          'created_at', created_at
        )
        ORDER BY created_at DESC
      ),
      '[]'::jsonb
    ) AS items
    FROM (
      SELECT id, content, status, created_at
      FROM public.posts
      WHERE user_id = target_user_id
      ORDER BY created_at DESC
      LIMIT 10
    ) t
  )
  SELECT jsonb_build_object(
    'scheduled_count', post_counts.scheduled_count,
    'published_count', post_counts.published_count,
    'failed_count', post_counts.failed_count,
    'fired_count', plug_counts.fired_count,
    'recent_posts', recent_posts.items
  )
  INTO output
  FROM post_counts, plug_counts, recent_posts;

  RETURN output;
END;
$$;

REVOKE ALL ON FUNCTION public.get_dashboard_stats(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats(UUID) TO authenticated;

UPDATE storage.buckets
SET public = FALSE
WHERE id = 'post-media';

DROP POLICY IF EXISTS "post_media_read" ON storage.objects;
CREATE POLICY "post_media_read_own" ON storage.objects
FOR SELECT
USING (
  bucket_id = 'post-media'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::TEXT
);
