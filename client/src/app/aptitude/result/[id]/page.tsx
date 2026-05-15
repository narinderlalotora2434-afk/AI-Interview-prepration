"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy,
  Target,
  Clock,
  Brain,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Loader2,
  Download,
  Lightbulb,
  ArrowLeft,
  TrendingUp,
  Award
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { getBaseUrl } from "@/lib/api";

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${getBaseUrl()}/api/aptitude/history/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        
        if (typeof data.details === 'string') {
          data.parsedDetails = JSON.parse(data.details);
        } else {
          data.parsedDetails = data.details || [];
        }
        
        setResult(data);
      })
      .catch(err => {
        console.error(err);
        router.push("/aptitude");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
        </div>
        <p className="mt-6 text-sm font-black text-text-secondary uppercase tracking-[0.3em] animate-pulse">De-coding Performance...</p>
      </div>
    );
  }

  if (!result) return null;

  const accuracy = result.correctAnswers > 0 
    ? Math.round((result.correctAnswers / (result.correctAnswers + result.wrongAnswers)) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-text-primary overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-10 pt-10 pb-6">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <Link href="/aptitude" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-black uppercase tracking-widest text-[10px] mb-8 group">
                <ArrowLeft className="w-4 h-4" /> Back to Arena
              </Link>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
                    <Trophy className="w-6 h-6 text-primary" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Evaluation Report</span>
                    <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter">Mission Accomplished</h1>
                 </div>
              </div>
            </div>
            
            <div className="flex gap-4">
               <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:bg-slate-50 transition-all flex items-center gap-3 shadow-sm">
                 <Download className="w-4 h-4" /> Download Intelligence
               </button>
               <button onClick={() => router.push('/aptitude')} className="btn-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3">
                 <RotateCcw className="w-4 h-4" /> Reset Mission
               </button>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto space-y-16 pb-32">
          
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 saas-card p-12 bg-white border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                  <Award className="w-64 h-64 rotate-12" />
               </div>
               
               <div className="relative w-56 h-56 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="112" cy="112" r="100" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-50" />
                    <motion.circle 
                      cx="112" cy="112" r="100" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="12" 
                      strokeDasharray={`${2 * Math.PI * 100}`} 
                      initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 100 * (1 - Math.max(0, result.score) / result.totalQuestions) }}
                      transition={{ duration: 2, ease: "circOut" }}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-6xl font-black text-text-primary tracking-tighter">{Math.max(0, result.score)}</span>
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mt-1">Global Score</span>
                  </div>
               </div>

               <div className="flex-1 space-y-8 relative z-10 text-center md:text-left">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                       {result.category} • {result.difficulty} Level
                    </div>
                    <h2 className="text-3xl font-black text-text-primary tracking-tighter">Strategic Execution Summary</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-5 rounded-[32px] bg-slate-50/50 border border-slate-100">
                       <div className="flex items-center gap-2 text-[9px] font-black text-text-secondary uppercase tracking-widest mb-2">
                          <Target className="w-3.5 h-3.5 text-emerald-500" /> Precision
                       </div>
                       <div className="text-2xl font-black text-emerald-600">{accuracy}%</div>
                    </div>
                    <div className="p-5 rounded-[32px] bg-slate-50/50 border border-slate-100">
                       <div className="flex items-center gap-2 text-[9px] font-black text-text-secondary uppercase tracking-widest mb-2">
                          <Clock className="w-3.5 h-3.5 text-amber-500" /> Latency
                       </div>
                       <div className="text-2xl font-black text-text-primary">{Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</div>
                    </div>
                  </div>
               </div>
            </div>

            <div className="saas-card p-10 bg-white border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
               <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-4">Neural Analytics</h3>
               <div className="space-y-4">
                  {[
                    { label: "Correct Answers", value: result.correctAnswers, color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle2 },
                    { label: "Incorrect Inputs", value: result.wrongAnswers, color: "text-rose-600", bg: "bg-rose-50", icon: XCircle },
                    { label: "Skipped Nodes", value: result.skipped, color: "text-slate-400", bg: "bg-slate-50", icon: AlertCircle }
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-[24px] border border-slate-50 bg-slate-50/30">
                       <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                             <stat.icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-text-secondary">{stat.label}</span>
                       </div>
                       <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <section className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 saas-card p-12 bg-white border-primary/10 shadow-2xl shadow-primary/5 relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                  <Brain className="w-64 h-64" />
               </div>
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                       <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-black text-text-primary tracking-tight">AI Cognitive Feedback</h3>
                  </div>
                  <p className="text-lg text-text-secondary leading-relaxed font-medium mb-10">
                    {result.aiFeedback}
                  </p>
                  <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 flex items-start gap-6">
                     <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100 shrink-0">
                        <Lightbulb className="w-6 h-6 text-amber-500" />
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">Neural Optimization Path</h4>
                        <p className="text-sm text-text-secondary font-medium leading-relaxed">
                          {accuracy < 70 
                            ? "Current data suggests a gap in core pattern recognition. Prioritize conceptual mastery before aiming for speed-tier metrics."
                            : "Excellent neural stability detected. Transitioning to high-frequency shortcut training recommended to minimize assessment latency."}
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="saas-card p-12 bg-gradient-to-br from-primary to-primary-dark border-none shadow-2xl shadow-primary/20 text-white relative overflow-hidden group">
               <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 border border-white/20">
                       <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-3xl font-black tracking-tight mb-6">Growth Protocol <br/><span className="text-white/70 italic">Activated</span></h3>
                    <p className="text-white/80 font-medium leading-relaxed">
                       Your performance has been logged in the global leaderboard. Ready to push your percentile higher?
                    </p>
                  </div>
                  <button onClick={() => router.push('/aptitude')} className="mt-12 w-full py-5 bg-white text-primary rounded-[24px] font-black uppercase text-[10px] tracking-widest shadow-xl hover:scale-105 transition-all">
                    Launch New Session
                  </button>
               </div>
               <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            </div>
          </section>

          <section className="space-y-10">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                     <CheckCircle2 className="w-5 h-5 text-text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-text-primary tracking-tight">Audit Checklist</h3>
               </div>
               <div className="px-4 py-2 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-text-secondary">
                  {result.parsedDetails.length} Audit Points
               </div>
            </div>

            <div className="space-y-8">
              {result.parsedDetails.map((detail: any, index: number) => (
                <div key={index} className="saas-card overflow-hidden bg-white border-slate-100 shadow-xl shadow-slate-200/30 group">
                   <div className={`h-1.5 w-full ${detail.correct ? 'bg-emerald-500' : detail.answer === null ? 'bg-slate-300' : 'bg-rose-500'}`} />
                   <div className="p-10">
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-text-secondary text-xs border border-slate-100">
                               {index + 1}
                            </span>
                            <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Query Protocol</h4>
                         </div>
                         <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            detail.correct ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                            detail.answer === null ? 'bg-slate-50 text-slate-400 border-slate-100' : 
                            'bg-rose-50 text-rose-600 border-rose-100'
                         }`}>
                            {detail.correct ? 'Success' : detail.answer === null ? 'Skipped' : 'Error'}
                         </div>
                      </div>

                      <p className="text-xl font-black text-text-primary mb-10 tracking-tight leading-snug">
                         {detail.questionText}
                      </p>

                      <div className="grid md:grid-cols-2 gap-6">
                         <div className={`p-6 rounded-[28px] border-2 flex items-center justify-between group/input ${
                            detail.correct ? 'bg-emerald-50/20 border-emerald-100' : 'bg-rose-50/20 border-rose-100'
                         }`}>
                            <div>
                               <div className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-1">Your Input</div>
                               <div className={`text-base font-bold ${detail.correct ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {detail.answer || "No Input Detected"}
                               </div>
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${detail.correct ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                               {detail.correct ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                            </div>
                         </div>

                         {!detail.correct && detail.correctAnswer && (
                           <div className="p-6 rounded-[28px] bg-emerald-50/50 border-2 border-emerald-100/50 flex items-center justify-between">
                              <div>
                                 <div className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Correct Logic</div>
                                 <div className="text-base font-bold text-emerald-600">{detail.correctAnswer}</div>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                                 <CheckCircle2 className="w-5 h-5" />
                              </div>
                           </div>
                         )}
                      </div>

                      {detail.explanation && (
                        <div className="mt-10 p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex gap-6">
                           <Lightbulb className="w-6 h-6 text-amber-500 shrink-0" />
                           <div>
                              <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-2">Technical Breakdown</div>
                              <p className="text-sm text-text-secondary font-medium leading-relaxed">
                                 {detail.explanation}
                              </p>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
