"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Calendar,
  Clock,
  ArrowRight,
  Trophy,
  BrainCircuit,
  Star,
  Zap,
  Target,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Flame,
  LayoutDashboard,
  Menu,
  Code,
  Brain,
  CheckCircle2
} from "lucide-react";

import { getBaseUrl } from "@/lib/api";
import Sidebar from "@/components/Sidebar";

interface ChallengeData {
  codingProblem: string;
  techQuestion: string;
  behavioralQuestion: string;
  error?: string;
}

function getTopicFromQuestion(question: string = ""): string {
  const lower = question.toLowerCase();
  if (lower.includes("database") || lower.includes("sql") || lower.includes("index")) return "Database Design";
  if (lower.includes("system") || lower.includes("scale") || lower.includes("microservice")) return "System Design";
  if (lower.includes("conflict") || lower.includes("teammate") || lower.includes("disagree")) return "Team Dynamics";
  if (lower.includes("optimize") || lower.includes("algorithm") || lower.includes("complexity")) return "Algorithm Design";
  if (lower.includes("react") || lower.includes("frontend") || lower.includes("component")) return "Frontend Engineering";
  if (lower.includes("api") || lower.includes("rest") || lower.includes("graphql")) return "API Design";
  return lower.includes("?") ? "Behavioral Scenario" : "Technical Concept";
}

