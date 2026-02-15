-- ============================================================
-- 0006_security_hardening.sql  –  Beta-code signup validation
-- ============================================================

-- ── Enforce beta code on every signup via auth.users trigger ─

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

    -- Mark code as used (committed only if auth user creation succeeds)
    UPDATE public.beta_codes
    SET used_by = NEW.id, used_at = NOW()
    WHERE code = beta_code_input;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS check_beta_code_on_signup ON auth.users;

CREATE TRIGGER check_beta_code_on_signup
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.validate_beta_code();

-- ── Client-side validation RPC (UX hint only, not a security boundary) ──

CREATE OR REPLACE FUNCTION public.check_invite_code(code_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER AS $$
BEGIN
  PERFORM 1 FROM public.beta_codes WHERE code = code_input AND used_by IS NULL;
  RETURN FOUND;
END;
$$;

-- ── Lock down beta_codes table ──────────────────────────────
-- Only the SECURITY DEFINER functions above need access.

REVOKE ALL ON public.beta_codes FROM anon, authenticated;
