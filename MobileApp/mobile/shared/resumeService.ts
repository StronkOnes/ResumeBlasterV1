import { ResumeData } from './types';

// Pure logic: Build the payload your server expects. No DOM or window.
export const buildPayloadForResume = (resumeData: ResumeData): any => {
  return {
    fullName: resumeData.fullName,
    email: resumeData.email,
    sections: resumeData.sections
  };
};