"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ChevronRight, 
  Menu, 
  Code, 
  Cpu, 
  Wrench, 
  Map as MapIcon, 
  Brain,
  Sparkles,
  TrendingUp,
  Target,
  ArrowRight
} from "lucide-react";
import { getBaseUrl } from "@/lib/api";
import Sidebar from "@/components/Sidebar";

interface Branch {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName: string;
  difficulty: string;
  topRecruiters: string;
  salaryRange: string;
}

export default function RoadmapsDashboard() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const cachedRoadmaps = localStorage.getItem("roadmaps_cache");
    if (cachedRoadmaps) {
      try {
        setBranches(JSON.parse(cachedRoadmaps));
        setLoading(false);
      } catch {
        localStorage.removeItem("roadmaps_cache");
      }
    }

    fetch(`${getBaseUrl()}/api/roadmaps/branches`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setBranches(data);
        localStorage.setItem("roadmaps_cache", JSON.stringify(data));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  const filteredBranches = branches.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary selection:bg-primary/10 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 md:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-text-primary">Career Roadmaps</h1>
              <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em]">Expert curated learning paths</p>
            </div>
          </div>
          
          <div className="hidden lg:block relative w-[400px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text"
              placeholder="Search career paths..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5 transition-all text-text-primary placeholder:text-text-secondary shadow-sm"
            />
          </div>

          <div className="flex items-center gap-4">
             <div className="px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hidden sm:flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> AI-Optimized Paths
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 no-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-16">
            
            {/* Hero Banner */}
            <div className="relative rounded-[32px] md:rounded-[40px] overflow-hidden bg-white border border-slate-100 p-8 md:p-16 shadow-xl shadow-slate-200/50 group">
               <div className="absolute top-0 right-0 p-16 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                  <TrendingUp className="w-80 h-80 rotate-12" />
               </div>
               <div className="relative z-10 max-w-3xl space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                    <Target className="w-4 h-4" /> Global Career Standards
                  </div>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tighter text-text-primary">
                    Bridge the gap between <span className="text-primary italic">Campus</span> and <span className="text-secondary italic">Corporate</span>.
                  </h2>
                  <p className="text-text-secondary text-xl font-medium max-w-xl leading-relaxed">
                    Follow step-by-step career tracks architected by engineers from NVIDIA, Google, and Microsoft.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                     <button className="btn-primary w-full sm:w-auto px-10 py-4 text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                        Get Personalized Path <ArrowRight className="w-5 h-5" />
                     </button>
                     <span className="text-text-secondary text-sm font-bold flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        12,400+ students active
                     </span>
                  </div>
               </div>
            </div>

            {/* Grid Section */}
            <div className="space-y-10">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-3 text-text-primary">
                     <MapIcon className="w-6 md:w-7 h-6 md:h-7 text-primary" /> Engineering Specializations
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] bg-white border border-slate-100 px-4 py-2 rounded-full shadow-sm w-fit">
                     Showing {filteredBranches.length + 1} Professional Paths
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                  <AnimatePresence mode="popLayout">
                    {loading && branches.length === 0 ? (
                      [1, 2, 3, 4, 5, 6].map(i => (
                        <motion.div 
                          key={`skeleton-${i}`} 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="saas-card h-[450px] animate-pulse bg-white border-slate-100 shadow-lg" 
                        />
                      ))
                    ) : (
                      [
                        ...filteredBranches.map((branch, idx) => (
                          <motion.div 
                            key={branch.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <Link href={`/roadmaps/${branch.slug}`} className="group block h-full">
                              <div className="saas-card p-6 md:p-10 h-full flex flex-col hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 bg-white">
                                <div className="flex items-start justify-between mb-10">
                                  <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-500 text-primary group-hover:text-white">
                                    {branch.iconName === 'Code' ? <Code className="w-8 h-8" /> :
                                     branch.iconName === 'Cpu' ? <Cpu className="w-8 h-8" /> :
                                     branch.iconName === 'Wrench' ? <Wrench className="w-8 h-8" /> :
                                     <MapIcon className="w-8 h-8" />}
                                  </div>
                                  <div className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                                    {branch.difficulty}
                                  </div>
                                </div>

                                <h3 className="text-3xl font-black mb-4 tracking-tight text-text-primary group-hover:text-primary transition-colors">{branch.name}</h3>
                                <p className="text-text-secondary text-base mb-10 flex-1 line-clamp-3 leading-relaxed font-medium">{branch.description}</p>

                                <div className="space-y-8">
                                  <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                     <div className="flex -space-x-3">
                                        {(JSON.parse(branch.topRecruiters) as string[]).slice(0, 3).map((comp: string, i: number) => (
                                          <div key={i} className="w-11 h-11 rounded-full bg-white border-2 border-slate-50 flex items-center justify-center text-xs font-black text-text-primary shadow-sm hover:z-10 transition-all cursor-default">
                                             {comp.substring(0, 1)}
                                          </div>
                                        ))}
                                     </div>

                                  </div>
                                  <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.3em] text-primary group-hover:gap-2 transition-all">
                                    <span>Explore Roadmap</span>
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                      <ChevronRight className="w-6 h-6" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        )),
                        
                        <motion.div 
                          key="aptitude"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: filteredBranches.length * 0.05 }}
                        >
                          <Link href="/roadmaps/aptitude" className="group block h-full">
                            <div className="saas-card p-6 md:p-10 h-full flex flex-col border-rose-100 bg-rose-50/20 hover:border-rose-300 transition-all duration-500 hover:shadow-2xl hover:shadow-rose-100 bg-white">
                              <div className="flex items-start justify-between mb-10">
                                <div className="w-16 h-16 rounded-[24px] bg-rose-50 flex items-center justify-center border border-rose-100 group-hover:bg-rose-500 group-hover:border-rose-500 group-hover:shadow-lg group-hover:shadow-rose-500/20 transition-all duration-500 text-rose-500 group-hover:text-white shadow-sm">
                                  <Brain className="w-8 h-8" />
                                </div>
                                <div className="px-4 py-1.5 rounded-full bg-rose-100/50 border border-rose-200 text-[9px] font-black text-rose-600 uppercase tracking-[0.2em]">
                                  CORE PREP
                                </div>
                              </div>

                              <h3 className="text-3xl font-black mb-4 tracking-tight text-text-primary group-hover:text-rose-600 transition-colors">Aptitude Mastery</h3>
                              <p className="text-text-secondary text-base mb-10 flex-1 leading-relaxed font-medium">Master Quantitative, Logical, and Verbal skills required for all major company assessment rounds.</p>

                              <div className="space-y-8">
                                <div className="pt-8 border-t border-rose-100 flex items-center gap-3">
                                  {["AMCAT", "eLitmus", "TCS iQN"].map((comp, i) => (
                                    <span key={i} className="text-[9px] px-3 py-1.5 bg-white text-text-secondary rounded-lg border border-rose-100 font-black uppercase tracking-widest shadow-sm">{comp}</span>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-[0.3em] text-rose-600 group-hover:gap-2 transition-all">
                                  <span>Start Mastery</span>
                                  <div className="w-10 h-10 rounded-xl bg-rose-500/5 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-all">
                                    <ChevronRight className="w-6 h-6" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ]
                    )}
                  </AnimatePresence>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
