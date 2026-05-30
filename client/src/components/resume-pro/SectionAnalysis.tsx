"use client";

import React from 'react';
import { Briefcase, FolderGit2, GraduationCap, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export const SectionAnalysis = ({ data, certifications }: { data: any, certifications: any }) => {
  const sections = [
    { title: 'Experience', icon: <Briefcase className="w-5 h-5" />, score: data.experience.score, feedback: data.experience.feedback, color: 'blue' },
    { title: 'Projects', icon: <FolderGit2 className="w-5 h-5" />, score: data.projects.score, feedback: data.projects.feedback, color: 'purple' },
    { title: 'Education', icon: <GraduationCap className="w-5 h-5" />, score: data.education.score, feedback: data.education.feedback, color: 'emerald' }
  ];

  const colorMap: Record<string, { bg: string, text: string, border: string, fill: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', fill: 'bg-blue-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', fill: 'bg-purple-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', fill: 'bg-emerald-500' },
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {sections.map((sec, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-xl border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${colorMap[sec.color].bg} ${colorMap[sec.color].text}`}>
                {sec.icon}
              </div>
              <span className="text-xl font-black text-slate-800">{sec.score}/100</span>
            </div>
            <h4 className="font-bold text-slate-900 mb-2">{sec.title} Analysis</h4>
            <p className="text-sm text-slate-600 leading-relaxed flex-1">{sec.feedback}</p>
            
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${sec.score}%` }}
                transition={{ duration: 1 }}
                className={`h-full rounded-full ${colorMap[sec.color].fill}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50/80 border border-amber-200 p-6 rounded-2xl shadow-sm">
        <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" /> Recommended Certifications
        </h4>
        <div className="flex flex-wrap gap-2">
          {certifications.recommended.map((cert: string, i: number) => (
            <span key={i} className="px-3 py-1.5 bg-white border border-amber-200 text-amber-800 rounded-lg text-sm font-bold shadow-sm">
              {cert}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
