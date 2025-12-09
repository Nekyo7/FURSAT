# Quick Database Setup - Fix "Table Not Found" Error

## The Problem
You're seeing: `Could not find the table 'public.posts' in the schema cache`

This means the database tables haven't been created yet.

---

## Solution: Run the SQL Migration

### Step 1: Open Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Migration Script

1. Click **New query** button
2. Copy the ENTIRE contents of the file: `d:\FURSAT\fursat-nexus\supabase\migrations\create_posts_system.sql`
3. Paste it into the SQL Editor
4. Click **Run** (or press Ctrl+Enter)

### Step 3: Verify Tables Were Created

Run this query to check:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('posts', 'likes', 'saves');
```

You should see 3 rows returned:
- posts
- likes
- saves

---

## Step 4: Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Name: `post-images`
4. Check **Public bucket** ✅
5. Click **Create bucket**

### Set Storage Policies

After creating the bucket, go to **Policies** tab and add these:

**Policy 1: Allow authenticated uploads**
```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images');
```

**Policy 2: Allow public viewing**
```sql
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');
```

**Policy 3: Allow users to delete their own images**
```sql
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## Step 5: Refresh Your App

1. Go back to your browser with the app
2. Refresh the page (F5)
3. The error should be gone!

---

## Still Having Issues?

### Check Supabase Connection

Make sure your `.env` or `.env.local` file has:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Restart Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

## Quick Test

Once setup is complete:

1. Go to `/feed` in your app
2. Click "Drop it" button
3. Create a test post
4. It should appear in the feed immediately!

---

## Need the SQL File?

The migration file is located at:
`d:\FURSAT\fursat-nexus\supabase\migrations\create_posts_system.sql`

Open it, copy all contents, and paste into Supabase SQL Editor.
