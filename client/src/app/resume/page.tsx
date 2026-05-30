"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ResumeUploader from "@/components/ResumeUploader";
import { FileText } from "lucide-react";
import { HeroSection } from "@/components/resume-pro/HeroSection";
import { DashboardLayout } from "@/components/resume-pro/DashboardLayout";
import { mockResumeAnalysis } from "@/lib/mockResumeData";

export default function ResumePage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  // If the backend returns 'mocked' during our frontend-first dev phase, we inject the mock data
  const handleParseComplete = (data: any) => {
    if (data.analysis) {
      setAnalysis(data.analysis);
    } else if (data.status === 'mocked' || !data.totalScore) {
      setAnalysis(mockResumeAnalysis);
    } else {
      setAnalysis(data);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto relative">
        {/* Background decorative elements for the SaaS feel */}
        <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/5 to-transparent -z-10 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-slate-200/50 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              <FileText className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Resume Pro <span className="text-primary text-xs align-top ml-0.5">AI</span></h1>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">SaaS Analytics Platform</p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> AI Engine Active
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-[1400px] mx-auto min-h-[calc(100vh-80px)]">
          {!analysis ? (
            <div className="py-10">
              <HeroSection />
              <ResumeUploader onParseComplete={handleParseComplete} />
            </div>
          ) : (
            <DashboardLayout analysis={analysis} onReset={() => setAnalysis(null)} />
          )}
        </div>
      </main>
    </div>
  );
}
