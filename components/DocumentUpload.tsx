import React, { useState, useRef } from 'react';
import { Icons } from './Icons';
import { Button } from './Button';
import { parseDocument, validateDocumentFile } from '../services/documentParser';

interface DocumentUploadProps {
  onContentExtracted: (content: string) => void;
  onBack: () => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ onContentExtracted, onBack }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [extractedContent, setExtractedContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    setError('');
    setExtractedContent('');
    
    // Validate file
    const validation = validateDocumentFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setIsProcessing(true);
    setUploadedFileName(file.name);

    try {
      const content = await parseDocument(file);

      // Ensure content is a string and has content after trimming
      if (typeof content !== 'string' || !content || content.trim().length === 0) {
        throw new Error('No text content found in the document. Please ensure the file contains text.');
      }

      setExtractedContent(content);
      console.log('✅ Document parsed successfully:', content.substring(0, 100) + '...');
    } catch (err: any) {
      console.error('Error processing document:', err);
      setError(err.message || 'Failed to process document. Please try again.');
      setUploadedFileName('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    if (extractedContent) {
      onContentExtracted(extractedContent);
    }
  };

  const handleReset = () => {
    setExtractedContent('');
    setUploadedFileName('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 pt-6">
      <div className="flex items-center mb-8">
        <button 
          onClick={onBack} 
          className="mr-4 p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300"
        >
          <Icons.Back size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Upload Your Resume
        </h2>
      </div>

      {!extractedContent ? (
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`bg-white dark:bg-slate-900 rounded-3xl p-12 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border-2 border-dashed transition-all duration-300 ${
              isDragging
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-300 dark:border-slate-700'
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-6 rounded-2xl transition-all duration-300 ${
                isDragging 
                  ? 'bg-blue-100 dark:bg-blue-900/40 scale-110' 
                  : 'bg-slate-100 dark:bg-slate-800'
              }`}>
                <Icons.Upload size={48} className={isDragging ? 'text-blue-600' : 'text-slate-400'} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {isDragging ? 'Drop your file here' : 'Drag & drop your resume'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  or click to browse
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-[0.98] px-6 py-3 text-base bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 border border-transparent dark:bg-blue-600 dark:hover:bg-blue-500 dark:shadow-blue-900/30">
                  <Icons.Upload size={16} className="mr-2" />
                  Choose File
                </span>
              </label>

              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <span className="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-semibold">
                  PDF
                </span>
                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                  DOCX
                </span>
                <span className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                  TXT
                </span>
              </div>
            </div>
          </div>

          {/* Processing State */}
          {isProcessing && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-6 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="animate-spin">
                  <Icons.Sparkles size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    Processing {uploadedFileName}...
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Extracting text from your document
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 p-4 rounded-xl">
              <div className="flex items-start gap-3">
                <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
                <div>
                  <p className="font-semibold text-red-900 dark:text-red-100 mb-1">
                    Upload Failed
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
            <div className="flex items-start gap-3">
              <Icons.Shield size={20} className="text-slate-600 dark:text-slate-400 mt-0.5 shrink-0" />
              <div className="text-sm text-slate-700 dark:text-slate-300">
                <p className="font-semibold mb-1">Your privacy is protected</p>
                <p className="text-slate-600 dark:text-slate-400">
                  Your document is processed locally in your browser. We only extract the text content 
                  to help optimize your resume.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Preview Extracted Content */
        <div className="space-y-6">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-green-900 dark:text-green-100">
                  Document processed successfully!
                </p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {uploadedFileName} • {extractedContent.length} characters extracted
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Extracted Content
              </label>
              <button
                onClick={handleReset}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Upload Different File
              </button>
            </div>
            
            <textarea
              value={extractedContent}
              onChange={(e) => setExtractedContent(e.target.value)}
              className="w-full h-96 px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-blue-900/10 dark:focus:ring-blue-500/20 focus:border-blue-900 dark:focus:border-blue-500 outline-none transition-all resize-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed"
              placeholder="Extracted content will appear here..."
            />
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              You can edit the extracted content before proceeding to AI optimization.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={handleReset}
              className="flex-1"
            >
              <Icons.Back size={16} className="mr-2" />
              Upload Different File
            </Button>
            <Button
              onClick={handleContinue}
              className="flex-1"
            >
              Continue to AI Optimization
              <Icons.Back size={16} className="ml-2 -rotate-180" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
