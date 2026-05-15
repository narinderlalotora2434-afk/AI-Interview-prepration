"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  ChevronDown, 
  Clock, 
  Zap, 
  Trophy, 
  BookOpen,
  LayoutDashboard,
  Check,
  Map as MapIcon,
  User,
  LogOut,
  Bot,
  Menu,
  X,
  Brain,
  Code,
  MessageSquare,
  FileText,
  Cpu,
  Microscope,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";

// --- Data Structure ---

interface Topic {
  id: string;
  title: string;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

interface SubCategory {
  id: string;
  title: string;
  topics: Topic[];
}

interface Pathway {
  id: string;
  title: string;
  icon: React.ElementType;
  categories: SubCategory[];
}

const VLSI_TRACK: Pathway[] = [
  {
    id: "frontend-design",
    title: "Frontend Design (RTL)",
    icon: Code,
    categories: [
      {
        id: "cmos-fundamentals",
        title: "CMOS Fundamentals",
        topics: [
          { id: "vlsi-1", title: "CMOS Inverter", estimatedTime: "1.5h", difficulty: "Beginner" },
          { id: "vlsi-2", title: "MOSFET Operating Regions", estimatedTime: "1h", difficulty: "Intermediate" },
          { id: "vlsi-3", title: "CMOS Logic Gates", estimatedTime: "1h", difficulty: "Beginner" },
          { id: "vlsi-4", title: "Propagation Delay", estimatedTime: "2h", difficulty: "Intermediate" },
          { id: "vlsi-5", title: "Power Dissipation", estimatedTime: "1.5h", difficulty: "Advanced" },
          { id: "vlsi-6", title: "Basic Fabrication Process", estimatedTime: "2h", difficulty: "Intermediate" },
        ]
      },
      {
        id: "verilog-sv",
        title: "Verilog / SystemVerilog",
        topics: [
          { id: "vlsi-7", title: "Module and Port Declaration", estimatedTime: "30m", difficulty: "Beginner" },
          { id: "vlsi-8", title: "Data Types and Operators", estimatedTime: "45m", difficulty: "Beginner" },
          { id: "vlsi-9", title: "Continuous vs Procedural Assignment", estimatedTime: "1h", difficulty: "Intermediate" },
          { id: "vlsi-10", title: "Always Blocks", estimatedTime: "1h", difficulty: "Intermediate" },
          { id: "vlsi-11", title: "Blocking vs Non-Blocking Assignment", estimatedTime: "1.5h", difficulty: "Advanced" },
          { id: "vlsi-12", title: "Conditional & Case Statements", estimatedTime: "1h", difficulty: "Intermediate" },
          { id: "vlsi-13", title: "Finite State Machines (FSM)", estimatedTime: "2.5h", difficulty: "Advanced" },
          { id: "vlsi-14", title: "Testbench Writing", estimatedTime: "2h", difficulty: "Advanced" },
          { id: "vlsi-15", title: "SystemVerilog Basics", estimatedTime: "3h", difficulty: "Advanced" },
        ]
      },
      {
        id: "uvm-basics",
        title: "UVM Basics",
        topics: [
          { id: "vlsi-16", title: "Verification Fundamentals", estimatedTime: "1.5h", difficulty: "Intermediate" },
          { id: "vlsi-17", title: "UVM Components", estimatedTime: "2h", difficulty: "Advanced" },
          { id: "vlsi-18", title: "Sequence and Sequencer", estimatedTime: "1.5h", difficulty: "Advanced" },
          { id: "vlsi-19", title: "Driver and Monitor", estimatedTime: "2h", difficulty: "Advanced" },
          { id: "vlsi-20", title: "Scoreboard", estimatedTime: "1.5h", difficulty: "Advanced" },
          { id: "vlsi-21", title: "Basic Testbench Architecture", estimatedTime: "2h", difficulty: "Advanced" },
        ]
      }
    ]
  },
  {
    id: "backend-design",
    title: "Backend Design (Physical)",
    icon: Cpu,
    categories: [
      {
        id: "sta",
        title: "Static Timing Analysis (STA)",
        topics: [
          { id: "vlsi-22", title: "Setup Time and Hold Time", estimatedTime: "2h", difficulty: "Advanced" },
          { id: "vlsi-23", title: "Clock Skew and Clock Jitter", estimatedTime: "1.5h", difficulty: "Intermediate" },
          { id: "vlsi-24", title: "Critical Path Analysis", estimatedTime: "2h", difficulty: "Advanced" },
          { id: "vlsi-25", title: "Slack Calculation", estimatedTime: "1h", difficulty: "Advanced" },
          { id: "vlsi-26", title: "Timing Violations", estimatedTime: "1.5h", difficulty: "Advanced" },
          { id: "vlsi-27", title: "Timing Closure Basics", estimatedTime: "2h", difficulty: "Advanced" },
        ]
      },
      {
        id: "synthesis",
        title: "Synthesis",
        topics: [
          { id: "vlsi-28", title: "RTL to Gate-Level Conversion", estimatedTime: "1.5h", difficulty: "Intermediate" },
          { id: "vlsi-29", title: "Synthesis Constraints", estimatedTime: "2h", difficulty: "Advanced" },
          { id: "vlsi-30", title: "Area Optimization", estimatedTime: "1.5h", difficulty: "Advanced" },
          { id: "vlsi-31", title: "Timing Optimization", estimatedTime: "1.5h", difficulty: "Advanced" },
          { id: "vlsi-32", title: "Power Optimization", estimatedTime: "1.5h", difficulty: "Advanced" },
        ]
      },
      {
        id: "dft",
        title: "Design for Testability (DFT)",
        topics: [
          { id: "vlsi-33", title: "Scan Chain Architecture", estimatedTime: "2.5h", difficulty: "Advanced" },
          { id: "vlsi-34", title: "Scan Insertion", estimatedTime: "2h", difficulty: "Advanced" },
          { id: "vlsi-35", title: "ATPG Basics", estimatedTime: "1.5h", difficulty: "Advanced" },
          { id: "vlsi-36", title: "Fault Models", estimatedTime: "1.5h", difficulty: "Advanced" },
          { id: "vlsi-37", title: "Boundary Scan Fundamentals", estimatedTime: "2h", difficulty: "Advanced" },
        ]
      }
    ]
  }
];

export default function VLSITrackPage() {
  const router = useRouter();
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [expandedPathway, setExpandedPathway] = useState<string | null>("frontend-design");
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("ece-vlsi-progress");
    if (saved) {
      setCompletedTopics(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("ece-vlsi-progress", JSON.stringify(completedTopics));
    }
  }, [completedTopics, mounted]);

