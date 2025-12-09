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