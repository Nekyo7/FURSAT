-- ============================================================
-- CIRCLES FEATURE MIGRATION
-- ============================================================

-- 1. Create Circles Table
CREATE TABLE IF NOT EXISTS circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Circle Members Table
CREATE TABLE IF NOT EXISTS circle_members (
  circle_id UUID NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'admin', 'moderator', 'member'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (circle_id, user_id)
);

-- 3. Update Posts Table to support Circles
ALTER TABLE posts ADD COLUMN IF NOT EXISTS circle_id UUID REFERENCES circles(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS posts_circle_id_idx ON posts(circle_id);

-- 4. Enable RLS
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE circle_members ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for Circles

-- Everyone can view circles (Discovery)
CREATE POLICY "Anyone can view circles" ON circles FOR SELECT USING (true);

-- Authenticated users can create circles
CREATE POLICY "Authenticated users can create circles" ON circles FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only owner can update circle details
CREATE POLICY "Owner can update circle" ON circles FOR UPDATE USING (auth.uid() = owner_id);

-- Only owner can delete circle
CREATE POLICY "Owner can delete circle" ON circles FOR DELETE USING (auth.uid() = owner_id);


-- 6. RLS Policies for Circle Members

-- Everyone can view members (to see who is in a circle)
CREATE POLICY "Anyone can view circle members" ON circle_members FOR SELECT USING (true);

-- Users can join (insert themselves)
CREATE POLICY "Users can join circles" ON circle_members FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can leave (delete themselves)
CREATE POLICY "Users can leave circles" ON circle_members FOR DELETE USING (auth.uid() = user_id);

-- 7. Update Posts RLS (Optional but recommended for private circles later)
-- For now, we keep the existing "Anyone can view posts" policy, but in a real app 
-- you might want to restrict circle posts to members only.
-- We will rely on the frontend to filter for now, or add a specific policy if requested.

-- 8. Storage for Circle Covers (Optional)
-- Ensure 'circles' bucket exists or reuse 'post-images' with a folder.
-- We'll assume reusing 'post-images' or a new 'circles' bucket is created manually.
