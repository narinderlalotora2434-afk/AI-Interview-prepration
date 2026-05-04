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
  Calculator,
  Pencil,
  Languages,
  BarChart3,
  Search,
  Target
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

const APTITUDE_TRACK: Subject[] = [
  {
    id: "quantitative",
    title: "Quantitative Aptitude",
    icon: Calculator,
    topics: [
      { id: "quant-1", title: "Percentage", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "quant-2", title: "Profit and Loss", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "quant-3", title: "Simple Interest and Compound Interest", estimatedTime: "2h", difficulty: "Intermediate" },
      { id: "quant-4", title: "Ratio and Proportion", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "quant-5", title: "Average", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "quant-6", title: "Time and Work", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "quant-7", title: "Pipes and Cisterns", estimatedTime: "1h", difficulty: "Intermediate" },
      { id: "quant-8", title: "Time, Speed and Distance", estimatedTime: "2h", difficulty: "Intermediate" },
      { id: "quant-9", title: "Boats and Streams", estimatedTime: "1.5h", difficulty: "Advanced" },
      { id: "quant-10", title: "Permutation and Combination", estimatedTime: "2.5h", difficulty: "Advanced" },
      { id: "quant-11", title: "Probability", estimatedTime: "2h", difficulty: "Advanced" },
      { id: "quant-12", title: "Number System", estimatedTime: "2.5h", difficulty: "Advanced" },
      { id: "quant-13", title: "HCF and LCM", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "quant-14", title: "Simplification", estimatedTime: "1.5h", difficulty: "Beginner" },
      { id: "quant-15", title: "Mixtures and Alligations", estimatedTime: "2h", difficulty: "Advanced" },
    ]
  },
  {
    id: "logical",
    title: "Logical Reasoning",
    icon: Brain,
    topics: [
      { id: "logic-1", title: "Number Series", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "logic-2", title: "Letter Series", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "logic-3", title: "Coding-Decoding", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "logic-4", title: "Blood Relations", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "logic-5", title: "Direction Sense", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "logic-6", title: "Seating Arrangement", estimatedTime: "2.5h", difficulty: "Advanced" },
      { id: "logic-7", title: "Puzzles", estimatedTime: "3h", difficulty: "Advanced" },
      { id: "logic-8", title: "Syllogism", estimatedTime: "2h", difficulty: "Advanced" },
      { id: "logic-9", title: "Statement and Assumptions", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "logic-10", title: "Statement and Conclusions", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "logic-11", title: "Data Sufficiency", estimatedTime: "2h", difficulty: "Advanced" },
      { id: "logic-12", title: "Analogy", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "logic-13", title: "Odd One Out", estimatedTime: "1h", difficulty: "Beginner" },
    ]
  },
  {
    id: "verbal",
    title: "Verbal Ability",
    icon: Languages,
    topics: [
      { id: "verbal-1", title: "Reading Comprehension", estimatedTime: "2h", difficulty: "Intermediate" },
      { id: "verbal-2", title: "Sentence Correction", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "verbal-3", title: "Error Detection", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "verbal-4", title: "Fill in the Blanks", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "verbal-5", title: "Para Jumbles", estimatedTime: "2h", difficulty: "Advanced" },
      { id: "verbal-6", title: "Synonyms and Antonyms", estimatedTime: "2h", difficulty: "Intermediate" },
      { id: "verbal-7", title: "Vocabulary", estimatedTime: "3h", difficulty: "Advanced" },
      { id: "verbal-8", title: "Sentence Completion", estimatedTime: "1h", difficulty: "Beginner" },
      { id: "verbal-9", title: "Idioms and Phrases", estimatedTime: "2h", difficulty: "Intermediate" },
      { id: "verbal-10", title: "One Word Substitution", estimatedTime: "1.5h", difficulty: "Intermediate" },
    ]
  },
  {
    id: "di",
    title: "Data Interpretation",
    icon: BarChart3,
    topics: [
      { id: "di-1", title: "Tables", estimatedTime: "1.5h", difficulty: "Beginner" },
      { id: "di-2", title: "Bar Graphs", estimatedTime: "1.5h", difficulty: "Beginner" },
      { id: "di-3", title: "Pie Charts", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "di-4", title: "Line Graphs", estimatedTime: "1.5h", difficulty: "Intermediate" },
      { id: "di-5", title: "Caselet DI", estimatedTime: "2.5h", difficulty: "Advanced" },
      { id: "di-6", title: "Mixed Graphs", estimatedTime: "2.5h", difficulty: "Advanced" },
      { id: "di-7", title: "Data Sufficiency", estimatedTime: "2h", difficulty: "Intermediate" },
    ]
  }
];

