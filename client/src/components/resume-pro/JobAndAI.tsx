"use client";

import React, { useState } from 'react';
import { Target, Search, CheckCircle2, ChevronRight, Copy, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const JobDescriptionMatcher = () => {
  const [jd, setJd] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = () => {
    if (!jd.trim()) return;
    setAnalyzing(true);
    // Mock analysis delay
    setTimeout(() => {
      setResult({
        match: 76,
        missingSkills: ['Kubernetes', 'CI/CD Pipeline', 'GraphQL'],
        probability: 'High'
      });
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" /> Job Description Matcher
      </h3>
      <p className="text-sm text-slate-500 mb-4">Paste a job description to see how well your resume matches.</p>

      {!result ? (
        <div className="space-y-4">
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste Job Description here..."
            className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
          />
          <button
            onClick={handleAnalyze}
            disabled={!jd.trim() || analyzing}
            className="w-full py-3 bg-slate-900 hover:bg-primary text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing Match...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" /> Calculate Match Score
              </span>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Match Score</p>
              <p className="text-3xl font-black text-slate-900">{result.match}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">ATS Probability</p>
              <p className="text-xl font-bold text-emerald-600">{result.probability}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
              Missing Required Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.missingSkills.map((skill: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <button 
            onClick={() => {setResult(null); setJd('');}}
            className="text-sm font-bold text-primary hover:text-indigo-700 flex items-center gap-1"
          >
            Try another job description <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export const AIImprovements = ({ data }: { data: any }) => {
  const [copied, setCopied] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" /> AI Generated Improvements
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3">Suggested Summary</h4>
          <div className="relative group">
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-indigo-900 text-sm leading-relaxed pr-12">
              {data.summary}
            </div>
            <button 
              onClick={() => copyToClipboard(data.summary, -1)}
              className="absolute top-3 right-3 p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
            >
              {copied === -1 ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3">Better Experience Bullet Points</h4>
          <div className="space-y-3">
            {data.experienceBullets.map((bullet: string, i: number) => (
              <div key={i} className="relative group flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 text-sm leading-relaxed flex-1 pr-12">
                  {bullet}
                </div>
                <button 
                  onClick={() => copyToClipboard(bullet, i)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-slate-500 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                >
                  {copied === i ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
