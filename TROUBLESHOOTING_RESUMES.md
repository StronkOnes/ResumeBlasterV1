# Troubleshooting: Saved Resumes Not Appearing

## Quick Diagnostic Steps

### 1. Check Browser Console
Open your browser's Developer Tools (F12) and look for these messages:

**Expected messages when loading History:**
```
🔍 Loading resumes for user: [your-user-id]
📡 Fetching resumes from Supabase for user: [your-user-id]
✅ Supabase returned: X resumes
✅ Fetched resumes: X resumes found
📄 Resume data: [array of resumes]
```

**If you see errors:**
- ❌ Supabase error - Check the error details
- ❌ Failed to fetch resumes - Database connection issue

### 2. Verify Database Table Exists

Go to your Supabase Dashboard:
1. Navigate to **Table Editor**
2. Look for the `resumes` table
3. If it doesn't exist, run the SQL from `supabase-schema.sql`

### 3. Check if Data Exists in Database

In Supabase Dashboard:
1. Go to **Table Editor** → **resumes**
2. Check if there are any rows
3. Verify the `user_id` matches your logged-in user

### 4. Verify User ID

In browser console, when you log in, you should see:
```
🔍 Loading resumes for user: [some-uuid]
```

Copy that UUID and check in Supabase if any resumes have that `user_id`.

### 5. Common Issues & Solutions

#### Issue: "Table 'resumes' does not exist"
**Solution:** Run the SQL schema
1. Open `supabase-schema.sql`
2. Copy all the SQL
3. Go to Supabase → SQL Editor
4. Paste and run

#### Issue: "No resumes found" but you created some
**Possible causes:**
1. **Different user account** - You might be logged in with a different account
2. **RLS policies blocking** - Row Level Security might be preventing access
3. **Data was deleted** - Check Supabase table directly

**Solution:**
```sql
-- Run this in Supabase SQL Editor to check all resumes
SELECT * FROM resumes;

-- Check your current user ID
SELECT auth.uid();

-- Check resumes for your user
SELECT * FROM resumes WHERE user_id = auth.uid();
```

#### Issue: Resumes save but don't appear
**Solution:** Check RLS policies
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'resumes';

-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'resumes';
```

### 6. Manual Data Check

Run this in Supabase SQL Editor:
```sql
-- See all resumes in the database
SELECT 
  id,
  user_id,
  job_title,
  generated_at,
  enhancement_mode
FROM resumes
ORDER BY generated_at DESC;
```

### 7. Test Creating a New Resume

1. Go to Resume Builder
2. Enter some content
3. Click "Enhance & Optimize to 10/10"
4. Check browser console for:
   ```
   Resume saved: [resume object]
   ```
5. Go to History view
6. Check console for fetch messages

### 8. Force Refresh Resumes

Add this to browser console while on History page:
```javascript
// Get current user ID
const userId = (await supabase.auth.getSession()).data.session?.user?.id;
console.log('User ID:', userId);

// Manually fetch resumes
const { data, error } = await supabase
  .from('resumes')
  .select('*')
  .eq('user_id', userId);

console.log('Resumes:', data);
console.log('Error:', error);
```

### 9. Check Environment Variables

Verify your `.env.local` has:
```env
VITE_SUPABASE_URL="your-url"
VITE_SUPABASE_ANON_KEY="your-key"
```

### 10. Clear Cache and Reload

Sometimes the issue is browser cache:
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Restart dev server: `npm run dev`

## Expected Behavior

When everything works correctly:

1. **On Login:**
   - Console shows: "🔍 Loading resumes for user: [id]"
   - Resumes are fetched from database
   - Console shows: "✅ Fetched resumes: X resumes found"

2. **On History View:**
   - All saved resumes appear in a list
   - Each resume shows: title, date, mode badge
   - Preview, Download, Edit buttons are visible

3. **After Creating Resume:**
   - Console shows: "Resume saved: [object]"
   - Resume appears at top of History list
   - Can immediately preview/download

## Still Not Working?

Check these files for issues:
1. `App.tsx` - Resume loading logic
2. `services/resumeService.ts` - Database queries
3. `services/supabaseClient.ts` - Connection setup
4. `.env.local` - Environment variables

## Debug Mode

The app now has debug logging enabled. Check your browser console for detailed information about:
- User authentication
- Resume fetching
- Database queries
- Errors

All debug messages are prefixed with emojis:
- 🔍 = Loading/Searching
- 📡 = Network/Database request
- ✅ = Success
- ❌ = Error
- 📄 = Data output
