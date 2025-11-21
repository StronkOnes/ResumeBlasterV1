-- Resume Blaster Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create the necessary tables

-- Create the resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_title TEXT,
    original_content TEXT NOT NULL,
    enhanced_content TEXT NOT NULL,
    template_selected TEXT,
    enhancement_mode TEXT NOT NULL CHECK (enhancement_mode IN ('no_hallucination', 'power_boost')),
    file_path_pdf TEXT,
    file_path_docx TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    job_description_used TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON public.resumes(user_id);

-- Create an index on generated_at for sorting
CREATE INDEX IF NOT EXISTS idx_resumes_generated_at ON public.resumes(generated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only view their own resumes
CREATE POLICY "Users can view their own resumes"
    ON public.resumes
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy: Users can insert their own resumes
CREATE POLICY "Users can insert their own resumes"
    ON public.resumes
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own resumes
CREATE POLICY "Users can update their own resumes"
    ON public.resumes
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own resumes
CREATE POLICY "Users can delete their own resumes"
    ON public.resumes
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before updates
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.resumes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Optional: Create a storage bucket for PDF and DOCX files
-- Run this in the Supabase Storage section or via SQL:
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('resumes', 'resumes', false);

-- Optional: Create storage policies for the resumes bucket
-- CREATE POLICY "Users can upload their own resume files"
--     ON storage.objects
--     FOR INSERT
--     WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view their own resume files"
--     ON storage.objects
--     FOR SELECT
--     USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete their own resume files"
--     ON storage.objects
--     FOR DELETE
--     USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
