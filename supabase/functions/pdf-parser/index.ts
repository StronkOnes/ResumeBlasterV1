import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { getDocumentProxy, extractText } from 'https://esm.sh/unpdf@^0.11.0'

// CORS headers to allow requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Proper base64 decoding for binary data in Deno
function base64ToArrayBuffer(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { fileContent } = await req.json()
    
    // Properly decode the base64 content to binary
    const pdfBytes = base64ToArrayBuffer(fileContent)

    // Use unpdf to extract text from the PDF
    const pdf = await getDocumentProxy(pdfBytes)
    const result = await extractText(pdf)

    // The result might have different properties depending on the library version
    // Check all possible text properties
    let extractedText = '';
    if (typeof result === 'string') {
      extractedText = result;
    } else if (result && typeof result.text === 'string') {
      extractedText = result.text;
    } else if (result && typeof result.content === 'string') {
      extractedText = result.content;
    } else if (result && Array.isArray(result.items) && result.items.length > 0) {
      // For text content items
      extractedText = result.items.map((item: any) => item.str || '').join(' ');
    } else {
      // If all else fails, try to get whatever text might be available
      extractedText = JSON.stringify(result) || '';
    }
    
    return new Response(
      JSON.stringify({ text: extractedText }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      },
    )
  } catch (error) {
    console.error('PDF parsing error:', error)
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      },
    )
  }
})