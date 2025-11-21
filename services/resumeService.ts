import { supabase } from './supabaseClient';
import { ResumeData } from '../types';

/**
 * Save a new resume to Supabase
 */
export const saveResume = async (resumeData: Omit<ResumeData, 'id' | 'generated_at'>): Promise<ResumeData | null> => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .insert([{
        ...resumeData,
        generated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving resume:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to save resume:', error);
    return null;
  }
};

/**
 * Update an existing resume
 */
export const updateResume = async (id: string, updates: Partial<ResumeData>): Promise<ResumeData | null> => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating resume:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to update resume:', error);
    return null;
  }
};

/**
 * Fetch all resumes for a user
 */
export const fetchUserResumes = async (userId: string): Promise<ResumeData[]> => {
  console.log('📡 Fetching resumes from Supabase for user:', userId);
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase error:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('✅ Supabase returned:', data?.length || 0, 'resumes');
    return data || [];
  } catch (error) {
    console.error('❌ Failed to fetch resumes:', error);
    return [];
  }
};

/**
 * Delete a resume
 */
export const deleteResume = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete resume:', error);
    return false;
  }
};

/**
 * Fetch a single resume by ID
 */
export const fetchResumeById = async (id: string): Promise<ResumeData | null> => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching resume:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to fetch resume:', error);
    return null;
  }
};
