import React, { useState } from 'react';
import { ViewState, ResumeData, OptimizationMode } from '../types';
import { Icons } from '../components/Icons';
import { generateTemplatePDF } from '../services/templatePdfService';
import { ResumeTemplate } from '../types';

interface HistoryProps {
  setView: (view: ViewState) => void;
  resumes: ResumeData[];
  isPro: boolean;
  onPreviewResume?: (resume: ResumeData) => void;
  onEditResume?: (resume: ResumeData) => void;
}

export const History: React.FC<HistoryProps> = ({ setView, resumes, isPro, onPreviewResume, onEditResume }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handlePreview = (resume: ResumeData) => {
    if (onPreviewResume) {
      onPreviewResume(resume);
    }
  };

  const handleEdit = (resume: ResumeData) => {
    if (onEditResume) {
      onEditResume(resume);
    }
  };

  const handleDownload = async (resume: ResumeData) => {
    setDownloadingId(resume.id || null);
    try {
      const filename = `${resume.job_title || 'resume'}-${new Date().toISOString().split('T')[0]}.pdf`;
      const template = (resume.template_selected as ResumeTemplate) || ResumeTemplate.MODERN;
      await generateTemplatePDF(resume.enhanced_content, template, filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-md mx-auto pb-24 pt-6">
      <div className="flex items-center justify-between mb-8 px-4 md:px-0">
        <div className="flex items-center">
            <button onClick={() => setView(ViewState.HOME)} className="mr-4 p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300">
            <Icons.Back size={24} />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Resumes</h2>
        </div>
        <div>
           <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-blue-600 text-white border-2 border-slate-100 dark:border-slate-700 shadow-md flex items-center justify-center font-bold">
             JD
           </div>
        </div>
      </div>

      <div className="px-4 md:px-0">
        <div className="bg-slate-900 dark:bg-slate-800 text-white rounded-2xl p-4 mb-8 flex items-start space-x-3 shadow-lg shadow-slate-900/10 dark:shadow-black/30">
          <Icons.Crown className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
          <p className="text-sm font-medium leading-snug">
            {isPro ? 'You have unlimited history access.' : 'Pro users can access their last 10 saved resumes.'}
          </p>
        </div>

        <div className="space-y-4">
          {resumes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                 <Icons.FileText size={32} />
              </div>
              <h3 className="text-slate-900 dark:text-white font-semibold mb-1">No resumes yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Create your first 10/10 resume now</p>
            </div>
          )}

          {resumes.map((resume) => {
            const title = resume.job_title || 'Untitled Resume';
            const date = resume.generated_at 
              ? new Date(resume.generated_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'Unknown date';
            
            return (
            <div key={resume.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-black/20 hover:shadow-xl hover:shadow-slate-200/70 dark:hover:shadow-black/40 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{title}</h3>
                   <p className="text-xs text-slate-400 mt-1 font-medium uppercase tracking-wide">{date}</p>
                </div>
                {resume.enhancement_mode === OptimizationMode.POWER_BOOST && (
                  <span className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center border border-amber-100 dark:border-amber-800">
                    <Icons.Zap size={10} className="mr-1 fill-current" /> BOOSTED
                  </span>
                )}
              </div>
              
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-5 bg-slate-50 dark:bg-slate-800 px-3 py-2 rounded-lg">
                {resume.job_description_used ? (
                    <>
                        <Icons.Zap size={12} className="mr-2 text-teal-600 dark:text-teal-400" />
                        <span className="text-slate-600 dark:text-slate-300 font-medium">Tailored to Job Description</span>
                    </>
                ) : (
                    <>
                         <Icons.CheckCircle size={12} className="mr-2 text-blue-600 dark:text-blue-400" />
                         <span className="text-slate-600 dark:text-slate-300 font-medium">Standard Optimization</span>
                    </>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => handlePreview(resume)}
                  className="flex-1 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-800 dark:text-blue-200 py-2.5 rounded-xl text-sm font-bold transition-colors"
                >
                  Preview
                </button>
                <button 
                  onClick={() => handleDownload(resume)}
                  disabled={downloadingId === resume.id}
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {downloadingId === resume.id ? (
                    <>
                      <Icons.Download size={14} className="mr-1 animate-bounce" />
                      Downloading...
                    </>
                  ) : (
                    'Download'
                  )}
                </button>
                <button 
                  onClick={() => handleEdit(resume)}
                  className="w-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl transition-colors hover:text-blue-600 dark:hover:text-blue-400"
                  title="Edit Resume"
                >
                  <Icons.PenTool size={16} />
                </button>
              </div>
            </div>
            );
          })}
        </div>

        {!isPro && (
          <button 
            onClick={() => setView(ViewState.UPGRADE)}
            className="w-full mt-8 bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-900/20 dark:shadow-blue-900/20 hover:bg-slate-800 dark:hover:bg-blue-500 transition-all flex items-center justify-center"
          >
            <Icons.Crown size={18} className="mr-2 text-amber-400" />
            Upgrade to Pro
          </button>
        )}
      </div>
    </div>
  );
};
