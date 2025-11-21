import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { Button } from './Button';
import { createTemplateData } from '../services/docxProcessor';

interface TemplateDataEditorProps {
  resumeContent: string;
  onDataChange: (data: Record<string, any>) => void;
  onClose: () => void;
}

export const TemplateDataEditor: React.FC<TemplateDataEditorProps> = ({
  resumeContent,
  onDataChange,
  onClose
}) => {
  const [data, setData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<'basic' | 'sections'>('basic');

  useEffect(() => {
    const parsedData = createTemplateData(resumeContent);
    setData(parsedData);
    onDataChange(parsedData);
  }, [resumeContent]);

  const handleFieldChange = (field: string, value: any) => {
    const newData = { ...data, [field]: value };
    setData(newData);
    onDataChange(newData);
  };

  const handleArrayFieldChange = (field: string, index: number, value: string) => {
    const newArray = [...(data[field] || [])];
    newArray[index] = value;
    handleFieldChange(field, newArray);
  };

  const addArrayItem = (field: string) => {
    const newArray = [...(data[field] || []), ''];
    handleFieldChange(field, newArray);
  };

  const removeArrayItem = (field: string, index: number) => {
    const newArray = (data[field] || []).filter((_: any, i: number) => i !== index);
    handleFieldChange(field, newArray);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Edit Template Data
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review and customize the data that will be inserted into your DOCX template
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Icons.Back size={24} className="text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 dark:border-slate-800 px-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-3 px-4 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab('sections')}
              className={`py-3 px-4 font-semibold text-sm border-b-2 transition-colors ${
                activeTab === 'sections'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sections
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={data.name || ''}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={data.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={data.location || ''}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="New York, NY"
                />
              </div>

              {/* Profile Summary */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Profile Summary
                </label>
                <textarea
                  value={data.profile_summary || ''}
                  onChange={(e) => handleFieldChange('profile_summary', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Professional summary..."
                />
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-6">
              {/* Work Experience */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Work Experience
                  </label>
                  <button
                    onClick={() => addArrayItem('work_experience')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
                  >
                    <Icons.Sparkles size={14} className="mr-1" />
                    Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {(data.work_experience || []).map((item: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayFieldChange('work_experience', index, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        onClick={() => removeArrayItem('work_experience', index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Icons.Back size={16} className="rotate-180" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Education
                  </label>
                  <button
                    onClick={() => addArrayItem('education')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
                  >
                    <Icons.Sparkles size={14} className="mr-1" />
                    Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {(data.education || []).map((item: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayFieldChange('education', index, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        onClick={() => removeArrayItem('education', index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Icons.Back size={16} className="rotate-180" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Skills
                  </label>
                  <button
                    onClick={() => addArrayItem('skills')}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
                  >
                    <Icons.Sparkles size={14} className="mr-1" />
                    Add Item
                  </button>
                </div>
                <div className="space-y-2">
                  {(data.skills || []).map((item: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayFieldChange('skills', index, e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <button
                        onClick={() => removeArrayItem('skills', index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Icons.Back size={16} className="rotate-180" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            <Icons.User size={16} className="inline mr-2" />
            Data will be inserted into your selected template
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <Button onClick={onClose}>
              <Icons.CheckCircle size={16} className="mr-2" />
              Apply Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
