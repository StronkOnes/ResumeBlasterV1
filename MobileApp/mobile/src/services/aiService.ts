import { OptimizationMode, ResumeTemplate } from "../types";
import { EXPO_PUBLIC_SERVER_URL } from "@env";

// Get the server URL from environment - fallback to localhost for development
const SERVER_URL = EXPO_PUBLIC_SERVER_URL || "http://10.0.2.2:3000"; // Use your actual server IP or emulator localhost

export const generateResumeContent = async (
  rawContent: string,
  mode: OptimizationMode,
  template: ResumeTemplate = ResumeTemplate.MODERN,
  jobDescription?: string,
  jobTitle?: string
): Promise<string> => {
  try {
    const response = await fetch(`${SERVER_URL}/ai/optimize-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rawContent,
        mode,
        template,
        jobDescription,
        jobTitle
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.optimizedContent || "Failed to generate resume content.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    if (error instanceof TypeError && error.message.includes('Network request failed')) {
      throw new Error("Network error: Unable to connect to the AI service. Please check your internet connection and server availability.");
    }
    throw new Error("Failed to communicate with AI service.");
  }
};
