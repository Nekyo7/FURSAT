# Post System Setup Guide

## 🚀 Quick Start

Follow these steps to set up the complete post system for FURSAT.

---

## 1. Install Dependencies

The post system requires `uuid` and `date-fns` packages:

```bash
npm install uuid date-fns
npm install --save-dev @types/uuid
```

---

## 2. Database Setup

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase/migrations/create_posts_system.sql`
5. Run the query

### Option B: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db reset
```

---

## 3. Storage Bucket Setup

### Create the `post-images` bucket:

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Name: `post-images`
4. **Public bucket**: ✅ (checked)
5. Click **Create bucket**

### Set Storage Policies:

After creating the bucket, set these policies:

**INSERT Policy** (Allow authenticated uploads):
```sql
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images');
```

**SELECT Policy** (Public read):
```sql
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'post-images');
```

**DELETE Policy** (Owner can delete):
```sql
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 4. Verify Setup

### Test Database Tables

Run this query in SQL Editor to verify tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('posts', 'likes', 'saves');
```

You should see all three tables.

### Test RLS Policies

```sql
SELECT tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('posts', 'likes', 'saves');
```

You should see multiple policies for each table.

---

## 5. Start Development Server

```bash
npm run dev
```

Navigate to `/feed` and you should see:
- Empty state with "No posts yet" message
- "Drop it" button to create posts
- Real-time updates when posts are created

---

## 6. Test the System

### Create a Post

1. Click "Drop it" button or the quick create area
2. Write some content
3. Optionally add an image
4. Click "Post"
5. Post should appear immediately in the feed

### Test Like/Save

1. Click the heart icon to like a post
2. Click the bookmark icon to save a post
3. Counts should update immediately

### Test Real-time

1. Open the feed in two browser tabs
2. Create a post in one tab
3. It should appear in the other tab automatically

### Test Delete

1. You should see a trash icon on your own posts
2. Click it to delete
3. Confirm the deletion
4. Post should disappear from feed

---

## 7. Troubleshooting

### "Relation does not exist" error

- Make sure you ran the SQL migration script
- Check that tables were created in the `public` schema

### "Permission denied" error

- Verify RLS policies are set up correctly
- Make sure you're logged in (check auth state)

### Images not uploading

- Verify `post-images` bucket exists
- Check storage policies are set
- Ensure bucket is public

### Posts not appearing

- Check browser console for errors
- Verify Supabase credentials in `.env`
- Check that user is authenticated

### Real-time not working

- Supabase real-time requires proper project setup
- Check that real-time is enabled in Supabase Dashboard
- Verify no console errors related to subscriptions

---

## 8. Environment Variables

Make sure your `.env` or `.env.local` has:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🎉 You're Done!

Your post system is now fully functional with:
- ✅ Posts with text and images
- ✅ Like and save functionality
- ✅ Real-time updates
- ✅ Secure RLS policies
- ✅ Image uploads to Supabase Storage
- ✅ Delete own posts
- ✅ Loading and error states

---

## 📚 Next Steps

Consider adding:
- Comments system
- Share functionality
- User profiles
- Post editing
- Image filters/cropping
- Video support
- Hashtag parsing
- Mentions (@username)
