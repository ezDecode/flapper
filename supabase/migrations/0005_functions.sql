CREATE OR REPLACE FUNCTION public.get_dashboard_stats(user_id_input UUID)
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
    WHERE user_id = user_id_input
  ),
  plug_counts AS (
    SELECT COUNT(*) FILTER (WHERE status = 'FIRED')::INT AS fired_count
    FROM public.auto_plugs ap
    JOIN public.posts p ON p.id = ap.post_id
    WHERE p.user_id = user_id_input
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
      WHERE user_id = user_id_input
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

GRANT EXECUTE ON FUNCTION public.get_dashboard_stats(UUID) TO authenticated;
