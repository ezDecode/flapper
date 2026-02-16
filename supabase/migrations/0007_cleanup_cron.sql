-- ============================================================
-- 0007_cleanup_cron.sql - API Rate Tracking Cleanup
-- ============================================================

-- Delete rate tracking windows older than 24 hours (runs at 3am UTC daily)
SELECT cron.schedule('flapr-cleanup', '0 3 * * *',
  $$ DELETE FROM public.api_rate_tracking
     WHERE window_start < NOW() - INTERVAL '24 hours' $$);

-- Add an index to speed up the delete
CREATE INDEX IF NOT EXISTS idx_rate_window_cleanup
  ON public.api_rate_tracking (window_start);
