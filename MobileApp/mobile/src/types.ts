// Define common types used across the application

export enum OptimizationMode {
  NO_HALLUCINATIONS = 'no_hallucination',
  POWER_BOOST = 'power_boost'
}

export enum ResumeTemplate {
  MODERN = 'modern',
  CLASSIC = 'classic',
  EXECUTIVE = 'executive'
}

export interface TemplateInfo {
  id: ResumeTemplate;
  name: string;
  description: string;
  preview: string; // Path to preview image
  docxPath: string; // Path to DOCX template
}

export interface ResumeData {
  id?: string; // Supabase will generate this
  user_id: string;
  job_title?: string; // The job title entered by the user
  original_content: string; // The raw text from the user
  enhanced_content: string; // The AI-generated, polished text
  template_selected?: string; // e.g., 'modern', 'classic', 'executive'
  enhancement_mode: OptimizationMode;
  file_path_pdf?: string; // Path to the stored PDF in Supabase Storage.
  file_path_docx?: string; // Path to the stored DOCX in Supabase Storage.
  generated_at?: string; // Timestamp, Default: now()
  job_description_used?: string; // For tailoring feature.
  // Additional fields for mobile app compatibility with web schema
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  summary?: string;
  sections?: ResumeSection[];
}

export interface ResumeSection {
  title: string;
  items: ResumeItem[];
}

export interface ResumeItem {
  position?: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  degree?: string;
  institution?: string;
  skills?: string[];
  [key: string]: any; // Allow additional properties
}

// User-related types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserProfile {
  tier: 'free' | 'pro';
  resumeCount: number;
  savedResumes: ResumeData[];
}

export interface EditorState {
  rawContent: string;
  jobTitle: string;
  jobDescription: string;
  mode: OptimizationMode;
  isUploading: boolean;
}
