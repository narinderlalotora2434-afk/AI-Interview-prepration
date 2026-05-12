"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, LayoutDashboard, MessageSquare, FileText, Code, Zap,
  Map as MapIcon, User, LogOut,
  Search, ChevronRight, CheckCircle2, Brain,
  Target, Shield, Star, Building2,
  Menu, X, Sparkles, TrendingUp, Trophy, ArrowRight
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getBaseUrl } from "@/lib/api";

interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  acceptanceRate: number;
  solved: boolean;
  company: string[];
}

export default function CodingArenaDashboard() {
  const router = useRouter();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const cachedProblems = localStorage.getItem("coding_problems_cache");
    if (cachedProblems) {
      try {
        setProblems(JSON.parse(cachedProblems));
        setLoading(false);
      } catch {
        localStorage.removeItem("coding_problems_cache");
      }
    }

    // Mock Problems
    const mockProblems: Problem[] = [
      { id: "1", title: "Two Sum", difficulty: "Easy", category: "Array", acceptanceRate: 0.48, solved: true, company: ["Google", "Amazon"] },
      { id: "2", title: "Add Two Numbers", difficulty: "Medium", category: "Linked List", acceptanceRate: 0.35, solved: false, company: ["Microsoft", "Adobe"] },
      { id: "3", title: "Median of Two Sorted Arrays", difficulty: "Hard", category: "Divide and Conquer", acceptanceRate: 0.22, solved: false, company: ["Goldman Sachs", "Uber"] },
      { id: "4", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "String", acceptanceRate: 0.41, solved: true, company: ["Facebook", "Apple"] },
      { id: "5", title: "Longest Palindromic Substring", difficulty: "Medium", category: "Dynamic Programming", acceptanceRate: 0.38, solved: false, company: ["Amazon", "TCS"] },
      { id: "6", title: "Reverse Integer", difficulty: "Easy", category: "Math", acceptanceRate: 0.55, solved: true, company: ["Infosys"] },
      { id: "7", title: "String to Integer (atoi)", difficulty: "Medium", category: "String", acceptanceRate: 0.28, solved: false, company: ["Google"] },
    ];
    
    const timer = setTimeout(() => {
      setProblems(mockProblems);
      localStorage.setItem("coding_problems_cache", JSON.stringify(mockProblems));
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [router]);

  const filteredProblems = problems.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/3 w-full max-w-4xl h-64 bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-50 h-20 border-b border-border px-8 flex items-center justify-between bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <LogOut className="w-5 h-5 rotate-180" />
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.4)] text-white">
              <Code className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight">Coding Arena</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="w-10 h-10 rounded-full bg-foreground/10 border border-border flex items-center justify-center font-bold">U</div>
        </div>
      </header>

      <main className="relative z-10 p-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)] space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-4 h-4" /> Competitive Programming
            </div>
            <h1 className="text-5xl font-bold tracking-tight">Algorithmic Forge</h1>
            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">Master data structures and algorithms with real-time feedback and company-specific problem sets.</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-4 glass-card p-6 border-emerald-500/20">
             <div className="text-center px-6">
               <div className="text-3xl font-bold text-emerald-500 tracking-tighter">142</div>
               <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Solved</div>
             </div>
             <div className="w-px h-10 bg-border" />
             <div className="text-center px-6">
               <div className="text-3xl font-bold text-primary tracking-tighter">1,845</div>
               <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Rating</div>
             </div>
          </motion.div>
        </header>

        {/* Content Grid */}
        <div className="flex flex-col xl:flex-row gap-10">
          <div className="flex-1 space-y-8">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search algorithms, companies, or categories..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-secondary border border-border rounded-2xl py-5 pl-14 pr-6 text-foreground focus:outline-none focus:border-emerald-500 focus:bg-foreground/5 transition-all font-medium text-lg placeholder:text-muted-foreground"
              />
            </div>

            <div className="glass-card overflow-hidden border-border">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-secondary border-b border-border text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    <th className="py-6 px-10">Status</th>
                    <th className="py-6 px-10">Challenge</th>
                    <th className="py-6 px-10 text-center">Difficulty</th>
                    <th className="py-6 px-10 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading && problems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-32 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                          <p className="text-muted-foreground font-bold tracking-widest text-[10px] uppercase">Syncing Arena...</p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredProblems.map((p, idx) => (
                    <motion.tr 
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-foreground/[0.03] transition-all cursor-pointer"
                      onClick={() => router.push(`/coding/problem/${p.id}`)}
                    >
                      <td className="py-8 px-10">
                        {p.solved ? (
                          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-lg border-2 border-border group-hover:border-emerald-500/50 transition-colors" />
                        )}
                      </td>
                      <td className="py-8 px-10">
                        <div className="space-y-2">
                          <span className="text-xl font-bold tracking-tight group-hover:text-emerald-500 transition-colors">{p.title}</span>
                          <div className="flex items-center gap-3">
                            {p.company.map(c => (
                              <span key={c} className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-widest px-2 py-0.5 bg-secondary rounded border border-border">
                                <Building2 className="w-3 h-3 opacity-50" /> {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-8 px-10 text-center">
                        <span className={`text-[10px] font-bold uppercase px-4 py-1.5 rounded-full border ${
                          p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          p.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        }`}>
                          {p.difficulty}
                        </span>
                      </td>
                      <td className="py-8 px-10 text-right">
                        <button className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-emerald-500 group-hover:text-primary-foreground transition-all">
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="w-full xl:w-96 space-y-8">
            <div className="glass-card p-8">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8 flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-primary" /> Mastery Progress
              </h3>
              <div className="space-y-8">
                {[
                  { label: 'Array & Strings', value: 85, color: 'from-emerald-500 to-teal-500' },
                  { label: 'Dynamic Programming', value: 42, color: 'from-amber-500 to-orange-500' },
                  { label: 'Graph Theory', value: 15, color: 'from-rose-500 to-pink-500' },
                  { label: 'System Design', value: 64, color: 'from-primary to-purple-500' },
                ].map((topic) => (
                  <div key={topic.label} className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-muted-foreground">{topic.label}</span>
                      <span className="text-foreground">{topic.value}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden border border-border">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${topic.value}%` }}
                        transition={{ duration: 1.5 }}
                        className={`h-full bg-gradient-to-r ${topic.color} rounded-full`} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-3">
                <Trophy className="w-4 h-4 text-amber-500" /> Recommended Sheets
              </h3>
              <div className="grid gap-4">
                {['Striver SDE Sheet', 'Blind 75', 'NeetCode 150'].map((sheet) => (
                  <button key={sheet} className="w-full p-4 bg-secondary border border-border rounded-2xl hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-between group">
                    <span className="text-sm font-bold tracking-tight">{sheet}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
