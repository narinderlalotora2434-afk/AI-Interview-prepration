"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Code,
  Zap,
  Map as MapIcon,
  User,
  LogOut,
  Brain,
  Calculator,
  Lightbulb,
  BookOpen,
  PieChart,
  TerminalSquare,
  Target,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldAlert,
  Trophy,
  Medal,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Timer
} from "lucide-react";
import { getBaseUrl } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  { id: "Quantitative Aptitude", title: "Quantitative", icon: Calculator, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "Logical Reasoning", title: "Logical Reasoning", icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: "Verbal Ability", title: "Verbal Ability", icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "Data Interpretation", title: "Data Analysis", icon: PieChart, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "Coding Aptitude", title: "Coding Theory", icon: TerminalSquare, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { id: "Mixed", title: "Full Mock Test", icon: Target, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
];

export default function AptitudeDashboard() {
  const router = useRouter();
  const [history, setHistory] = useState<Attempt[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-full max-w-4xl h-64 bg-primary/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 h-20 border-b border-border px-8 flex items-center justify-between bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <LogOut className="w-5 h-5 rotate-180" />
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight">Aptitude Arena</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="w-10 h-10 rounded-full bg-foreground/10 border border-border flex items-center justify-center font-bold">U</div>
        </div>
      </header>

      <main className="relative z-10 p-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)] space-y-12">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
            <Brain className="w-4 h-4" /> Professional Assessments
          </div>
          <h1 className="text-5xl font-bold accent-gradient-text">Aptitude Mastery</h1>
          <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
            Hone your logical and quantitative skills with AMCAT-style mock assessments and real-time AI performance metrics.
          </p>
        </motion.header>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 group hover:border-primary/50 transition-all duration-500"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${cat.bg} ${cat.border} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                <cat.icon className={`w-7 h-7 ${cat.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-3">{cat.title}</h3>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                Adaptive difficulty engine designed to prepare you for top-tier placement examinations.
              </p>
              
              <div className="space-y-3">
                {['Beginner', 'Intermediate', 'Advanced'].map((diff) => (
                  <button 
                    key={diff}
                    onClick={() => startTest(cat.id, diff)}
                    className="w-full btn-glass p-3 flex items-center justify-between group/btn overflow-hidden"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">{diff}</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-primary" />
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section: History & Leaderboard */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card p-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Timer className="w-6 h-6 text-primary" /> Recent History
              </h2>
            </div>
            
            {history.length === 0 ? (
              <div className="text-center py-20 bg-secondary rounded-3xl border-2 border-dashed border-border">
                <ShieldAlert className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No activity recorded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.slice(0, 5).map((attempt, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-secondary border border-border rounded-[24px] hover:bg-foreground/10 transition-all group">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20 shadow-lg">
                        {Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100)}%
                      </div>
                      <div>
                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{attempt.category}</h4>
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {Math.round(attempt.timeTaken / 60)}m</span>
                          <div className="w-1 h-1 rounded-full bg-foreground/10" />
                          <span>{attempt.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold accent-gradient-text">+{attempt.score}</div>
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{new Date(attempt.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="glass-card p-10 flex flex-col">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-500" /> Leaderboard
            </h2>
            <div className="space-y-4 flex-1">
              {leaderboard.slice(0, 6).map((user, idx) => (
                <div key={user.userId} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary border border-border group hover:bg-foreground/10 transition-all">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border-2 ${
                    idx === 0 ? 'bg-amber-500/20 border-amber-500 text-amber-500' :
                    idx === 1 ? 'bg-slate-500/20 border-slate-500 text-muted-foreground' :
                    idx === 2 ? 'bg-orange-500/20 border-orange-500 text-orange-600' :
                    'bg-secondary border-border text-muted-foreground'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm flex items-center justify-between">
                      {user.name} 
                      {idx < 3 && <Medal className={`w-4 h-4 ${idx===0?'text-amber-500':idx===1?'text-muted-foreground':'text-orange-700'}`} />}
                    </h4>
                    <div className="text-[10px] text-primary font-bold uppercase tracking-widest mt-0.5">{Math.round(user.totalScore)} PTS</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full btn-glass mt-10 text-[10px] font-bold uppercase tracking-[0.2em] py-4">View All Standings</button>
          </div>
        </div>
      </main>
    </div>
  );
}
