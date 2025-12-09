import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { User, ResumeData } from '../types';

// Initialize Supabase client
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL. Please set the EXPO_PUBLIC_SUPABASE_URL environment variable.');
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing SUPABASE_ANON_KEY. Please set the EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase client initialized');

/**
 * Authentication methods
 */
export const authService = {
  // Sign up with email and password
  signUp: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // For the web app schema, we only use auth.users metadata
    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  },

  // Update user profile
  updateProfile: async (fullName?: string, avatarUrl?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user found');

    const updates: any = {};
    if (fullName) updates.full_name = fullName;
    if (avatarUrl) updates.avatar_url = avatarUrl;

    const { error } = await supabase.auth.updateUser({
      data: updates
    });

    if (error) throw error;

    return { id: user.id, full_name: fullName, avatar_url: avatarUrl, updated_at: new Date() };
  },
};

/**
 * Resume management methods
 */
export const resumeService = {
  // Create a new resume
  createResume: async (resumeData: Omit<ResumeData, 'id' | 'generated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const newResume = {
      user_id: user.id,
      job_title: resumeData.job_title,
      original_content: resumeData.original_content,
      enhanced_content: resumeData.enhanced_content,
      template_selected: resumeData.template_selected,
      enhancement_mode: resumeData.enhancement_mode,
      file_path_pdf: resumeData.file_path_pdf,
      file_path_docx: resumeData.file_path_docx,
      job_description_used: resumeData.job_description_used,
      generated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('resumes')
      .insert([newResume])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update an existing resume
  updateResume: async (resumeId: string, updates: Partial<ResumeData>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if the resume belongs to the user
    const { data: existingResume, error: fetchError } = await supabase
      .from('resumes')
      .select('user_id')
      .eq('id', resumeId)
      .single();

    if (fetchError) throw fetchError;
    if (existingResume.user_id !== user.id) throw new Error('Unauthorized');

    const { data, error } = await supabase
      .from('resumes')
      .update({
        job_title: updates.job_title,
        original_content: updates.original_content,
        enhanced_content: updates.enhanced_content,
        template_selected: updates.template_selected,
        enhancement_mode: updates.enhancement_mode,
        file_path_pdf: updates.file_path_pdf,
        file_path_docx: updates.file_path_docx,
        job_description_used: updates.job_description_used,
        updated_at: new Date().toISOString(),
      })
      .eq('id', resumeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's resumes
  getUserResumes: async (): Promise<ResumeData[] | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('generated_at', { ascending: false });

    if (error) throw error;
    return data as ResumeData[] || null;
  },

  // Get a specific resume by ID
  getResumeById: async (resumeId: string): Promise<ResumeData | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data as ResumeData || null;
  },

  // Delete a resume
  deleteResume: async (resumeId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check if the resume belongs to the user
    const { data: existingResume, error: fetchError } = await supabase
      .from('resumes')
      .select('user_id')
      .eq('id', resumeId)
      .single();

    if (fetchError) throw fetchError;
    if (existingResume.user_id !== user.id) throw new Error('Unauthorized');

    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeId);

    if (error) throw error;
  },
};

/**
 * Initialize user profile if it doesn't exist
 * Note: Since there's no dedicated profiles table in the web app schema,
 * we're creating user records directly in the auth.users metadata
 */
export const initializeProfile = async (user: User) => {
  // The web app schema doesn't have a separate profiles table,
  // so we just ensure the user exists in auth.users with proper metadata
  if (user.name) {
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: user.name,
      }
    });

    if (error) {
      console.error('Error updating user metadata:', error);
      throw error;
    }
  }
};

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  // Handle auth state changes if needed
  console.log('Auth state changed:', event);
});

export { supabase };