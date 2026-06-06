// ============================================
// FILE: CareerPathDetector.tsx
// Changes: Added CareerPath interface
// ============================================
"use client";

import React from 'react';
import { Compass, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface CareerPath {
  role: string;
  confidence: number;
}

export const CareerPathDetector = ({ path }: { path: CareerPath }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-800 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Compass className="w-32 h-32 text-white" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-indigo-200 font-bold mb-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-300" /> Career Path Detected
        </h3>
        <h2 className="text-3xl font-black text-white mb-6">
          {path.role}
        </h2>
        
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-indigo-200 text-sm font-medium">Match Confidence</span>
            <span className="text-white font-bold text-xl">{path.confidence}%</span>
          </div>
          <div className="w-full bg-indigo-950/50 h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${path.confidence}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-[0_0_10px_rgba(167,139,250,0.5)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const RecruiterFeedback = ({ feedback }: { feedback: string }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm relative">
      <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 rotate-12">
        <Users className="w-6 h-6 text-white -rotate-12" />
      </div>
      
      <div className="pl-6">
        <h3 className="text-lg font-bold text-slate-900 mb-3 ml-2">Simulated Recruiter Feedback</h3>
        <div className="relative">
          <span className="absolute -top-2 -left-2 text-4xl text-slate-200 font-serif">"</span>
          <p className="text-slate-600 font-medium leading-relaxed italic z-10 relative px-4">
            {feedback}
          </p>
          <span className="absolute -bottom-6 -right-2 text-4xl text-slate-200 font-serif">"</span>
        </div>
      </div>
    </div>
  );
};
