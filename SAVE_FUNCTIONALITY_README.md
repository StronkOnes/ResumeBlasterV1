# Resume Blaster - Save Functionality Documentation

## Overview
The Resume Blaster app now has full Supabase integration for saving and managing resumes. This document explains how the save functionality works and how to set it up.

## Features Implemented

### 1. **Automatic Save on Generation**
- When a user generates a resume, it's automatically saved to Supabase
- The save happens in `App.tsx` in the `handleResumeGeneration` function
- Includes all resume data: content, mode, job title, job description, etc.

### 2. **Manual Save Options**
- **Top "Save" Button**: Shows confirmation that resume is already saved
- **Bottom "Save to History & Finish" Button**: Navigates to the History view

### 3. **Resume History**
- View all saved resumes in the History section
- Displays job title, date/time, optimization mode
- Shows if resume was tailored to a job description

## Database Schema

### Resumes Table Structure
```sql
- id: UUID (Primary Key, auto-generated)
- user_id: UUID (Foreign Key to auth.users)
- job_title: TEXT (Optional)
- original_content: TEXT (User's raw input)
- enhanced_content: TEXT (AI-generated content)
- template_selected: TEXT (Optional, for future use)
- enhancement_mode: TEXT ('no_hallucination' or 'power_boost')
- file_path_pdf: TEXT (Optional, for future PDF storage)
- file_path_docx: TEXT (Optional, for future DOCX storage)
- generated_at: TIMESTAMP (Auto-generated)
- job_description_used: TEXT (Optional)
- created_at: TIMESTAMP (Auto-generated)
- updated_at: TIMESTAMP (Auto-updated)
```

## Setup Instructions

### Step 1: Create the Database Table
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script

This will create:
- The `resumes` table with all necessary columns
- Indexes for performance optimization
- Row Level Security (RLS) policies
- Automatic timestamp update triggers

### Step 2: Verify Environment Variables
Make sure your `.env.local` file has:
```env
VITE_SUPABASE_URL="your-supabase-url"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
VITE_GEMINI_API_KEY="your-gemini-api-key"
```

### Step 3: Test the Functionality
1. Start the dev server: `npm run dev`
2. Sign in to the app
3. Create a resume using the Resume Builder or Tailor to Job
4. Click "Enhance & Optimize to 10/10"
5. View the preview - the resume is automatically saved
6. Click "Save to History & Finish" to view your saved resumes

## File Structure

### New/Modified Files

#### `services/resumeService.ts` (NEW)
Contains all Supabase operations for resumes:
- `saveResume()` - Save a new resume
- `updateResume()` - Update an existing resume
- `fetchUserResumes()` - Get all resumes for a user
- `deleteResume()` - Delete a resume
- `fetchResumeById()` - Get a single resume

#### `types.ts` (MODIFIED)
- Added `job_title` field to `ResumeData` interface

#### `App.tsx` (MODIFIED)
- Added `currentResume` state to track the active resume
- Updated `handleResumeGeneration` to include `job_title`
- Modified Preview component props to pass resume data

#### `views/Preview.tsx` (MODIFIED)
- Added save handlers: `handleSave()` and `handleSaveAndFinish()`
- Added save confirmation messages
- Updated UI to show save status

#### `views/History.tsx` (MODIFIED)
- Fixed data mapping to use correct `ResumeData` fields
- Added proper date formatting
- Fixed field names (`enhancement_mode`, `job_description_used`, etc.)

## Security Features

### Row Level Security (RLS)
The database is protected with RLS policies that ensure:
- Users can only view their own resumes
- Users can only create resumes for themselves
- Users can only update/delete their own resumes
- No user can access another user's data

### Authentication
- All resume operations require authentication
- Unauthenticated users are redirected to the Auth view
- User ID is automatically attached to all resume records

## Future Enhancements

### Planned Features
1. **PDF Storage**: Upload generated PDFs to Supabase Storage
2. **DOCX Export**: Generate and store DOCX files
3. **Resume Templates**: Save template preferences
4. **Resume Editing**: Edit saved resumes
5. **Resume Sharing**: Share resumes via public links
6. **Resume Analytics**: Track views and downloads

### Storage Setup (Optional)
To enable PDF/DOCX storage:
1. Create a storage bucket named `resumes` in Supabase
2. Uncomment the storage policies in `supabase-schema.sql`
3. Implement file upload in the Preview component

## Troubleshooting

### Resume Not Saving
1. Check browser console for errors
2. Verify Supabase credentials in `.env.local`
3. Ensure the `resumes` table exists in Supabase
4. Check that RLS policies are enabled

### Can't See Saved Resumes
1. Verify you're logged in
2. Check that `user_id` matches your auth user ID
3. Look for errors in the browser console
4. Verify RLS policies allow SELECT for your user

### Database Errors
1. Run the SQL schema again to ensure all tables/policies exist
2. Check Supabase logs for detailed error messages
3. Verify your Supabase project is active and not paused

## API Reference

### resumeService Functions

#### `saveResume(resumeData)`
```typescript
const resume = await saveResume({
  user_id: 'user-uuid',
  job_title: 'Software Engineer',
  original_content: 'raw text...',
  enhanced_content: 'enhanced text...',
  enhancement_mode: OptimizationMode.POWER_BOOST,
  job_description_used: 'job description...'
});
```

#### `fetchUserResumes(userId)`
```typescript
const resumes = await fetchUserResumes('user-uuid');
```

#### `updateResume(id, updates)`
```typescript
const updated = await updateResume('resume-uuid', {
  job_title: 'Senior Software Engineer'
});
```

#### `deleteResume(id)`
```typescript
const success = await deleteResume('resume-uuid');
```

## Support
For issues or questions, check:
1. Browser console for error messages
2. Supabase dashboard logs
3. Network tab for failed requests
4. This documentation for setup steps
