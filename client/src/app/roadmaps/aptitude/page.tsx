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
  Calculator,
  Languages,
  BarChart3,
  ArrowRight,
  Sparkles
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
    <div className="min-h-screen bg-[#F8FAFC] flex text-text-primary overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 md:px-10 pt-8 pb-4">
          <div className="max-w-[1600px] mx-auto">
            <Link href="/roadmaps" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-black uppercase tracking-widest text-[10px] mb-8 group">
              <ArrowLeft className="w-4 h-4" /> Back to Roadmaps
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Master Track</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter mb-4">Aptitude Preparation</h1>
                <p className="text-base md:text-lg text-text-secondary max-w-3xl font-medium leading-relaxed">Master Quantitative, Logical, and Verbal skills required for AMCAT, eLitmus, and major company recruitment rounds.</p>
              </div>
            </div>

            {/* Dashboard Summary Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { label: "Total Categories", value: APTITUDE_TRACK.length, color: "text-primary" },
                { label: "Curriculum Topics", value: totalTopics, color: "text-text-primary" },
                { label: "Milestones Reached", value: completedCount, color: "text-emerald-600" },
                { label: "Overall Mastery", value: `${progressPercent}%`, color: "text-primary", isProgress: true },
              ].map((stat, i) => (
                <div key={i} className="saas-card p-6 bg-white shadow-xl shadow-slate-200/50 flex flex-col justify-center relative overflow-hidden">
                  <div className="relative z-10">
                    <div className={`text-xl md:text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</div>
                    <div className="text-[8px] md:text-[10px] text-text-secondary uppercase tracking-widest font-black mt-2">{stat.label}</div>
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

        <div className="px-4 md:px-10 py-8 md:py-16 max-w-[1600px] mx-auto">
          <div className="space-y-8">
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
                  className={`saas-card overflow-hidden transition-all duration-500 bg-white ${isExpanded ? 'ring-2 ring-primary/20 shadow-2xl shadow-slate-200' : 'hover:shadow-xl hover:shadow-slate-200/50 shadow-lg shadow-slate-200/30'}`}
                >
                  {/* Subject Header */}
                  <div 
                    className={`p-4 md:p-8 cursor-pointer flex flex-col md:flex-row md:items-center justify-between transition-colors ${isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                    onClick={() => setExpandedSubject(isExpanded ? null : subject.id)}
                  >
                    <div className="flex items-center gap-8 flex-1">
                      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border transition-all duration-500 ${allSubjectDone ? 'bg-emerald-50 border-emerald-100 text-emerald-600 shadow-lg shadow-emerald-500/10' : 'bg-white border-slate-100 text-primary shadow-lg shadow-slate-200/50'}`}>
                        {allSubjectDone ? <CheckCircle2 className="w-8 h-8" /> : <Icon className="w-8 h-8" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h2 className="text-xl md:text-2xl font-black text-text-primary tracking-tighter">{subject.title}</h2>
                          {allSubjectDone && (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-full border border-emerald-100">Aptitude Ace</span>
                          )}
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-full md:w-48 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <motion.div 
                              className="h-full bg-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                              initial={{ width: 0 }}
                              animate={{ width: `${subjectPercent}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                          <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{subjectPercent}% Mastery</span>
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
                            <span className="text-[10px] text-text-secondary uppercase tracking-[0.3em] font-black">Core Curriculum Breakdown</span>
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
                                  onClick={() => router.push(`/aptitude/learn/${topic.title.toLowerCase().replace(/\s+/g, '-')}`)}
                                  className={`p-6 rounded-[32px] border cursor-pointer transition-all duration-500 flex items-center justify-between group ${isDone ? 'bg-emerald-50/30 border-emerald-100' : 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-slate-200/50'}`}
                                >
                                  <div className="flex items-center gap-5">
                                    <div 
                                      onClick={(e) => { e.stopPropagation(); toggleTopic(topic.id); }}
                                      className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all duration-500 hover:scale-110 ${isDone ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 border-slate-100 text-transparent group-hover:border-emerald-200'}`}
                                    >
                                      <Check className={`w-5 h-5 ${isDone ? '' : 'text-emerald-300 opacity-0 hover:opacity-100'}`} />
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
               <Trophy className="w-96 h-96" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="w-20 h-20 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-primary/5">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-4xl font-black text-text-primary tracking-tighter mb-6">Mastering Corporate Entrance Assessments</h3>
              <p className="text-lg text-text-secondary mb-10 font-medium leading-relaxed">The aptitude round is the critical first barrier in elite tech recruitment. This curriculum is engineered to ensure you clear AMCAT, eLitmus, and major company assessments with a 99th percentile score.</p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/roadmaps" className="w-full sm:w-auto px-10 py-5 rounded-[24px] bg-primary text-white font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3">
                  Back to Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="w-full sm:w-auto px-10 py-5 rounded-[24px] bg-white text-text-primary border border-slate-200 font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                  Download Guide <FileText className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
