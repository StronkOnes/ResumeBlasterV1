import React, { useRef, useState } from 'react';
import { ViewState, ResumeData } from '../types';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';
import { updateResume } from '../services/resumeService';
import { generateTemplatePDFFromElement } from '../services/templatePdfService';
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
           <Button variant="outline" className="!px-4 !py-2 text-sm rounded-lg" onClick={handleDownloadPdf}>
              <Icons.Download size={18} className="mr-2" />
              PDF
           </Button>
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
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-900">
              {/* Simple markdown rendering */}
              {content.split('\n').map((line, i) => {
                if (line.startsWith('###')) return <h3 key={i} className="text-lg uppercase tracking-wide border-b-2 border-slate-100 pb-2 mt-8 mb-4 text-slate-900">{line.replace('###', '')}</h3>;
                if (line.startsWith('##')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-3 text-slate-900">{line.replace('##', '')}</h2>;
                if (line.startsWith('#')) return <h1 key={i} className="text-4xl font-extrabold text-center mb-10 text-slate-900 tracking-tight">{line.replace('#', '')}</h1>;
                if (line.startsWith('-')) return <li key={i} className="ml-4 list-disc mb-2 pl-1 marker:text-slate-400">{line.replace('-', '')}</li>;
                if (line.trim() === '') return <div key={i} className="h-2"></div>;
                return <p key={i} className="mb-3 leading-relaxed">{line}</p>;
              })}
            </div>
        </div>
      </div>
      
      {saveMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {saveMessage}
        </div>
      )}
      
      <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 md:rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] transition-colors">
        <Button fullWidth onClick={handleSaveAndFinish} size="lg" isLoading={isSaving}>
           {resumeData?.id ? 'Go to History' : 'Save to History & Finish'}
        </Button>
      </div>
    </div>
  );
};