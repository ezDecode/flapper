ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.beta_codes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.platform_connections ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.post_targets ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.auto_plugs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.api_rate_tracking ENABLE ROW LEVEL SECURITY;

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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "users_own" ON public.users
FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "beta_codes_read" ON public.beta_codes
FOR SELECT
USING (TRUE);

CREATE POLICY "platform_connections_own" ON public.platform_connections
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "posts_own" ON public.posts
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "post_targets_own" ON public.post_targets
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.posts
    WHERE
      id = post_id
      AND user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.posts
    WHERE
      id = post_id
      AND user_id = auth.uid()
  )
);

CREATE POLICY "auto_plugs_own" ON public.auto_plugs
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.posts
    WHERE
      id = post_id
      AND user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.posts
    WHERE
      id = post_id
      AND user_id = auth.uid()
  )
);

CREATE POLICY "api_rate_tracking_own" ON public.api_rate_tracking
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
