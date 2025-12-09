import { ResumeTemplate } from '../types';

export const getTemplatePromptInstructions = (template: ResumeTemplate): string => {
  switch (template) {
    case ResumeTemplate.MODERN:
      return "Apply modern resume design principles: clean layout, strategic white space, impact-focused bullet points, quantified achievements.";
    case ResumeTemplate.CLASSIC:
      return "Apply classic resume design principles: traditional structure, conservative formatting, standard sections, formal language.";
    case ResumeTemplate.EXECUTIVE:
      return "Apply executive resume design principles: leadership-focused language, high-level achievements, strategic impact, senior-level terminology.";
    default:
      return "Apply modern resume design principles: clean layout, strategic white space, impact-focused bullet points, quantified achievements.";
  }
};