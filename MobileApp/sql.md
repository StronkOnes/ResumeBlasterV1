# Resume Blaster Mobile App - Database Setup Instructions

## Overview
This document provides the SQL schema and instructions to set up the database tables for the Resume Blaster mobile application in Supabase. The schema uses mobile-specific table names to avoid conflicts with the web app tables.

## Prerequisites
- Access to a Supabase project
- Admin privileges to execute SQL queries in the database

## Step-by-Step Setup

### 1. Open Supabase SQL Editor
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to "Database" → "SQL Editor"

### 2. Execute the SQL Schema
Copy and paste the following SQL code into the SQL Editor and click "Run":

```sql
-- Resume Blaster Mobile App Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create the necessary tables for mobile app
-- This schema uses mobile-specific table names to avoid conflicts with web app tables

-- Create the mobile_profiles table for user information
CREATE TABLE IF NOT EXISTS public.mobile_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster queries
CREATE INDEX IF NOT EXISTS idx_mobile_profiles_email ON public.mobile_profiles(email);

-- Enable Row Level Security (RLS) for mobile_profiles
ALTER TABLE public.mobile_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only view their own mobile profile
CREATE POLICY "Users can view their own mobile profile"
    ON public.mobile_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Create policy: Users can insert their own mobile profile
CREATE POLICY "Users can insert their own mobile profile"
    ON public.mobile_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Create policy: Users can update their own mobile profile
CREATE POLICY "Users can update their own mobile profile"
    ON public.mobile_profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Create a function to automatically update the updated_at timestamp for mobile_profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at_for_mobile_profiles()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before updates on mobile_profiles
CREATE TRIGGER set_updated_at_for_mobile_profiles
    BEFORE UPDATE ON public.mobile_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at_for_mobile_profiles();

-- Create the mobile_resumes table
CREATE TABLE IF NOT EXISTS public.mobile_resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    summary TEXT,
    sections JSONB NOT NULL, -- This will store the array of ResumeSection objects
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_mobile_resumes_user_id ON public.mobile_resumes(user_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_mobile_resumes_created_at ON public.mobile_resumes(created_at DESC);

-- Enable Row Level Security (RLS) for mobile_resumes
ALTER TABLE public.mobile_resumes ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only view their own mobile resumes
CREATE POLICY "Users can view their own mobile resumes"
    ON public.mobile_resumes
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy: Users can insert their own mobile resumes
CREATE POLICY "Users can insert their own mobile resumes"
    ON public.mobile_resumes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own mobile resumes
CREATE POLICY "Users can update their own mobile resumes"
    ON public.mobile_resumes
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own mobile resumes
CREATE POLICY "Users can delete their own mobile resumes"
    ON public.mobile_resumes
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp for mobile_resumes
CREATE OR REPLACE FUNCTION public.handle_updated_at_for_mobile_resumes()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before updates on mobile_resumes
CREATE TRIGGER set_updated_at_for_mobile_resumes
    BEFORE UPDATE ON public.mobile_resumes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at_for_mobile_resumes();

-- Create a function to automatically create a mobile profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_for_mobile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.mobile_profiles (id, email, full_name)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to automatically create a mobile profile for new users
CREATE TRIGGER on_auth_user_created_for_mobile
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user_for_mobile();
```

### 3. Verify Setup
After running the SQL, you should see confirmation that all tables, policies, and triggers have been created successfully.

### 4. Test the Setup
1. Go to "Database" → "Table Editor" in your Supabase dashboard
2. You should see the `mobile_profiles` and `mobile_resumes` tables listed
3. Check that Row Level Security (RLS) is enabled for both tables

## Important Notes

- The `mobile_profiles` table stores user information linked to Supabase auth users (mobile-specific)
- The `mobile_resumes` table stores resume data with JSONB format for flexible section content (mobile-specific)
- Row Level Security ensures users can only access their own data
- The triggers automatically manage updated timestamps
- The user creation trigger automatically creates a mobile profile when a new auth user is created
- These tables are specifically named to avoid conflicts with the existing web app tables

## Troubleshooting

### If you get an error about the auth.users table:
This means the Supabase Auth module needs to be set up in your project. Go to the "Authentication" section of your Supabase dashboard to ensure it's properly configured.

### If you get permission errors:
Make sure you're running the SQL as a super user or with appropriate permissions.

### If the triggers don't work:
Verify that the `pgcrypto` extension is enabled in your Supabase project under "Database" → "Extensions".

### If you get "relation already exists" errors:
This means the tables were already created. You can safely ignore these warnings.

## Next Steps
Once the database tables are set up, you can:
1. Run the mobile app which will now be able to store user profiles and resumes without conflicts with the web app
2. Use the authentication features without database errors
3. Save and retrieve resume data properly
4. The mobile app will use the mobile-specific tables to avoid interfering with web app data