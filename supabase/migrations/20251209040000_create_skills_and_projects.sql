-- Create skills table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Skills

-- View: Everyone can view skills
DROP POLICY IF EXISTS "Everyone can view skills" ON public.skills;
CREATE POLICY "Everyone can view skills" ON public.skills
    FOR SELECT USING (true);

-- Insert: Users can add their own skills
DROP POLICY IF EXISTS "Users can add their own skills" ON public.skills;
CREATE POLICY "Users can add their own skills" ON public.skills
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Delete: Users can delete their own skills
DROP POLICY IF EXISTS "Users can delete their own skills" ON public.skills;
CREATE POLICY "Users can delete their own skills" ON public.skills
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Projects

-- View: Everyone can view projects
DROP POLICY IF EXISTS "Everyone can view projects" ON public.projects;
CREATE POLICY "Everyone can view projects" ON public.projects
    FOR SELECT USING (true);

-- Insert: Users can add their own projects
DROP POLICY IF EXISTS "Users can add their own projects" ON public.projects;
CREATE POLICY "Users can add their own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Update: Users can update their own projects
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
CREATE POLICY "Users can update their own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

-- Delete: Users can delete their own projects
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
CREATE POLICY "Users can delete their own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);
