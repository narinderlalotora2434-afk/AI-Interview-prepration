// FILE: KeywordAnalysis.tsx | JD-aware ATS scoring system
"use client";

import React from 'react';
import { Search, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { JDAnalysis, ResumeDomain } from './domainConfig';

interface Keywords {
  matched: string[];
  missing: string[];
  priority: string[];
}

interface Props {
  keywords: Keywords;
  domain: ResumeDomain;
  jdAnalysis?: JDAnalysis | null;
}

export const KeywordAnalysis = ({ keywords, domain, jdAnalysis }: Props) => {
  const isJdMode = !!jdAnalysis;
  const matchedList = isJdMode ? keywords.matched : keywords.matched;
  const missingList = isJdMode ? keywords.missing : keywords.missing;
  const priorityList = isJdMode ? keywords.priority : keywords.priority;

  const matchedCount = matchedList.length;
  const totalCount = matchedList.length + missingList.length;
  const matchPct = totalCount > 0 
    ? Math.round((matchedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" /> Keyword Analysis
        </h3>
        {isJdMode && (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">
            Based on Job Description
          </span>
        )}
      </div>

      <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
          <span>{isJdMode ? `${matchedCount} of ${totalCount} JD requirements matched` : `${matchedCount} of ${totalCount} keywords matched`}</span>
          <span className={matchPct >= 70 ? 'text-emerald-600' : 
            matchPct >= 50 ? 'text-amber-600' : 'text-rose-600'}>
            {matchPct}%
          </span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 
              ${matchPct >= 70 ? 'bg-emerald-500' : 
                matchPct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
            style={{ width: `${matchPct}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matched Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {matchedList.map((kw: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-sm font-medium">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-500" /> Missing Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {missingList.map((kw: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg text-sm font-medium">
                {kw}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" /> Priority Keywords to Add
          </h4>
          <div className="flex flex-wrap gap-2">
            {priorityList.map((kw: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 text-amber-800 rounded-lg text-sm font-bold shadow-sm">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
