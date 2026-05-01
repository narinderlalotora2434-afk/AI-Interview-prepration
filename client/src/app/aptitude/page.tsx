"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  Medal
} from "lucide-react";

const CATEGORIES = [
  { id: "Quantitative Aptitude", title: "Quantitative Aptitude", icon: Calculator, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  { id: "Logical Reasoning", title: "Logical Reasoning", icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { id: "Verbal Ability", title: "Verbal Ability", icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { id: "Data Interpretation", title: "Data Interpretation", icon: PieChart, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
  { id: "Coding Aptitude", title: "Coding Aptitude", icon: TerminalSquare, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { id: "Mixed", title: "Full Mock Test", icon: Target, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
];

export default function AptitudeDashboard() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    Promise.all([
      fetch("http://localhost:5000/api/aptitude/history", {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => res.json()),
      fetch("http://localhost:5000/api/aptitude/leaderboard", {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => res.json())
    ])
    .then(([historyData, leaderboardData]) => {
      setHistory(historyData);
      setLeaderboard(leaderboardData);
    })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const startTest = (category: string, difficulty: string) => {
    router.push(`/aptitude/test?category=${encodeURIComponent(category)}&difficulty=${difficulty}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Brain className="w-12 h-12 text-pink-500 animate-pulse" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-slate-950 p-6 flex flex-col hidden md:flex">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">PrepAI</span>
        </Link>
        <nav className="space-y-1 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/quests" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <Zap className="w-5 h-5 text-amber-400" /> Daily Quests
          </Link>
          <Link href="/roadmaps" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <MapIcon className="w-5 h-5" />
            Placement Roadmaps
          </Link>
          <Link href="/interview" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <MessageSquare className="w-5 h-5" /> Mock Interview
          </Link>
          <Link href="/coding" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <Code className="w-5 h-5" /> Coding Simulator
          </Link>
          <Link href="/resume" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <FileText className="w-5 h-5" /> Resume Analyzer
          </Link>
          <Link href="/aptitude" className="flex items-center gap-3 px-4 py-3 bg-white/5 text-white rounded-xl font-medium">
            <Brain className="w-5 h-5 text-pink-400" /> Aptitude Test
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <User className="w-5 h-5 text-indigo-400" /> Profile
          </Link>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors mt-auto">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-900/20 via-slate-950 to-slate-950 -z-10" />

        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-bold mb-4">
            <Brain className="w-4 h-4" /> AI-Powered Assessments
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
            Aptitude Mastery
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Ace your placements with our comprehensive aptitude modules. Features AMCAT/eLitmus style interfaces, negative marking, and deep AI performance analysis.
          </p>
        </header>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="glass-card p-6 border border-white/5 hover:border-white/20 transition-all duration-300 group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.bg} ${cat.border} border`}>
                <cat.icon className={`w-6 h-6 ${cat.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{cat.title}</h3>
              <p className="text-sm text-slate-400 mb-6 line-clamp-2">
                Practice topic-wise questions with instant solutions and performance tracking.
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => startTest(cat.id, 'Beginner')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  Beginner Level <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
                <button 
                  onClick={() => startTest(cat.id, 'Intermediate')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  Intermediate Level <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
                <button 
                  onClick={() => startTest(cat.id, 'Advanced')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  Advanced Level <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics & Recent History */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-card p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-indigo-400" /> Recent Attempts
            </h2>
            {history.length === 0 ? (
              <div className="text-center py-10 bg-white/5 rounded-xl border border-dashed border-white/20">
                <ShieldAlert className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">No tests taken yet. Start practicing to see your analytics!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.slice(0, 5).map((attempt, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold">
                        {Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100)}%
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{attempt.category}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {Math.round(attempt.timeTaken / 60)} mins</span>
                          <span>•</span>
                          <span>{attempt.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-400">Score: {attempt.score}</div>
                      <div className="text-xs text-slate-500">{new Date(attempt.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="glass-card p-8 bg-gradient-to-br from-pink-600/10 to-transparent">
            <h2 className="text-xl font-bold mb-6">Performance Radar</h2>
            <div className="h-48 flex items-center justify-center border border-white/10 rounded-xl mb-6 bg-slate-900/50 relative overflow-hidden">
               {/* Mock Radar Chart visualization using CSS */}
               <div className="w-32 h-32 rounded-full border border-pink-500/30 flex items-center justify-center absolute">
                 <div className="w-20 h-20 rounded-full border border-pink-500/40 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-pink-500/50 animate-pulse" />
                 </div>
               </div>
               <span className="text-sm text-slate-500 mt-32 z-10 font-medium">Take more tests to unlock radar.</span>
            </div>
            
            <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-400">Total Tests Taken</span>
                 <span className="font-bold text-white">{history.length}</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-400">Average Accuracy</span>
                 <span className="font-bold text-emerald-400">
                   {history.length > 0 ? Math.round(history.reduce((a,b) => a + (b.correctAnswers/b.totalQuestions), 0) / history.length * 100) : 0}%
                 </span>
               </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mt-8 glass-card p-8 bg-gradient-to-tr from-slate-900 to-indigo-900/20 border-indigo-500/10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" /> Global Top Performers
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leaderboard.length === 0 ? (
              <p className="text-slate-500 italic col-span-full">Leaderboard is currently empty. Be the first to rank!</p>
            ) : (
              leaderboard.map((user, idx) => (
                <div key={user.userId} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    idx === 0 ? 'bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' :
                    idx === 1 ? 'bg-slate-300 text-slate-900 shadow-[0_0_15px_rgba(203,213,225,0.5)]' :
                    idx === 2 ? 'bg-amber-700 text-white shadow-[0_0_15px_rgba(180,83,9,0.5)]' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white flex items-center gap-2">
                      {user.name} 
                      {idx < 3 && <Medal className={`w-4 h-4 ${idx===0?'text-amber-400':idx===1?'text-slate-300':'text-amber-700'}`} />}
                    </h4>
                    <div className="text-sm text-indigo-400 font-bold">{Math.round(user.totalScore)} Pts</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
