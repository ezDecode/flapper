-- ============================================================
-- 20240216130001_core_schema.sql
-- Core Schema: Extensions, Enums, Tables, Triggers
-- ============================================================

-- ── Extensions ────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_cron  WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net   WITH SCHEMA extensions;

-- ── Enums ────────────────────────────────────────────────────
CREATE TYPE platform_type  AS ENUM ('TWITTER');
CREATE TYPE post_status    AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED');
CREATE TYPE plug_status    AS ENUM ('PENDING', 'FIRED', 'FAILED', 'SKIPPED');
CREATE TYPE trigger_type   AS ENUM ('LIKES', 'COMMENTS', 'REPOSTS', 'TIME_AFTER_PUBLISH');
CREATE TYPE user_plan      AS ENUM ('FREE', 'PRO', 'AGENCY');

-- ── Utility Functions ────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ── Tables ───────────────────────────────────────────────────

-- 1. Users
CREATE TABLE public.users (
  id                    UUID        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email                 TEXT        NOT NULL,
  name                  TEXT,
  avatar_url            TEXT,
  plan                  user_plan   NOT NULL DEFAULT 'FREE',
  onboarding_step       INTEGER     NOT NULL DEFAULT 0,
  dodo_customer_id      TEXT        UNIQUE,
  dodo_subscription_id  TEXT        UNIQUE,
  is_beta_user          BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Beta Codes
CREATE TABLE public.beta_codes (
  code       TEXT        PRIMARY KEY,
  used_by    UUID        REFERENCES public.users (id),
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Platform Connections
CREATE TABLE public.platform_connections (
  id                TEXT          PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id           UUID          NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  platform          platform_type NOT NULL,
  platform_user_id  TEXT          NOT NULL,
  platform_handle   TEXT          NOT NULL,
  access_token      TEXT          NOT NULL,
  refresh_token     TEXT,
  token_expires_at  TIMESTAMPTZ,
  scopes            TEXT[]        NOT NULL DEFAULT '{}',
  is_active         BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, platform)
);

-- 4. Posts
CREATE TABLE public.posts (
  id            TEXT        PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id       UUID        NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  content       TEXT        NOT NULL,
  media_urls    TEXT[]      NOT NULL DEFAULT '{}',
  status        post_status NOT NULL DEFAULT 'DRAFT',
  scheduled_at  TIMESTAMPTZ,
  published_at  TIMESTAMPTZ,
  retry_count   INTEGER     NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  fail_reason   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Post Targets
CREATE TABLE public.post_targets (
  id                TEXT          PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  post_id           TEXT          NOT NULL REFERENCES public.posts (id) ON DELETE CASCADE,
  platform          platform_type NOT NULL,
  platform_post_id  TEXT,
  platform_post_url TEXT,
  likes_count       INTEGER       NOT NULL DEFAULT 0,
  comments_count    INTEGER       NOT NULL DEFAULT 0,
  reposts_count     INTEGER       NOT NULL DEFAULT 0,
  last_polled_at    TIMESTAMPTZ,
  published_at      TIMESTAMPTZ,
  fail_reason       TEXT,
  UNIQUE (post_id, platform)
);

-- 6. Auto Plugs
CREATE TABLE public.auto_plugs (
  id            TEXT          PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  post_id       TEXT          NOT NULL REFERENCES public.posts (id) ON DELETE CASCADE,
  platform      platform_type NOT NULL,
  plug_content  TEXT          NOT NULL,
  trigger_type  trigger_type  NOT NULL DEFAULT 'LIKES',
  trigger_value INTEGER       NOT NULL,
  status        plug_status   NOT NULL DEFAULT 'PENDING',
  fired_at      TIMESTAMPTZ,
  plug_post_id  TEXT,
  fail_reason   TEXT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, platform)
);

-- 7. API Rate Tracking
CREATE TABLE public.api_rate_tracking (
  user_id      UUID          NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  platform     platform_type NOT NULL,
  window_start TIMESTAMPTZ   NOT NULL,
  call_count   INTEGER       NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, platform, window_start)
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_posts_user_status      ON public.posts (user_id, status);
CREATE INDEX idx_posts_scheduled        ON public.posts (scheduled_at) WHERE status = 'SCHEDULED';
CREATE INDEX idx_posts_retry            ON public.posts (next_retry_at) WHERE status = 'FAILED' AND retry_count < 3;
CREATE INDEX idx_post_targets_post      ON public.post_targets (post_id);
CREATE INDEX idx_auto_plugs_pending     ON public.auto_plugs (status) WHERE status = 'PENDING';
CREATE INDEX idx_platform_conn_active   ON public.platform_connections (user_id, is_active);
CREATE INDEX idx_rate_window_cleanup    ON public.api_rate_tracking (window_start);

-- ── Triggers ─────────────────────────────────────────────────
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_platform_connections_updated_at BEFORE UPDATE ON public.platform_connections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
