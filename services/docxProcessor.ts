import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import { ResumeTemplate } from '../types';

/**
 * Parse AI-generated resume content into structured data for DOCX templates
 */
export function parseResumeContent(content: string): Record<string, any> {
  const data: Record<string, any> = {
    name: '',
    email: '',
    phone: '',
    location: '',
    profile_summary: '',
    work_experience: [],
    education: [],
    skills: [],
    certifications: [],
    achievements: [],
  };

  const lines = content.split('\n');
  let currentSection = '';
  let currentContent: string[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Main header (name)
    if (trimmedLine.startsWith('#') && !trimmedLine.startsWith('##')) {
      data.name = trimmedLine.replace(/^#+\s*/, '').trim();
    }
    // Section headers
    else if (trimmedLine.startsWith('###')) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        saveSection(data, currentSection, currentContent);
      }
      // Start new section
      currentSection = trimmedLine.replace(/^#+\s*/, '').trim().toLowerCase();
      currentContent = [];
    }
    // Subsection headers
    else if (trimmedLine.startsWith('##')) {
      const sectionName = trimmedLine.replace(/^#+\s*/, '').trim().toLowerCase();
      currentSection = sectionName;
      currentContent = [];
    }
    // Content lines
    else if (trimmedLine) {
      // Check for contact info patterns
      if (index < 5) { // Contact info usually in first few lines
        if (trimmedLine.includes('@')) {
          data.email = extractEmail(trimmedLine);
        }
        if (trimmedLine.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/)) {
          data.phone = extractPhone(trimmedLine);
        }
        if (trimmedLine.match(/[A-Z][a-z]+,\s*[A-Z]{2}|[A-Z][a-z]+\s+[A-Z][a-z]+/)) {
          data.location = extractLocation(trimmedLine);
        }
      }
      currentContent.push(trimmedLine);
    }
  });

  // Save last section
  if (currentSection && currentContent.length > 0) {
    saveSection(data, currentSection, currentContent);
  }

  return data;
}

function saveSection(data: Record<string, any>, section: string, content: string[]) {
  const sectionKey = section.toLowerCase().replace(/\s+/g, '_');
  
  if (sectionKey.includes('summary') || sectionKey.includes('profile') || sectionKey.includes('objective')) {
    data.profile_summary = content.join('\n');
  } else if (sectionKey.includes('experience') || sectionKey.includes('work')) {
    data.work_experience = parseListItems(content);
  } else if (sectionKey.includes('education')) {
    data.education = parseListItems(content);
  } else if (sectionKey.includes('skill')) {
    data.skills = parseListItems(content);
  } else if (sectionKey.includes('certification') || sectionKey.includes('certificate')) {
    data.certifications = parseListItems(content);
  } else if (sectionKey.includes('achievement') || sectionKey.includes('award')) {
    data.achievements = parseListItems(content);
  } else {
    // Generic section
    data[sectionKey] = content.join('\n');
  }
}

function parseListItems(content: string[]): string[] {
  return content
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(line => line.length > 0);
}

function extractEmail(text: string): string {
  const match = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  return match ? match[0] : '';
}

function extractPhone(text: string): string {
  const match = text.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0] : '';
}

function extractLocation(text: string): string {
  // Simple location extraction - can be improved
  const parts = text.split('|').map(p => p.trim());
  for (const part of parts) {
    if (part.match(/[A-Z][a-z]+,\s*[A-Z]{2}/) || part.match(/[A-Z][a-z]+\s+[A-Z][a-z]+/)) {
      return part;
    }
  }
  return '';
}

/**
 * Load and process a DOCX template with resume data
 */
export async function processDocxTemplate(
  templatePath: string,
  resumeContent: string
): Promise<Blob> {
  try {
    // Fetch the template file
    const response = await fetch(templatePath);
    const arrayBuffer = await response.arrayBuffer();
    
    // Load the template
    const zip = new PizZip(arrayBuffer);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter: () => '', // Return empty string for missing values
    });

    // Parse resume content into structured data
    const data = parseResumeContent(resumeContent);

    // Render the document with data
    doc.render(data);

    // Generate the output
    const output = doc.getZip().generate({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    return output;
  } catch (error) {
    console.error('Error processing DOCX template:', error);
    throw new Error('Failed to process DOCX template');
  }
}

/**
 * Download a DOCX file
 */
export function downloadDocx(blob: Blob, filename: string) {
  saveAs(blob, filename);
}

/**
 * Generate and download DOCX from template
 */
export async function generateDocxResume(
  template: ResumeTemplate,
  resumeContent: string,
  jobTitle: string = 'resume'
): Promise<void> {
  try {
    // Map template to file path
    const templatePaths: Record<ResumeTemplate, string> = {
      [ResumeTemplate.MODERN]: '/Templates/Document 1.docx',
      [ResumeTemplate.CLASSIC]: '/Templates/Document 2.docx',
      [ResumeTemplate.EXECUTIVE]: '/Templates/Document 3.docx',
    };

    const templatePath = templatePaths[template];
    
    // Process the template
    const docxBlob = await processDocxTemplate(templatePath, resumeContent);
    
    // Generate filename
    const filename = `${jobTitle.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.docx`;
    
    // Download
    downloadDocx(docxBlob, filename);
  } catch (error) {
    console.error('Error generating DOCX resume:', error);
    throw error;
  }
}

/**
 * Create structured data object for manual template filling
 */
export function createTemplateData(resumeContent: string): Record<string, any> {
  return parseResumeContent(resumeContent);
}

/**
 * Preview template data structure
 */
export function previewTemplateData(resumeContent: string): string {
  const data = parseResumeContent(resumeContent);
  return JSON.stringify(data, null, 2);
}
