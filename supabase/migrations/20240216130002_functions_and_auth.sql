-- ============================================================
-- 20240216130002_functions_and_auth.sql
-- Functions & Auth Triggers
-- ============================================================

-- 1. Helper RPC for client-side beta code check
CREATE OR REPLACE FUNCTION public.check_invite_code(code_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
  PERFORM 1 FROM public.beta_codes WHERE code = code_input AND used_by IS NULL;
  RETURN FOUND;
END;
$$;

-- 2. Trigger Function to Validate Beta Code on Signup
CREATE OR REPLACE FUNCTION public.validate_beta_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
DECLARE
    beta_code_input TEXT;
    code_record RECORD;
BEGIN
    -- Extract beta code from user metadata
    beta_code_input := NEW.raw_user_meta_data->>'beta_code';

    -- If no code provided, reject signup
    IF beta_code_input IS NULL THEN
        RAISE EXCEPTION 'Beta code required for signup.';
    END IF;

    -- Check if code exists and is unused
    SELECT * INTO code_record
    FROM public.beta_codes
    WHERE code = beta_code_input AND used_by IS NULL;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid or used beta code.';
    END IF;

    -- Mark code as used
    UPDATE public.beta_codes
    SET used_by = NEW.id, used_at = NOW()
    WHERE code = beta_code_input;

    RETURN NEW;
END;
$$;

-- 3. Trigger Function to Create Public User Record
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Attach Triggers to auth.users
DROP TRIGGER IF EXISTS check_beta_code_on_signup ON auth.users;
CREATE TRIGGER check_beta_code_on_signup
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.validate_beta_code();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Dashboard Stats RPC ──────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
SET search_path = public AS $$
  WITH post_counts AS (
    SELECT
      COUNT(*) FILTER (WHERE status = 'SCHEDULED')::INT AS scheduled_count,
      COUNT(*) FILTER (WHERE status = 'PUBLISHED')::INT AS published_count,
      COUNT(*) FILTER (WHERE status = 'FAILED')::INT    AS failed_count
    FROM public.posts
    WHERE user_id = auth.uid()
  ),
  plug_counts AS (
    SELECT COUNT(*) FILTER (WHERE ap.status = 'FIRED')::INT AS fired_count
    FROM public.auto_plugs ap
    JOIN public.posts p ON p.id = ap.post_id
    WHERE p.user_id = auth.uid()
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
      WHERE user_id = auth.uid()
      ORDER BY created_at DESC
      LIMIT 10
    ) t
  )
  SELECT jsonb_build_object(
    'scheduled_count', post_counts.scheduled_count,
    'published_count', post_counts.published_count,
    'failed_count',    post_counts.failed_count,
    'fired_count',     plug_counts.fired_count,
    'recent_posts',    recent_posts.items
  )
  FROM post_counts, plug_counts, recent_posts;
$$;

REVOKE EXECUTE ON FUNCTION public.get_dashboard_stats() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_dashboard_stats() TO authenticated;
