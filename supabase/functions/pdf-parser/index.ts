import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Using pdfjs-dist which is more reliable for text extraction
const pdfjsLib = await import('https://esm.sh/pdfjs-dist@4.0.379/esm/pdf.mjs');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { fileContent } = await req.json()
    
    // Decode base64 content
    const binaryString = atob(fileContent);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Use pdfjs-dist to load the PDF
    const uint8Array = new Uint8Array(bytes);
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Extract text items and join them
      const pageText = textContent.items
        .filter((item: any) => item && typeof item.str === 'string')
        .map((item: any) => item.str)
        .join(' ');
        
      fullText += pageText + ' ';
    }

    return new Response(
      JSON.stringify({ text: fullText.trim() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('PDF parsing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})