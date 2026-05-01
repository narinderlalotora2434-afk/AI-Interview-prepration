"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Bot, LayoutDashboard, MessageSquare, FileText, Code, Zap,
  Map as MapIcon, User, LogOut,
  Search, Filter, ChevronRight, CheckCircle2, Clock, Trophy, Flame, Brain
} from "lucide-react";

export default function CodingArenaDashboard() {
  const router = useRouter();
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [category, setCategory] = useState("All Topics");
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}'}`}/api/coding/problems?difficulty=${difficulty}&category=${encodeURIComponent(category)}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProblems(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [difficulty, category, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const filteredProblems = problems.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-slate-300 font-sans">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col shrink-0">
        <Link href="/" className="p-6 flex items-center gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
            <Code className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight hidden lg:block">CodeArena</span>
        </Link>
        <nav className="space-y-2 flex-1 px-3">
          <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span className="hidden lg:block font-medium">Dashboard</span>
          </Link>
          <Link href="/coding" className="flex items-center gap-3 p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 transition-colors">
            <Code className="w-5 h-5 shrink-0" />
            <span className="hidden lg:block font-bold">Problems</span>
          </Link>
          <Link href="/quests" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <Zap className="w-5 h-5 shrink-0 text-amber-400" />
            <span className="hidden lg:block font-medium">Daily Quests</span>
          </Link>
          <Link href="/roadmaps" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <MapIcon className="w-5 h-5" />
            Placement Roadmaps
          </Link>
          <Link href="/interview" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
            <MessageSquare className="w-5 h-5 shrink-0" />
            <span className="hidden lg:block font-medium">Interviews</span>
          </Link>
        </nav>
        <button onClick={handleLogout} className="p-6 flex items-center gap-3 hover:text-rose-400 transition-colors mt-auto">
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="hidden lg:block font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        {/* Header Section */}
        <div className="px-8 pt-10 pb-6 shrink-0">
          <h1 className="text-3xl font-extrabold text-white mb-2">Problem Library</h1>
          <p className="text-slate-400">Master algorithms and data structures to ace your technical interviews.</p>
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Solved</div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 shrink-0">
                <Flame className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-8 pb-4 shrink-0 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search problems..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all"
            />
          </div>
          <select 
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 outline-none focus:border-emerald-500/50 appearance-none"
          >
            <option>All</option>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 outline-none focus:border-emerald-500/50 appearance-none"
          >
            <option>All Topics</option>
            <option>Array</option>
            <option>String</option>
            <option>Linked List</option>
            <option>Tree</option>
            <option>Dynamic Programming</option>
          </select>
        </div>

        {/* Problems List */}
        <div className="flex-1 overflow-y-auto px-8 pb-10">
          <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="py-4 px-6 font-semibold text-slate-400 text-sm">Status</th>
                  <th className="py-4 px-6 font-semibold text-slate-400 text-sm">Title</th>
                  <th className="py-4 px-6 font-semibold text-slate-400 text-sm">Difficulty</th>
                  <th className="py-4 px-6 font-semibold text-slate-400 text-sm">Acceptance</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        Loading problems...
                      </div>
                    </td>
                  </tr>
                ) : filteredProblems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-500">No problems found matching your criteria.</td>
                  </tr>
                ) : (
                  filteredProblems.map((p, idx) => (
                    <tr 
                      key={p.id} 
                      onClick={() => router.push(`/coding/problem/${p.id}`)}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6">
                        <div className="w-5 h-5 rounded-full border border-slate-600 group-hover:border-slate-400 transition-colors flex items-center justify-center">
                          {/* Checked state will be shown if solved */}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                          {idx + 1}. {p.title}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{p.category}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                          p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          p.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-medium">
                        {Math.round(p.acceptanceRate * 100)}%
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