export default function AptitudeRoadmapPage() {
  const router = useRouter();
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [expandedSubject, setExpandedSubject] = useState<string | null>("quantitative");
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("aptitude-roadmap-progress");
    if (saved) {
      setCompletedTopics(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("aptitude-roadmap-progress", JSON.stringify(completedTopics));
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

  const totalTopics = APTITUDE_TRACK.reduce((acc, sub) => acc + sub.topics.length, 0);
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
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>

        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 pt-8 pb-4 px-6 md:px-12">
          <Link href="/roadmaps" className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 font-medium mb-6 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Roadmaps
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Aptitude Preparation</h1>
              <p className="text-lg text-slate-400 max-w-2xl">Master Quantitative, Logical, and Verbal skills required for AMCAT, eLitmus, and major company recruitment rounds.</p>
            </div>
          </div>

          {/* Dashboard Summary Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="glass-card p-4 border border-white/10 bg-white/5 flex flex-col items-center justify-center text-center">
              <div className="text-2xl font-black text-pink-400">{APTITUDE_TRACK.length}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Total Categories</div>
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
                <div className="text-2xl font-black text-pink-500">{progressPercent}%</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-1">Overall Mastery</div>
              </div>
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-pink-500/30"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </header>

        <main className="w-full px-6 md:px-12 py-12">
          <div className="space-y-6">
            {APTITUDE_TRACK.map((subject, sIdx) => {
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
                  className={`glass-card border overflow-hidden transition-all duration-500 ${isExpanded ? 'border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.1)]' : 'border-white/5 hover:border-white/20'}`}
                >
                  {/* Subject Header */}
                  <div 
                    className={`p-6 cursor-pointer flex items-center justify-between transition-colors ${isExpanded ? 'bg-pink-500/5' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}
                    onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${allSubjectDone ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-pink-400'}`}>
                        {allSubjectDone ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-xl font-bold text-white tracking-tight">{subject.title}</h2>
                          {allSubjectDone && (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase rounded border border-emerald-500/20">Aptitude Ace</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-pink-500 shadow-[0_0_10px_#ec4899]"
                              initial={{ width: 0 }}
                              animate={{ width: `${subjectPercent}%` }}
                              transition={{ duration: 0.8 }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-500">{subjectPercent}% Mastery</span>
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
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Curriculum Breakdown</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                markSubjectComplete(subject);
                              }}
                              className="text-[10px] text-pink-400 hover:text-pink-300 font-black uppercase tracking-widest transition-colors flex items-center gap-1.5"
                            >
                              <Check className="w-3 h-3" /> Mark All Complete
                            </button>
                          </div>
                          
                          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {subject.topics.map((topic, tIdx) => {
                              const isDone = completedTopics.includes(topic.id);
                              return (
                                <motion.div
                                  key={topic.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: tIdx * 0.05 }}
                                  onClick={() => toggleTopic(topic.id)}
                                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex items-center justify-between group ${isDone ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-pink-500/30'}`}
                                >
                                  <div className="flex items-center gap-4">
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-white/20 text-transparent group-hover:border-pink-500/50'}`}>
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
                                    <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400">
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
            className="mt-16 p-10 glass-card text-center border border-white/10 bg-gradient-to-br from-pink-600/10 to-transparent relative overflow-hidden"
          >
            <div className="relative z-10">
              <Trophy className="w-12 h-12 text-pink-400 mx-auto mb-6 shadow-[0_0_20px_#ec4899]" />
              <h3 className="text-2xl font-bold text-white mb-4">Cracking Corporate Tests</h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">Mastering aptitude is the first barrier to any major company recruitment. This roadmap ensures you clear AMCAT, eLitmus, and company assessments with ease.</p>
              <Link href="/roadmaps" className="btn-primary inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                Back to Dashboard <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
