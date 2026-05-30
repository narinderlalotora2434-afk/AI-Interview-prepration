"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, TrendingUp, Search, Target, Sparkles } from 'lucide-react';

export const HeroSection = () => {
  const badges = [
    { icon: <CheckCircle2 className="w-4 h-4" />, text: "ATS Compatibility" },
    { icon: <Search className="w-4 h-4" />, text: "Keyword Matching" },
    { icon: <Target className="w-4 h-4" />, text: "Skills Analysis" },
    { icon: <TrendingUp className="w-4 h-4" />, text: "Recruiter Insights" },
    { icon: <FileText className="w-4 h-4" />, text: "Job Match Analysis" },
    { icon: <Sparkles className="w-4 h-4" />, text: "AI Suggestions" },
  ];

  return (
    <div className="text-center max-w-4xl mx-auto mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="inline-block py-1.5 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide mb-4">
          Free ATS Resume Checker
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          Analyze your resume like a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">recruiter</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover how modern ATS systems score your profile. Get instant feedback on keywords, skills, and formatting to land your dream job.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {badges.map((badge, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-slate-700 font-medium text-sm"
            >
              <span className="text-emerald-500">{badge.icon}</span>
              {badge.text}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
