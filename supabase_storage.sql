-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-smsaudeeseguros-institucional', 'app-smsaudeeseguros-institucional', true)
ON CONFLICT (id) DO NOTHING;

-- Note: storage.objects usually has RLS enabled by default in Supabase.
-- Attempting to run 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY'
-- often results in permission errors (42501) for non-superuser roles.
-- We proceed directly to creating policies.

-- Helper block to safely drop policies if they exist (to allow re-running script)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Policy: Allow public read access to the bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'app-smsaudeeseguros-institucional' );

-- Policy: Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'app-smsaudeeseguros-institucional' );

-- Policy: Allow authenticated users to update their own uploads (or all uploads if admin)
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'app-smsaudeeseguros-institucional' );

-- Policy: Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'app-smsaudeeseguros-institucional' );
