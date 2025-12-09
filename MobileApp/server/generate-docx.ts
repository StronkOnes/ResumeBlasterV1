import express from 'express';
import bodyParser from 'body-parser';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import 'dotenv/config';

// Define constants for resume functionality (using JavaScript objects instead of TypeScript enums)
const OptimizationMode = {
  NO_HALLUCINATIONS: 'no_hallucinations',
  POWER_BOOST: 'power_boost'
};

const ResumeTemplate = {
  MODERN: 'modern',
  CLASSIC: 'classic',
  CREATIVE: 'creative'
};

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

// Define the Gemini model to use
const GEMINI_MODEL = "gemini-2.5-flash";

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
    format: "Plain text - no markdown formatting.",
    rules: ["Use power words", "Quantify achievements", "No filler words"]
  }
};

const getTemplatePromptInstructions = (template: string): string => {
  switch (template) {
    case ResumeTemplate.MODERN:
      return "MODERN TEMPLATE: Focus on clean design elements, use appropriate spacing, and emphasize key sections with subtle formatting that's readable by ATS systems.";
    case ResumeTemplate.CLASSIC:
      return "CLASSIC TEMPLATE: Emphasize traditional professional formatting, standard section headers, and clear hierarchical information structure that works well with ATS parsing.";
    case ResumeTemplate.CREATIVE:
      return "CREATIVE TEMPLATE: Allow for more expressive language and innovative phrasing while maintaining professional standards appropriate for creative roles.";
    default:
      return "DEFAULT TEMPLATE: Use standard professional formatting with clear section organization.";
  }
};

const buildGeminiPrompt = (
    rawContent: string,
    mode: string,
    template: string,
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
    Return ONLY the resume content in clean plain text format. Do not include conversational filler before or after.
    Format the content according to the template style specified above but with no markdown formatting (no ##, *, -, etc.).
  `;

    const userContent = `User Job Title: ${jobTitle}\n\nUser Raw Content:\n${rawContent}`

    return { systemInstruction, userContent };
};

// Endpoint to optimize resume content using AI
app.post('/ai/optimize-resume', async (req, res) => {
  try {
    const { rawContent, mode, template, jobDescription, jobTitle } = req.body;

    // Validate required parameters
    if (!rawContent) {
      return res.status(400).json({ error: 'Raw content is required' });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      console.error('Gemini API Key is missing from server environment variables');
      return res.status(500).json({ error: 'Server configuration error: API key not set' });
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);

    const { systemInstruction, userContent } = buildGeminiPrompt(rawContent, mode, template, jobDescription, jobTitle);

    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemInstruction
    });

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{ text: userContent }]
      }],
      generationConfig: {
        temperature: mode === OptimizationMode.POWER_BOOST ? 0.7 : 0.2,
      }
    });

    const response = await result.response;
    if (!response.text) {
      return res.status(500).json({ error: 'Failed to generate resume content' });
    }

    res.json({ optimizedContent: response.text() });
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: 'Failed to communicate with AI service' });
  }
});

// Endpoint to generate DOCX resume
app.post('/generate-docx', async (req, res) => {
  try {
    const { fullName, email, phone, address, summary, sections } = req.body;

    // Validate required fields
    if (!fullName) {
      return res.status(400).send('Full name is required');
    }

    // Create a simple DOCX document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: fullName,
                bold: true,
                size: 32,
              })
            ],
            alignment: "center"
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: email || '',
                size: 16,
              })
            ],
            alignment: "center"
          }),
          ...(phone || address ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: [phone, address].filter(Boolean).join(' | '),
                  size: 14,
                })
              ],
              alignment: "center"
            })
          ] : []),
          new Paragraph(''),
          ...(summary ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: 'SUMMARY',
                  bold: true,
                  size: 18,
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: summary,
                  size: 14,
                })
              ]
            }),
            new Paragraph('')
          ] : []),
          ...sections.flatMap((section: any) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: section.title,
                  bold: true,
                  size: 24,
                })
              ]
            }),
            ...section.items.map((item: any) => {
              const paragraphs = [];

              // Add position and company if they exist
              if (item.position || item.company) {
                const companyText = item.company ? ` at ${item.company}` : '';
                paragraphs.push(new Paragraph({
                  children: [new TextRun({
                    text: `${item.position || ''}${companyText}`,
                    bold: true,
                    size: 18,
                  })]
                }));
              }

              // Add dates if they exist
              if (item.startDate || item.endDate) {
                paragraphs.push(new Paragraph({
                  children: [new TextRun({
                    text: `${item.startDate || ''} - ${item.endDate || ''}`,
                    size: 16,
                    italics: true,
                  })]
                }));
              }

              // Add description if it exists
              if (item.description) {
                paragraphs.push(new Paragraph({
                  children: [new TextRun({
                    text: item.description,
                    size: 16,
                  })]
                }));
              }

              // Add degree and institution if they exist
              if (item.degree || item.institution) {
                const institutionText = item.institution ? ` at ${item.institution}` : '';
                paragraphs.push(new Paragraph({
                  children: [new TextRun({
                    text: `${item.degree || ''}${institutionText}`,
                    bold: true,
                    size: 18,
                  })]
                }));
              }

              // Add skills if they exist
              if (item.skills && Array.isArray(item.skills) && item.skills.length > 0) {
                paragraphs.push(new Paragraph({
                  children: [new TextRun({
                    text: `Skills: ${item.skills.join(', ')}`,
                    size: 16,
                  })]
                }));
              }

              // Add a blank paragraph at the end of each item
              paragraphs.push(new Paragraph(''));

              return paragraphs;
            }).flat(),
            new Paragraph('')
          ])
        ],
      }]
    });

    // Generate the buffer
    const buffer = await Packer.toBuffer(doc);

    // Send the buffer as a response
    res.setHeader('Content-Disposition', `attachment; filename="${fullName.replace(/\s+/g, '_')}_resume.docx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating document:', error);
    res.status(500).send('Error generating document');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;