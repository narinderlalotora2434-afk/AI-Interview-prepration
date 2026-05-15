"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, 
  Lightbulb, 
  BookOpen, 
  PieChart, 
  TerminalSquare, 
  Target, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  Trophy, 
  Medal, 
  Sparkles, 
  ChevronRight, 
  Timer,
  Brain,
  Zap,
  ArrowRight,
  Menu,
  CheckCircle2,
  Lock,
  Search
} from "lucide-react";
import { getBaseUrl } from "@/lib/api";
import Sidebar from "@/components/Sidebar";

interface Attempt {
  category: string;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  difficulty: string;
  score: number;
  createdAt: string;
}

interface LeaderboardEntry {
  userId: string;
  name: string;
  totalScore: number;
}

const CATEGORIES = [
  { id: "Quantitative Aptitude", title: "Quantitative", icon: Calculator, color: "text-primary", accent: "primary", description: "Arithmetic, Algebra, Geometry, and Advanced Math." },
  { id: "Logical Reasoning", title: "Logical Reasoning", icon: Lightbulb, color: "text-amber-500", accent: "amber", description: "Puzzles, Syllogisms, Analogies, and Critical Thinking." },
  { id: "Verbal Ability", title: "Verbal Ability", icon: BookOpen, color: "text-emerald-500", accent: "emerald", description: "Grammar, Vocabulary, and Reading Comprehension." },
  { id: "Data Interpretation", title: "Data Analysis", icon: PieChart, color: "text-secondary", accent: "secondary", description: "Charts, Tables, and Complex Data Relationship Sets." },
  { id: "Coding Aptitude", title: "Coding Theory", icon: TerminalSquare, color: "text-slate-600", accent: "slate", description: "Pseudocode, Complexity, and CS Fundamentals." },
  { id: "Mixed", title: "Full Mock Test", icon: Target, color: "text-rose-500", accent: "rose", description: "Full-length standardized AMCAT/eLitmus pattern mock." },
];

