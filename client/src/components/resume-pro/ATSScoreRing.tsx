// ============================================
// FILE: ATSScoreRing.tsx
// Changes: Fixed animation with inline styles, added keyword-driven tooltip
// ============================================
"use client";

import React, { useEffect, useState } from 'react';

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
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="6" />
          <circle 
            cx="50" cy="50" r="45" fill="none" 
            stroke="currentColor"
            strokeWidth="6" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={colorClass}
            style={{ 
              strokeDashoffset, 
              transition: 'stroke-dashoffset 1.5s ease-out' 
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-black ${colorClass}`}>{animatedScore}</span>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">ATS Score</span>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 font-medium mt-1 text-center px-2">
         {score >= 80 ? 'Strong keyword match' : 
          score >= 60 ? 'Improve keyword coverage' : 
          'Low keyword alignment'}
      </p>
    </div>
  );
};
