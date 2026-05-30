"use client";

import React, { useState } from 'react';
import { Upload, Loader2, CheckCircle2, AlertCircle, FileText, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBaseUrl } from '@/lib/api';

interface ResumeUploaderProps {
  onParseComplete: (data: any) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onParseComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setFileName(file.name);
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch(`${getBaseUrl()}/api/resume/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to parse resume');
      }
      
      const data = await res.json();
      
      setSuccess(true);
      setTimeout(() => {
        onParseComplete(data);
      }, 1000);
    } catch (err: any) {
      console.warn('Resume upload error:', err.message || err);
      setError(err.message || 'An error occurred while uploading your resume.');
      setSuccess(false);
      setFileName(null);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFileName(null);
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div 
        className={`relative group rounded-[2rem] transition-all duration-300 ${isDragActive ? 'scale-[1.02]' : 'scale-100'}`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        
        <div className={`p-16 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center gap-6 backdrop-blur-xl ${
          isDragActive ? 'bg-primary/5 border-primary shadow-xl shadow-primary/20' :
          isUploading ? 'bg-white/50 border-primary/50' : 
          success ? 'bg-emerald-50 border-emerald-500/50' :
          error ? 'bg-rose-50 border-rose-500/50' :
          'bg-white/40 border-slate-300 hover:border-primary hover:bg-white/60 hover:shadow-lg transition-all duration-300'
        }`}>
          <motion.div 
            animate={{ y: isDragActive ? -10 : 0 }}
            className={`p-6 rounded-3xl ${
              success ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30' : 
              error ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/30' : 
              'bg-gradient-to-br from-primary to-secondary text-white shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform duration-300'
            }`}
          >
            {isUploading ? <Loader2 className="w-10 h-10 animate-spin" /> : 
             success ? <CheckCircle2 className="w-10 h-10" /> :
             error ? <AlertCircle className="w-10 h-10" /> :
             <Upload className="w-10 h-10" />}
          </motion.div>
          
          <div className="text-center z-30">
            <h3 className={`text-2xl font-bold mb-2 ${
              success ? 'text-emerald-600' :
              error ? 'text-rose-600' :
              'text-slate-900 group-hover:text-primary transition-colors'
            }`}>
              {isUploading ? "Analyzing your profile..." : 
               success ? "Analysis Complete!" :
               error ? "Upload Failed" :
               "Drag & Drop your resume here"}
            </h3>
            
            {!fileName && !isUploading && !success && (
              <p className="text-slate-500 text-base font-medium">
                Supports PDF, DOC, DOCX, TXT (Max 5MB)
              </p>
            )}

            {fileName && (
              <div className="mt-4 flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                <File className="w-5 h-5 text-primary" />
                <span className="text-slate-700 font-medium truncate max-w-[200px]">{fileName}</span>
                {error && (
                  <button onClick={removeFile} className="text-slate-400 hover:text-rose-500 transition-colors z-30 relative ml-2">
                    &times;
                  </button>
                )}
              </div>
            )}
            
            {!isUploading && !success && !error && (
              <div className="mt-6 flex items-center gap-4 w-full justify-center opacity-70">
                <div className="h-[1px] w-12 bg-slate-300"></div>
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">OR</span>
                <div className="h-[1px] w-12 bg-slate-300"></div>
              </div>
            )}
            
            {!isUploading && !success && !error && (
              <button className="mt-6 px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all z-30 relative pointer-events-none group-hover:bg-primary">
                Browse Files
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 bg-rose-50 rounded-xl text-rose-600 text-sm font-semibold flex items-center justify-center gap-2 border border-rose-100 shadow-sm"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeUploader;

