CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE platform_type AS ENUM ('TWITTER', 'LINKEDIN', 'BLUESKY');
CREATE TYPE post_status AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHING', 'PUBLISHED', 'FAILED');
CREATE TYPE plug_status AS ENUM ('PENDING', 'FIRED', 'FAILED', 'SKIPPED');
CREATE TYPE trigger_type AS ENUM ('LIKES', 'COMMENTS', 'REPOSTS', 'TIME_AFTER_PUBLISH');
CREATE TYPE user_plan AS ENUM ('FREE', 'PRO', 'AGENCY');

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  plan user_plan NOT NULL DEFAULT 'FREE',
  onboarding_step INTEGER NOT NULL DEFAULT 0,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  is_beta_user BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.beta_codes (
  code TEXT PRIMARY KEY,
  used_by UUID REFERENCES public.users (id),
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.platform_connections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  platform_user_id TEXT NOT NULL,
  platform_handle TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, platform)
);

CREATE TABLE public.posts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_urls TEXT[] NOT NULL DEFAULT '{}',
  status post_status NOT NULL DEFAULT 'DRAFT',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  retry_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  fail_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.post_targets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  post_id TEXT NOT NULL REFERENCES public.posts (id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  platform_post_id TEXT,
  platform_post_url TEXT,
  bluesky_cid TEXT,
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  reposts_count INTEGER NOT NULL DEFAULT 0,
  last_polled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  fail_reason TEXT,
  UNIQUE (post_id, platform)
);

CREATE TABLE public.auto_plugs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  post_id TEXT NOT NULL REFERENCES public.posts (id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  plug_content TEXT NOT NULL,
  trigger_type trigger_type NOT NULL DEFAULT 'LIKES',
  trigger_value INTEGER NOT NULL,
  status plug_status NOT NULL DEFAULT 'PENDING',
  fired_at TIMESTAMPTZ,
  plug_post_id TEXT,
  fail_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (post_id, platform)
);

CREATE TABLE public.api_rate_tracking (
  user_id UUID NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  platform platform_type NOT NULL,
  window_start TIMESTAMPTZ NOT NULL,
  call_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, platform, window_start)
);

CREATE INDEX ON public.posts (user_id, status);
CREATE INDEX ON public.posts (scheduled_at)
WHERE
  status = 'SCHEDULED';

CREATE INDEX ON public.posts (next_retry_at)
WHERE
  status = 'FAILED'
  AND retry_count < 3;

CREATE INDEX ON public.post_targets (post_id);
CREATE INDEX ON public.auto_plugs (status)
WHERE
  status = 'PENDING';

CREATE INDEX ON public.platform_connections (user_id, is_active);
