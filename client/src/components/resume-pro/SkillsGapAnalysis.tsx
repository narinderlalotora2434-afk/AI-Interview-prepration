"use client";

import React from 'react';
import { Target, Check, X, Sparkles } from 'lucide-react';

export const SkillsGapAnalysis = ({ skillsGap }: { skillsGap: any }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Target className="w-5 h-5 text-primary" /> Skills Gap Analysis
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            Verified Skills
          </h4>
          <ul className="space-y-2.5">
            {skillsGap.found.map((skill: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                <Check className="w-4 h-4 text-emerald-500" /> {skill}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            Missing Skills
          </h4>
          <ul className="space-y-2.5">
            {skillsGap.missing.map((skill: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                <X className="w-4 h-4 text-rose-500" /> {skill}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-xl">
        <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Recommended to Learn
        </h4>
        <div className="flex flex-wrap gap-2">
          {skillsGap.recommended.map((skill: string, i: number) => (
            <span key={i} className="px-3 py-1 bg-white border border-primary/20 text-primary rounded-lg text-sm font-semibold shadow-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
