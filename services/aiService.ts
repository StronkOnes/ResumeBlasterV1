import { OptimizationMode, ResumeTemplate } from "../types";
import { GoogleGenAI } from "@google/genai";
import { getTemplatePromptInstructions } from "../constants/templates";

// Define the Gemini model to use
const GEMINI_MODEL = "gemini-2.5-flash"; // Or "gemini-2.5-flash" if preferred, matching the original in resume-blaster2

// Using the JSON Context Profile structure provided in the requirements
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
    format: "Markdown with clear headers (###).",
    rules: ["Use power words", "Quantify achievements", "No filler words"]
  }
};

const buildGeminiPrompt = (
    rawContent: string,
    mode: OptimizationMode,
    template: ResumeTemplate,
    jobDescription?: string,
    jobTitle?: string
): { systemInstruction: string, userContent: string } => {
    let systemInstruction = `
    ${JSON.stringify(RESUME_CONTEXT_PROFILE)}
    
    Your task is to analyze the user's input and generate a 10/10 resume.
    
    CURRENT MODE: ${mode === OptimizationMode.NO_HALLUCINATIONS ? "STRICT FACTUAL (No Hallucinations)" : "AI POWER BOOST (Creative Enhancement)"}
  `;

  if (mode === OptimizationMode.NO_HALLUCINATIONS) {
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

  // Add template-specific formatting instructions
  systemInstruction += getTemplatePromptInstructions(template);

  systemInstruction += `
    Output Format:
    Return ONLY the resume content in clean Markdown format. Do not include conversational filler before or after.
    Format the content according to the template style specified above.
  `;

    const userContent = `User Job Title: ${jobTitle}\n\nUser Raw Content:\n${rawContent}`

    return { systemInstruction, userContent };
};

export const generateResumeContent = async (
  rawContent: string,
  mode: OptimizationMode,
  template: ResumeTemplate = ResumeTemplate.MODERN,
  jobDescription?: string,
  jobTitle?: string
): Promise<string> => {
    // Directly access the environment variable
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!geminiApiKey) {
        throw new Error("Gemini API Key is missing. Please set VITE_GEMINI_API_KEY in your .env.local file.");
    }

    // Use the GoogleGenerativeAI library - pass apiKey as an object for browser environment
    const genAI = new GoogleGenAI({ apiKey: geminiApiKey });

    const { systemInstruction, userContent } = buildGeminiPrompt(rawContent, mode, template, jobDescription, jobTitle);

    try {
        const response = await genAI.models.generateContent({
            model: GEMINI_MODEL,
            contents: userContent,
            config: {
                systemInstruction: systemInstruction,
                temperature: mode === OptimizationMode.POWER_BOOST ? 0.7 : 0.2,
            }
        });

        return response.text || "Failed to generate resume content.";
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to communicate with AI service.");
    }
};
