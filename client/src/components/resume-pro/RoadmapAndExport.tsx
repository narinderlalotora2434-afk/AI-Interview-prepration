"use client";

import React from 'react';
import { Route, CheckCircle2, Circle, Download, FileText, FileBarChart, Presentation, FilePieChart } from 'lucide-react';
import { motion } from 'framer-motion';

export const ImprovementRoadmap = ({ roadmap }: { roadmap: any[] }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm h-full">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Route className="w-5 h-5 text-primary" /> Improvement Roadmap
      </h3>

      <div className="relative pl-3">
        <div className="absolute top-0 bottom-0 left-[21px] w-0.5 bg-slate-100"></div>
        <div className="space-y-6 relative z-10">
          {roadmap.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                item.status === 'done' ? 'bg-emerald-500 text-white' : 
                i === 0 ? 'bg-primary text-white ring-4 ring-primary/20' : 
                'bg-white border-2 border-slate-200 text-slate-400'
              }`}>
                {item.status === 'done' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-3 h-3 fill-current" />}
              </div>
              <div className="pt-1">
                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                  item.status === 'done' ? 'text-emerald-600' : 
                  i === 0 ? 'text-primary' : 'text-slate-500'
                }`}>{item.week}</p>
                <p className="text-sm font-medium text-slate-700">{item.task}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ExportActions = () => {
  return (
    <div className="bg-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Download className="w-32 h-32 text-white" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-white font-bold mb-4 text-lg">Export Reports</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-colors text-white group/btn">
            <FileText className="w-6 h-6 text-indigo-300 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-medium">ATS Report PDF</span>
          </button>
          
          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-colors text-white group/btn">
            <Presentation className="w-6 h-6 text-emerald-300 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-medium">Recruiter Report</span>
          </button>

          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-colors text-white group/btn">
            <FileBarChart className="w-6 h-6 text-amber-300 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-medium">Skill Gap Report</span>
          </button>

          <button className="flex flex-col items-center justify-center gap-2 p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-colors text-white group/btn">
            <FilePieChart className="w-6 h-6 text-rose-300 group-hover/btn:scale-110 transition-transform" />
            <span className="text-xs font-medium">Resume Insights</span>
          </button>
        </div>
      </div>
    </div>
  );
};
