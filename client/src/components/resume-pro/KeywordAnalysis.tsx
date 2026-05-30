"use client";

import React from 'react';
import { Search, CheckCircle2, AlertCircle, Sparkles, Zap } from 'lucide-react';

export const KeywordAnalysis = ({ keywords }: { keywords: any }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Search className="w-5 h-5 text-primary" /> Keyword Analysis
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Matched Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {keywords.matched.map((kw: string, i: number) => (
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
            {keywords.missing.map((kw: string, i: number) => (
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
            {keywords.priority.map((kw: string, i: number) => (
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
