import { ResumeTemplate, TemplateInfo } from '../types';

export const RESUME_TEMPLATES: TemplateInfo[] = [
  {
    id: ResumeTemplate.MODERN,
    name: 'Modern',
    description: 'Clean, minimalist design with bold headings and accent colors. Perfect for tech and creative roles.',
    preview: '/templates/modern-preview.png',
    docxPath: '/Templates/Document 1.docx'
  },
  {
    id: ResumeTemplate.CLASSIC,
    name: 'Classic',
    description: 'Traditional, professional layout with serif fonts. Ideal for corporate and formal positions.',
    preview: '/templates/classic-preview.png',
    docxPath: '/Templates/Document 2.docx'
  },
  {
    id: ResumeTemplate.EXECUTIVE,
    name: 'Executive',
    description: 'Sophisticated design with subtle shading and prominent achievements. Best for senior-level roles.',
    preview: '/templates/executive-preview.png',
    docxPath: '/Templates/Document 3.docx'
  }
];

export const getTemplateInfo = (templateId: ResumeTemplate): TemplateInfo | undefined => {
  return RESUME_TEMPLATES.find(t => t.id === templateId);
};

export const getTemplatePromptInstructions = (templateId: ResumeTemplate): string => {
  switch (templateId) {
    case ResumeTemplate.MODERN:
      return `
        MODERN TEMPLATE FORMATTING:
        - Use large, bold headings with clear hierarchy (# for name, ## for sections, ### for subsections)
        - Separate sections with visual breaks
        - Highlight key achievements in callout/quote blocks
        - Use bullet points extensively for readability
        - Keep design minimalistic and clean
        - Use one accent color for emphasis (blue recommended)
      `;
    case ResumeTemplate.CLASSIC:
      return `
        CLASSIC TEMPLATE FORMATTING:
        - Use traditional section headers with underlines
        - Maintain formal, professional tone throughout
        - Use serif-style formatting cues
        - Keep layout conservative and structured
        - Emphasize experience chronologically
        - Use subtle formatting, avoid excessive styling
      `;
    case ResumeTemplate.EXECUTIVE:
      return `
        EXECUTIVE TEMPLATE FORMATTING:
        - Use ALL CAPS for job titles and section headers
        - Highlight key metrics and achievements prominently
        - Include executive summary at the top
        - Use subtle shading for section separation
        - Emphasize leadership and strategic impact
        - Keep contact info prominent and professional
      `;
    default:
      return '';
  }
};
