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
  Layers,
  Server,
  Cpu,
  Globe,
  Database,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Data Structure ---

interface Topic {
  id: string;
  title: string;
  estimatedTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

interface Subject {
  id: string;
  title: string;
  icon: any;
  topics: Topic[];
}

const SYSTEM_DESIGN_TRACK: Subject[] = [
  {
    id: "lld",
    title: "Low Level Design (LLD)",
    icon: Cpu,
    topics: [
      { id: "lld-1", title: "Object-Oriented Design Principles", estimatedTime: "1h", difficulty: "Intermediate" },
      { id: "lld-2", title: "SOLID Principles", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "lld-3", title: "Common Design Patterns", estimatedTime: "3h", difficulty: "Advanced" },
      { id: "lld-4", title: "UML Class Diagrams", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "lld-5", title: "Sequence Diagrams", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "lld-6", title: "Interface Design", estimatedTime: "1h", difficulty: "Intermediate" },
      { id: "lld-7", title: "Dependency Injection", estimatedTime: "1.5h", difficulty: "Advanced" },
      { id: "lld-8", title: "Designing Parking Lot", estimatedTime: "2.5h", difficulty: "Advanced" },
      { id: "lld-9", title: "Designing Elevator System", estimatedTime: "2.5h", difficulty: "Advanced" },
      { id: "lld-10", title: "Designing Library Management System", estimatedTime: "2h", difficulty: "Intermediate" },
    ]
  },
  {
    id: "hld",
    title: "High Level Design (HLD)",
    icon: Globe,
    topics: [
      { id: "hld-1", title: "Scalability Fundamentals", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "hld-2", title: "Load Balancing", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "hld-3", title: "Caching", estimatedTime: "2h", difficulty: "Intermediate" },
      { id: "hld-4", title: "Database Scaling", estimatedTime: "2.5h", difficulty: "Advanced" },
      { id: "hld-5", title: "Microservices Architecture", estimatedTime: "2h", difficulty: "Advanced" },
      { id: "hld-6", title: "Message Queues", estimatedTime: "2h", difficulty: "Advanced" },
      { id: "hld-7", title: "CAP Theorem", estimatedTime: "1h", difficulty: "Intermediate" },
      { id: "hld-8", title: "Consistent Hashing", estimatedTime: "2h", difficulty: "Advanced" },
      { id: "hld-9", title: "CDN Basics", estimatedTime: "1h", difficulty: "Intermediate" },
      { id: "hld-10", title: "Designing URL Shortener", estimatedTime: "3h", difficulty: "Advanced" },
      { id: "hld-11", title: "Designing Chat Application", estimatedTime: "3.5h", difficulty: "Advanced" },
    ]
  }
];

export default function CSESystemDesignPage() {
  const router = useRouter();
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [expandedSubject, setExpandedSubject] = useState<string | null>("lld");
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("cse-system-design-progress");
    if (saved) {
      setCompletedTopics(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cse-system-design-progress", JSON.stringify(completedTopics));
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

  const markSubjectComplete = (subject: Subject) => {
    const topicIds = subject.topics.map(t => t.id);
    setCompletedTopics(prev => {
      const filtered = prev.filter(id => !topicIds.includes(id));
      return [...filtered, ...topicIds];
    });
  };

  const totalTopics = SYSTEM_DESIGN_TRACK.reduce((acc, sub) => acc + sub.topics.length, 0);
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
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>

        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 pt-8 pb-4 px-6 md:px-12">
          <Link href="/roadmaps/cse" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Software Hub
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">System Design</h1>
              <p className="text-lg text-slate-400 max-w-2xl">Master LLD and HLD architectures to design scalable, fault-tolerant systems for high-stakes interviews.</p>
            </div>
          </div>

          {/* Dashboard Summary Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="glass-card p-4 border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-black text-amber-400">{SYSTEM_DESIGN_TRACK.length}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Total Sections</div>
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
                <div className="text-2xl font-black text-amber-500">{progressPercent}%</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Overall Progress</div>
              </div>
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-amber-500/30"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </header>

        <main className="w-full px-6 md:px-12 py-12">
          <div className="space-y-6">
            {SYSTEM_DESIGN_TRACK.map((subject, sIdx) => {
              const isExpanded = expandedSubject === subject.id;
              const subjectCompletedCount = subject.topics.filter(t => completedTopics.includes(t.id)).length;
              const subjectPercent = Math.round((subjectCompletedCount / subject.topics.length) * 100);
              const allSubjectDone = subjectCompletedCount === subject.topics.length;
              const Icon = subject.icon;

              return (
                <motion.div 
                  key={subject.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sIdx * 0.1 }}
                  className={`glass-card border overflow-hidden transition-all duration-500 ${isExpanded ? 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.1)]' : 'border-white/5 hover:border-white/20'}`}
                >
                  {/* Subject Header */}
                  <div 
                    className={`p-6 cursor-pointer flex items-center justify-between transition-colors ${isExpanded ? 'bg-amber-500/5' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}
                    onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${allSubjectDone ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-amber-400'}`}>
                        {allSubjectDone ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-xl font-bold text-white tracking-tight">{subject.title}</h2>
                          {allSubjectDone && (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded border border-emerald-500/20">System Architect</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b]"
                              initial={{ width: 0 }}
                              animate={{ width: `${subjectPercent}%` }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-500">{subjectPercent}% Architecture Mastery</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-500 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <ChevronDown className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Topics Accordion Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-3 bg-slate-950/30">
                          <div className="flex justify-between items-center mb-4 pt-2 px-2">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Design Curriculum</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                markSubjectComplete(subject);
                              }}
                              className="text-[10px] text-amber-400 hover:text-amber-300 font-black uppercase tracking-widest transition-colors flex items-center gap-1.5"
                            >
                              <Check className="w-3 h-3" /> Mark All Complete
                            </button>
                          </div>
                          
                          <div className="grid gap-3 md:grid-cols-2">
                            {subject.topics.map((topic, tIdx) => {
                              const isDone = completedTopics.includes(topic.id);
                              return (
                                <motion.div
                                  key={topic.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: tIdx * 0.05 }}
                                  onClick={() => toggleTopic(topic.id)}
                                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex items-center justify-between group ${isDone ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-amber-500/30'}`}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-white/20 text-transparent group-hover:border-amber-500/50'}`}>
                                      <Check className="w-4 h-4" />
                                    </div>
                                    <div>
                                      <h4 className={`text-sm font-bold transition-colors ${isDone ? 'text-slate-400 line-through decoration-emerald-500/50' : 'text-slate-200 group-hover:text-white'}`}>
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
                                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                                      <Zap className="w-4 h-4" />
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
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
            className="mt-16 p-10 glass-card text-center border border-white/10 bg-gradient-to-br from-amber-600/10 to-transparent relative overflow-hidden"
          >
            <div className="relative z-10">
              <Share2 className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Architecture Excellence</h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">Mastering System Design is the hallmark of a Senior Engineer. This track prepares you for the most challenging technical rounds at Uber, Airbnb, and Facebook.</p>
              <Link href="/roadmaps/cse" className="btn-primary inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                Back to Software Hub <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
