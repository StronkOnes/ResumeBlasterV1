import React, { useState, useEffect } from 'react';
import { ViewState, OptimizationMode, ResumeTemplate, ResumeData } from '../types';
import { Icons } from '../components/Icons';
import { Button } from '../components/Button';
import { TemplateSelector } from '../components/TemplateSelector';
import { generateResumeContent } from '../services/aiService';
import { updateResume } from '../services/resumeService';

interface EditResumeProps {
  setView: (view: ViewState) => void;
  resume: ResumeData;
  onSaveSuccess: (updatedResume: ResumeData) => void;
}

export const EditResume: React.FC<EditResumeProps> = ({ setView, resume, onSaveSuccess }) => {
  const [jobTitle, setJobTitle] = useState(resume.job_title || '');
  const [content, setContent] = useState(resume.original_content);
  const [enhancedContent, setEnhancedContent] = useState(resume.enhanced_content);
  const [jobDesc, setJobDesc] = useState(resume.job_description_used || '');
  const [mode, setMode] = useState<OptimizationMode>(resume.enhancement_mode);
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>(
    (resume.template_selected as ResumeTemplate) || ResumeTemplate.MODERN
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState<'original' | 'enhanced'>('original');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setHasChanges(
      content !== resume.original_content ||
      enhancedContent !== resume.enhanced_content ||
      jobTitle !== (resume.job_title || '') ||
      jobDesc !== (resume.job_description_used || '') ||
      mode !== resume.enhancement_mode ||
      selectedTemplate !== resume.template_selected
    );
  }, [content, enhancedContent, jobTitle, jobDesc, mode, selectedTemplate, resume]);

  const handleRegenerate = async () => {
    if (!content.trim()) {
      setError("Please enter some resume content.");
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await generateResumeContent(
        content, 
        mode,
        selectedTemplate,
        jobDesc || undefined,
        jobTitle
      );
      setEnhancedContent(result);
      setHasChanges(true);
    } catch (err) {
      setError("Failed to regenerate resume. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!resume.id) {
      setError("Cannot save: Resume ID is missing.");
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const updates: Partial<ResumeData> = {
        job_title: jobTitle,
        original_content: content,
        enhanced_content: enhancedContent,
        enhancement_mode: mode,
        template_selected: selectedTemplate,
        job_description_used: jobDesc || undefined,
      };

      const updatedResume = await updateResume(resume.id, updates);
      
      if (updatedResume) {
        onSaveSuccess(updatedResume);
        setHasChanges(false);
        // Show success message briefly then go back
        setTimeout(() => {
          setView(ViewState.HISTORY);
        }, 1000);
      } else {
        setError("Failed to save changes. Please try again.");
      }
    } catch (err) {
      setError("Failed to save changes. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 pt-6 px-4">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={() => setView(ViewState.HISTORY)} 
            className="mr-4 p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300"
          >
            <Icons.Back size={24} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Edit Resume
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {resume.job_title || 'Untitled Resume'}
            </p>
          </div>
        </div>
        {hasChanges && (
          <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs px-3 py-1.5 rounded-full font-semibold">
            Unsaved Changes
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Edit Controls */}
        <div className="space-y-6">
          {/* Edit Mode Toggle */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-1.5 shadow-md border border-slate-200 dark:border-slate-800 flex">
            <button 
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                editMode === 'original' 
                  ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              onClick={() => setEditMode('original')}
            >
              Edit Original
            </button>
            <button 
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
                editMode === 'enhanced' 
                  ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
              onClick={() => setEditMode('enhanced')}
            >
              Edit Enhanced
            </button>
          </div>

          {/* Job Title */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Job Title
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
              placeholder="e.g. Senior Product Manager"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          {/* Content Editor */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              {editMode === 'original' ? 'Original Content' : 'Enhanced Content'}
            </label>
            <textarea 
              className="w-full h-96 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-mono"
              value={editMode === 'original' ? content : enhancedContent}
              onChange={(e) => editMode === 'original' ? setContent(e.target.value) : setEnhancedContent(e.target.value)}
            />
          </div>

          {/* Job Description */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Job Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea 
              className="w-full h-32 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed"
              placeholder="Paste job description to tailor resume..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column - Settings & Actions */}
        <div className="space-y-6">
          {/* Template Selection */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800">
            <TemplateSelector 
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
          </div>

          {/* Mode Selection */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              Enhancement Mode
            </h3>
            <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-1.5 flex">
              <button 
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  mode === OptimizationMode.NO_HALLUCINATIONS 
                    ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => setMode(OptimizationMode.NO_HALLUCINATIONS)}
              >
                <Icons.Shield size={14} />
                <span>Strict</span>
              </button>
              <button 
                className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  mode === OptimizationMode.POWER_BOOST 
                    ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                onClick={() => setMode(OptimizationMode.POWER_BOOST)}
              >
                <Icons.Sparkles size={14} />
                <span>Boost</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              fullWidth 
              onClick={handleRegenerate}
              isLoading={isLoading}
              variant="outline"
            >
              <Icons.Sparkles size={16} className="mr-2" />
              Regenerate with AI
            </Button>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl text-sm flex items-center border border-red-100 dark:border-red-800">
                <span className="mr-2">⚠️</span> {error}
              </div>
            )}

            {isSaving && (
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 px-4 py-3 rounded-xl text-sm flex items-center border border-blue-100 dark:border-blue-800">
                <Icons.Download size={16} className="mr-2 animate-spin" />
                Saving changes...
              </div>
            )}

            <Button 
              fullWidth 
              size="lg"
              onClick={handleSave}
              isLoading={isSaving}
              disabled={!hasChanges}
            >
              <Icons.CheckCircle size={18} className="mr-2" />
              Save Changes
            </Button>

            <button
              onClick={() => setView(ViewState.HISTORY)}
              className="w-full py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl">
            <div className="flex items-start space-x-3">
              <Icons.User size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                  Editing Tips
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-200 space-y-1">
                  <li>• Edit original content and regenerate with AI</li>
                  <li>• Or directly edit the enhanced version</li>
                  <li>• Change template or mode anytime</li>
                  <li>• All changes are saved to your history</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
