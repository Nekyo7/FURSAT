-- ============================================================
-- FIX STORIES & STORAGE POLICIES
-- Run this script in your Supabase SQL Editor to fix upload errors
-- ============================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Ensure Stories Table Exists
CREATE TABLE IF NOT EXISTS stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- 3. Reset Stories Table Policies
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create their own stories" ON stories;
CREATE POLICY "Users can create their own stories" ON stories FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can view stories" ON stories;
CREATE POLICY "Anyone can view stories" ON stories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can delete their own stories" ON stories;
CREATE POLICY "Users can delete their own stories" ON stories FOR DELETE USING (auth.uid() = user_id);

-- 4. Fix Storage Policies for 'stories' bucket
-- IMPORTANT: Ensure you have created a bucket named 'stories' in the Storage dashboard!

-- Allow public viewing of story images
DROP POLICY IF EXISTS "Public Access Stories" ON storage.objects;
CREATE POLICY "Public Access Stories" ON storage.objects FOR SELECT USING ( bucket_id = 'stories' );

-- Allow authenticated users to upload to stories bucket
DROP POLICY IF EXISTS "Authenticated Upload Stories" ON storage.objects;
CREATE POLICY "Authenticated Upload Stories" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'stories' AND auth.role() = 'authenticated' );

-- Allow users to delete their own story images
DROP POLICY IF EXISTS "Users Delete Own Stories" ON storage.objects;
CREATE POLICY "Users Delete Own Stories" ON storage.objects FOR DELETE USING ( bucket_id = 'stories' AND auth.uid() = owner );