export default function AptitudeDashboard() {
  const router = useRouter();
  const [history, setHistory] = useState<Attempt[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const cachedHistory = localStorage.getItem("aptitude_history_cache");
    const cachedLeaderboard = localStorage.getItem("aptitude_leaderboard_cache");
    
    try {
      if (cachedHistory) setHistory(JSON.parse(cachedHistory));
      if (cachedLeaderboard) setLeaderboard(JSON.parse(cachedLeaderboard));
      if (cachedHistory) setLoading(false);
    } catch (e) { }

    Promise.all([
      fetch(`${getBaseUrl()}/api/aptitude/history`, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => res.json()),
      fetch(`${getBaseUrl()}/api/aptitude/leaderboard`, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => res.json())
    ])
    .then(([historyData, leaderboardData]) => {
      setHistory(historyData);
      setLeaderboard(leaderboardData);
      try {
        localStorage.setItem("aptitude_history_cache", JSON.stringify(historyData));
        localStorage.setItem("aptitude_leaderboard_cache", JSON.stringify(leaderboardData));
      } catch (e) {
        console.warn("Failed to cache aptitude data:", e);
      }
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, [router]);

  const startTest = (category: string, difficulty: string) => {
    router.push(`/aptitude/test?category=${encodeURIComponent(category)}&difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-text-primary overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-10 pt-10 pb-6">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
                    <Brain className="w-6 h-6 text-primary" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Skill Assessment</span>
                    <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter">Aptitude Arena</h1>
                 </div>
              </div>
              <p className="text-lg text-text-secondary max-w-3xl font-medium leading-relaxed">
                Adaptive cognitive assessments designed for elite recruitment standards.
              </p>
            </div>
            
            <div className="flex gap-6">
               <div className="saas-card p-5 bg-white shadow-xl shadow-slate-200/50 flex flex-col justify-center min-w-[180px] border border-slate-100">
                  <div className="text-2xl font-black text-primary tracking-tighter">{history.length}</div>
                  <div className="text-[10px] text-text-secondary uppercase tracking-widest font-black mt-1 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" /> Total Attempts
                  </div>
               </div>
               <div className="saas-card p-5 bg-white shadow-xl shadow-slate-200/50 flex flex-col justify-center min-w-[180px] border border-slate-100">
                  <div className="text-2xl font-black text-amber-600 tracking-tighter">
                     {leaderboard.find(u => u.userId === "current")?.totalScore || 0}
                  </div>
                  <div className="text-[10px] text-text-secondary uppercase tracking-widest font-black mt-1 flex items-center gap-2">
                    <Trophy className="w-3.5 h-3.5" /> Lifetime Points
                  </div>
               </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto space-y-24 pb-32">
          
          {/* Categories Section */}
          <section>
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                     <Target className="w-5 h-5 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">Standardized Modules</h2>
               </div>
               <div className="px-4 py-2 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-text-secondary">
                  6 Curated Categories
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {CATEGORIES.map((cat, idx) => (
                <motion.div 
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="saas-card p-10 group hover:border-primary/30 transition-all duration-500 bg-white shadow-xl shadow-slate-200/30 relative overflow-hidden"
                >
                  <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-10 bg-${cat.accent}-50 border border-${cat.accent}-100 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-${cat.accent}-500/10`}>
                    <cat.icon className={`w-8 h-8 ${cat.color}`} />
                  </div>
                  
                  <h3 className="text-2xl font-black mb-4 tracking-tight text-text-primary">{cat.title}</h3>
                  <p className="text-text-secondary text-sm mb-12 leading-relaxed font-medium">
                    {cat.description}
                  </p>
                  
                  <div className="space-y-3 relative z-10">
                    {[
                      { level: 'Beginner', pts: '100' },
                      { level: 'Intermediate', pts: '250' },
                      { level: 'Advanced', pts: '500' }
                    ].map((diff) => (
                      <button 
                        key={diff.level}
                        onClick={() => startTest(cat.id, diff.level)}
                        className="w-full py-4 px-6 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-between group/btn hover:bg-white hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex flex-col items-start">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary group-hover/btn:text-primary transition-colors">{diff.level}</span>
                           <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">Earn up to {diff.pts} pts</span>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary group-hover/btn:bg-primary group-hover/btn:text-white transition-all shadow-sm">
                           <ChevronRight className="w-5 h-5" />
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className={`absolute -bottom-10 -right-10 w-40 h-40 bg-${cat.accent}-500/5 rounded-full blur-3xl group-hover:bg-${cat.accent}-500/10 transition-all duration-1000`} />
                </motion.div>
              ))}
            </div>
          </section>

          {/* Activity & Performance Section */}
          <section className="grid lg:grid-cols-3 gap-12">
            
            {/* Recent History */}
            <div className="lg:col-span-2 space-y-10">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-amber-50/50 flex items-center justify-center border border-amber-100">
                        <Timer className="w-5 h-5 text-amber-500" />
                     </div>
                     <h2 className="text-2xl font-black tracking-tight">Performance History</h2>
                  </div>
                  <Link href="/analytics" className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:gap-3 transition-all">
                     View All Analytics <ArrowRight className="w-4 h-4" />
                  </Link>
               </div>

               <div className="saas-card p-8 bg-white border-slate-100 shadow-xl shadow-slate-200/40">
                  {history.length === 0 ? (
                    <div className="text-center py-32 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200">
                      <ShieldAlert className="w-16 h-16 text-slate-200 mx-auto mb-8" />
                      <p className="text-text-secondary font-black uppercase tracking-[0.3em] text-xs">Awaiting first assessment data</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {history.slice(0, 5).map((attempt, i) => (
                        <div key={i} className="flex items-center justify-between p-8 rounded-[40px] border border-slate-50 bg-slate-50/30 hover:bg-white hover:border-primary/20 hover:shadow-2xl transition-all group">
                          <div className="flex items-center gap-10">
                            <div className="w-20 h-20 rounded-[32px] bg-white border border-slate-100 flex items-center justify-center relative shadow-sm group-hover:shadow-primary/10 transition-all">
                               <svg className="w-16 h-16 transform -rotate-90">
                                  <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-slate-100" />
                                  <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" strokeDasharray={`${(attempt.correctAnswers / attempt.totalQuestions) * 176} 176`} className="text-primary transition-all duration-1000" />
                               </svg>
                               <span className="absolute text-sm font-black text-text-primary">
                                  {Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100)}%
                               </span>
                            </div>
                            <div>
                              <h4 className="font-black text-xl text-text-primary group-hover:text-primary transition-colors tracking-tight">{attempt.category}</h4>
                              <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-text-secondary mt-2">
                                <span className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full"><Clock className="w-3.5 h-3.5 text-amber-500" /> {Math.round(attempt.timeTaken / 60)}m Taken</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                <span className="text-primary font-black">{attempt.difficulty}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-4xl font-black text-text-primary tracking-tighter group-hover:text-primary transition-all">+{attempt.score}</div>
                            <div className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-2">{new Date(attempt.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
            </div>

            {/* Leaderboard Section */}
            <div className="space-y-10">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100">
                     <Trophy className="w-5 h-5 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">Arena Standings</h2>
               </div>

               <div className="saas-card p-10 bg-slate-50 border-slate-100 flex flex-col h-full shadow-inner">
                  <div className="space-y-5 flex-1">
                    {leaderboard.slice(0, 7).map((user, idx) => (
                      <div key={user.userId} className="flex items-center gap-6 p-6 rounded-[32px] bg-white border border-slate-100 group hover:shadow-xl transition-all duration-500">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border-4 ${
                          idx === 0 ? 'bg-amber-50 border-amber-500 text-amber-600 shadow-lg shadow-amber-500/20' :
                          idx === 1 ? 'bg-slate-50 border-slate-300 text-slate-500' :
                          idx === 2 ? 'bg-orange-50 border-orange-500 text-orange-600' :
                          'bg-slate-50 border-slate-100 text-text-secondary'
                        }`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-base flex items-center justify-between text-text-primary truncate tracking-tight">
                            {user.name} 
                            {idx < 3 && <Medal className={`w-5 h-5 shrink-0 ${idx===0?'text-amber-500':idx===1?'text-slate-400':'text-orange-600'}`} />}
                          </h4>
                          <div className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                             <Sparkles className="w-3 h-3" /> {Math.round(user.totalScore)} Mastery Points
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-10 text-[10px] font-black uppercase tracking-[0.4em] py-5 bg-white border border-slate-100 rounded-3xl hover:bg-primary hover:text-white hover:border-primary transition-all text-text-secondary shadow-xl shadow-slate-200/50">
                    Enter Global Hall of Fame
                  </button>
               </div>
            </div>
          </section>

          {/* CTA / Promotion Section */}
          <section className="saas-card p-16 bg-gradient-to-br from-primary to-primary-dark rounded-[64px] border-none text-white relative overflow-hidden group">
             <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                <div className="max-w-2xl text-center lg:text-left">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest mb-8">
                      <Sparkles className="w-4 h-4" /> Recommended for you
                   </div>
                   <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">Master AMCAT Patterns</h2>
                   <p className="text-white/80 text-xl font-medium leading-relaxed">
                      Our mixed mock tests are calibrated with the latest AMCAT and eLitmus standards to ensure you're ready for the actual recruitment drive.
                   </p>
                </div>
                <button 
                  onClick={() => startTest("Mixed", "Advanced")}
                  className="bg-white text-primary px-12 py-6 rounded-[32px] font-black text-sm uppercase tracking-widest hover:scale-105 hover:shadow-2xl transition-all shadow-xl shadow-black/10 flex items-center gap-4"
                >
                   Launch Full Mock Test <Zap className="w-6 h-6 fill-current" />
                </button>
             </div>
             {/* Decorative Background Elements */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
          </section>

        </div>
      </main>
    </div>
  );
}
