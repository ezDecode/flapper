CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT
  cron.schedule(
    'flapr-publish',
    '* * * * *',
    $$ SELECT net.http_post(
      url     := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_project_url') || '/functions/v1/publish-post',
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_service_key')),
      body    := '{}'::jsonb) $$
  );

SELECT
  cron.schedule(
    'flapr-poll',
    '*/5 * * * *',
    $$ SELECT net.http_post(
      url     := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_project_url') || '/functions/v1/poll-engagement',
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_service_key')),
      body    := '{}'::jsonb) $$
  );

SELECT
  cron.schedule(
    'flapr-refresh',
    '0 2 * * *',
    $$ SELECT net.http_post(
      url     := (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_project_url') || '/functions/v1/refresh-tokens',
      headers := jsonb_build_object('Content-Type','application/json','Authorization','Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name='flapr_service_key')),
      body    := '{}'::jsonb) $$
  );
