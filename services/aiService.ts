import { OptimizationMode } from "../types";
import { GoogleGenAI } from "@google/genai";

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
      - Improve grammar, structure, and phrasing based ONLY on provided info.
      - Do NOT add new skills, tools, or achievements not explicitly mentioned.
      - Fix formatting and flow.
    `;
  } else {
    systemInstruction += `
      - Infer industry-standard skills, tools, and achievements based on the job title: "${jobTitle || 'Unknown'}".
      - Fill in gaps with high-probability professional keywords.
      - Make it sound impressive and senior-level.
    `;
  }

  if (jobDescription) {
    systemInstruction += `
      - TAILOR the resume specifically to this Job Description: "${jobDescription}".
      - Highlight matching skills and keywords from the description.
    `;
  }

  systemInstruction += `
    Output Format:
    Return ONLY the resume content in clean Markdown format. Do not include conversational filler before or after.
  `;

    const userContent = `User Job Title: ${jobTitle}\n\nUser Raw Content:\n${rawContent}`

    return { systemInstruction, userContent };
};

export const generateResumeContent = async (
  rawContent: string,
  mode: OptimizationMode,
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

    const { systemInstruction, userContent } = buildGeminiPrompt(rawContent, mode, jobDescription, jobTitle);

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
