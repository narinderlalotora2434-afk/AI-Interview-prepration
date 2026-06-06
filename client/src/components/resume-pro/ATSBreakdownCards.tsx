// ============================================
// FILE: ATSBreakdownCards.tsx
// Changes: Added ATSBreakdown interface and trend labels
// ============================================
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Search, Target, Layout, BookOpen, Users } from 'lucide-react';

interface ATSBreakdown {
  compatibility: number;
  keywordsMatch: number;
  skillsCoverage: number;
  formatting: number;
  readability: number;
  recruiterImpact: number;
}

export const ATSBreakdownCards = ({ data }: { data: ATSBreakdown }) => {
  const cards = [
    { label: 'Compatibility', value: data.compatibility, icon: <CheckCircle2 className="w-5 h-5" />, color: 'emerald' },
    { label: 'Keywords', value: data.keywordsMatch, icon: <Search className="w-5 h-5" />, color: 'primary' },
    { label: 'Skills Coverage', value: data.skillsCoverage, icon: <Target className="w-5 h-5" />, color: 'amber' },
    { label: 'Formatting', value: data.formatting, icon: <Layout className="w-5 h-5" />, color: 'sky' },
    { label: 'Readability', value: data.readability, icon: <BookOpen className="w-5 h-5" />, color: 'fuchsia' },
    { label: 'Recruiter Impact', value: data.recruiterImpact, icon: <Users className="w-5 h-5" />, color: 'rose' },
  ];

  const colorMap: Record<string, { bg: string, text: string }> = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    primary: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-600' },
    fuchsia: { bg: 'bg-fuchsia-50', text: 'text-fuchsia-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2.5 rounded-xl ${colorMap[c.color]?.bg || 'bg-slate-50'} ${colorMap[c.color]?.text || 'text-slate-600'} group-hover:scale-110 transition-transform`}>
              {c.icon}
            </div>
            <span className={`text-lg font-black ${c.value >= 80 ? 'text-emerald-600' : c.value >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
              {c.value}%
            </span>
          </div>
          <p className="text-slate-600 font-semibold text-sm">{c.label}</p>
          
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${c.value}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-full rounded-full ${c.value >= 80 ? 'bg-emerald-500' : c.value >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
            />
          </div>
          <p className={`text-[10px] font-black uppercase tracking-widest mt-2
            ${c.value >= 80 ? 'text-emerald-500' : 
              c.value >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
            {c.value >= 80 ? 'Excellent' : c.value >= 60 ? 'Good' : 'Needs Work'}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
