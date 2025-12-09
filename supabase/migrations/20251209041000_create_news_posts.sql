-- Create news_posts table
CREATE TABLE IF NOT EXISTS public.news_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    summary TEXT NOT NULL,
    content TEXT,
    category TEXT DEFAULT 'NEWS',
    cover_image_url TEXT,
    published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on slug
CREATE INDEX IF NOT EXISTS news_posts_slug_idx ON public.news_posts(slug);
CREATE INDEX IF NOT EXISTS news_posts_published_idx ON public.news_posts(published);
CREATE INDEX IF NOT EXISTS news_posts_created_at_idx ON public.news_posts(created_at DESC);

-- Enable RLS
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- View: Public can view published posts
DROP POLICY IF EXISTS "Public can view published news" ON public.news_posts;
CREATE POLICY "Public can view published news" ON public.news_posts
    FOR SELECT USING (published = true);

-- View: Admins can view all posts
DROP POLICY IF EXISTS "Admins can view all news" ON public.news_posts;
CREATE POLICY "Admins can view all news" ON public.news_posts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insert: Admin only
DROP POLICY IF EXISTS "Admins can create news" ON public.news_posts;
CREATE POLICY "Admins can create news" ON public.news_posts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Update: Admin only
DROP POLICY IF EXISTS "Admins can update news" ON public.news_posts;
CREATE POLICY "Admins can update news" ON public.news_posts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Delete: Admin only
DROP POLICY IF EXISTS "Admins can delete news" ON public.news_posts;
CREATE POLICY "Admins can delete news" ON public.news_posts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
