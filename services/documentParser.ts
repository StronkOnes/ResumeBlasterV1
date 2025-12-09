import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
// Try multiple CDN sources to ensure compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.min.js`;

/**
 * Parse a text file
 */
async function parseTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
}

/**
 * Parse a DOCX file using mammoth
 */
async function parseDocxFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.messages.length > 0) {
      console.warn('DOCX parsing warnings:', result.messages);
    }
    
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file. Please ensure the file is not corrupted.');
  }
}

/**
 * Parse a PDF file using PDF.js
 */
async function parsePdfFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Ensure textContent.items exists and map only valid string items
      if (textContent && textContent.items && Array.isArray(textContent.items)) {
        const pageText = textContent.items
          .filter((item: any) => item && typeof item.str === 'string') // Only process items with valid str property
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + ' ';
      }
    }

    // Ensure we return a string, even if empty
    return fullText ? fullText.trim() : '';
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Please ensure the file is not corrupted or password-protected.');
  }
}

/**
 * Main document parser function
 * Accepts .txt, .docx, and .pdf files
 */
export async function parseDocument(file: File): Promise<string> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  switch (fileExtension) {
    case 'txt':
    case 'md':
      return parseTextFile(file);
    
    case 'docx':
      return parseDocxFile(file);
    
    case 'pdf':
      return parsePdfFile(file);
    
    default:
      throw new Error(`Unsupported file type: ${fileExtension}. Please upload a .txt, .docx, or .pdf file.`);
  }
}

/**
 * Validate file before parsing
 */
export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedExtensions = ['txt', 'md', 'docx', 'pdf'];
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  
  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a .txt, .docx, or .pdf file.'
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit. Please upload a smaller file.'
    };
  }
  
  return { valid: true };
}
