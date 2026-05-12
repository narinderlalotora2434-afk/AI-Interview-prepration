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
  Brain
} from "lucide-react";

import { getBaseUrl } from "@/lib/api";
import Sidebar from "@/components/Sidebar";

interface ChallengeData {
  codingProblem: string;
  techQuestion: string;
  behavioralQuestion: string;
  error?: string;
}

export default function QuestsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [challenges, setChallenges] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
      </div>
    </div>
  );

  if (!challenges || challenges.error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground p-6">
        <ShieldCheck className="w-16 h-16 text-rose-500 mb-6 opacity-50" />
        <h2 className="text-3xl font-bold mb-2 tracking-tight">Access Restricted</h2>
        <p className="text-muted-foreground mb-8 max-w-md text-center">{challenges?.error || "We couldn't synchronize your daily quests with the neural network."}</p>
        <button onClick={() => window.location.reload()} className="btn-primary py-3 px-10 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]">
          Retry Sync
        </button>
      </div>
    );
  }

  const codingProblem = challenges?.codingProblem ? JSON.parse(challenges.codingProblem) : null;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex relative z-10">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="px-8 h-20 border-b border-border flex items-center justify-between bg-background/50 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3 text-amber-400 font-bold">
                <Calendar className="w-4 h-4" />
                <span className="text-sm uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border border-border shadow-xl">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-bold tabular-nums">Neural Streak</span>
               </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-10">
              
              <div className="space-y-2">
                <h1 className="text-5xl font-bold tracking-tight accent-gradient-text">Neural Quests</h1>
                <p className="text-muted-foreground text-lg">Daily high-impact missions to accelerate your engineering career.</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-10">
                {/* Main Quests */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Mission 1: Coding */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-10 overflow-hidden relative group border-l-4 border-l-primary"
                  >
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                       <Code className="w-48 h-48" />
                    </div>
                    <div className="relative z-10 space-y-8">
                       <div className="flex justify-between items-center">
                          <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
                             Priority Mission 01: Algorithms
                          </div>
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                             <Clock className="w-4 h-4" /> 25 Mins
                          </div>
                       </div>

                       <div className="space-y-4">
                          <h2 className="text-3xl font-bold group-hover:text-primary transition-colors">{codingProblem?.title}</h2>
                          <p className="text-muted-foreground leading-relaxed text-lg line-clamp-3">
                             {codingProblem?.description}
                          </p>
                       </div>

                       <div className="flex items-center justify-between pt-8 border-t border-border">
                          <div className="flex items-center gap-6">
                             <div className="flex items-center gap-2 text-amber-400">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm font-bold">+50 XP</span>
                             </div>
                             <div className="px-3 py-1 rounded-lg bg-secondary border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {codingProblem?.difficulty || 'Medium'}
                             </div>
                          </div>
                          <Link href="/coding" className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all">
                             Launch Arena <ChevronRight className="w-5 h-5" />
                          </Link>
                       </div>
                    </div>
                  </motion.div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Mission 2: Theory */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="glass-card p-8 border-l-4 border-l-accent-cyan group relative overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 p-6 opacity-5">
                          <Brain className="w-24 h-24" />
                       </div>
                       <div className="relative z-10 space-y-6 flex flex-col h-full">
                          <div className="px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan text-[10px] font-bold uppercase tracking-widest self-start">
                             Mission 02: Theory
                          </div>
                          <h3 className="text-xl font-bold">System Architecture</h3>
                          <p className="text-slate-400 text-sm italic flex-1 leading-relaxed border-l-2 border-white/5 pl-4">
                             &quot;{challenges?.techQuestion}&quot;
                          </p>
                          <div className="flex items-center justify-between pt-6">
                             <span className="text-xs font-bold text-accent-cyan">+25 XP</span>
                             <Link href="/interview" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                                Start Preparation <ArrowRight className="w-4 h-4 text-accent-cyan" />
                             </Link>
                          </div>
                       </div>
                    </motion.div>

                    {/* Mission 3: Behavioral */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="glass-card p-8 border-l-4 border-l-accent-pink group relative overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 p-6 opacity-5">
                          <Target className="w-24 h-24" />
                       </div>
                       <div className="relative z-10 space-y-6 flex flex-col h-full">
                          <div className="px-3 py-1 rounded-full bg-accent-pink/10 border border-accent-pink/20 text-accent-pink text-[10px] font-bold uppercase tracking-widest self-start">
                             Mission 03: Soft Skills
                          </div>
                          <h3 className="text-xl font-bold">Conflict Resolution</h3>
                          <p className="text-slate-400 text-sm italic flex-1 leading-relaxed border-l-2 border-white/5 pl-4">
                             &quot;{challenges?.behavioralQuestion}&quot;
                          </p>
                          <div className="flex items-center justify-between pt-6">
                             <span className="text-xs font-bold text-accent-pink">+25 XP</span>
                             <Link href="/interview" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                                Start Prep <ArrowRight className="w-4 h-4 text-accent-pink" />
                             </Link>
                          </div>
                       </div>
                    </motion.div>
                  </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-8">
                  <div className="glass-card p-8 bg-gradient-to-br from-primary/10 to-transparent">
                     <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-amber-500" /> Neural Progress
                     </h3>
                     <div className="space-y-8">
                        {[
                          { id: 1, label: "Coding Mission", icon: Code, color: "text-primary" },
                          { id: 2, label: "Technical Theory", icon: Brain, color: "text-accent-cyan" },
                          { id: 3, label: "Behavioral Mastery", icon: Target, color: "text-accent-pink" },
                        ].map((mission) => (
                          <div key={mission.id} className="flex items-center gap-5">
                             <div className="w-12 h-12 rounded-xl border-2 border-border bg-secondary flex items-center justify-center text-muted-foreground group-hover:border-primary transition-all">
                                <mission.icon className={`w-5 h-5 ${mission.color} opacity-40`} />
                             </div>
                             <div className="flex-1">
                                <div className="text-sm font-bold">{mission.label}</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Incomplete</div>
                             </div>
                             <div className="w-2 h-2 rounded-full bg-foreground/10" />
                          </div>
                        ))}
                     </div>
                     
                     <div className="mt-12 p-8 bg-black/40 rounded-3xl border border-white/5 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                           <div className="text-5xl font-bold mb-2 accent-gradient-text tabular-nums tracking-tighter">0 / 3</div>
                           <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">Daily Quests Sync</div>
                        </div>
                     </div>
                  </div>

                  <div className="glass-card p-8 border-dashed border-2 border-white/5">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-primary" /> Strategist Insight
                     </h3>
                     <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-primary/30 pl-4 py-1">
                        &quot;Today&apos;s objective cluster optimizes for <span className="text-primary font-bold">architectural scalability</span> and <span className="text-accent-pink font-bold">stakeholder alignment</span>. High probability of matching NVIDIA&apos;s Q3 technical benchmarks.&quot;
                     </p>
                  </div>

                  <div className="glass-card p-8 bg-white/5 border-white/5">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                           <Flame className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold">Neural Streak</h4>
                     </div>
                     <div className="grid grid-cols-7 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7].map(day => (
                          <div key={day} className={`aspect-square rounded-lg border flex items-center justify-center text-[10px] font-bold ${day < 7 ? 'bg-orange-500 border-orange-600 text-white shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                             {day < 7 ? '✓' : day}
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
    </div>
  );
}
