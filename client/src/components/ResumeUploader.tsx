"use client";

import React, { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResumeUploaderProps {
  onParseComplete: (data: { skills: string[], technologies: string[], projects: any[] }) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onParseComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/resume/parse`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!res.ok) throw new Error('Failed to parse resume');
      const data = await res.json();
      
      setSuccess(true);
      setTimeout(() => {
        onParseComplete(data);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError('Could not parse resume. Please ensure it is a PDF or Text file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative group">
        <input
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileChange}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
        />
        
        <div className={`p-12 border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center gap-4 ${
          isUploading ? 'bg-white/5 border-indigo-500/50' : 
          success ? 'bg-emerald-500/5 border-emerald-500/50' :
          error ? 'bg-rose-500/5 border-rose-500/50' :
          'bg-white/5 border-white/10 group-hover:border-white/30 group-hover:bg-white/[0.07]'
        }`}>
          <div className={`p-4 rounded-2xl ${
            success ? 'bg-emerald-500 text-white' : 
            error ? 'bg-rose-500 text-white' : 
            'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20'
          }`}>
            {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : 
             success ? <CheckCircle2 className="w-8 h-8" /> :
             error ? <AlertCircle className="w-8 h-8" /> :
             <Upload className="w-8 h-8" />}
          </div>
          
          <div className="text-center">
            <p className="text-xl font-bold text-white mb-1">
              {isUploading ? "Parsing Resume..." : 
               success ? "Resume Parsed!" :
               error ? "Upload Failed" :
               "Upload Your Resume"}
            </p>
            <p className="text-slate-400 text-sm">
              {fileName || "Drag and drop or click to browse (PDF, TXT)"}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-rose-400 text-center text-sm font-medium flex items-center justify-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeUploader;
