// Define common types used across the application

export interface ResumeData {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  summary?: string;
  sections: ResumeSection[];
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