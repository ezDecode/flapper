-- ============================================================
-- 0003_storage.sql  –  Post-media storage bucket + policies
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('post-media', 'post-media', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can read (public bucket)
CREATE POLICY "post_media_read" ON storage.objects
FOR SELECT
USING (bucket_id = 'post-media');

-- Authenticated users can upload into their own folder
CREATE POLICY "post_media_insert_own" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'post-media'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::TEXT
);

-- Authenticated users can update their own files
CREATE POLICY "post_media_update_own" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'post-media'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::TEXT
)
WITH CHECK (
  bucket_id = 'post-media'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::TEXT
);

-- Authenticated users can delete their own files
CREATE POLICY "post_media_delete_own" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'post-media'
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::TEXT
);
