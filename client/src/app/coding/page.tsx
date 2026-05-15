"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Code, 
  Zap, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  Brain,
  Target, 
  Shield, 
  Star, 
  Building2,
  Menu, 
  Sparkles, 
  TrendingUp, 
  Trophy, 
  ArrowRight,
  Filter,
  LayoutGrid,
  List,
  Terminal,
  MousePointer2,
  Check
} from "lucide-react";
import { getBaseUrl } from "@/lib/api";
import Sidebar from "@/components/Sidebar";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
    <div className="min-h-screen bg-[#F8FAFC] flex text-text-primary overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 no-scrollbar scroll-smooth">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 md:px-10 h-20 flex items-center justify-between">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-10 w-full">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors">
                  <Menu className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10">
                      <Terminal className="w-6 h-6 text-emerald-600" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Developer Forge</span>
                      <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter">Coding Arena</h1>
                   </div>
                </div>
              </div>
              <p className="text-lg text-text-secondary max-w-3xl font-medium leading-relaxed">
                Elite algorithmic challenges curated for MAANG recruitment cycles.
              </p>
            </div>
            
            <div className="flex gap-6">
               <div className="saas-card p-5 bg-white shadow-xl shadow-slate-200/50 flex flex-col justify-center min-w-[180px] border border-slate-100">
                  <div className="text-2xl font-black text-emerald-600 tracking-tighter">142</div>
                  <div className="text-[10px] text-text-secondary uppercase tracking-widest font-black mt-1 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Problems Solved
                  </div>
               </div>
               <div className="saas-card p-5 bg-white shadow-xl shadow-slate-200/50 flex flex-col justify-center min-w-[180px] border border-slate-100">
                  <div className="text-2xl font-black text-primary tracking-tighter">1,845</div>
                  <div className="text-[10px] text-text-secondary uppercase tracking-widest font-black mt-1 flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" /> Global Rating
                  </div>
               </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto pb-32">
          
          <div className="flex flex-col xl:flex-row gap-12">
            {/* Main Content: Problem List */}
            <div className="flex-1 space-y-12">
              
              {/* Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-2xl">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                   <input 
                     type="text" 
                     placeholder="Search algorithmic patterns..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full bg-white border border-slate-200 rounded-[32px] py-6 pl-16 pr-8 text-lg focus:outline-none focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 transition-all text-text-primary placeholder:text-text-secondary shadow-xl shadow-slate-200/20"
                   />
                </div>
                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                   <button className="h-full px-8 bg-white border border-slate-200 rounded-[28px] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-xl shadow-slate-200/20">
                      <Filter className="w-4 h-4" /> Filters
                   </button>
                   <button className="h-full px-8 bg-white border border-slate-200 rounded-[28px] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-xl shadow-slate-200/20">
                      <LayoutGrid className="w-4 h-4" /> Layout
                   </button>
                </div>
              </div>

              {/* Table Container */}
              <div className="saas-card bg-white shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 rounded-[32px] md:rounded-[48px]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-[0.3em] font-black text-text-secondary">
                        <th className="py-10 px-12 text-center w-24">Status</th>
                        <th className="py-10 px-6">Algorithm Challenge</th>
                        <th className="py-10 px-6 text-center w-40">Difficulty</th>
                        <th className="py-10 px-6 text-center w-32">Acceptance</th>
                        <th className="py-10 px-12 text-right w-40">Interactive</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loading && problems.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-48 text-center bg-white">
                            <div className="flex flex-col items-center gap-8">
                               <div className="relative w-20 h-20">
                                  <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full" />
                                  <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                               </div>
                               <p className="text-text-secondary font-black tracking-[0.4em] text-[10px] uppercase">Syncing Cloud Arena...</p>
                            </div>
                          </td>
                        </tr>
                      ) : filteredProblems.length === 0 ? (
                        <tr>
                           <td colSpan={5} className="py-48 text-center bg-white">
                              <div className="flex flex-col items-center gap-6">
                                 <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center border border-slate-100">
                                    <Search className="w-10 h-10 text-slate-300" />
                                 </div>
                                 <p className="text-text-secondary font-black tracking-[0.3em] text-[10px] uppercase">No matching challenges found</p>
                              </div>
                           </td>
                        </tr>
                      ) : filteredProblems.map((p, idx) => (
                        <motion.tr 
                          key={p.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          className="group hover:bg-slate-50/50 transition-all cursor-pointer"
                          onClick={() => router.push(`/coding/problem/${p.id}`)}
                        >
                          <td className="py-12 px-12">
                            {p.solved ? (
                              <div className="w-12 h-12 rounded-[18px] bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 mx-auto">
                                <Check className="w-6 h-6 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-[18px] border-2 border-slate-100 group-hover:border-emerald-500/50 transition-all bg-white shadow-inner mx-auto" />
                            )}
                          </td>
                          <td className="py-12 px-6">
                            <div className="space-y-4">
                              <span className="text-2xl font-black tracking-tight text-text-primary group-hover:text-emerald-600 transition-colors">{p.title}</span>
                              <div className="flex items-center gap-2">
                                {p.company.map(c => (
                                  <span key={c} className="text-[8px] font-black text-text-secondary flex items-center gap-2 uppercase tracking-widest px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg group-hover:bg-white transition-all">
                                    <Building2 className="w-3 h-3 text-emerald-500" /> {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                          <td className="py-12 px-6 text-center">
                            <span className={`text-[10px] font-black uppercase px-6 py-2.5 rounded-full border shadow-sm ${
                              p.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              p.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                              {p.difficulty}
                            </span>
                          </td>
                          <td className="py-12 px-6 text-center font-black text-text-secondary text-sm">
                             {Math.round(p.acceptanceRate * 100)}%
                          </td>
                          <td className="py-12 px-12 text-right">
                            <div className="w-14 h-14 rounded-[22px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 group-hover:shadow-xl group-hover:shadow-emerald-500/30 transition-all ml-auto">
                              <MousePointer2 className="w-6 h-6" />
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Aside: Insights & Progress */}
            <aside className="w-full xl:w-[450px] space-y-12">
              
              {/* Progress Card */}
              <div className="saas-card p-12 bg-white border-slate-100 shadow-2xl shadow-slate-200/40 rounded-[48px]">
                <div className="flex items-center justify-between mb-12">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight">Skill Matrix</h3>
                   </div>
                   <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Global PCTL: 94th</div>
                </div>

                <div className="space-y-12">
                  {[
                    { label: 'Array & Strings', value: 85, color: 'bg-emerald-500', accent: 'emerald' },
                    { label: 'Dynamic Programming', value: 42, color: 'bg-amber-500', accent: 'amber' },
                    { label: 'Graph Theory', value: 15, color: 'bg-rose-500', accent: 'rose' },
                    { label: 'System Design', value: 64, color: 'bg-primary', accent: 'primary' },
                  ].map((topic) => (
                    <div key={topic.label} className="space-y-5">
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                           <span className="text-sm font-black tracking-tight text-text-primary">{topic.label}</span>
                           <span className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em] mt-1">Tier 1 Proficiency</span>
                        </div>
                        <span className="text-lg font-black text-text-primary tracking-tighter">{topic.value}%</span>
                      </div>
                      <div className="h-3 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${topic.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "circOut" }}
                          className={`h-full ${topic.color} rounded-full shadow-lg shadow-${topic.accent}-500/10`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curated Lists */}
              <div className="saas-card p-12 bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group rounded-[48px]">
                <div className="relative z-10">
                   <div className="flex items-center gap-4 mb-10">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10">
                         <Trophy className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight text-text-primary">Elite Roadmap</h3>
                   </div>
                   
                   <div className="space-y-4">
                     {[
                        { title: 'Striver SDE Sheet', desc: '180 Problems for Top Tech', accent: 'emerald', color: 'text-emerald-600', bg: 'bg-emerald-50', bborder: 'border-emerald-100' },
                        { title: 'Blind 75', desc: 'Most Common LC Questions', accent: 'amber', color: 'text-amber-600', bg: 'bg-amber-50', bborder: 'border-amber-100' },
                        { title: 'NeetCode 150', desc: 'Comprehensive Pattern Map', accent: 'rose', color: 'text-rose-600', bg: 'bg-rose-50', bborder: 'border-rose-100' }
                     ].map((sheet) => (
                       <button key={sheet.title} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] hover:bg-white hover:border-primary/30 transition-all flex items-center justify-between group/sheet">
                         <div className="text-left">
                            <span className="text-base font-black tracking-tight text-text-primary block">{sheet.title}</span>
                            <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest mt-1">{sheet.desc}</span>
                         </div>
                         <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover/sheet:bg-primary group-hover/sheet:text-white group-hover/sheet:border-primary transition-all shadow-sm">
                           <ArrowRight className="w-5 h-5" />
                         </div>
                       </button>
                     ))}
                   </div>
                   
                   <button className="w-full mt-10 py-5 bg-primary text-white rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] transition-all shadow-2xl shadow-primary/20">
                      Unlock Expert Tracks
                   </button>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
                <div className="absolute -left-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
              </div>
              
              {/* Daily Streak */}
              <div className="saas-card p-12 bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-[48px] flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[24px] bg-rose-50 flex items-center justify-center border border-rose-100">
                       <Zap className="w-8 h-8 text-rose-500 fill-rose-500" />
                    </div>
                    <div>
                       <div className="text-3xl font-black text-text-primary tracking-tighter">12 Days</div>
                       <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest mt-1">Current Streak</div>
                    </div>
                 </div>
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                          {i}
                       </div>
                    ))}
                 </div>
              </div>

            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
