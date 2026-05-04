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
  Terminal,
  Coffee,
  Code2
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

const LANGUAGE_TRACK: Subject[] = [
  {
    id: "cpp-fundamentals",
    title: "C++ Fundamentals",
    icon: Code2,
    topics: [
      { id: "cpp-1", title: "Variables, Data Types, and Operators", estimatedTime: "45m", difficulty: "Beginner" },
      { id: "cpp-2", title: "Conditional Statements and Loops", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "cpp-3", title: "Functions and Recursion", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "cpp-4", title: "Arrays and Strings", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "cpp-5", title: "Pointers and References", estimatedTime: "2.5h", difficulty: "Advanced" },
      { id: "cpp-6", title: "Object-Oriented Programming (OOP)", estimatedTime: "2h", difficulty: "Intermediate" },
      { id: "cpp-7", title: "Classes and Objects", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "cpp-8", title: "Inheritance and Polymorphism", estimatedTime: "2h", difficulty: "Intermediate" },
      { id: "cpp-9", title: "Abstraction and Encapsulation", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "cpp-10", title: "Exception Handling", estimatedTime: "1h", difficulty: "Intermediate" },
      { id: "cpp-11", title: "STL (Vector, Stack, Queue, Map, Set)", estimatedTime: "3.5h", difficulty: "Advanced" },
    ]
  },
  {
    id: "java-fundamentals",
    title: "Java Fundamentals",
    icon: Coffee,
    topics: [
      { id: "java-1", title: "Variables, Data Types, and Operators", estimatedTime: "45m", difficulty: "Beginner" },
      { id: "java-2", title: "Conditional Statements and Loops", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "java-3", title: "Methods and Recursion", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "java-4", title: "Arrays and Strings", estimatedTime: "1.5h", difficulty: "Beginner" },
      { id: "java-5", title: "Object-Oriented Programming (OOP)", estimatedTime: "2h", difficulty: "Intermediate" },
      { id: "java-6", title: "Classes and Objects", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "java-7", title: "Inheritance and Polymorphism", estimatedTime: "2h", difficulty: "Intermediate" },
      { id: "java-8", title: "Abstraction and Encapsulation", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "java-9", title: "Exception Handling", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "java-10", title: "Collections Framework", estimatedTime: "4h", difficulty: "Advanced" },
      { id: "java-11", title: "Multithreading Basics", estimatedTime: "3h", difficulty: "Advanced" },
    ]
  }
];

export default function CSELanguagePage() {
  const router = useRouter();
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [expandedSubject, setExpandedSubject] = useState<string | null>("cpp-fundamentals");
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("cse-languages-progress");
    if (saved) {
      setCompletedTopics(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cse-languages-progress", JSON.stringify(completedTopics));
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

  const totalTopics = LANGUAGE_TRACK.reduce((acc, sub) => acc + sub.topics.length, 0);
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
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 pt-8 pb-4 px-6 md:px-12">
          <Link href="/roadmaps/cse" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Software Hub
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Programming Mastery</h1>
              <p className="text-lg text-slate-400 max-w-2xl">Master the deep mechanics of C++ and Java to crush technical interviews and machine coding rounds.</p>
            </div>
          </div>

          {/* Dashboard Summary Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="glass-card p-4 border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-black text-indigo-400">{LANGUAGE_TRACK.length}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Total Languages</div>
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
                <div className="text-2xl font-black text-blue-400">{progressPercent}%</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Overall Progress</div>
              </div>
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-blue-500/30"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </header>

        <main className="w-full px-6 md:px-12 py-12">
          <div className="space-y-6">
            {LANGUAGE_TRACK.map((subject, sIdx) => {
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
                  className={`glass-card border overflow-hidden transition-all duration-500 ${isExpanded ? 'border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : 'border-white/5 hover:border-white/20'}`}
                >
                  {/* Subject Header */}
                  <div 
                    className={`p-8 cursor-pointer flex items-center justify-between transition-colors ${isExpanded ? 'bg-indigo-500/5' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}
                    onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
                  >
                    <div className="flex items-center gap-8 flex-1">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${allSubjectDone ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-indigo-400'}`}>
                        {allSubjectDone ? <CheckCircle2 className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h2 className="text-2xl font-black text-white tracking-tight">{subject.title}</h2>
                          {allSubjectDone && (
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded border border-emerald-500/20">Certified</span>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                              initial={{ width: 0 }}
                              animate={{ width: `${subjectPercent}%` }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-500">{subjectPercent}% Mastery Level</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-500 transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <ChevronDown className="w-6 h-6" />
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
                        <div className="px-8 pb-8 pt-4 border-t border-white/5 bg-slate-950/30">
                          <div className="flex justify-between items-center mb-8 pt-2">
                            <span className="text-xs text-indigo-400 font-black uppercase tracking-[0.2em]">Curriculum Breakdown</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                markSubjectComplete(subject);
                              }}
                              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-black uppercase tracking-widest transition-colors flex items-center gap-2 py-2 px-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20"
                            >
                              <Check className="w-3 h-3" /> Mark All Complete
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {subject.topics.map((topic, tIdx) => {
                              const isDone = completedTopics.includes(topic.id);
                              return (
                                <motion.div
                                  key={topic.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: tIdx * 0.05 }}
                                  onClick={() => toggleTopic(topic.id)}
                                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center justify-between group ${isDone ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-indigo-500/40'}`}
                                >
                                  <div className="flex items-center gap-5">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'bg-white/5 border-white/20 text-transparent group-hover:border-indigo-500/50'}`}>
                                      <Check className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <h4 className={`text-base font-bold transition-colors ${isDone ? 'text-slate-500 line-through' : 'text-slate-200 group-hover:text-white'}`}>
                                        {topic.title}
                                      </h4>
                                      <div className="flex items-center gap-4 mt-2">
                                        <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                          <Clock className="w-3.5 h-3.5" /> {topic.estimatedTime}
                                        </span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-tight ${
                                          topic.difficulty === 'Beginner' ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20' :
                                          topic.difficulty === 'Intermediate' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' :
                                          'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                                        }`}>
                                          {topic.difficulty}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Zap className="w-5 h-5 text-indigo-400" />
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
            className="mt-20 p-12 glass-card text-center border border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 to-transparent relative overflow-hidden"
          >
            <div className="relative z-10">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-8 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
              <h3 className="text-4xl font-black text-white mb-6 tracking-tight">Language Specialist Path</h3>
              <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg leading-relaxed">Deep knowledge of your primary language's internals is often the deciding factor in high-stakes technical interviews at product companies.</p>
              <Link href="/roadmaps/cse" className="btn-primary inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 border-indigo-500 text-lg py-4 px-10 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
                Return to Software Hub <ArrowLeft className="w-6 h-6 rotate-180" />
              </Link>
            </div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
