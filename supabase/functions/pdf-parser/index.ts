import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { getDocumentProxy, extractText } from 'https://esm.sh/unpdf@^0.11.0'

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
    const buffer = Uint8Array.from(atob(fileContent), c => c.charCodeAt(0))
    const pdf = await getDocumentProxy(buffer)
    const { text } = await extractText(pdf)

    // Ensure we return text, even if it's empty
    return new Response(
      JSON.stringify({ text: text || '' }),
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