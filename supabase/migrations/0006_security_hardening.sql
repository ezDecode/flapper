-- 1. Invite-Only Signup Bypass
-- Create a trigger aimed at auth.users to validate beta code presence in metadata
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

    -- If no code provided, raise error
    IF beta_code_input IS NULL THEN
        RAISE EXCEPTION 'Beta code required for signup.';
    END IF;

    -- Check if code exists and is unused
    SELECT * INTO code_record FROM public.beta_codes WHERE code = beta_code_input AND used_by IS NULL;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid or used beta code.';
    END IF;

    -- If valid, mark as used (will be committed if auth user creation succeeds)
    UPDATE public.beta_codes
    SET used_by = NEW.id, used_at = NOW()
    WHERE code = beta_code_input;

    RETURN NEW;
END;
$$;

-- Drop trigger if exists to allow idempotency
DROP TRIGGER IF EXISTS check_beta_code_on_signup ON auth.users;

CREATE TRIGGER check_beta_code_on_signup
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.validate_beta_code();

-- Create RPC for client-side validation (UX only, not security boundary)
CREATE OR REPLACE FUNCTION public.check_invite_code(code_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM 1 FROM public.beta_codes WHERE code = code_input AND used_by IS NULL;
  RETURN FOUND;
END;
$$;

-- Secure beta_codes table (Revoke public access)
REVOKE ALL ON public.beta_codes FROM anon, authenticated;


-- 2. Privilege Escalation on public.users
-- Revoke existing broad update policy
DROP POLICY IF EXISTS "users_own" ON public.users;

-- Create restrictive update policy
CREATE POLICY "users_update_own" ON public.users
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Revoke generic UPDATE privilege and grant only specific columns
REVOKE UPDATE ON public.users FROM authenticated;
GRANT UPDATE (name, avatar_url, updated_at) ON public.users TO authenticated;
-- Re-grant SELECT to authenticated
CREATE POLICY "users_select_own" ON public.users
FOR SELECT
USING (auth.uid() = id);

-- 3. IDOR in get_dashboard_stats
-- Drop the insecure function
DROP FUNCTION IF EXISTS public.get_dashboard_stats(UUID);

-- Create secure version
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS JSONB
LANGUAGE sql
SECURITY DEFINER
SET search_path = public AS $$
  WITH post_counts AS (
    SELECT
      COUNT(*) FILTER (WHERE status = 'SCHEDULED')::INT AS scheduled_count,
      COUNT(*) FILTER (WHERE status = 'PUBLISHED')::INT AS published_count,
      COUNT(*) FILTER (WHERE status = 'FAILED')::INT AS failed_count
    FROM public.posts
    WHERE user_id = auth.uid()
  ),
  plug_counts AS (
    SELECT COUNT(*) FILTER (WHERE status = 'FIRED')::INT AS fired_count
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
    'failed_count', post_counts.failed_count,
    'fired_count', plug_counts.fired_count,
    'recent_posts', recent_posts.items
  )
  FROM post_counts, plug_counts, recent_posts;
$$;

GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO authenticated;
