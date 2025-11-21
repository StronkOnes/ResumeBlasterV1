# Quick Supabase Setup Guide

## 🚀 Get Your Resume Save Feature Working in 5 Minutes!

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run the Database Schema
1. Open the file `supabase-schema.sql` in your project
2. Copy ALL the SQL code
3. Paste it into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter)

You should see: ✅ Success. No rows returned

### Step 3: Verify the Table Was Created
1. Click on **Table Editor** in the left sidebar
2. You should see a new table called **resumes**
3. Click on it to see the columns

### Step 4: Test It Out!
1. Make sure your dev server is running: `npm run dev`
2. Go to http://localhost:3000
3. Sign in (or create an account)
4. Create a resume:
   - Click "Resume Builder" or "Tailor to Job"
   - Enter some content
   - Click "Enhance & Optimize to 10/10"
5. View the preview - **Your resume is automatically saved!**
6. Click "Save to History & Finish"
7. You should see your resume in the History view!

### Step 5: Verify in Supabase
1. Go back to Supabase
2. Click **Table Editor** → **resumes**
3. You should see your saved resume data!

## 🎉 That's It!

Your resume save functionality is now fully working with Supabase!

## What Happens When You Save?

1. **Automatic Save**: When you generate a resume, it's automatically saved to Supabase
2. **User-Specific**: Only you can see your resumes (protected by Row Level Security)
3. **Full Data**: Saves everything - content, job title, mode, job description, timestamp
4. **History View**: All your resumes appear in the History section

## Troubleshooting

### "Error saving resume to Supabase"
- Check your `.env.local` file has the correct Supabase credentials
- Make sure you ran the SQL schema
- Check browser console for detailed error

### "No resumes showing in History"
- Make sure you're logged in
- Try creating a new resume
- Check Supabase Table Editor to see if data is there

### "Cannot read properties of undefined"
- Restart your dev server: `npm run dev`
- Clear browser cache and reload

## Next Steps

### Optional Enhancements:
1. **Enable PDF Storage**: Create a storage bucket for PDFs
2. **Add Resume Editing**: Allow users to edit saved resumes
3. **Add Delete Function**: Let users delete old resumes
4. **Add Search**: Search through saved resumes

See `SAVE_FUNCTIONALITY_README.md` for detailed documentation!
