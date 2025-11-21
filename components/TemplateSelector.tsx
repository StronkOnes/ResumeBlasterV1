import React from 'react';
import { ResumeTemplate } from '../types';
import { RESUME_TEMPLATES } from '../constants/templates';
import { Icons } from './Icons';

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onSelectTemplate: (template: ResumeTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  selectedTemplate, 
  onSelectTemplate 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Choose Your Template</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">Select a visual style for your resume</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RESUME_TEMPLATES.map((template) => {
          const isSelected = selectedTemplate === template.id;
          
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`relative group rounded-xl border-2 p-4 transition-all text-left ${
                isSelected
                  ? 'border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-200/50 dark:shadow-blue-900/30'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
              }`}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Icons.CheckCircle size={16} className="text-white" />
                </div>
              )}

              {/* Template Preview Placeholder */}
              <div className={`w-full h-40 rounded-lg mb-3 flex items-center justify-center ${
                isSelected 
                  ? 'bg-blue-100 dark:bg-blue-900/30' 
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}>
                <Icons.FileText size={48} className={
                  isSelected 
                    ? 'text-blue-500 dark:text-blue-400' 
                    : 'text-slate-400 dark:text-slate-500'
                } />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    isSelected 
                      ? 'text-blue-600 dark:text-blue-300' 
                      : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {template.name}
                  </span>
                </div>
              </div>

              {/* Template Info */}
              <div>
                <h4 className={`font-bold mb-1 ${
                  isSelected 
                    ? 'text-blue-900 dark:text-blue-100' 
                    : 'text-slate-900 dark:text-white'
                }`}>
                  {template.name}
                </h4>
                <p className={`text-xs leading-relaxed ${
                  isSelected 
                    ? 'text-blue-700 dark:text-blue-200' 
                    : 'text-slate-600 dark:text-slate-400'
                }`}>
                  {template.description}
                </p>
              </div>

              {/* Hover Effect */}
              {!isSelected && (
                <div className="absolute inset-0 rounded-xl bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Template Features */}
      <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
        <div className="flex items-start space-x-3">
          <Icons.Sparkles size={18} className="text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
              AI-Powered Formatting
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Our AI will automatically format your resume to match the selected template's style, 
              ensuring professional presentation and visual impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
