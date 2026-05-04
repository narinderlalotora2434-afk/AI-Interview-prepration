"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
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
  Zap as ZapIcon,
  Cpu,
  Unplug,
  Terminal,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  icon: any;
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

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
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans relative">
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
        fixed md:sticky top-0 left-0 h-screen w-72 md:w-64 border-r border-white/5 bg-slate-950 p-6 flex flex-col shrink-0 z-50 transition-transform duration-300
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
            { href: "/quests", label: "Daily Quests", icon: ZapIcon, color: "text-amber-400" },
            { href: "/roadmaps", label: "Placement Roadmaps", icon: MapIcon, color: "text-indigo-400", active: true },
            { href: "/aptitude", label: "Aptitude Test", icon: Brain, color: "text-pink-400" },
            { href: "/coding", label: "Coding Simulator", icon: Code, color: "" },
            { href: "/interview", label: "Mock Interview", icon: MessageSquare, color: "" },
            { href: "/resume", label: "Resume Analyzer", icon: FileText, color: "" },
            { href: "/profile", label: "Profile", icon: User, color: "text-indigo-400" },
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                item.active ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'
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

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        {/* Background Glows */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]" />
        </div>

        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 pt-8 pb-4 px-6 md:px-12">
          <Link href="/roadmaps/ece" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to ECE Roadmap
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Embedded Systems Track</h1>
              <p className="text-lg text-slate-400 max-w-2xl">Master Embedded Software, RTOS, and Hardware Protocols for elite firmware and system roles.</p>
            </div>
          </div>

          {/* Dashboard Summary Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="glass-card p-4 border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-black text-amber-500">{EMBEDDED_TRACK.length}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Total Tracks</div>
            </div>
            <div className="glass-card p-4 border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-black text-white">{totalTopics}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Total Topics</div>
            </div>
            <div className="glass-card p-4 border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-black text-emerald-400">{completedCount}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Completed</div>
            </div>
            <div className="glass-card p-4 border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-2xl font-black text-orange-400">{progressPercent}%</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Overall Progress</div>
              </div>
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-orange-500/30"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </header>

        <main className="w-full px-6 md:px-12 py-12">
          <div className="space-y-8">
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
                  className={`glass-card border overflow-hidden transition-all duration-500 ${isExpanded ? 'border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.15)]' : 'border-white/5 hover:border-white/20'}`}
                >
                  {/* Pathway Header */}
                  <div 
                    className={`p-8 cursor-pointer flex items-center justify-between transition-colors ${isExpanded ? 'bg-amber-500/5' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}
                    onClick={() => setExpandedPathway(isExpanded ? null : pathway.id)}
                  >
                    <div className="flex items-center gap-8 flex-1">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${allPathwayDone ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-amber-500'}`}>
                        {allPathwayDone ? <CheckCircle2 className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h2 className="text-2xl font-black text-white tracking-tight">{pathway.title}</h2>
                          {allPathwayDone && (
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded border border-emerald-500/20">Production Ready</span>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"
                              initial={{ width: 0 }}
                              animate={{ width: `${pathwayPercent}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-500">{pathwayPercent}% Completion reached</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <ChevronDown className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Categories & Topics Accordion Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <div className="px-8 pb-8 pt-4 border-t border-white/5 bg-slate-950/40">
                          <div className="flex justify-between items-center mb-8 pt-2">
                            <span className="text-xs text-amber-500 font-black uppercase tracking-[0.2em]">Syllabus Breakdown</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                markPathwayComplete(pathway);
                              }}
                              className="text-[10px] text-amber-500 hover:text-amber-400 font-black uppercase tracking-widest transition-colors flex items-center gap-2 py-2 px-4 rounded-lg bg-amber-500/5 border border-amber-500/20"
                            >
                              <Check className="w-3 h-3" /> Mark All Complete
                            </button>
                          </div>
                          
                          <div className="space-y-10">
                            {pathway.categories.map((cat, cIdx) => (
                              <div key={cat.id} className="relative">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                                  {cat.title}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {cat.topics.map((topic, tIdx) => {
                                    const isDone = completedTopics.includes(topic.id);
                                    return (
                                      <motion.div
                                        key={topic.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: tIdx * 0.05 + cIdx * 0.1 }}
                                        onClick={() => toggleTopic(topic.id)}
                                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between group ${isDone ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-amber-500/40'}`}
                                      >
                                        <div className="flex items-center gap-4">
                                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/5 border-white/20 text-transparent group-hover:border-amber-500/50'}`}>
                                            <Check className="w-4 h-4" />
                                          </div>
                                          <div>
                                            <h4 className={`text-sm font-bold transition-colors ${isDone ? 'text-slate-500 line-through' : 'text-slate-200 group-hover:text-white'}`}>
                                              {topic.title}
                                            </h4>
                                            <div className="flex items-center gap-3 mt-1">
                                              <span className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                                <Clock className="w-3 h-3" /> {topic.estimatedTime}
                                              </span>
                                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-tighter ${
                                                topic.difficulty === 'Beginner' ? 'text-blue-400 bg-blue-500/10' :
                                                topic.difficulty === 'Intermediate' ? 'text-amber-400 bg-amber-500/10' :
                                                'text-rose-400 bg-rose-500/10'
                                              }`}>
                                                {topic.difficulty}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Zap className="w-4 h-4 text-amber-500" />
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 p-12 glass-card text-center border border-amber-500/20 bg-gradient-to-br from-amber-600/10 to-transparent relative overflow-hidden"
          >
            <div className="relative z-10">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
              <h3 className="text-3xl font-black text-white mb-4 tracking-tight">Firmware Excellence</h3>
              <p className="text-slate-400 mb-10 max-w-lg mx-auto text-lg leading-relaxed">Prepare for specialized roles at Bosch, Continental, Tesla, and aerospace giants with our industry-vetted track.</p>
              <Link href="/roadmaps/ece" className="btn-primary inline-flex items-center gap-3 bg-amber-600 hover:bg-amber-700 border-amber-500 text-lg py-4 px-8 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                Return to ECE Hub <ArrowLeft className="w-6 h-6 rotate-180" />
              </Link>
            </div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]" />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
