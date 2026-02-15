-- ============================================================
-- 0004_cron.sql  –  Scheduled jobs (publish, poll, refresh)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_cron  WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net   WITH SCHEMA extensions;

-- ── Idempotent unschedule before (re)scheduling ─────────────

SELECT cron.unschedule('flapr-publish')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'flapr-publish');

SELECT cron.unschedule('flapr-poll')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'flapr-poll');

SELECT cron.unschedule('flapr-refresh')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'flapr-refresh');

-- ── Publish scheduled / retryable posts — every minute ──────

SELECT
  cron.schedule(
    'flapr-publish',
    '* * * * *',
    $$ SELECT net.http_post(
      url     := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_project_url') || '/functions/v1/publish-post',
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_service_key')),
      body    := '{}'::jsonb) $$
  );

-- ── Poll engagement for auto-plugs — every 5 min ───────────

SELECT
  cron.schedule(
    'flapr-poll',
    '*/5 * * * *',
    $$ SELECT net.http_post(
      url     := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_project_url') || '/functions/v1/poll-engagement',
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_service_key')),
      body    := '{}'::jsonb) $$
  );

-- ── Refresh expiring OAuth tokens — daily at 02:00 UTC ──────

SELECT
  cron.schedule(
    'flapr-refresh',
    '0 2 * * *',
    $$ SELECT net.http_post(
      url     := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_project_url') || '/functions/v1/refresh-tokens',
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_service_key')),
      body    := '{}'::jsonb) $$
  );
