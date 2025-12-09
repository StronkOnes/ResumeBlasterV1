import mammoth from 'mammoth';

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
 * Parse a PDF file using Supabase Edge Function
 */
async function parsePdfFile(file: File): Promise<string> {
  try {
    // Get Supabase URL and anon key from environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    // Convert file to base64 for transmission
    // Use FileReader to properly convert to base64 to avoid stack overflow
    const arrayBuffer = await file.arrayBuffer();
    const base64String = arrayBufferToBase64(arrayBuffer);

    // Call the Supabase Edge Function
    const response = await fetch(`${supabaseUrl}/functions/v1/pdf-parser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({ fileContent: base64String }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if there was an error from the function
    if (data.error) {
      throw new Error(data.error);
    }

    // Return the text - even if empty, it's a valid response from the function
    return typeof data.text === 'string' ? data.text : '';
  } catch (error) {
    console.error('Error parsing PDF via Supabase:', error);
    throw new Error('Failed to parse PDF file. Please ensure the file is not corrupted or password-protected.');
  }
}

// Helper function to convert ArrayBuffer to Base64 without stack overflow
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
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
