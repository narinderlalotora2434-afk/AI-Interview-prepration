"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Bot, 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  History,
  ArrowRight,
  LogOut,
  Plus,
  Code,
  Palette,
  Check,
  Flame,
  Target,
  Trophy,
  Calendar,
  Zap,
  Map as MapIcon,
  User,
  Brain,
  Award,
  Menu,
  X
} from "lucide-react";

const THEMES = [
  { name: "Deep Space", color: "#020617", accent: "indigo" },
  { name: "Midnight Blue", color: "#0f172a", accent: "blue" },
  { name: "Dark Forest", color: "#064e3b", accent: "emerald" },
  { name: "Royal Purple", color: "#2e1065", accent: "purple" },
  { name: "Bordeaux", color: "#450a0a", accent: "red" },
];

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dailyChallenges, setDailyChallenges] = useState<any>(null);
  const [currentTheme, setCurrentTheme] = useState("#020617");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://ai-interview-prepration-2-nadp.onrender.com/api/challenges/daily", {
        headers: { "Authorization": `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setDailyChallenges(data))
        .catch(err => console.error("Failed to fetch daily challenges", err));
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme-color");
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      document.documentElement.style.setProperty('--bg-color', savedTheme);
    }
  }, []);

  const changeTheme = (color: string) => {
    setCurrentTheme(color);
    document.documentElement.style.setProperty('--bg-color', color);
    localStorage.setItem("theme-color", color);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("https://ai-interview-prepration-2-nadp.onrender.com/api/user/dashboard", {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Bot className="w-12 h-12 text-indigo-500 animate-bounce" />
    </div>
  );



  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <header className="md:hidden h-16 border-b border-white/5 bg-slate-950 flex items-center justify-between px-6 z-50 sticky top-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">PrepAI</span>
        </Link>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-72 md:w-64 border-r border-white/5 bg-slate-950 p-6 flex flex-col z-50 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Link href="/" className="hidden md:flex items-center gap-2 mb-10">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">PrepAI</span>
        </Link>

        <nav className="space-y-1 flex-1">
          {[
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "" },
            { href: "/quests", label: "Daily Quests", icon: Zap, color: "text-amber-400" },
            { href: "/roadmaps", label: "Placement Roadmaps", icon: MapIcon, color: "" },
            { href: "/interview", label: "Mock Interview", icon: MessageSquare, color: "" },
            { href: "/coding", label: "Coding Simulator", icon: Code, color: "" },
            { href: "/resume", label: "Resume Analyzer", icon: FileText, color: "" },
            { href: "/aptitude", label: "Aptitude Test", icon: Brain, color: "text-pink-400" },
            { href: "/profile", label: "Profile", icon: User, color: "text-indigo-400" },
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                router === item.href ? 'bg-white/5 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              {item.label}
            </Link>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto w-full">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Welcome back, {JSON.parse(localStorage.getItem("user") || "{}").name}!
            </h1>
            <p className="text-slate-400 text-sm md:text-base">Here's an overview of your preparation progress.</p>
          </div>
          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* XP and Level */}
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Level {Math.floor((data?.analytics.xp || 0) / 100) + 1}</div>
              <div className="w-24 md:w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-1000" 
                  style={{ width: `${(data?.analytics.xp || 0) % 100}%` }}
                />
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
              <Flame className="w-4 h-4 md:w-5 md:h-5 text-orange-500 animate-pulse" />
              <span className="font-bold text-xs md:text-sm text-orange-500 whitespace-nowrap">{data?.analytics.streak || 0} Day Streak</span>
            </div>

            <Link href="/interview" className="btn-primary flex items-center gap-2 text-xs md:text-sm py-2 md:py-3 flex-1 lg:flex-none justify-center">
              <Plus className="w-4 h-4" />
              Mock Interview
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="glass-card p-5 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <span className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">Interviews</span>
              <div className="p-2 bg-indigo-500/10 rounded-lg"><MessageSquare className="w-4 h-4 text-indigo-400" /></div>
            </div>
            <div className="text-2xl md:text-3xl font-black">{data?.analytics.mockInterviewCount}</div>
          </div>
          <div className="glass-card p-5 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <span className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">Avg Score</span>
              <div className="p-2 bg-emerald-500/10 rounded-lg"><TrendingUp className="w-4 h-4 text-emerald-400" /></div>
            </div>
            <div className="text-2xl md:text-3xl font-black">{data?.analytics.avgScore}%</div>
          </div>
          <div className="glass-card p-5 md:p-6 sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <span className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">Coding Rounds</span>
              <div className="p-2 bg-amber-500/10 rounded-lg"><Target className="w-4 h-4 text-amber-400" /></div>
            </div>
            <div className="text-2xl md:text-3xl font-black">{data?.analytics.codingRoundCount}</div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="glass-card p-6 md:p-8 mb-8 md:mb-10">
          <h2 className="text-lg md:text-xl font-black mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Hall of Fame
          </h2>
          <div className="flex flex-wrap gap-4 md:gap-8">
            {JSON.parse(data?.analytics.badges || "[]").length === 0 ? (
              <p className="text-slate-500 italic text-sm">Earn your first badge today!</p>
            ) : (
              JSON.parse(data?.analytics.badges || "[]").map((b: string) => (
                <div key={b} className="flex flex-col items-center gap-2 group">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                    <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {b.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Recent Activity */}
          <div className="glass-card p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-black flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-400" />
                Latest Sessions
              </h2>
              <Link href="/interview/history" className="text-xs md:text-sm text-indigo-400 hover:underline">See all</Link>
            </div>
            <div className="space-y-4">
              {data?.recentInterviews.length === 0 ? (
                <p className="text-slate-500 py-4 text-center text-sm italic">No data yet</p>
              ) : (
                data?.recentInterviews.map((int: any) => (
                  <div key={int.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                    <div>
                      <div className="font-bold text-sm md:text-base">{int.type}</div>
                      <div className="text-[10px] md:text-xs text-slate-500">{new Date(int.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs md:text-sm font-black text-indigo-400">{int.score}%</div>
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-slate-600" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-lg md:text-xl font-black mb-6">Pro Tips</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 font-black text-xs md:text-sm border border-indigo-500/20">1</div>
                <div>
                  <h4 className="font-bold text-sm md:text-base mb-1 text-slate-200">The Elevator Pitch</h4>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">Perfect your "Tell me about yourself" answer. It's the most important first impression.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 font-black text-xs md:text-sm border border-emerald-500/20">2</div>
                <div>
                  <h4 className="font-bold text-sm md:text-base mb-1 text-slate-200">ATS Optimization</h4>
                  <p className="text-xs md:text-sm text-slate-400 leading-relaxed">Ensure your resume keywords match the job description for a higher match score.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Themes */}
          <div className="glass-card p-6 md:p-8 lg:col-span-2">
            <h2 className="text-lg md:text-xl font-black mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-400" />
              Aesthetics
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
              {THEMES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => changeTheme(t.color)}
                  className={`group relative p-3 md:p-4 rounded-2xl border transition-all ${currentTheme === t.color ? 'border-indigo-500 bg-white/10' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                >
                  <div 
                    className="w-full h-8 md:h-12 rounded-lg mb-2 md:mb-3 shadow-inner"
                    style={{ backgroundColor: t.color }}
                  />
                  <div className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.name}</div>
                  {currentTheme === t.color && (
                    <div className="absolute top-1.5 right-1.5 bg-indigo-500 rounded-full p-0.5">
                      <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
