// ============================================
// FILE: StrengthsWeaknesses.tsx
// Changes: Added priority indicators for each item
// ============================================
"use client";

import React from 'react';
import { CheckCircle2, AlertTriangle, ThumbsUp, TrendingDown } from 'lucide-react';

export const StrengthsWeaknesses = ({ strengths, weaknesses }: { strengths: string[], weaknesses: string[] }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Strengths */}
      <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-3xl shadow-sm">
        <h3 className="text-lg font-bold text-emerald-900 mb-5 flex items-center gap-2">
          <ThumbsUp className="w-5 h-5 text-emerald-500" /> Key Strengths
        </h3>
        <ul className="space-y-4">
          {strengths.map((s, i) => (
            <li key={i} className="flex gap-3 text-emerald-800 text-sm font-medium leading-relaxed items-start">
              <span className="shrink-0 mt-0.5 px-2 py-0.5 bg-emerald-200/50 text-emerald-700 text-[10px] font-black rounded-md">
                {i === 0 ? "TOP" : i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="bg-rose-50/50 border border-rose-100 p-6 rounded-3xl shadow-sm">
        <h3 className="text-lg font-bold text-rose-900 mb-5 flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-rose-500" /> Areas for Improvement
        </h3>
        <ul className="space-y-4">
          {weaknesses.map((w, i) => (
            <li key={i} className="flex gap-3 text-rose-800 text-sm font-medium leading-relaxed items-start">
              <span className="shrink-0 mt-0.5 px-2 py-0.5 bg-rose-200/50 text-rose-700 text-[10px] font-black rounded-md">
                {i === 0 ? "TOP" : i + 1}
              </span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
