-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- STORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS stories_user_id_idx ON stories(user_id);
CREATE INDEX IF NOT EXISTS stories_expires_at_idx ON stories(expires_at);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stories

-- Allow users to insert their own stories
DROP POLICY IF EXISTS "Users can create their own stories" ON stories;
CREATE POLICY "Users can create their own stories"
  ON stories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow everyone to view active stories
-- Note: We filter expired stories in the query, but RLS can also enforce it if needed.
-- For now, we allow viewing all, but the client/API will filter.
DROP POLICY IF EXISTS "Anyone can view stories" ON stories;
CREATE POLICY "Anyone can view stories"
  ON stories FOR SELECT
  USING (true);

-- Allow users to delete their own stories
DROP POLICY IF EXISTS "Users can delete their own stories" ON stories;
CREATE POLICY "Users can delete their own stories"
  ON stories FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- STORAGE BUCKET (stories)
-- =============================================
-- Note: You must create the 'stories' bucket in the Dashboard if it doesn't exist.
-- This SQL sets up the policies assuming the bucket exists.

-- Policy: Give users access to their own folder 
-- (This is a bit loose, usually we just allow authenticated uploads to a folder)

-- INSERT: Authenticated users can upload to 'stories' bucket
-- We'll use a policy that allows any authenticated user to upload
-- You might want to restrict path to `public/{user_id}/*` in production
-- but for simplicity/MVP:

-- NOTE: These are storage.objects policies. 
-- You usually set these in the Dashboard, but here is the SQL equivalent if you have permissions.

-- Allow public read access to stories bucket
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'stories' );

-- Allow authenticated users to upload images
DROP POLICY IF EXISTS "Authenticated users can upload stories" ON storage.objects;
CREATE POLICY "Authenticated users can upload stories"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'stories' 
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own images (optional, if we track owner in metadata)
-- For now, we might rely on the backend cleanup or manual deletion.
