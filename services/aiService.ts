import { OptimizationMode, ResumeTemplate } from "../types";

// Helper function to convert enum to string
const getTemplateString = (template: ResumeTemplate): string => {
  switch (template) {
    case ResumeTemplate.MODERN: return 'MODERN';
    case ResumeTemplate.CLEAN: return 'CLEAN';
    case ResumeTemplate.PROFESSIONAL: return 'PROFESSIONAL';
    case ResumeTemplate.CREATIVE: return 'CREATIVE';
    case ResumeTemplate.ATOMIC: return 'ATOMIC';
    default: return 'MODERN';
  }
};

export const generateResumeContent = async (
  rawContent: string,
  mode: OptimizationMode,
  template: ResumeTemplate = ResumeTemplate.MODERN,
  jobDescription?: string,
  jobTitle?: string
): Promise<string> => {
  // Prepare the request body with all necessary parameters
  const requestBody = {
    rawContent,
    mode: mode === OptimizationMode.NO_HALLUCINATIONS ? 'no_hallucinations' : 'power_boost',
    template: getTemplateString(template),
    jobDescription,
    jobTitle
  };

  try {
    // Get the Supabase URL and anon key from environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    // Call the secure Supabase Edge Function instead of the AI API directly
    const response = await fetch(`${supabaseUrl}/functions/v1/ai-resume-generation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.content || "Failed to generate resume content.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to communicate with AI service. Please try again later.");
  }
};
