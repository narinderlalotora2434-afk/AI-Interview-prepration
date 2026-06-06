// ============================================
// FILE: RoadmapAndExport.tsx
// Changes: Export actions toast and interactive roadmap steps
// ============================================
"use client";

import React, { useState, useEffect } from 'react';
import { Route, CheckCircle2, Circle, Download, FileText, FileBarChart, Presentation, FilePieChart } from 'lucide-react';

export const ImprovementRoadmap = ({ roadmap }: { roadmap: any[] }) => {
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    try {
      const saved = localStorage.getItem("roadmap_progress");
      if (saved) {
        setDoneSteps(new Set(JSON.parse(saved)));
      }
    } catch (e) {}
  }, []);

  const toggleStep = (index: number) => {
    setDoneSteps(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      localStorage.setItem("roadmap_progress", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const resetProgress = () => {
    setDoneSteps(new Set());
    localStorage.removeItem("roadmap_progress");
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Route className="w-5 h-5 text-primary" /> Improvement Roadmap
        </h3>
        {doneSteps.size > 0 && (
          <button onClick={resetProgress} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider transition-colors">
            Reset Progress
          </button>
        )}
      </div>

      <div className="relative pl-3 flex-1">
        <div className="absolute top-0 bottom-0 left-[21px] w-0.5 bg-slate-100"></div>
        <div className="space-y-6 relative z-10">
          {roadmap.map((item, i) => {
            const isDone = doneSteps.has(i) || item.status === 'done';
            return (
              <div 
                key={i} 
                className="flex gap-4 cursor-pointer group"
                onClick={() => toggleStep(i)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isDone ? 'bg-emerald-500 text-white shadow-sm' : 
                  i === 0 && doneSteps.size === 0 ? 'bg-primary text-white ring-4 ring-primary/20 shadow-sm' : 
                  'bg-white border-2 border-slate-200 text-slate-400 group-hover:border-primary/50 group-hover:text-primary/50'
                }`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-3 h-3 fill-current" />}
                </div>
                <div className="pt-1">
                  <p className={`text-xs font-bold uppercase tracking-wider mb-1 transition-colors ${
                    isDone ? 'text-emerald-600' : 
                    i === 0 && doneSteps.size === 0 ? 'text-primary' : 'text-slate-500'
                  }`}>{item.week}</p>
                  <p className={`text-sm font-medium transition-colors ${isDone ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                    {item.task}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const ExportActions = () => {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (label: string) => {
    setToast(`${label} export coming soon!`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden group h-full">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Download className="w-32 h-32 text-white" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-white font-bold mb-4 text-lg">Export Reports</h3>
        
        <div className="grid grid-cols-2 gap-3 flex-1">
          <button onClick={() => showToast("ATS Report PDF")} className="flex flex-col items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-colors text-white group/btn">
            <FileText className="w-6 h-6 text-indigo-300 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-medium text-center">ATS Report PDF</span>
          </button>
          
          <button onClick={() => showToast("Recruiter Report")} className="flex flex-col items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-colors text-white group/btn">
            <Presentation className="w-6 h-6 text-emerald-300 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-medium text-center">Recruiter Report</span>
          </button>

          <button onClick={() => showToast("Skill Gap Report")} className="flex flex-col items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-colors text-white group/btn">
            <FileBarChart className="w-6 h-6 text-amber-300 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-medium text-center">Skill Gap Report</span>
          </button>

          <button onClick={() => showToast("Resume Insights")} className="flex flex-col items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-colors text-white group/btn">
            <FilePieChart className="w-6 h-6 text-rose-300 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-medium text-center">Resume Insights</span>
          </button>
        </div>

        {toast && (
          <div className="mt-4 p-3 bg-white/20 border border-white/10 rounded-xl text-white text-xs font-bold text-center animate-in fade-in slide-in-from-bottom-2">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
};
