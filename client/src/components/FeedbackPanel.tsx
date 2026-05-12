"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb, Trophy, ArrowRight } from 'lucide-react';

interface FeedbackData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvedAnswer: string;
  nextQuestion: string;
}

interface FeedbackPanelProps {
  feedback: FeedbackData;
  onNext: () => void;
  isLastStep?: boolean;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedback, onNext, isLastStep }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl glass-card p-8 space-y-8 mt-12 overflow-hidden relative"
    >
      {/* Background Glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Interview Feedback</h2>
          <p className="text-slate-400 mt-1">Real-time AI evaluation of your last response.</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
          <Trophy className="w-8 h-8 text-yellow-500" />
          <div>
            <span className="text-4xl font-black text-white">{feedback.score}</span>
            <span className="text-slate-500 text-lg">/10</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-sm">
            <CheckCircle2 className="w-5 h-5" />
            Strengths
          </div>
          <ul className="space-y-3">
            {(feedback.strengths || []).map((s, i) => (
              <li key={i} className="flex gap-3 text-slate-300 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                <span className="text-emerald-500 font-bold">•</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-sm">
            <XCircle className="w-5 h-5" />
            Areas for Improvement
          </div>
          <ul className="space-y-3">
            {(feedback.weaknesses || []).map((w, i) => (
              <li key={i} className="flex gap-3 text-slate-300 bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
                <span className="text-rose-500 font-bold">•</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggested Answer */}
      <div className="space-y-4 bg-indigo-500/5 p-6 rounded-3xl border border-indigo-500/10">
        <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-sm">
          <Lightbulb className="w-5 h-5" />
          AI Suggested Better Answer
        </div>
        <p className="text-slate-300 leading-relaxed italic">&quot;{feedback.improvedAnswer}&quot;</p>
      </div>

      {/* Next Step */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
        <div className="flex-1">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Follow-up Question</p>
          <p className="text-white text-lg font-medium">{feedback.nextQuestion}</p>
        </div>
        <button
          onClick={onNext}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          {isLastStep ? "Finish Interview" : "Proceed to Next Question"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </motion.div>
  );
};

export default FeedbackPanel;
