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
  Unplug,
  Terminal,
  Activity,
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

const EMBEDDED_TRACK: Pathway[] = [
  {
    id: "embedded-software",
    title: "Embedded Software",
    icon: Terminal,
    categories: [
      {
        id: "embedded-c",
        title: "Embedded C",
        topics: [
          { id: "emb-1", title: "Data Types and Storage Classes", estimatedTime: "45m", difficulty: "Beginner" },
          { id: "emb-2", title: "Pointers and Pointer Arithmetic", estimatedTime: "1.5h", difficulty: "Intermediate" },
          { id: "emb-3", title: "Bitwise Operators", estimatedTime: "1h", difficulty: "Beginner" },
          { id: "emb-4", title: "Structures and Unions", estimatedTime: "1h", difficulty: "Intermediate" },
          { id: "emb-5", title: "Volatile and Const Keywords", estimatedTime: "45m", difficulty: "Intermediate" },
          { id: "emb-6", title: "Memory-Mapped Registers", estimatedTime: "1.5h", difficulty: "Advanced" },
          { id: "emb-7", title: "Interrupt Handling in C", estimatedTime: "2h", difficulty: "Advanced" },
        ]
      },
      {
        id: "microcontrollers",
        title: "Microprocessors & Microcontrollers",
        topics: [
          { id: "emb-8", title: "8085 Architecture & Instruction Set", estimatedTime: "2.5h", difficulty: "Intermediate" },
          { id: "emb-9", title: "8051 Architecture & Programming", estimatedTime: "2h", difficulty: "Intermediate" },
          { id: "emb-10", title: "ARM Cortex-M Architecture", estimatedTime: "3h", difficulty: "Advanced" },
          { id: "emb-11", title: "Registers and Memory Organization", estimatedTime: "1.5h", difficulty: "Intermediate" },
          { id: "emb-12", title: "Interrupt System", estimatedTime: "1h", difficulty: "Advanced" },
          { id: "emb-13", title: "GPIO and Timer Basics", estimatedTime: "1.5h", difficulty: "Intermediate" },
        ]
      },
      {
        id: "rtos",
        title: "RTOS",
        topics: [
          { id: "emb-14", title: "RTOS Fundamentals", estimatedTime: "1h", difficulty: "Intermediate" },
          { id: "emb-15", title: "Tasks and Threads", estimatedTime: "1h", difficulty: "Intermediate" },
          { id: "emb-16", title: "Scheduling Algorithms", estimatedTime: "1.5h", difficulty: "Advanced" },
          { id: "emb-17", title: "Context Switching", estimatedTime: "1.5h", difficulty: "Advanced" },
          { id: "emb-18", title: "Mutex vs Semaphore", estimatedTime: "2h", difficulty: "Advanced" },
          { id: "emb-19", title: "Inter-Task Communication", estimatedTime: "1.5h", difficulty: "Advanced" },
          { id: "emb-20", title: "Deadlocks and Priority Inversion", estimatedTime: "2h", difficulty: "Advanced" },
        ]
      }
    ]
  },
  {
    id: "protocols-hardware",
    title: "Protocols & Hardware",
    icon: Unplug,
    categories: [
      {
        id: "comm-protocols",
        title: "Communication Protocols",
        topics: [
          { id: "emb-21", title: "UART", estimatedTime: "1h", difficulty: "Beginner" },
          { id: "emb-22", title: "SPI", estimatedTime: "1.5h", difficulty: "Intermediate" },
          { id: "emb-23", title: "I2C", estimatedTime: "1.5h", difficulty: "Intermediate" },
          { id: "emb-24", title: "CAN Bus", estimatedTime: "2.5h", difficulty: "Advanced" },
          { id: "emb-25", title: "Protocol Comparison & Apps", estimatedTime: "1h", difficulty: "Intermediate" },
          { id: "emb-26", title: "Master-Slave Communication", estimatedTime: "1h", difficulty: "Intermediate" },
        ]
      },
      {
        id: "device-drivers",
        title: "Device Drivers",
        topics: [
          { id: "emb-27", title: "Bare-Metal Programming Basics", estimatedTime: "2h", difficulty: "Advanced" },
          { id: "emb-28", title: "GPIO Driver Development", estimatedTime: "2.5h", difficulty: "Advanced" },
          { id: "emb-29", title: "Interrupt Service Routines (ISR)", estimatedTime: "1.5h", difficulty: "Advanced" },
          { id: "emb-30", title: "Linux Device Driver Fundamentals", estimatedTime: "3h", difficulty: "Advanced" },
          { id: "emb-31", title: "Character Device Drivers", estimatedTime: "2.5h", difficulty: "Advanced" },
          { id: "emb-32", title: "Memory-Mapped I/O", estimatedTime: "1.5h", difficulty: "Advanced" },
        ]
      }
    ]
  }
];

