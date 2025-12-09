import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.24.1'

// Get your Gemini API key from Supabase project settings
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
const GEMINI_MODEL = "gemini-2.5-flash"

if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set')
}

// Define the resume context profile
const RESUME_CONTEXT_PROFILE = {
  identity: {
    role: "You are a world-class Career Advisor and Resume Writer with 15+ years of experience in HR and talent acquisition.",
    persona: "The Strategic Optimizer",
    credentials: "Certified Professional Resume Writer (CPRW), expert in ATS optimization."
  },
  audience: {
    profile: "A job seeker who needs a polished, professional resume.",
    expectations: "Clean, error-free, compelling resume that passes ATS."
  },
  response_style: {
    tone: "Professional and Confident",
    format: "Plain text - no markdown formatting.",
    rules: ["Use power words", "Quantify achievements", "No filler words"]
  }
};

const buildGeminiPrompt = (
  rawContent: string,
  mode: 'no_hallucinations' | 'power_boost',
  template: string,
  jobDescription?: string,
  jobTitle?: string
): { systemInstruction: string, userContent: string } => {
  let systemInstruction = `
    ${JSON.stringify(RESUME_CONTEXT_PROFILE)}

    Your task is to analyze the user's input and generate a 10/10 resume.

    CURRENT MODE: ${mode === 'no_hallucinations' ? "STRICT FACTUAL (No Hallucinations)" : "AI POWER BOOST (Creative Enhancement)"}
  `;

  if (mode === 'no_hallucinations') {
    systemInstruction += `
      STRICT MODE RULES (No Hallucinations):
      - Transform generic statements into high-impact professional phrases using ONLY the provided information.
      - Quantify results whenever the information allows (e.g., "Led project" → "Led project to completion 2 weeks ahead of schedule").
      - Use powerful action verbs and eliminate passive voice entirely.
      - Remove all filler words, repetition, and CV clichés.
      - Ensure every bullet point is concise, direct, and optimized for ATS algorithms.
      - Convert vague statements into measurable impact where data exists.
      - Maintain US English spelling and grammar consistency.
      - Do NOT add new skills, tools, or achievements not explicitly mentioned.
      - Do NOT invent facts, dates, or accomplishments.
    `;
  } else {
    systemInstruction += `
      POWER BOOST MODE RULES (AI Enhancement):
      - Infer industry-standard skills, tools, and achievements for "${jobTitle || 'Unknown'}" role.
      - Add ONLY credible, interview-defensible enhancements that align with the user's background.
      - Never contradict provided information (e.g., don't claim leadership if user only did junior work).
      - Use advanced professional phrasing, active voice, and industry-accepted buzzwords.
      - Quantify achievements with realistic, plausible metrics (e.g., "increased efficiency by 18%").
      - Fill gaps with high-probability skills that match the job title and industry trends.
      - Structure output per latest resume design trends: impactful summary, strategic keywords, quantified results.
      - Make it sound impressive and senior-level while maintaining credibility.
      - All additions must be easily justifiable in an interview setting.
    `;
  }

  if (jobDescription) {
    systemInstruction += `
      - TAILOR the resume specifically to this Job Description: "${jobDescription}".
      - Highlight matching skills and keywords from the description.
    `;
  }

  // Add template-specific formatting instructions (simplified for this example)
  const templateInstructions = `Apply the ${template} template format to the resume.`
  systemInstruction += templateInstructions

  systemInstruction += `
    Output Format:
    Return ONLY the resume content in clean plain text format. Do not include conversational filler before or after.
    Format the content according to the template style specified above but with no markdown formatting (no ##, *, -, etc.).
  `;

  const userContent = `User Job Title: ${jobTitle}\n\nUser Raw Content:\n${rawContent}`

  return { systemInstruction, userContent };
};

// Enable CORS for local development and production
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })

    const { rawContent, mode, template, jobDescription, jobTitle } = await req.json()

    // Validate required fields
    if (!rawContent) {
      return new Response(
        JSON.stringify({ error: 'rawContent is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { systemInstruction, userContent } = buildGeminiPrompt(
      rawContent,
      mode as 'no_hallucinations' | 'power_boost',
      template,
      jobDescription,
      jobTitle
    )

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: userContent }]
      }],
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature: mode === 'power_boost' ? 0.7 : 0.2,
      }
    })

    const response = await result.response
    const text = response.text()

    // Return the AI-generated content
    return new Response(
      JSON.stringify({ content: text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('AI Generation Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to communicate with AI service',
        details: error.toString()
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})