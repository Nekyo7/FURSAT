# Debugging Username Display Issue

## Steps to Debug

1. **Open Browser Console** (F12)
   - Look for logs starting with 🔍, ✅, ❌, ⚠️
   - These will show you exactly what's happening

2. **Check Supabase Dashboard**
   - Go to Table Editor → `profiles` table
   - Find your user ID
   - Check if `username` column has a value (not NULL)

3. **Common Issues & Fixes**

### Issue 1: Profile exists but username is NULL
**Solution:** The trigger might have created a profile without username. Update it:
```sql
UPDATE profiles 
SET username = 'your_username' 
WHERE id = 'your-user-id';
```

### Issue 2: Profile doesn't exist
**Solution:** Run the SQL migration from `SUPABASE_SETUP.md`

### Issue 3: RLS (Row Level Security) blocking
**Solution:** Check if RLS policies are correct. The user should be able to:
- INSERT their own profile
- SELECT their own profile  
- UPDATE their own profile

### Issue 4: Trigger conflict
**Solution:** If you have the auto-create trigger, it might create a profile without username first. The code handles this by updating, but you can disable the trigger:
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

## Manual Test

1. Sign up with a new account
2. Check console logs - you should see:
   - ✅ User created
   - 📝 Creating profile
   - ✅ Profile created successfully
   - Username saved: [your username]

3. After login, check console:
   - ✅ Signed in, fetching profile
   - ✅ Profile loaded
   - Username: [your username]

4. If username is still not showing:
   - Check Supabase dashboard for the actual data
   - Use the `refreshProfile()` function (it's called automatically)
   - Check browser console for any errors

## Quick Fix Script

If username is NULL in database, run this in Supabase SQL Editor:

```sql
-- Update username for a specific user
UPDATE profiles 
SET username = 'your_username_here'
WHERE id = 'your-user-id-here';

-- Or update all users without username (use email prefix)
UPDATE profiles 
SET username = split_part(email, '@', 1)
WHERE username IS NULL;
```

