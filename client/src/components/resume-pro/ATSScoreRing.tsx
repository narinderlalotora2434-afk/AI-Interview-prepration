"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const ATSScoreRing = ({ score }: { score: number }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (circumference * animatedScore) / 100;

  const colorClass = score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-rose-500';

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="6" />
        <motion.circle 
          cx="50" cy="50" r="45" fill="none" 
          stroke="currentColor"
          strokeWidth="6" 
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-1500 ease-out ${colorClass}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-black ${colorClass}`}>{animatedScore}</span>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">ATS Score</span>
      </div>
    </div>
  );
};
