-- ============================================================
-- 20240216130003_rls_policies.sql
-- Row Level Security (RLS) Policies
-- ============================================================

-- Enable RLS
ALTER TABLE public.users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_codes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_targets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_plugs          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_rate_tracking   ENABLE ROW LEVEL SECURITY;

-- Users
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Restrict updates on users table
REVOKE UPDATE ON public.users FROM authenticated;
GRANT UPDATE (name, avatar_url, updated_at) ON public.users TO authenticated;

-- Beta Codes (public read for validation)
CREATE POLICY "beta_codes_read" ON public.beta_codes
  FOR SELECT USING (TRUE);
-- Lockdown beta_codes modifications
REVOKE INSERT, UPDATE, DELETE ON public.beta_codes FROM anon, authenticated;

-- Platform Connections
CREATE POLICY "platform_connections_own" ON public.platform_connections
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Posts
CREATE POLICY "posts_own" ON public.posts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Post Targets (Inherit from Post)
CREATE POLICY "post_targets_own" ON public.post_targets
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND user_id = auth.uid())
  );

-- Auto Plugs (Inherit from Post)
CREATE POLICY "auto_plugs_own" ON public.auto_plugs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND user_id = auth.uid())
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND user_id = auth.uid())
  );

-- API Rate Tracking
CREATE POLICY "api_rate_tracking_own" ON public.api_rate_tracking
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
