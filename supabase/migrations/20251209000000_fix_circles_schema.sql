-- Create circles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.circles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Create circle_members table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.circle_members (
    circle_id UUID REFERENCES public.circles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    PRIMARY KEY (circle_id, user_id)
);

-- Add circle_id to posts table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'circle_id') THEN
        ALTER TABLE public.posts ADD COLUMN circle_id UUID REFERENCES public.circles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE public.circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Circles
DROP POLICY IF EXISTS "Circles are viewable by everyone" ON public.circles;
CREATE POLICY "Circles are viewable by everyone" ON public.circles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create circles" ON public.circles;
CREATE POLICY "Authenticated users can create circles" ON public.circles
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for Circle Members
DROP POLICY IF EXISTS "Circle members are viewable by everyone" ON public.circle_members;
CREATE POLICY "Circle members are viewable by everyone" ON public.circle_members
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can join circles" ON public.circle_members;
CREATE POLICY "Users can join circles" ON public.circle_members
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can leave circles" ON public.circle_members;
CREATE POLICY "Users can leave circles" ON public.circle_members
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Posts (Updated)

-- Drop existing policies if they conflict
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;
DROP POLICY IF EXISTS "View posts" ON public.posts;
DROP POLICY IF EXISTS "Create posts" ON public.posts;
DROP POLICY IF EXISTS "Manage own posts" ON public.posts;

-- View Policy:
-- 1. Global posts (circle_id IS NULL) are viewable by everyone.
-- 2. Circle posts are viewable only by members of that circle.
CREATE POLICY "View posts" ON public.posts
    FOR SELECT USING (
        circle_id IS NULL 
        OR 
        EXISTS (
            SELECT 1 FROM public.circle_members 
            WHERE circle_members.circle_id = posts.circle_id 
            AND circle_members.user_id = auth.uid()
        )
    );

-- Insert Policy:
-- 1. Global posts: Authenticated users can create.
-- 2. Circle posts: Must be a member of the circle.
CREATE POLICY "Create posts" ON public.posts
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND (
            circle_id IS NULL 
            OR 
            EXISTS (
                SELECT 1 FROM public.circle_members 
                WHERE circle_members.circle_id = posts.circle_id 
                AND circle_members.user_id = auth.uid()
            )
        )
    );

-- Update/Delete Policy: Users can manage their own posts
CREATE POLICY "Manage own posts" ON public.posts
    FOR ALL USING (auth.uid() = user_id);