export default function EmbeddedTrackPage() {
  const router = useRouter();
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [expandedPathway, setExpandedPathway] = useState<string | null>("embedded-software");
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("ece-embedded-progress");
    if (saved) {
      setCompletedTopics(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("ece-embedded-progress", JSON.stringify(completedTopics));
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

  const totalTopics = EMBEDDED_TRACK.reduce((acc, p) => acc + p.categories.reduce((a, c) => a + c.topics.length, 0), 0);
  const completedCount = completedTopics.length;
  const progressPercent = Math.round((completedCount / totalTopics) * 100);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-text-primary overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />

        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-10 pt-8 pb-4">
          <div className="max-w-[1600px] mx-auto">
            <Link href="/roadmaps/ece" className="inline-flex items-center gap-2 text-amber-600 hover:gap-3 transition-all font-black uppercase tracking-widest text-[10px] mb-8 group">
              <ArrowLeft className="w-4 h-4" /> Back to ECE Roadmap
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
                    <Terminal className="w-6 h-6 text-amber-600" />
                  </div>
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Embedded Track</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter mb-4">Embedded Systems</h1>
                <p className="text-lg text-text-secondary max-w-3xl font-medium leading-relaxed">Master Embedded Software, RTOS, and Hardware Protocols for elite firmware and system roles.</p>
              </div>
            </div>

            {/* Dashboard Summary Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Core Pathways", value: EMBEDDED_TRACK.length, color: "text-amber-600" },
                { label: "Firmware Topics", value: totalTopics, color: "text-text-primary" },
                { label: "Concepts Mastered", value: completedCount, color: "text-emerald-600" },
                { label: "System Readiness", value: `${progressPercent}%`, color: "text-amber-600", isProgress: true },
              ].map((stat, i) => (
                <div key={i} className="saas-card p-6 bg-white shadow-xl shadow-slate-200/50 flex flex-col justify-center relative overflow-hidden">
                  <div className="relative z-10">
                    <div className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</div>
                    <div className="text-[10px] text-text-secondary uppercase tracking-widest font-black mt-2">{stat.label}</div>
                  </div>
                  {stat.isProgress && (
                    <motion.div 
                      className="absolute bottom-0 left-0 h-1.5 bg-amber-500/20"
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
            {EMBEDDED_TRACK.map((pathway, pIdx) => {
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
                  className={`saas-card overflow-hidden transition-all duration-500 bg-white ${isExpanded ? 'ring-2 ring-amber-500/20 shadow-2xl shadow-slate-200' : 'hover:shadow-xl hover:shadow-slate-200/50 shadow-lg shadow-slate-200/30'}`}
                >
                  {/* Pathway Header */}
                  <div 
                    className={`p-8 cursor-pointer flex items-center justify-between transition-colors ${isExpanded ? 'bg-amber-50/20' : 'hover:bg-slate-50/50'}`}
                    onClick={() => setExpandedPathway(isExpanded ? null : pathway.id)}
                  >
                    <div className="flex items-center gap-8 flex-1">
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border transition-all duration-500 ${allPathwayDone ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/10' : 'bg-white border-slate-100 text-amber-500 shadow-lg shadow-slate-200/50'}`}>
                        {allPathwayDone ? <CheckCircle2 className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h2 className="text-2xl font-black text-text-primary tracking-tighter">{pathway.title}</h2>
                          {allPathwayDone && (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-full border border-emerald-100">Production Ready</span>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <motion.div 
                              className="h-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
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
                            <span className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-black">Firmware Syllabus Breakdown</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                markPathwayComplete(pathway);
                              }}
                              className="px-5 py-2 rounded-xl bg-white border border-slate-200 text-[10px] text-amber-500 hover:bg-amber-500 hover:text-white hover:border-amber-500 font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" /> Mark All Complete
                            </button>
                          </div>
                          
                          <div className="space-y-12">
                            {pathway.categories.map((cat, cIdx) => (
                              <div key={cat.id} className="relative">
                                <h3 className="text-sm font-black text-text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
                                  <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
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
                                        className={`p-6 rounded-[32px] border cursor-pointer transition-all duration-500 flex items-center justify-between group ${isDone ? 'bg-emerald-50/30 border-emerald-100' : 'bg-white border-slate-100 hover:border-amber-500/30 hover:shadow-xl hover:shadow-slate-200/50'}`}
                                      >
                                        <div className="flex items-center gap-5">
                                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 border-slate-100 text-transparent group-hover:border-amber-500/50'}`}>
                                            <Check className="w-5 h-5" />
                                          </div>
                                          <div>
                                            <h4 className={`text-base font-black tracking-tight transition-colors ${isDone ? 'text-text-secondary line-through decoration-emerald-500/50' : 'text-text-primary group-hover:text-amber-500'}`}>
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
                                          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-sm border border-amber-500/5">
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
               <Cpu className="w-96 h-96" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-amber-500/10 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-amber-500/5">
                <Sparkles className="w-10 h-10 text-amber-500" />
              </div>
              <h3 className="text-4xl font-black text-text-primary tracking-tighter mb-6">Master Firmware Architecture</h3>
              <p className="text-lg text-text-secondary mb-10 font-medium leading-relaxed">Prepare for specialized roles at Bosch, Continental, Tesla, and aerospace giants. Mastering embedded systems is the key to building the next generation of intelligent hardware.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/roadmaps/ece" className="w-full sm:w-auto px-10 py-5 rounded-[24px] bg-amber-500 text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-amber-500/20 hover:shadow-2xl hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-3">
                   ECE Hub <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="w-full sm:w-auto px-10 py-5 rounded-[24px] bg-white text-text-primary border border-slate-200 font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                  Firmware Guide <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
