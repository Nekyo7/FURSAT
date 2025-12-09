-- Add role to profiles if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    image_url TEXT,
    category TEXT,
    tags TEXT[],
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- RLS Policies for News

-- View: Everyone can view news
DROP POLICY IF EXISTS "Everyone can view news" ON public.news;
CREATE POLICY "Everyone can view news" ON public.news
    FOR SELECT USING (true);

-- Admin only policies
-- We assume a user is an admin if their profile has role = 'admin'

-- Insert: Admin only
DROP POLICY IF EXISTS "Admins can create news" ON public.news;
CREATE POLICY "Admins can create news" ON public.news
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Update: Admin only
DROP POLICY IF EXISTS "Admins can update news" ON public.news;
CREATE POLICY "Admins can update news" ON public.news
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Delete: Admin only
DROP POLICY IF EXISTS "Admins can delete news" ON public.news;
CREATE POLICY "Admins can delete news" ON public.news
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS news_created_at_idx ON public.news(created_at DESC);
CREATE INDEX IF NOT EXISTS news_category_idx ON public.news(category);
