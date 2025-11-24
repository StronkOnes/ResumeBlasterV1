import React from 'react';
import { Icons } from './Icons';

export type InputMethod = 'wizard' | 'upload';

interface MethodSelectorProps {
  onSelectMethod: (method: InputMethod) => void;
}

export const MethodSelector: React.FC<MethodSelectorProps> = ({ onSelectMethod }) => {
  return (
    <div className="max-w-4xl mx-auto pb-24 pt-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          How would you like to create your resume?
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Choose the method that works best for you
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create from Scratch Option */}
        <button
          onClick={() => onSelectMethod('wizard')}
          className="group bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 text-left hover:scale-105 hover:shadow-2xl"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Icons.User size={48} className="text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Create from Scratch
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Use our step-by-step wizard to build your resume from the ground up. 
                Perfect if you're starting fresh or want guided assistance.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                Step-by-step
              </span>
              <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                Guided
              </span>
              <span className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                Easy
              </span>
            </div>

            <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
              <span>Get Started</span>
              <Icons.Back className="ml-2 -rotate-180" size={20} />
            </div>
          </div>
        </button>

        {/* Upload Document Option */}
        <button
          onClick={() => onSelectMethod('upload')}
          className="group bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border-2 border-slate-100 dark:border-slate-800 hover:border-green-500 dark:hover:border-green-500 transition-all duration-300 text-left hover:scale-105 hover:shadow-2xl"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Icons.Upload size={48} className="text-white" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Upload Document
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Already have a resume? Upload your existing document and we'll 
                optimize it for you. Supports PDF, DOCX, and TXT files.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <span className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                PDF
              </span>
              <span className="px-3 py-1 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-xs font-semibold">
                DOCX
              </span>
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                TXT
              </span>
            </div>

            <div className="flex items-center text-green-600 dark:text-green-400 font-semibold group-hover:translate-x-2 transition-transform">
              <span>Upload File</span>
              <Icons.Back className="ml-2 -rotate-180" size={20} />
            </div>
          </div>
        </button>
      </div>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <Icons.Sparkles size={20} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-semibold mb-1">Both methods lead to AI optimization!</p>
            <p className="text-blue-700 dark:text-blue-300">
              After entering your information, you'll be able to enhance your resume with our AI-powered 
              optimization tools to create a perfect 10/10 resume.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
