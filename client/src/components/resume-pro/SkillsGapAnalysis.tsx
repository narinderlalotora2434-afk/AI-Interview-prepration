// FILE: SkillsGapAnalysis.tsx | JD-aware ATS scoring system
"use client";

import React from 'react';
import { Target, Check, X, Sparkles, FileText } from 'lucide-react';
import { JDAnalysis, ResumeDomain, DomainConfig } from './domainConfig';

interface SkillsGap {
  found: string[];
  missing: string[];
  recommended: string[];
}

interface Props {
  skillsGap: SkillsGap;
  domain: ResumeDomain;
  domainConfig: DomainConfig;
  jdAnalysis?: JDAnalysis | null;
}

export const SkillsGapAnalysis = ({ skillsGap, domain, domainConfig, jdAnalysis }: Props) => {
  const isJdMode = !!jdAnalysis;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm relative">
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

      {isJdMode ? (
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4" /> 📋 Tailored to: Job Description Provided
          </div>
          
          {jdAnalysis.requiredSkills && (
            <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl">
              <h4 className="text-sm font-bold text-rose-800 mb-3 flex items-center gap-1.5">
                <X className="w-4 h-4" /> Missing JD Requirements
              </h4>
              <div className="flex flex-wrap gap-2">
                {jdAnalysis.requiredSkills.filter(s => !skillsGap.found.some(f => f.toLowerCase().includes(s.toLowerCase()))).map((skill: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-white border border-rose-200 text-rose-700 rounded-lg text-sm font-semibold shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {jdAnalysis.preferredSkills && (
            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl">
              <h4 className="text-sm font-bold text-amber-800 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Missing JD Preferred Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {jdAnalysis.preferredSkills.filter(s => !skillsGap.found.some(f => f.toLowerCase().includes(s.toLowerCase()))).map((skill: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-white border border-amber-200 text-amber-700 rounded-lg text-sm font-semibold shadow-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
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
      )}
    </div>
  );
};
