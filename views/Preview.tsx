import React, { useRef, useState } from 'react';
import { ViewState, ResumeData } from '../types';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';
import { TemplateDataEditor } from '../components/TemplateDataEditor';
import { updateResume } from '../services/resumeService';
import { generateTemplatePDFFromElement } from '../services/templatePdfService';
import { generateDocxResume } from '../services/docxProcessor';
import { ResumeTemplate } from '../types';

interface PreviewProps {
  setView: (view: ViewState) => void;
  content: string;
  resumeData: ResumeData | null;
  onSaveSuccess?: (resume: ResumeData) => void;
}

export const Preview: React.FC<PreviewProps> = ({ setView, content, resumeData, onSaveSuccess }) => {
  const resumeContentRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [templateData, setTemplateData] = useState<Record<string, any>>({});
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);

  const handleSave = async () => {
    if (!resumeData) {
      setSaveMessage('No resume data to save');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    if (resumeData.id) {
      // Already saved, just show confirmation
      setSaveMessage('Resume already saved!');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    // If somehow we have resume data but no ID, this shouldn't happen
    // as the save happens in App.tsx, but we can handle it gracefully
    setSaveMessage('Resume is being saved...');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleSaveAndFinish = async () => {
    if (resumeData?.id) {
      // Already saved, just navigate to history
      setView(ViewState.HISTORY);
    } else {
      // Show message that it's already saved and navigate
      setSaveMessage('Resume saved successfully!');
      setTimeout(() => {
        setSaveMessage('');
        setView(ViewState.HISTORY);
      }, 1500);
    }
  };

  const handleDownloadDocx = async () => {
    if (!content || !resumeData) return;

    setIsDownloadingDocx(true);
    try {
      const template = (resumeData?.template_selected as ResumeTemplate) || ResumeTemplate.MODERN;
      const jobTitle = resumeData?.job_title || 'resume';
      
      await generateDocxResume(template, content, jobTitle);
      
      setSaveMessage('DOCX downloaded successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error downloading DOCX:', error);
      setSaveMessage('Failed to download DOCX. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (resumeContentRef.current) {
      const filename = resumeData?.job_title 
        ? `${resumeData.job_title}-resume-${new Date().toISOString().split('T')[0]}.pdf`
        : `resume-${new Date().toISOString().split('T')[0]}.pdf`;
      
      const template = (resumeData?.template_selected as ResumeTemplate) || ResumeTemplate.MODERN;
      await generateTemplatePDFFromElement(resumeContentRef.current, template, filename);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 min-h-screen flex flex-col">
      <div className="flex items-center justify-between py-6 px-4 md:px-0 sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50 transition-colors">
        <div className="flex items-center">
          <button onClick={() => setView(ViewState.EDITOR)} className="mr-4 p-2 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm rounded-full transition-all text-slate-600 dark:text-slate-300">
            <Icons.Back size={24} />
          </button>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Resume</h2>
        </div>
        <div className="flex space-x-3">
           <Button 
             variant="outline" 
             className="!px-3 !py-2 text-xs rounded-lg" 
             onClick={handleDownloadDocx}
             isLoading={isDownloadingDocx}
           >
              <Icons.FileText size={16} className="mr-1" />
              DOCX
           </Button>
           <Button 
             variant="outline" 
             className="!px-3 !py-2 text-xs rounded-lg" 
             onClick={handleDownloadPdf}
           >
              <Icons.Download size={16} className="mr-1" />
              PDF
           </Button>
           <button
             onClick={() => setShowTemplateEditor(true)}
             className="px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center"
             title="Edit Template Data"
           >
             <Icons.PenTool size={16} className="mr-1" />
             Edit Data
           </button>
           <Button 
             className="!px-4 !py-2 text-sm rounded-lg" 
             onClick={handleSave}
             isLoading={isSaving}
           >
             {resumeData?.id ? 'Saved ✓' : 'Save'}
           </Button>
        </div>
      </div>

      <div className="flex-grow px-4 md:px-0 pb-8 pt-6">
        <div ref={resumeContentRef} className="bg-white shadow-2xl shadow-slate-200/60 dark:shadow-black/40 rounded-lg min-h-[800px] p-8 md:p-16 border border-slate-100 dark:border-slate-800 print:shadow-none transition-colors">
            {/* Resume content intentionally kept light/white paper-like for readability and realism */}
            <div className="max-w-none text-slate-900 dark:text-slate-100">
              {/* Plain text rendering - no markdown formatting */}
              {content.split('\n').map((line, i) => {
                // Remove any markdown formatting characters but preserve the text
                const cleanLine = line
                  .replace(/^#+\s*/, '')      // Remove #, ##, ### headers
                  .replace(/^-/, '')          // Remove list markers
                  .replace(/^\s*[-*]\s*/, '') // Remove other list markers
                  .trim();

                if (cleanLine === '') return <div key={i} className="h-2 block"></div>;
                return <p key={i} className="mb-3 leading-relaxed text-black dark:text-white">{cleanLine}</p>;
              })}
            </div>
        </div>
      </div>
      
      {saveMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {saveMessage}
        </div>
      )}

      {showTemplateEditor && (
        <TemplateDataEditor
          resumeContent={content}
          onDataChange={setTemplateData}
          onClose={() => setShowTemplateEditor(false)}
        />
      )}
      
      <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 md:rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] transition-colors">
        <Button fullWidth onClick={handleSaveAndFinish} size="lg" isLoading={isSaving}>
           {resumeData?.id ? 'Go to History' : 'Save to History & Finish'}
        </Button>
      </div>
    </div>
  );
};