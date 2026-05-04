"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Bot, LayoutDashboard, MessageSquare, FileText, Code, Zap,
  Map as MapIcon, User, LogOut,
  Search, Filter, ChevronRight, CheckCircle2, Clock, Trophy, Flame, Brain,
  TrendingUp, Activity, Target, Shield, Star, Globe, Building2, Layers
} from "lucide-react";
import { motion } from "framer-motion";

export default function CodingArenaDashboard() {
  const router = useRouter();
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [category, setCategory] = useState("All Topics");
  
  useEffect(() => {
    // Simulated fetching for the new professional view
    const mockProblems = [
      { id: "1", title: "Two Sum", difficulty: "Easy", category: "Array", acceptanceRate: 0.48, solved: true, company: ["Google", "Amazon"] },
      { id: "2", title: "Add Two Numbers", difficulty: "Medium", category: "Linked List", acceptanceRate: 0.35, solved: false, company: ["Microsoft", "Adobe"] },
      { id: "3", title: "Median of Two Sorted Arrays", difficulty: "Hard", category: "Divide and Conquer", acceptanceRate: 0.22, solved: false, company: ["Goldman Sachs", "Uber"] },
      { id: "4", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "String", acceptanceRate: 0.41, solved: true, company: ["Facebook", "Apple"] },
      { id: "5", title: "Longest Palindromic Substring", difficulty: "Medium", category: "Dynamic Programming", acceptanceRate: 0.38, solved: false, company: ["Amazon", "TCS"] },
      { id: "6", title: "Reverse Integer", difficulty: "Easy", category: "Math", acceptanceRate: 0.55, solved: true, company: ["Infosys"] },
      { id: "7", title: "String to Integer (atoi)", difficulty: "Medium", category: "String", acceptanceRate: 0.28, solved: false, company: ["Google"] },
    ];
    
    setTimeout(() => {
      setProblems(mockProblems);
      setLoading(false);
    }, 1000);
  }, [difficulty, category]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const filteredProblems = problems.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:flex-row text-slate-300 font-sans relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Sidebar */}
      <aside className="fixed md:sticky top-0 left-0 h-screen w-72 md:w-64 border-r border-white/5 bg-slate-950 p-6 flex flex-col shrink-0 z-50">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">PrepAI</span>
        </Link>
        <nav className="space-y-1 flex-1">
          {[
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, color: "" },
            { href: "/quests", label: "Daily Quests", icon: Zap, color: "text-amber-400" },
            { href: "/roadmaps", label: "Placement Roadmaps", icon: MapIcon, color: "text-indigo-400" },
            { href: "/aptitude", label: "Aptitude Test", icon: Brain, color: "text-pink-400" },
            { href: "/coding", label: "Coding Simulator", icon: Code, active: true, color: "text-emerald-400" },
            { href: "/interview", label: "Mock Interview", icon: MessageSquare, color: "" },
            { href: "/resume", label: "Resume Analyzer", icon: FileText, color: "" },
            { href: "/profile", label: "Profile", icon: User, color: "text-indigo-400" },
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                item.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.color} shrink-0`} />
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-400 transition-colors mt-auto">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative p-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                Global Code Arena
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold">
                <Globe className="w-3 h-3" /> Online: 1,248 Candidates
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">Coding Arena</h1>
            <p className="text-lg text-slate-400 max-w-2xl">Master algorithms, optimize space-time complexity, and dominate technical interview rounds at top tier product companies.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-xl">
             <div className="text-center px-4">
               <div className="text-2xl font-black text-emerald-400">142</div>
               <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Solved</div>
             </div>
             <div className="w-[1px] h-8 bg-white/10" />
             <div className="text-center px-4">
               <div className="text-2xl font-black text-amber-400">12</div>
               <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Streak</div>
             </div>
             <div className="w-[1px] h-8 bg-white/10" />
             <div className="text-center px-4">
               <div className="text-2xl font-black text-indigo-400">1,845</div>
               <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Rating</div>
             </div>
          </div>
        </header>

        {/* Filters & Actions */}
        <div className="flex flex-col xl:flex-row gap-8 mb-12">
          <div className="flex-1 space-y-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search problem title or company tag..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-medium"
                />
              </div>
              <div className="flex gap-4">
                <select className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-300 outline-none focus:border-emerald-500/50 appearance-none font-bold text-sm">
                  <option>Difficulty: All</option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
                <select className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-slate-300 outline-none focus:border-emerald-500/50 appearance-none font-bold text-sm">
                  <option>Topic: All</option>
                  <option>Arrays</option>
                  <option>DP</option>
                  <option>Graphs</option>
                  <option>Trees</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap gap-2">
              {['Amazon', 'Google', 'Microsoft', 'Uber', 'Goldman Sachs', 'Adobe', 'Striver SDE Sheet', 'Blind 75', 'NeetCode 150'].map((tag) => (
                <button key={tag} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all">
                  {tag}
                </button>
              ))}
            </div>

            {/* Problem Table */}
            <div className="glass-card overflow-hidden border border-white/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest font-black text-slate-500">
                    <th className="py-5 px-8">Status</th>
                    <th className="py-5 px-8">Title</th>
                    <th className="py-5 px-8 text-center">Difficulty</th>
                    <th className="py-5 px-8 text-center">Acceptance</th>
                    <th className="py-5 px-8 text-right">Practice</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                          <div className="text-slate-500 font-bold tracking-widest text-[10px] uppercase">Syncing Arena Data...</div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredProblems.length === 0 ? (
                    <tr><td colSpan={5} className="py-20 text-center text-slate-500">No challenges match your query.</td></tr>
                  ) : (
                    filteredProblems.map((p, idx) => (
                      <tr 
                        key={p.id} 
                        className="group border-b border-white/[0.03] hover:bg-emerald-500/[0.02] transition-colors cursor-pointer"
                        onClick={() => router.push(`/coding/problem/${p.id}`)}
                      >
                        <td className="py-6 px-8">
                          {p.solved ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-white/10 group-hover:border-emerald-500/50 transition-colors" />
                          )}
                        </td>
                        <td className="py-6 px-8">
                          <div className="flex flex-col gap-1">
                            <span className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors tracking-tight">
                              {p.title}
                            </span>
                            <div className="flex items-center gap-3">
                               <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                 <Building2 className="w-3 h-3" /> {p.company.join(', ')}
                               </span>
                               <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                 <Layers className="w-3 h-3" /> {p.category}
                               </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-8 text-center">
                          <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                            p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            p.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {p.difficulty}
                          </span>
                        </td>
                        <td className="py-6 px-8 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-bold text-white tracking-tighter">{Math.round(p.acceptanceRate * 100)}%</span>
                            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                               <motion.div 
                                 className="h-full bg-emerald-500"
                                 initial={{ width: 0 }}
                                 animate={{ width: `${p.acceptanceRate * 100}%` }}
                                 transition={{ duration: 1 }}
                               />
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-8 text-right">
                          <button className="p-3 bg-white/5 rounded-xl text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xl active:scale-90">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Sidebar: Stats & Sheets */}
          <aside className="w-full xl:w-96 space-y-8">
            {/* Topic Mastery */}
            <div className="glass-card p-6 border border-white/10 relative overflow-hidden">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" /> Topic Mastery
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'Array & Strings', value: 85, color: 'bg-emerald-400' },
                  { label: 'Dynamic Programming', value: 42, color: 'bg-amber-400' },
                  { label: 'Graph Theory', value: 15, color: 'bg-rose-400' },
                  { label: 'Trees & Heaps', value: 64, color: 'bg-indigo-400' },
                ].map((topic) => (
                  <div key={topic.label} className="space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-slate-400">{topic.label}</span>
                      <span className="text-white">{topic.value}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${topic.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${topic.value}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            {/* Preparation Sheets */}
            <div className="glass-card p-6 border border-white/10">
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" /> Curated Sheets
              </h3>
              <div className="grid gap-3">
                {[
                  { name: 'Striver SDE Sheet', count: 180, solved: 142 },
                  { name: 'Blind 75', count: 75, solved: 75 },
                  { name: 'NeetCode 150', count: 150, solved: 45 },
                  { name: 'Amazon Top 50', count: 50, solved: 12 },
                ].map((sheet) => (
                  <div key={sheet.name} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-black text-white group-hover:text-amber-400 transition-colors uppercase tracking-tight">{sheet.name}</span>
                      <Star className={`w-3.5 h-3.5 ${sheet.solved === sheet.count ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-500" style={{ width: `${(sheet.solved/sheet.count)*100}%` }} />
                       </div>
                       <span className="text-[10px] font-black text-slate-500">{sheet.solved}/{sheet.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
