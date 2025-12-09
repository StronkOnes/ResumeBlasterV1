// Validation utilities for the Resume Blaster mobile app

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates resume data
 */
export const validateResumeData = (resumeData: any): ValidationResult => {
  const errors: string[] = [];

  // Validate required fields
  if (!resumeData.fullName || resumeData.fullName.trim() === '') {
    errors.push('Full name is required');
  } else if (resumeData.fullName.trim().length > 100) {
    errors.push('Full name must be less than 100 characters');
  }

  if (resumeData.email && resumeData.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resumeData.email)) {
      errors.push('Please enter a valid email address');
    }
  }

  if (resumeData.phone && resumeData.phone.trim() !== '') {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(resumeData.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please enter a valid phone number');
    }
  }

  if (resumeData.summary && resumeData.summary.length > 500) {
    errors.push('Summary must be less than 500 characters');
  }

  // Validate sections
  if (resumeData.sections && Array.isArray(resumeData.sections)) {
    for (const [index, section] of resumeData.sections.entries()) {
      if (!section.title || section.title.trim() === '') {
        errors.push(`Section ${index + 1} must have a title`);
      }
      if (section.items && Array.isArray(section.items)) {
        for (const [itemIndex, item] of section.items.entries()) {
          if (typeof item !== 'string' && typeof item !== 'object') {
            errors.push(`Section ${index + 1}, item ${itemIndex + 1} has invalid format`);
          }
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates user input
 */
export const validateUserInput = (field: string, value: string): ValidationResult => {
  const errors: string[] = [];

  switch (field) {
    case 'fullName':
      if (!value || value.trim() === '') {
        errors.push('Full name is required');
      } else if (value.trim().length > 100) {
        errors.push('Full name must be less than 100 characters');
      }
      break;
    
    case 'email':
      if (value && value.trim() !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push('Please enter a valid email address');
        }
      }
      break;
    
    case 'phone':
      if (value && value.trim() !== '') {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
          errors.push('Please enter a valid phone number');
        }
      }
      break;
    
    case 'summary':
      if (value && value.length > 500) {
        errors.push('Summary must be less than 500 characters');
      }
      break;
    
    default:
      // No validation for other fields
      break;
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitizes user input
 */
export const sanitizeInput = (value: string): string => {
  if (typeof value !== 'string') return '';
  
  // Remove potentially dangerous characters
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .trim();
};
