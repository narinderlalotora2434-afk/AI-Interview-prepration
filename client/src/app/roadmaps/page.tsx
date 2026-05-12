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
  Target
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex relative z-10">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="px-8 h-20 border-b border-border flex items-center justify-between bg-background/50 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Placement Roadmaps</h1>
                <p className="text-xs text-slate-500 font-medium">Expert curated paths to top engineering roles</p>
              </div>
            </div>
            
            <div className="hidden lg:block relative w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Search career paths..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-4">
               <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest hidden sm:block">
                  AI-Optimized Learning
               </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-12">
              
              {/* Hero Banner */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent-cyan/10 border border-border p-12">
                 <div className="absolute top-0 right-0 p-12 opacity-10">
                    <TrendingUp className="w-64 h-64" />
                 </div>
                 <div className="relative z-10 max-w-2xl space-y-6">
                    <h2 className="text-4xl font-bold leading-tight">Master your core fundamentals and crack <span className="accent-gradient-text">Top Companies</span>.</h2>
                    <p className="text-muted-foreground text-lg">Follow step-by-step career tracks designed by engineers from NVIDIA, Google, and Microsoft.</p>
                    <div className="flex items-center gap-4">
                       <button className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2">
                          Get Personalized Path <ChevronRight className="w-5 h-5" />
                       </button>
                    </div>
                 </div>
              </div>

              {/* Grid Section */}
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                       <Target className="w-6 h-6 text-primary" /> Engineering Tracks
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                       Showing {filteredBranches.length + 1} Paths
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                      {loading && branches.length === 0 ? (
                        [1, 2, 3, 4, 5, 6].map(i => (
                          <motion.div 
                            key={`skeleton-${i}`} 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-card h-80 animate-pulse bg-secondary border-border" 
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
                                <div className="glass-card p-8 h-full flex flex-col hover:border-primary/50 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.1)]">
                                  <div className="flex items-start justify-between mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center border border-border group-hover:bg-primary transition-all duration-500 shadow-xl group-hover:text-primary-foreground">
                                      {branch.iconName === 'Code' ? <Code className="w-7 h-7" /> :
                                       branch.iconName === 'Cpu' ? <Cpu className="w-7 h-7" /> :
                                       branch.iconName === 'Wrench' ? <Wrench className="w-7 h-7" /> :
                                       <MapIcon className="w-7 h-7" />}
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-foreground/5 border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                                      {branch.difficulty}
                                    </div>
                                  </div>

                                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{branch.name}</h3>
                                  <p className="text-muted-foreground text-sm mb-8 flex-1 line-clamp-3 leading-relaxed">{branch.description}</p>

                                  <div className="space-y-6">
                                    <div className="pt-6 border-t border-border flex items-center justify-between">
                                       <div className="flex -space-x-3">
                                          {(JSON.parse(branch.topRecruiters) as string[]).slice(0, 3).map((comp: string, i: number) => (
                                            <div key={i} className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-lg">
                                               {comp.substring(0, 1)}
                                            </div>
                                          ))}
                                       </div>
                                       <div className="text-right">
                                          <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Avg Salary</div>
                                          <div className="text-sm font-bold text-emerald-400">{branch.salaryRange}</div>
                                       </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-bold text-primary group-hover:gap-2 transition-all">
                                      <span>Explore Roadmap</span>
                                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
                              <div className="glass-card p-8 h-full flex flex-col border-accent-pink/20 bg-accent-pink/5 hover:border-accent-pink/50 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.1)]">
                                <div className="flex items-start justify-between mb-6">
                                  <div className="w-14 h-14 rounded-2xl bg-accent-pink/20 flex items-center justify-center border border-accent-pink/30 group-hover:bg-accent-pink transition-all duration-500 shadow-xl">
                                    <Brain className="w-7 h-7" />
                                  </div>
                                  <div className="px-3 py-1 rounded-full bg-accent-pink/20 border border-accent-pink/30 text-[10px] font-bold text-accent-pink uppercase tracking-[0.2em]">
                                    CORE PREP
                                  </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-3 group-hover:text-accent-pink transition-colors">Aptitude Preparation</h3>
                                <p className="text-muted-foreground text-sm mb-8 flex-1 leading-relaxed">Master Quantitative, Logical, and Verbal skills required for all major company assessment rounds.</p>

                                <div className="space-y-6">
                                  <div className="pt-6 border-t border-border flex items-center gap-2">
                                    {["AMCAT", "eLitmus", "TCS iQN"].map((comp, i) => (
                                      <span key={i} className="text-[10px] px-3 py-1 bg-foreground/5 text-muted-foreground rounded-lg border border-border font-bold uppercase tracking-wider">{comp}</span>
                                    ))}
                                  </div>
                                  <div className="flex items-center justify-between text-sm font-bold text-accent-pink group-hover:gap-2 transition-all">
                                    <span>Start Mastery</span>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
    </div>
  );
}
