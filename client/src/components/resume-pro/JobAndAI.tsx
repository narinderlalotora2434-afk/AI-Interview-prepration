// FILE: JobAndAI.tsx | JD-aware ATS scoring system
"use client";

import React, { useState } from 'react';
import { Target, Search, CheckCircle2, ChevronRight, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';
import { getBaseUrl } from "@/lib/api";
import { parseJobDescription, DOMAIN_CONFIGS, JDAnalysis } from './domainConfig';

interface Props {
  onJDAnalyzed: (jdText: string) => void;
}

export const JobDescriptionMatcher = ({ onJDAnalyzed }: Props) => {
  const [jd, setJd] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [localResult, setLocalResult] = useState<JDAnalysis | null>(null);

  const handleAnalyze = () => {
    if (!jd.trim()) return;
    setAnalyzing(true);
    
    // Parse JD client-side immediately (no API needed)
    setTimeout(() => {
      const parsed = parseJobDescription(jd);
      setLocalResult(parsed);
      onJDAnalyzed(jd); // triggers parent score recalculation
      setAnalyzing(false);
    }, 800); // small delay for UX feel
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" /> Job Description Matcher
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        Paste a job description — all scores will update to reflect your match against this specific role.
      </p>

      {!localResult ? (
        <div className="space-y-4">
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm font-medium"
          />
          <div className="text-xs text-slate-400 font-medium">
            Tip: Include the full JD with requirements section for best results
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!jd.trim() || analyzing}
            className="w-full py-3 bg-slate-900 hover:bg-primary text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing JD...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search className="w-4 h-4" /> Analyze & Update Scores
              </span>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          
          {/* JD Active Notice */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0"/>
            <p className="text-xs font-bold text-emerald-700">
              All ATS scores updated to reflect this job description
            </p>
          </div>

          {/* Domain detected */}
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {DOMAIN_CONFIGS[localResult.detectedDomain].icon}
            </span>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                Role Domain Detected
              </p>
              <p className="font-bold text-slate-800">
                {DOMAIN_CONFIGS[localResult.detectedDomain].label}
              </p>
            </div>
          </div>

          {/* Requirements */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                Experience
              </p>
              <p className="text-sm font-bold text-slate-800">
                {localResult.experienceRequired}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
                Education
              </p>
              <p className="text-sm font-bold text-slate-800">
                {localResult.educationRequired}
              </p>
            </div>
          </div>

          {/* Required Skills from JD */}
          {localResult.requiredSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Required Skills in JD ({localResult.requiredSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {localResult.requiredSkills.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Preferred Skills from JD */}
          {localResult.preferredSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Preferred Skills in JD ({localResult.preferredSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {localResult.preferredSkills.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-amber-50 border border-amber-100 text-amber-700 rounded-lg text-xs font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => { setLocalResult(null); setJd(''); }}
            className="text-sm font-bold text-primary hover:text-indigo-700 flex items-center gap-1"
          >
            Try a different job description 
            <ChevronRight className="w-4 h-4" />
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
            {data.experienceBullets?.map((bullet: string, i: number) => (
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
