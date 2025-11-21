import React, { useState } from 'react';
import { ViewState, OptimizationMode } from '../types';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';
import { generateResumeContent } from '../services/aiService';

interface EditorProps {
  setView: (view: ViewState) => void;
  setGeneratedResume: (originalContent: string, enhancedContent: string, mode: OptimizationMode, jobDescription?: string, jobTitle?: string) => void;
  initialJobMode?: boolean;
}

export const Editor: React.FC<EditorProps> = ({ setView, setGeneratedResume, initialJobMode = false }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [content, setContent] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [mode, setMode] = useState<OptimizationMode>(OptimizationMode.NO_HALLUCINATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!content.trim()) {
      setError("Please enter some resume content or upload a file.");
      return;
    }
    if (initialJobMode && !jobDesc.trim()) {
      setError("Please provide a job description to tailor against.");
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await generateResumeContent(
        content, 
        mode, 
        initialJobMode ? jobDesc : undefined,
        jobTitle
      );
      setGeneratedResume(content, result, mode, initialJobMode ? jobDesc : undefined, jobTitle);
      setView(ViewState.PREVIEW);
    } catch (err) {
      setError("Failed to generate resume. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto pb-24 pt-6">
      <div className="flex items-center mb-8">
        <button onClick={() => setView(ViewState.HOME)} className="mr-4 p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300">
          <Icons.Back size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {initialJobMode ? 'Tailor to Job' : 'Resume Builder'}
        </h2>
      </div>

      <div className="space-y-6">
        {/* Input Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-800 space-y-5 transition-colors">
           <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
              Desired Job Title <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
              placeholder="e.g. Senior Product Manager"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
              Resume Content
            </label>
            <div className="relative">
              <textarea 
                className="w-full h-56 px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all resize-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed placeholder-slate-400"
                placeholder="Paste your current resume text here, or type your work history..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              {content.length === 0 && (
                 <div className="absolute top-4 right-4">
                    <label className="flex items-center space-x-2 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors border border-blue-100 dark:border-blue-800 shadow-sm">
                      <Icons.Upload size={14} />
                      <span>Upload File</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".txt,.md"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => setContent(ev.target?.result as string);
                            reader.readAsText(file);
                          }
                        }}
                      />
                    </label>
                 </div>
              )}
            </div>
          </div>

          {initialJobMode && (
            <div className="animate-fade-in">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                Job Description
              </label>
              <textarea 
                className="w-full h-32 px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all resize-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed placeholder-slate-400"
                placeholder="Paste the job description here..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Mode Selection */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-md shadow-slate-200/40 dark:shadow-black/30 border border-slate-100 dark:border-slate-800 flex">
          <button 
            className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${mode === OptimizationMode.NO_HALLUCINATIONS ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg shadow-slate-900/20 dark:shadow-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            onClick={() => setMode(OptimizationMode.NO_HALLUCINATIONS)}
          >
            <Icons.Shield size={16} />
            <span>Strict Mode</span>
          </button>
          <button 
            className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${mode === OptimizationMode.POWER_BOOST ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg shadow-slate-900/20 dark:shadow-blue-900/30' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
            onClick={() => setMode(OptimizationMode.POWER_BOOST)}
          >
            <Icons.Sparkles size={16} />
            <span>Power Boost</span>
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl text-xs text-blue-800 dark:text-blue-200 leading-relaxed flex items-start gap-3">
           <Icons.User size={16} className="mt-0.5 shrink-0 opacity-70" />
           {mode === OptimizationMode.NO_HALLUCINATIONS 
            ? "Strict Mode: Optimizes grammar, structure, and phrasing based ONLY on provided info. Perfect for maintaining factual accuracy."
            : "Power Boost: Infers industry-standard skills and achievements based on your job title to create a 'perfect' candidate profile. Use with discretion."}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm flex items-center border border-red-100 dark:border-red-800">
            <span className="mr-2">⚠️</span> {error}
          </div>
        )}

        <Button 
          fullWidth 
          size="lg" 
          onClick={handleGenerate}
          isLoading={isLoading}
        >
          {initialJobMode ? 'Tailor & Optimize Resume' : 'Enhance & Optimize to 10/10'}
        </Button>
      </div>
    </div>
  );
};