export default function QuestsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [challenges, setChallenges] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);

  // New states for tracking and UI
  const [completed, setCompleted] = useState({ coding: false, theory: false, behavioral: false });
  const [streak, setStreak] = useState(0);
  const [history, setHistory] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [timeLeft, setTimeLeft] = useState("");
  const [xpPopup, setXpPopup] = useState<{ type: string | null; amount: number; show: boolean }>({ type: null, amount: 0, show: false });

  const todayStr = new Date().toISOString().split('T')[0];
  const completionKey = `quest_completion_${todayStr}`;

  useEffect(() => {
    // 1. Setup timer
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${h}h ${m}m`);
    };
    updateTimer();
    const intervalId = setInterval(updateTimer, 60000);

    // 2. Load completions
    try {
      const savedCompletions = localStorage.getItem(completionKey);
      if (savedCompletions) {
        setCompleted(JSON.parse(savedCompletions));
      }
    } catch (e) {}

    // 3. Load streak and history
    let streakLog: string[] = [];
    try {
      streakLog = JSON.parse(localStorage.getItem("streak_log") || "[]");
    } catch(e) {}
    
    if (!streakLog.includes(todayStr)) {
      streakLog.push(todayStr);
      streakLog.sort();
      localStorage.setItem("streak_log", JSON.stringify(streakLog));
    }

    let currentStreak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
        const dStr = new Date(checkDate.getTime() - checkDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        if (streakLog.includes(dStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    setStreak(currentStreak);

    const newHistory = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        newHistory.push(streakLog.includes(dStr));
    }
    setHistory(newHistory);

    return () => clearInterval(intervalId);
  }, [todayStr, completionKey]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const cachedData = localStorage.getItem("daily_challenges");
    if (cachedData) {
      try {
        setChallenges(JSON.parse(cachedData));
        setLoading(false);
      } catch (e) {
        localStorage.removeItem("daily_challenges");
      }
    }

    fetch(`${getBaseUrl()}/api/challenges/daily`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            router.push("/login");
          }
          throw new Error("Failed to fetch challenges");
        }
        return res.json();
      })
      .then(data => {
        setChallenges(data);
        localStorage.setItem("daily_challenges", JSON.stringify(data));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  const markComplete = (type: 'coding' | 'theory' | 'behavioral', amount: number) => {
    if (completed[type]) return; // already completed

    setCompleted(prev => {
       const next = { ...prev, [type]: true };
       localStorage.setItem(completionKey, JSON.stringify(next));
       return next;
    });

    setXpPopup({ type, amount, show: true });
    setTimeout(() => setXpPopup(p => ({ ...p, show: false })), 2000);
  };

  const getMissionStatus = (isCompleted: boolean) => {
    if (isCompleted) return "Completed ✓";
    return "Not Started";
  };

  const getStatusColor = (isCompleted: boolean) => {
    if (isCompleted) return "bg-green-500";
    return "bg-slate-300";
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
        <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
      </div>
    </div>
  );

  if (!challenges || challenges.error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-text-primary p-6">
        <ShieldCheck className="w-20 h-20 text-rose-500 mb-8 opacity-20" />
        <h2 className="text-4xl font-black mb-4 tracking-tighter">Access Restricted</h2>
        <p className="text-text-secondary mb-10 max-w-md text-center font-medium leading-relaxed">{challenges?.error || "We couldn't synchronize your daily quests with the neural network."}</p>
        <button onClick={() => window.location.reload()} className="btn-primary py-4 px-12 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20">
          Retry Sync
        </button>
      </div>
    );
  }

  const codingProblem = challenges?.codingProblem ? JSON.parse(challenges.codingProblem) : null;
  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary selection:bg-primary/10 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="px-10 h-20 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 text-amber-600 font-black">
              <Calendar className="w-5 h-5" />
              <span className="text-xs uppercase tracking-[0.2em]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            {timeLeft && (
              <div className="flex items-center gap-2 text-text-secondary text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-full">
                <Clock className="w-4 h-4" /> Resets in {timeLeft}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-slate-100 shadow-sm">
                <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500' : 'text-slate-400'}`} />
                <span className="text-sm font-black tabular-nums text-text-primary tracking-tight">{streak}-DAY STREAK</span>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 no-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-16">
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                <Zap className="w-4 h-4" /> Daily Missions
              </div>
              <h1 className="text-6xl font-black tracking-tighter text-text-primary">Daily <span className="text-primary italic">Neural</span> Quests</h1>
              <p className="text-text-secondary text-xl font-medium max-w-2xl leading-relaxed">High-impact missions designed by AI to accelerate your placement readiness today.</p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-10 pb-20">
              {/* Main Quests */}
              <div className="lg:col-span-2 space-y-10">
                
                {/* Mission 1: Coding */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`saas-card p-12 overflow-hidden relative group border-l-[6px] border-l-primary bg-white shadow-xl shadow-slate-200/50 transition-all ${completed.coding ? 'opacity-80' : ''}`}
                >
                  <AnimatePresence>
                    {xpPopup.show && xpPopup.type === 'coding' && (
                      <motion.div
                        initial={{ opacity: 1, y: 0 }}
                        animate={{ opacity: 0, y: -50 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute right-12 top-12 text-3xl font-black text-amber-500 z-50 pointer-events-none drop-shadow-md"
                      >
                        +{xpPopup.amount} XP
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                     <Code className="w-64 h-64 rotate-12" />
                  </div>
                  {completed.coding && (
                     <div className="absolute inset-0 bg-green-500/5 z-0 pointer-events-none" />
                  )}
                  
                  <div className="relative z-10 space-y-10">
                     <div className="flex justify-between items-center">
                        {completed.coding ? (
                          <div className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                             <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </div>
                        ) : (
                          <div className="px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                             Primary Objective: Algorithms
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-text-secondary text-xs font-black uppercase tracking-[0.2em]">
                           <Clock className="w-4 h-4" /> 25 Mins
                        </div>
                     </div>

                     <div className="space-y-6">
                        <h2 className="text-4xl font-black text-text-primary group-hover:text-primary transition-colors tracking-tighter">{codingProblem?.title}</h2>
                        <p className="text-text-secondary leading-relaxed text-xl font-medium line-clamp-3">
                           {codingProblem?.description}
                        </p>
                     </div>

                     <div className="flex items-center justify-between pt-10 border-t border-slate-50">
                        <div className="flex items-center gap-8">
                           <div className="flex items-center gap-3 text-amber-500 font-black">
                              <Star className="w-5 h-5 fill-current" />
                              <span className="text-lg tracking-tight">+50 XP</span>
                           </div>
                           <div className="px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">
                              {codingProblem?.difficulty || 'Medium'}
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           {!completed.coding && (
                             <button onClick={() => markComplete('coding', 50)} className="px-6 py-4 text-xs font-black uppercase tracking-[0.2em] text-text-secondary hover:text-green-600 transition-colors">
                               Mark Complete
                             </button>
                           )}
                           <Link href="/coding" className="btn-primary px-10 py-4 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center gap-2 transition-all">
                              Launch Arena <ArrowRight className="w-5 h-5" />
                           </Link>
                        </div>
                     </div>
                  </div>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-10">
                  {/* Mission 2: Theory */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={`saas-card p-10 border-l-[6px] border-l-secondary group relative overflow-hidden bg-white shadow-lg transition-all ${completed.theory ? 'opacity-80' : ''}`}
                  >
                     <AnimatePresence>
                      {xpPopup.show && xpPopup.type === 'theory' && (
                        <motion.div
                          initial={{ opacity: 1, y: 0 }}
                          animate={{ opacity: 0, y: -50 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="absolute right-8 top-8 text-2xl font-black text-amber-500 z-50 pointer-events-none drop-shadow-md"
                        >
                          +{xpPopup.amount} XP
                        </motion.div>
                      )}
                    </AnimatePresence>

                     <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                        <Brain className="w-32 h-32" />
                     </div>
                     {completed.theory && (
                        <div className="absolute inset-0 bg-green-500/5 z-0 pointer-events-none" />
                     )}
                     
                     <div className="relative z-10 space-y-8 flex flex-col h-full">
                        {completed.theory ? (
                          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-[10px] font-black uppercase tracking-widest self-start flex items-center gap-1.5">
                             <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </div>
                        ) : (
                          <div className="px-3 py-1 rounded-full bg-secondary/5 border border-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest self-start">
                             Theory Objective
                          </div>
                        )}
                        <h3 className="text-2xl font-black text-text-primary tracking-tight">{getTopicFromQuestion(challenges.techQuestion)}</h3>
                        <p className="text-text-secondary text-base italic flex-1 leading-relaxed border-l-4 border-slate-100 pl-6 py-2 font-medium">
                           &quot;{challenges?.techQuestion}&quot;
                        </p>
                        <div className="flex items-center justify-between pt-8 flex-wrap gap-4">
                           <span className="text-xs font-black text-secondary uppercase tracking-widest">+25 XP</span>
                           <div className="flex items-center gap-4">
                             {!completed.theory && (
                               <button onClick={() => markComplete('theory', 25)} className="text-xs font-black text-text-secondary hover:text-green-600 uppercase tracking-[0.2em] transition-all">
                                 Mark Complete
                               </button>
                             )}
                             <Link href={`/interview?question=${encodeURIComponent(challenges.techQuestion || "")}&type=theory`} className="text-xs font-black text-text-secondary hover:text-secondary uppercase tracking-[0.2em] flex items-center gap-2 transition-all">
                                Start Prep <ChevronRight className="w-4 h-4" />
                             </Link>
                           </div>
                        </div>
                     </div>
                  </motion.div>

                  {/* Mission 3: Behavioral */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={`saas-card p-10 border-l-[6px] border-l-rose-500 group relative overflow-hidden bg-white shadow-lg transition-all ${completed.behavioral ? 'opacity-80' : ''}`}
                  >
                     <AnimatePresence>
                      {xpPopup.show && xpPopup.type === 'behavioral' && (
                        <motion.div
                          initial={{ opacity: 1, y: 0 }}
                          animate={{ opacity: 0, y: -50 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="absolute right-8 top-8 text-2xl font-black text-amber-500 z-50 pointer-events-none drop-shadow-md"
                        >
                          +{xpPopup.amount} XP
                        </motion.div>
                      )}
                    </AnimatePresence>

                     <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                        <Target className="w-32 h-32" />
                     </div>
                     {completed.behavioral && (
                        <div className="absolute inset-0 bg-green-500/5 z-0 pointer-events-none" />
                     )}

                     <div className="relative z-10 space-y-8 flex flex-col h-full">
                        {completed.behavioral ? (
                          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-[10px] font-black uppercase tracking-widest self-start flex items-center gap-1.5">
                             <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                          </div>
                        ) : (
                          <div className="px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest self-start">
                             Behavioral Objective
                          </div>
                        )}
                        <h3 className="text-2xl font-black text-text-primary tracking-tight">{getTopicFromQuestion(challenges.behavioralQuestion)}</h3>
                        <p className="text-text-secondary text-base italic flex-1 leading-relaxed border-l-4 border-slate-100 pl-6 py-2 font-medium">
                           &quot;{challenges?.behavioralQuestion}&quot;
                        </p>
                        <div className="flex items-center justify-between pt-8 flex-wrap gap-4">
                           <span className="text-xs font-black text-rose-600 uppercase tracking-widest">+25 XP</span>
                           <div className="flex items-center gap-4">
                             {!completed.behavioral && (
                               <button onClick={() => markComplete('behavioral', 25)} className="text-xs font-black text-text-secondary hover:text-green-600 uppercase tracking-[0.2em] transition-all">
                                 Mark Complete
                               </button>
                             )}
                             <Link href={`/interview?question=${encodeURIComponent(challenges.behavioralQuestion || "")}&type=behavioral`} className="text-xs font-black text-text-secondary hover:text-rose-600 uppercase tracking-[0.2em] flex items-center gap-2 transition-all">
                                Start Prep <ChevronRight className="w-4 h-4" />
                             </Link>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                </div>
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-10">
                <div className="saas-card p-10 bg-white border-slate-100 shadow-xl">
                   <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-12 flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-amber-500" /> Neural Progress
                   </h3>
                   <div className="space-y-10">
                      {[
                        { id: 'coding' as const, label: "Coding Mission", icon: Code, color: "text-primary", bg: "bg-primary/5" },
                        { id: 'theory' as const, label: "Technical Theory", icon: Brain, color: "text-secondary", bg: "bg-secondary/5" },
                        { id: 'behavioral' as const, label: "Behavioral Mastery", icon: Target, color: "text-rose-500", bg: "bg-rose-50" },
                      ].map((mission) => {
                        const isCompleted = completed[mission.id];
                        return (
                          <div key={mission.id} className="flex items-center gap-6 group cursor-default">
                             <div className={`w-14 h-14 rounded-2xl border border-slate-100 ${isCompleted ? 'bg-green-500/10' : mission.bg} flex items-center justify-center transition-all group-hover:scale-110 shadow-sm`}>
                                {isCompleted ? (
                                  <CheckCircle2 className={`w-6 h-6 text-green-500 opacity-80`} />
                                ) : (
                                  <mission.icon className={`w-6 h-6 ${mission.color} opacity-40`} />
                                )}
                             </div>
                             <div className="flex-1">
                                <div className="text-sm font-black text-text-primary tracking-tight">{mission.label}</div>
                                <div className={`text-[9px] uppercase tracking-[0.2em] font-black mt-1 ${isCompleted ? 'text-green-600' : 'text-text-secondary'}`}>
                                  {getMissionStatus(isCompleted)}
                                </div>
                             </div>
                             <div className={`w-2.5 h-2.5 rounded-full transition-colors ${getStatusColor(isCompleted)}`} />
                          </div>
                        );
                      })}
                   </div>
                   
                   <div className="mt-16 p-10 bg-slate-50 rounded-[32px] border border-slate-100 text-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                         <div className="text-6xl font-black mb-2 text-text-primary tracking-tighter tabular-nums">{completedCount} <span className="text-2xl text-text-secondary">/ 3</span></div>
                         <div className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-black">Daily Objective Sync</div>
                      </div>
                   </div>
                </div>

                <div className="saas-card p-10 bg-slate-50 border-slate-100 relative overflow-hidden">
                   <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                      <BrainCircuit className="w-5 h-5 text-primary" /> Strategist Insight
                   </h3>
                   <p className="text-base text-text-secondary leading-relaxed italic border-l-4 border-primary/20 pl-6 py-2 font-medium">
                      &quot;Today&apos;s objective cluster optimizes for <span className="text-primary font-black">architectural scalability</span> and <span className="text-rose-600 font-black">stakeholder alignment</span>. High probability of matching NVIDIA&apos;s Q3 technical benchmarks.&quot;
                   </p>
                </div>

                <div className="saas-card p-10 bg-white border-slate-100 shadow-lg">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                         <Flame className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="font-black text-text-primary tracking-tight">Daily Continuity</h4>
                        <p className="text-[9px] text-text-secondary uppercase tracking-widest font-black">Past 7 Days</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-7 gap-3">
                      {history.map((wasActive, i) => (
                        <div key={i} className={`aspect-square rounded-xl border flex items-center justify-center text-[10px] font-black transition-all ${wasActive ? 'bg-orange-500 border-orange-600 text-white shadow-lg shadow-orange-500/20 scale-105' : 'bg-slate-50 border-slate-100 text-text-secondary opacity-50'}`}>
                           {wasActive ? '✓' : '—'}
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