  const toggleTopic = (topicId: string) => {
    setCompletedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId) 
        : [...prev, topicId]
    );
  };

  const markPathwayComplete = (pathway: Pathway) => {
    const topicIds = pathway.categories.flatMap(cat => cat.topics.map(t => t.id));
    setCompletedTopics(prev => {
      const filtered = prev.filter(id => !topicIds.includes(id));
      return [...filtered, ...topicIds];
    });
  };

  const totalTopics = VLSI_TRACK.reduce((acc, p) => acc + p.categories.reduce((a, c) => a + c.topics.length, 0), 0);
  const completedCount = completedTopics.length;
  const progressPercent = Math.round((completedCount / totalTopics) * 100);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-text-primary overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-10 pt-8 pb-4">
          <div className="max-w-[1600px] mx-auto">
            <Link href="/roadmaps/ece" className="inline-flex items-center gap-2 text-emerald-600 hover:gap-3 transition-all font-black uppercase tracking-widest text-[10px] mb-8 group">
              <ArrowLeft className="w-4 h-4" /> Back to ECE Roadmap
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <Layers className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">VLSI Track</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter mb-4">Silicon Design</h1>
                <p className="text-lg text-text-secondary max-w-3xl font-medium leading-relaxed">Elite pathways for Frontend (RTL) and Backend (Physical Design) roles at top semiconductor firms.</p>
              </div>
            </div>

            {/* Dashboard Summary Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Core Pathways", value: VLSI_TRACK.length, color: "text-emerald-600" },
                { label: "Silicon Topics", value: totalTopics, color: "text-text-primary" },
                { label: "Steps Mastered", value: completedCount, color: "text-emerald-600" },
                { label: "Silicon Readiness", value: `${progressPercent}%`, color: "text-emerald-600", isProgress: true },
              ].map((stat, i) => (
                <div key={i} className="saas-card p-6 bg-white shadow-xl shadow-slate-200/50 flex flex-col justify-center relative overflow-hidden">
                  <div className="relative z-10">
                    <div className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</div>
                    <div className="text-[10px] text-text-secondary uppercase tracking-widest font-black mt-2">{stat.label}</div>
                  </div>
                  {stat.isProgress && (
                    <motion.div 
                      className="absolute bottom-0 left-0 h-1.5 bg-emerald-500/20"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="px-10 py-16 max-w-[1600px] mx-auto">
          <div className="space-y-12">
            {VLSI_TRACK.map((pathway, pIdx) => {
              const isExpanded = expandedPathway === pathway.id;
              const pathwayTopics = pathway.categories.flatMap(c => c.topics);
              const pathwayCompletedCount = pathwayTopics.filter(t => completedTopics.includes(t.id)).length;
              const pathwayPercent = Math.round((pathwayCompletedCount / pathwayTopics.length) * 100);
              const allPathwayDone = pathwayCompletedCount === pathwayTopics.length;
              const Icon = pathway.icon;

              return (
                <motion.div 
                  key={pathway.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: pIdx * 0.1 }}
                  className={`saas-card overflow-hidden transition-all duration-500 bg-white ${isExpanded ? 'ring-2 ring-emerald-500/20 shadow-2xl shadow-slate-200' : 'hover:shadow-xl hover:shadow-slate-200/50 shadow-lg shadow-slate-200/30'}`}
                >
                  {/* Pathway Header */}
                  <div 
                    className={`p-8 cursor-pointer flex items-center justify-between transition-colors ${isExpanded ? 'bg-emerald-50/20' : 'hover:bg-slate-50/50'}`}
                    onClick={() => setExpandedPathway(isExpanded ? null : pathway.id)}
                  >
                    <div className="flex items-center gap-8 flex-1">
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border transition-all duration-500 ${allPathwayDone ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/10' : 'bg-white border-slate-100 text-emerald-600 shadow-lg shadow-slate-200/50'}`}>
                        {allPathwayDone ? <CheckCircle2 className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h2 className="text-2xl font-black text-text-primary tracking-tighter">{pathway.title}</h2>
                          {allPathwayDone && (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-full border border-emerald-100">Certified Silicon Engineer</span>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <motion.div 
                              className="h-full bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                              initial={{ width: 0 }}
                              animate={{ width: `${pathwayPercent}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                          <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{pathwayPercent}% Completion</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 transition-all duration-500 ${isExpanded ? 'bg-white shadow-md' : 'bg-transparent'}`} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <ChevronDown className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  {/* Categories & Topics Accordion Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                      >
                        <div className="px-8 pb-10 pt-4 border-t border-slate-100 space-y-12 bg-slate-50/30">
                          <div className="flex justify-between items-center pt-4">
                            <span className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-black">Silicon Architecture Syllabus</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                markPathwayComplete(pathway);
                              }}
                              className="px-5 py-2 rounded-xl bg-white border border-slate-200 text-[10px] text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" /> Mark All Complete
                            </button>
                          </div>
                          
                          <div className="space-y-12">
                            {pathway.categories.map((cat, cIdx) => (
                              <div key={cat.id} className="relative">
                                <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                                  <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
                                  {cat.title}
                                </h3>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                  {cat.topics.map((topic, tIdx) => {
                                    const isDone = completedTopics.includes(topic.id);
                                    return (
                                      <motion.div
                                        key={topic.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: tIdx * 0.05 + cIdx * 0.1 }}
                                        onClick={() => toggleTopic(topic.id)}
                                        className={`p-6 rounded-[32px] border cursor-pointer transition-all duration-500 flex items-center justify-between group ${isDone ? 'bg-emerald-50/30 border-emerald-100' : 'bg-white border-slate-100 hover:border-emerald-600/30 hover:shadow-xl hover:shadow-slate-200/50'}`}
                                      >
                                        <div className="flex items-center gap-5">
                                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 border-slate-100 text-transparent group-hover:border-emerald-600/50'}`}>
                                            <Check className="w-5 h-5" />
                                          </div>
                                          <div>
                                            <h4 className={`text-base font-black tracking-tight transition-colors ${isDone ? 'text-text-secondary line-through decoration-emerald-500/50' : 'text-text-primary group-hover:text-emerald-600'}`}>
                                              {topic.title}
                                            </h4>
                                            <div className="flex items-center gap-4 mt-2">
                                              <span className="flex items-center gap-1.5 text-[10px] text-text-secondary font-black uppercase tracking-widest">
                                                <Clock className="w-3.5 h-3.5" /> {topic.estimatedTime}
                                              </span>
                                              <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${
                                                topic.difficulty === 'Beginner' ? 'text-blue-600 bg-blue-50 border border-blue-100' :
                                                topic.difficulty === 'Intermediate' ? 'text-amber-600 bg-amber-50 border border-amber-100' :
                                                'text-rose-600 bg-rose-50 border border-rose-100'
                                              }`}>
                                                {topic.difficulty}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                                          <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-600/5">
                                            <ArrowRight className="w-5 h-5" />
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 p-16 saas-card bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-1000 rotate-12">
               <Layers className="w-96 h-96" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-emerald-600/10 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-600/5">
                <Sparkles className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-4xl font-black text-text-primary tracking-tighter mb-6">Master Silicon Engineering</h3>
              <p className="text-lg text-text-secondary mb-10 font-medium leading-relaxed">The semiconductor industry is the backbone of modern technology. Mastering VLSI design opens doors to the most prestigious engineering roles at Qualcomm, Intel, Broadcom, and MediaTek.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/roadmaps/ece" className="w-full sm:w-auto px-10 py-5 rounded-[24px] bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-emerald-600/20 hover:shadow-2xl hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-3">
                   ECE Hub <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="w-full sm:w-auto px-10 py-5 rounded-[24px] bg-white text-text-primary border border-slate-200 font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                  Silicon Reference <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
