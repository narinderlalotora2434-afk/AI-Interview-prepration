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
  Coffee,
  Code2,
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

interface Subject {
  id: string;
  title: string;
  icon: React.ElementType;
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
    <div className="min-h-screen bg-[#F8FAFC] flex text-text-primary overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-10 pt-8 pb-4">
          <div className="max-w-[1600px] mx-auto">
            <Link href="/roadmaps/cse" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-black uppercase tracking-widest text-[10px] mb-8 group">
              <ArrowLeft className="w-4 h-4" /> Back to Software Hub
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
                    <Code2 className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Language Track</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter mb-4">Programming Mastery</h1>
                <p className="text-lg text-text-secondary max-w-3xl font-medium leading-relaxed">Master the deep mechanics of C++ and Java to crush technical interviews and machine coding rounds.</p>
              </div>
            </div>

            {/* Dashboard Summary Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: "Elite Languages", value: LANGUAGE_TRACK.length, color: "text-primary" },
                { label: "Syntax Milestones", value: totalTopics, color: "text-text-primary" },
                { label: "Concepts Mastered", value: completedCount, color: "text-emerald-600" },
                { label: "Language Proficiency", value: `${progressPercent}%`, color: "text-primary", isProgress: true },
              ].map((stat, i) => (
                <div key={i} className="saas-card p-6 bg-white shadow-xl shadow-slate-200/50 flex flex-col justify-center relative overflow-hidden">
                  <div className="relative z-10">
                    <div className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</div>
                    <div className="text-[10px] text-text-secondary uppercase tracking-widest font-black mt-2">{stat.label}</div>
                  </div>
                  {stat.isProgress && (
                    <motion.div 
                      className="absolute bottom-0 left-0 h-1.5 bg-primary/20"
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
          <div className="space-y-8">
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
                  className={`saas-card overflow-hidden transition-all duration-500 bg-white ${isExpanded ? 'ring-2 ring-primary/20 shadow-2xl shadow-slate-200' : 'hover:shadow-xl hover:shadow-slate-200/50 shadow-lg shadow-slate-200/30'}`}
                >
                  {/* Subject Header */}
                  <div 
                    className={`p-8 cursor-pointer flex items-center justify-between transition-colors ${isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                    onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
                  >
                    <div className="flex items-center gap-8 flex-1">
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border transition-all duration-500 ${allSubjectDone ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/10' : 'bg-white border-slate-100 text-primary shadow-lg shadow-slate-200/50'}`}>
                        {allSubjectDone ? <CheckCircle2 className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h2 className="text-2xl font-black text-text-primary tracking-tighter">{subject.title}</h2>
                          {allSubjectDone && (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-full border border-emerald-100">Certified Specialist</span>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <motion.div 
                              className="h-full bg-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                              initial={{ width: 0 }}
                              animate={{ width: `${subjectPercent}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                          <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{subjectPercent}% Proficiency</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 transition-all duration-500 ${isExpanded ? 'bg-white shadow-md' : 'bg-transparent'}`} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <ChevronDown className="w-6 h-6" />
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
                        transition={{ duration: 0.5, ease: "circOut" }}
                      >
                        <div className="px-8 pb-10 pt-4 border-t border-slate-100 space-y-6 bg-slate-50/30">
                          <div className="flex justify-between items-center mb-6 pt-4">
                            <span className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-black">Language Mechanics Syllabus</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                markSubjectComplete(subject);
                              }}
                              className="px-5 py-2 rounded-xl bg-white border border-slate-200 text-[10px] text-primary hover:bg-primary hover:text-white hover:border-primary font-black uppercase tracking-widest transition-all shadow-sm flex items-center gap-2"
                            >
                              <Check className="w-4 h-4" /> Mark All Complete
                            </button>
                          </div>
                          
                          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {subject.topics.map((topic, tIdx) => {
                              const isDone = completedTopics.includes(topic.id);
                              return (
                                <motion.div
                                  key={topic.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: tIdx * 0.05 }}
                                  onClick={() => toggleTopic(topic.id)}
                                  className={`p-6 rounded-[32px] border cursor-pointer transition-all duration-500 flex items-center justify-between group ${isDone ? 'bg-emerald-50/30 border-emerald-100' : 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/50'}`}
                                >
                                  <div className="flex items-center gap-5">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 ${isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 border-slate-100 text-transparent group-hover:border-primary/50'}`}>
                                      <Check className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <h4 className={`text-base font-black tracking-tight transition-colors ${isDone ? 'text-text-secondary line-through decoration-emerald-500/50' : 'text-text-primary group-hover:text-primary'}`}>
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
                                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/5">
                                      <ArrowRight className="w-5 h-5" />
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 p-16 saas-card bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-1000 rotate-12">
               <Code2 className="w-96 h-96" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-primary/5">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-4xl font-black text-text-primary tracking-tighter mb-6">Language Architecture Specialist</h3>
              <p className="text-lg text-text-secondary mb-10 font-medium leading-relaxed">Deep knowledge of your primary language&apos;s internals is often the deciding factor in high-stakes technical interviews at product giants like Google and Meta.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/roadmaps/cse" className="w-full sm:w-auto px-10 py-5 rounded-[24px] bg-primary text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3">
                   Software Hub <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="w-full sm:w-auto px-10 py-5 rounded-[24px] bg-white text-text-primary border border-slate-200 font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                  Language Internals <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
