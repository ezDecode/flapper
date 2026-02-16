-- ============================================================
-- 20240216130005_cron_jobs.sql
-- Scheduled Cron Jobs
-- ============================================================

-- Cleanup old jobs if they exist to avoid duplicates
SELECT cron.unschedule('flapr-publish');
SELECT cron.unschedule('flapr-poll');
SELECT cron.unschedule('flapr-refresh');
SELECT cron.unschedule('flapr-cleanup');

-- 1. Publish Posts (Every Minute)
SELECT cron.schedule(
  'flapr-publish',
  '* * * * *',
  $$ SELECT net.http_post(
      url     := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_project_url') || '/functions/v1/publish-post',
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_service_key')),
      body    := '{}'::jsonb) $$
);

-- 2. Poll Engagement (Every 5 Minutes)
SELECT cron.schedule(
  'flapr-poll',
  '*/5 * * * *',
  $$ SELECT net.http_post(
      url     := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_project_url') || '/functions/v1/poll-engagement',
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_service_key')),
      body    := '{}'::jsonb) $$
);

-- 3. Refresh Tokens (Every 20 Minutes)
SELECT cron.schedule(
  'flapr-refresh',
  '*/20 * * * *',
  $$ SELECT net.http_post(
      url     := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_project_url') || '/functions/v1/refresh-tokens',
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_service_key')),
      body    := '{}'::jsonb) $$
);

-- 4. Cleanup Rate Limits (Daily at 3am UTC)
SELECT cron.schedule(
  'flapr-cleanup',
  '0 3 * * *',
  $$ DELETE FROM public.api_rate_tracking
     WHERE window_start < NOW() - INTERVAL '24 hours' $$
);
