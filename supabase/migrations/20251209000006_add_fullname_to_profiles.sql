-- Add full_name column if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;

-- Add avatar_url column if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Seed profiles for the test users
INSERT INTO public.profiles (id, email, username, full_name, avatar_url, updated_at)
VALUES
    ('e84e00f1-44dd-4d9f-80d0-cbfbaebcf77a', 'nekyo063@gmail.com', 'nekyo063', 'Nekyo 063', 'https://api.dicebear.com/7.x/avataaars/svg?seed=nekyo063', now()),
    ('1399ab34-6762-4f2d-9fb6-78f5865f9b96', 'nekyo108@gmail.com', 'nekyo108', 'Nekyo 108', 'https://api.dicebear.com/7.x/avataaars/svg?seed=nekyo108', now())
ON CONFLICT (id) DO UPDATE
SET
    email = COALESCE(EXCLUDED.email, profiles.email),
    username = EXCLUDED.username,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = now();
