"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Flag, 
  CheckCircle2, 
  Circle, 
  X,
  AlertTriangle,
  Loader2,
  Menu,
  Brain,
  ShieldCheck,
  Target,
  Zap,
  Activity,
  Award,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { getBaseUrl } from "@/lib/api";

interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
}

function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "Mixed";
  const difficulty = searchParams.get("difficulty") || "Beginner";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes default
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${getBaseUrl()}/api/aptitude/questions/${encodeURIComponent(category)}?difficulty=${difficulty}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setTimeLeft(data.length * 90); // 1.5 mins per question
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [category, difficulty, router]);

  useEffect(() => {
    if (loading || submitting) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, submitting]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (qId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const toggleMarkForReview = (qId: string) => {
    setMarked(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setShowConfirm(false);
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`${getBaseUrl()}/api/aptitude/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          difficulty,
          answers,
          timeTaken: (questions.length * 90) - timeLeft,
          totalQuestions: questions.length
        })
      });
      const data = await res.json();
      router.push(`/aptitude/result/${data.id}`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
        </div>
        <p className="mt-6 text-sm font-black text-text-secondary uppercase tracking-[0.3em] animate-pulse">Syncing Test Cluster...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
        <div className="saas-card p-12 max-w-md w-full text-center space-y-8 bg-white shadow-xl">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto border border-rose-100">
             <AlertTriangle className="w-10 h-10 text-rose-500" />
          </div>
          <div className="space-y-3">
             <h2 className="text-3xl font-black tracking-tight">No Questions Found</h2>
             <p className="text-text-secondary font-medium">Could not synchronize questions for this category and difficulty level.</p>
          </div>
          <button onClick={() => router.push('/aptitude')} className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest">
            Return to Arena
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary selection:bg-primary/10 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="px-10 h-20 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
               <div className="p-3 bg-accent/5 rounded-2xl border border-accent/10">
                  <Brain className="w-6 h-6 text-accent" />
               </div>
               <div>
                  <h1 className="text-lg font-black tracking-tight text-text-primary uppercase leading-tight">{category}</h1>
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{difficulty} Assessment</p>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-3 px-6 py-2.5 rounded-full border-2 font-mono text-xl tabular-nums shadow-lg transition-all ${timeLeft < 300 ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-white border-slate-100 text-text-primary'}`}>
              <Clock className={`w-5 h-5 ${timeLeft < 300 ? 'text-rose-500' : 'text-text-secondary'}`} />
              {formatTime(timeLeft)}
            </div>
            <button onClick={() => setShowConfirm(true)} className="btn-primary px-10 py-3 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20">
              Submit Test
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Main Content Area */}
            <div className="flex-1 p-10 lg:p-16">
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="flex items-center justify-between">
                   <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-text-secondary text-[10px] font-black uppercase tracking-widest">
                      Question {currentIdx + 1} of {questions.length}
                   </div>
                   <button 
                    onClick={() => toggleMarkForReview(currentQ.id)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                      marked.has(currentQ.id) 
                        ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-sm' 
                        : 'bg-white border-slate-100 text-text-secondary hover:bg-slate-50'
                    }`}
                   >
                    <Flag className={`w-4 h-4 ${marked.has(currentQ.id) ? 'fill-current' : ''}`} />
                    {marked.has(currentQ.id) ? 'Marked for Review' : 'Mark for Review'}
                   </button>
                </div>

                <div className="saas-card p-12 bg-white shadow-2xl shadow-slate-200/50 space-y-12 rounded-[48px] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                      <Brain className="w-64 h-64 rotate-[-15deg]" />
                   </div>
                   
                   <p className="text-3xl font-black text-text-primary leading-tight tracking-tight relative z-10">
                      {currentQ.questionText}
                   </p>
                   
                   <div className="space-y-4 relative z-10">
                     {currentQ.options.map((opt: string, i: number) => {
                       const isSelected = answers[currentQ.id] === opt;
                       return (
                         <button
                           key={i}
                           onClick={() => handleOptionSelect(currentQ.id, opt)}
                           className={`w-full text-left p-8 rounded-3xl border-2 transition-all flex items-center gap-6 group/opt ${
                             isSelected 
                               ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5' 
                               : 'bg-slate-50/50 border-slate-100 hover:border-primary/30 hover:bg-white text-text-secondary'
                           }`}
                         >
                           <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all ${
                             isSelected ? 'border-primary bg-primary text-white scale-110' : 'border-slate-200 text-transparent group-hover/opt:border-primary/50'
                           }`}>
                             <div className={`w-2.5 h-2.5 bg-white rounded-full transition-all ${isSelected ? 'scale-100' : 'scale-0'}`} />
                           </div>
                           <span className={`text-xl font-bold ${isSelected ? 'text-text-primary' : 'text-text-secondary group-hover/opt:text-text-primary'}`}>{opt}</span>
                         </button>
                       );
                     })}
                   </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between pt-10 border-t border-slate-100">
                   <button 
                    onClick={() => setAnswers(prev => { const n = {...prev}; delete n[currentQ.id]; return n; })}
                    className="text-[10px] font-black text-text-secondary hover:text-rose-600 transition-colors uppercase tracking-[0.2em] flex items-center gap-2"
                   >
                    <X className="w-4 h-4" /> Clear Neural Input
                   </button>
                   <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setCurrentIdx(p => Math.max(0, p - 1))}
                      disabled={currentIdx === 0}
                      className="px-8 py-4 bg-white border border-slate-100 text-text-secondary rounded-2xl transition-all flex items-center gap-3 disabled:opacity-50 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    <button 
                      onClick={() => setCurrentIdx(p => Math.min(questions.length - 1, p + 1))}
                      disabled={currentIdx === questions.length - 1}
                      className="btn-primary px-10 py-4 rounded-2xl flex items-center gap-3 disabled:opacity-50 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20"
                    >
                      Next Mission <ChevronRight className="w-4 h-4" />
                    </button>
                   </div>
                </div>
              </div>
            </div>

            {/* Question Palette - Right Sidebar Style */}
            <div className="w-full lg:w-96 border-l border-slate-100 bg-white flex flex-col shrink-0">
               <div className="p-10 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-primary" /> Question Network
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <div className="text-2xl font-black text-text-primary tabular-nums">{Object.keys(answers).length}</div>
                        <div className="text-[9px] font-black text-text-secondary uppercase tracking-widest mt-1">Answered</div>
                     </div>
                     <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <div className="text-2xl font-black text-text-primary tabular-nums">{marked.size}</div>
                        <div className="text-[9px] font-black text-text-secondary uppercase tracking-widest mt-1">Marked</div>
                     </div>
                  </div>
               </div>
               
               <div className="flex-1 p-10 overflow-y-auto no-scrollbar space-y-10">
                  <div className="grid grid-cols-5 gap-3">
                    {questions.map((q, i) => {
                      const isAnswered = !!answers[q.id];
                      const isMarked = marked.has(q.id);
                      const isCurrent = i === currentIdx;
                      
                      let style = "bg-slate-50 text-text-secondary hover:bg-slate-100";
                      if (isAnswered) style = "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm";
                      if (isMarked) style = "bg-amber-50 text-amber-600 border border-amber-100 shadow-sm";
                      if (isAnswered && isMarked) style = "bg-emerald-50 border-b-4 border-b-amber-500 text-emerald-600";
                      
                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentIdx(i)}
                          className={`aspect-square rounded-xl flex items-center justify-center text-xs font-black transition-all ${style} ${isCurrent ? 'ring-2 ring-primary ring-offset-4 scale-110 z-10' : ''}`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-10 border-t border-slate-50 space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Answered</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Marked for Review</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Unvisited</span>
                     </div>
                  </div>
               </div>

               <div className="p-10 border-t border-slate-100 bg-slate-50/50">
                  <div className="saas-card p-6 bg-white border-slate-100 shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                        <Zap className="w-12 h-12 text-primary" />
                     </div>
                     <h4 className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-4">Strategist Insight</h4>
                     <p className="text-xs font-medium text-text-secondary leading-relaxed italic">
                        &quot;Focus on <span className="text-primary font-bold">accuracy</span> over speed in the first 10 rounds. Neural stability is key for high scores.&quot;
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[48px] p-12 max-w-xl w-full shadow-2xl relative z-10 space-y-10"
            >
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-rose-50 rounded-[32px] flex items-center justify-center text-rose-500 border border-rose-100">
                    <ShieldCheck className="w-10 h-10" />
                 </div>
                 <div>
                    <h3 className="text-4xl font-black tracking-tight text-text-primary uppercase leading-tight">Neural Sync <br/><span className="text-rose-500 italic">Complete?</span></h3>
                 </div>
              </div>

              <p className="text-lg font-medium text-text-secondary leading-relaxed">
                Confirming the finalization of this assessment will synchronize your responses with the evaluation cluster. You cannot modify entries post-submission.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-[32px] p-6 text-center border border-slate-100">
                  <div className="text-3xl font-black text-text-primary tabular-nums">{Object.keys(answers).length}</div>
                  <div className="text-[10px] text-text-secondary uppercase tracking-widest font-black mt-1">Neural Inputs</div>
                </div>
                <div className="bg-slate-50 rounded-[32px] p-6 text-center border border-slate-100">
                  <div className="text-3xl font-black text-slate-300 tabular-nums">{questions.length - Object.keys(answers).length}</div>
                  <div className="text-[10px] text-text-secondary uppercase tracking-widest font-black mt-1">Pending Sync</div>
                </div>
              </div>

              <div className="flex gap-6 pt-4">
                <button 
                  onClick={() => setShowConfirm(false)} 
                  className="flex-1 py-5 bg-white border border-slate-100 text-text-secondary rounded-[24px] transition-all font-black uppercase text-[10px] tracking-widest hover:bg-slate-50"
                >
                  Resume Scan
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={submitting}
                  className="flex-1 py-5 btn-primary rounded-[24px] text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-primary/30"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Initialize Sync <Zap className="w-4 h-4" /></>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AptitudeTestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <TestContent />
    </Suspense>
  );
}
