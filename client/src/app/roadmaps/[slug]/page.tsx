"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles,
  LayoutDashboard,
  Zap,
  Map as MapIcon,
  Brain,
  Code,
  MessageSquare,
  FileText,
  User,
  LogOut,
  Bot,
  Menu,
  X,
  ArrowLeft,
  CheckCircle2,
  Circle,
  BookOpen,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  Target,
  PlayCircle
} from "lucide-react";
import { motion } from "framer-motion";

export default function BranchRoadmapPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [branch, setBranch] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("roadmaps");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!slug) return;

    Promise.all([
      fetch(`https://ai-interview-prepration-2-nadp.onrender.com/api/roadmaps/branches/${slug}`, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => res.json()),
    ])
      .then(([branchData]) => {
        if (branchData.error) throw new Error(branchData.error);
        setBranch(branchData);
        
        if (branchData.roadmaps?.[0]?.modules?.[0]) {
          setExpandedModules({ [branchData.roadmaps[0].modules[0].id]: true });
        }

        return fetch(`https://ai-interview-prepration-2-nadp.onrender.com/api/roadmaps/progress/${branchData.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        }).then(res => res.json());
      })
      .then(progressData => {
        setProgress(progressData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug, router]);

  const toggleTopicProgress = async (topicId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    const token = localStorage.getItem("token");
    
    setProgress(prev => {
      const existing = prev.find(p => p.topicId === topicId);
      if (existing) {
        return prev.map(p => p.topicId === topicId ? { ...p, status: newStatus } : p);
      }
      return [...prev, { topicId, status: newStatus }];
    });

    try {
      await fetch("https://ai-interview-prepration-2-nadp.onrender.com/api/roadmaps/progress", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ topicId, status: newStatus })
      });
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  const isTopicCompleted = (topicId: string) => {
    return progress.find(p => p.topicId === topicId)?.status === 'Completed';
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col pt-32 px-10">
        <div className="w-32 h-8 bg-white/5 rounded animate-pulse mb-8" />
        <div className="w-1/2 h-12 bg-white/5 rounded animate-pulse mb-4" />
        <div className="w-1/3 h-6 bg-white/5 rounded animate-pulse mb-12" />
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="w-full h-24 bg-white/5 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!branch) {
    return <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white">Branch not found.</div>;
  }

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
            { href: "/quests", label: "Daily Quests", icon: Zap, color: "text-amber-400" },
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

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 pt-8 pb-4 px-6 md:px-12">
          <Link href="/roadmaps" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to All Branches
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">{branch.name}</h1>
              <p className="text-lg text-slate-400 max-w-2xl">{branch.description}</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center min-w-[120px]">
                <div className="text-xl font-bold text-emerald-400">{branch.salaryRange}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Avg Package</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center min-w-[120px]">
                <div className="text-xl font-bold text-amber-400">{branch.difficulty}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Difficulty</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-white/10">
            <button 
              onClick={() => setActiveTab("roadmaps")}
              className={`pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative ${activeTab === 'roadmaps' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Preparation Roadmaps
              {activeTab === 'roadmaps' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveTab("companies")}
              className={`pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative ${activeTab === 'companies' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Company Tracks
              {activeTab === 'companies' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
            </button>
          </div>
        </header>

        <main className="w-full px-6 md:px-12 py-12">
          
          {activeTab === "roadmaps" && (
            <div className="space-y-16">

              {branch.roadmaps.length === 0 ? (
                <div className="text-center py-20 text-slate-500">No roadmaps available yet.</div>
              ) : branch.roadmaps.map((roadmap: any) => (
                <div key={roadmap.id} className="relative">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Layers className="w-6 h-6 text-indigo-500" />
                      {roadmap.title}
                    </h2>
                    <p className="text-slate-400 mt-2">{roadmap.description}</p>
                  </div>

                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/20 before:via-purple-500/20 before:to-transparent">
                    {roadmap.modules.map((mod: any, index: number) => {
                      const isExpanded = expandedModules[mod.id];
                      const completedTopics = mod.topics.filter((t: any) => isTopicCompleted(t.id)).length;
                      const isModuleDone = completedTopics === mod.topics.length && mod.topics.length > 0;

                      return (
                        <div key={mod.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          {/* Timeline Node */}
                          <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-950 bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                            <div className={`w-3 h-3 rounded-full ${isModuleDone ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-indigo-500'}`} />
                          </div>
                          
                          {/* Card */}
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] glass-card border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
                            {/* Module Header */}
                            <div 
                              className="p-6 cursor-pointer flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.04]"
                              onClick={() => toggleModule(mod.id)}
                            >
                              <div>
                                <div className="text-indigo-400 font-mono text-xs mb-1">MODULE {index + 1}</div>
                                <h3 className="text-lg font-bold text-white">{mod.title}</h3>
                                <div className="text-sm text-slate-500 mt-1">
                                  {completedTopics} of {mod.topics.length} topics completed
                                </div>
                              </div>
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                              </div>
                            </div>

                            {/* Module Topics */}
                            {isExpanded && (
                              <div className="border-t border-white/5 bg-slate-950/50 p-4 space-y-2">
                                {mod.topics.length === 0 ? (
                                  <p className="text-slate-500 text-sm p-2">Topics coming soon.</p>
                                ) : mod.topics.map((topic: any) => {
                                  const completed = isTopicCompleted(topic.id);
                                  return (
                                    <div key={topic.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group/topic">
                                      <div className="flex gap-4">
                                        <button 
                                          onClick={() => toggleTopicProgress(topic.id, completed ? 'Completed' : 'Pending')}
                                          className="shrink-0 mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors"
                                        >
                                          {completed ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6" />}
                                        </button>
                                        <div>
                                          <h4 className={`font-bold transition-colors ${completed ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-200 group-hover/topic:text-indigo-300'}`}>
                                            {topic.title}
                                          </h4>
                                          <p className="text-sm text-slate-500 mt-1 leading-relaxed">{topic.description}</p>
                                          
                                          {/* Optional Learning Resources */}
                                          {topic.resources?.length > 0 && !completed && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                              {topic.resources.map((res: any, idx: number) => (
                                                <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-indigo-500/20 text-xs font-medium text-slate-300 hover:text-indigo-300 border border-white/10 rounded-lg transition-colors">
                                                  {res.type === 'Video' ? <PlayCircle className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                                                  {res.title}
                                                </a>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {slug === 'ece' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 glass-card p-8 border border-indigo-500/30 bg-gradient-to-br from-indigo-600/10 to-transparent relative overflow-hidden group"
                >
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black mb-4 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> New Enhanced Experience
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2">Core Fundamentals Mastery</h2>
                      <p className="text-slate-400 max-w-xl">We've upgraded the ECE Fundamentals track with interactive progress tracking, detailed syllabus, and expert-curated learning paths.</p>
                    </div>
                    <Link href="/roadmaps/ece/fundamentals" className="btn-primary py-4 px-8 flex items-center gap-3 whitespace-nowrap shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:scale-105 transition-all">
                      Launch Interactive Roadmap <Zap className="w-5 h-5 fill-current" />
                    </Link>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors" />
                </motion.div>
              )}

              {slug === 'ece' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 glass-card p-8 border border-purple-500/30 bg-gradient-to-br from-purple-600/10 to-transparent relative overflow-hidden group"
                >
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-black mb-4 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> Technical Deep-Dive
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2">Advanced Electronics Mastery</h2>
                      <p className="text-slate-400 max-w-xl">Master Communication, Control Systems, and Signal Processing with high-impact, interview-centric learning paths.</p>
                    </div>
                    <Link href="/roadmaps/ece/advanced" className="btn-primary py-4 px-8 flex items-center gap-3 whitespace-nowrap shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-purple-600 hover:bg-purple-700 border-purple-500 hover:scale-105 transition-all">
                      Unlock Advanced Track <Zap className="w-5 h-5 fill-current" />
                    </Link>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors" />
                </motion.div>
              )}

              {slug === 'ece' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 glass-card p-8 border border-emerald-500/30 bg-gradient-to-br from-emerald-600/10 to-transparent relative overflow-hidden group"
                >
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black mb-4 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> Industry Specialist
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2">VLSI Design Track</h2>
                      <p className="text-slate-400 max-w-xl">Deep-dive into RTL Design, Verification (UVM), STA, and Physical Design to land roles at top semiconductor giants.</p>
                    </div>
                    <Link href="/roadmaps/ece/vlsi" className="btn-primary py-4 px-8 flex items-center gap-3 whitespace-nowrap shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-600 hover:bg-emerald-700 border-emerald-500 hover:scale-105 transition-all">
                      Master VLSI Design <Zap className="w-5 h-5 fill-current" />
                    </Link>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
                </motion.div>
              )}

              {slug === 'ece' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 glass-card p-8 border border-amber-500/30 bg-gradient-to-br from-amber-600/10 to-transparent relative overflow-hidden group"
                >
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black mb-4 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> System Architect
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2">Embedded Systems Track</h2>
                      <p className="text-slate-400 max-w-xl">Master Embedded C, RTOS, and Communication Protocols (I2C, SPI, CAN) to excel in firmware and IoT interviews.</p>
                    </div>
                    <Link href="/roadmaps/ece/embedded" className="btn-primary py-4 px-8 flex items-center gap-3 whitespace-nowrap shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-amber-600 hover:bg-amber-700 border-amber-500 hover:scale-105 transition-all">
                      Master Embedded Systems <Zap className="w-5 h-5 fill-current" />
                    </Link>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors" />
                </motion.div>
              )}

              {slug === 'cse' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 glass-card p-8 border border-indigo-500/30 bg-gradient-to-br from-indigo-600/10 to-transparent relative overflow-hidden group"
                >
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black mb-4 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> Step 1: Foundations
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2">Foundation & Programming</h2>
                      <p className="text-slate-400 max-w-xl">Master C++/Java OOPs and Data Structures basics with our high-fidelity, interview-centric learning path.</p>
                    </div>
                    <Link href="/roadmaps/cse/foundation" className="btn-primary py-4 px-8 flex items-center gap-3 whitespace-nowrap shadow-[0_0_20px_rgba(99,102,241,0.3)] bg-indigo-600 hover:bg-indigo-700 border-indigo-500 hover:scale-105 transition-all">
                      Start Programming Track <Zap className="w-5 h-5 fill-current" />
                    </Link>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors" />
                </motion.div>
              )}

              {slug === 'cse' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 glass-card p-8 border border-rose-500/30 bg-gradient-to-br from-rose-600/10 to-transparent relative overflow-hidden group"
                >
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black mb-4 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> Step 2: Advanced Mastery
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2">Advanced DSA & CP</h2>
                      <p className="text-slate-400 max-w-xl">Master Dynamic Programming, Graphs, and Segment Trees to crack HFTs and top product giants.</p>
                    </div>
                    <Link href="/roadmaps/cse/advanced-dsa" className="btn-primary py-4 px-8 flex items-center gap-3 whitespace-nowrap shadow-[0_0_20px_rgba(244,63,94,0.3)] bg-rose-600 hover:bg-rose-700 border-rose-500 hover:scale-105 transition-all">
                      Master Advanced DSA <Zap className="w-5 h-5 fill-current" />
                    </Link>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition-colors" />
                </motion.div>
              )}

              {slug === 'cse' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 glass-card p-8 border border-blue-500/30 bg-gradient-to-br from-blue-600/10 to-transparent relative overflow-hidden group"
                >
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black mb-4 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> Step 3: Core Pillars
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2">Computer Science Core</h2>
                      <p className="text-slate-400 max-w-xl">Master OS, DBMS, and Networking with a focus on core interview concepts and frequently asked questions.</p>
                    </div>
                    <Link href="/roadmaps/cse/core" className="btn-primary py-4 px-8 flex items-center gap-3 whitespace-nowrap shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-blue-600 hover:bg-blue-700 border-blue-500 hover:scale-105 transition-all">
                      Explore Core Subjects <Zap className="w-5 h-5 fill-current" />
                    </Link>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />
                </motion.div>
              )}

              {slug === 'cse' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 glass-card p-8 border border-emerald-500/30 bg-gradient-to-br from-emerald-600/10 to-transparent relative overflow-hidden group"
                >
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black mb-4 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> Step 4: Industry Ready
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2">Full Stack Development</h2>
                      <p className="text-slate-400 max-w-xl">Master React, Node.js, Databases, and DevOps to build and deploy end-to-end scalable applications.</p>
                    </div>
                    <Link href="/roadmaps/cse/fullstack" className="btn-primary py-4 px-8 flex items-center gap-3 whitespace-nowrap shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-600 hover:bg-emerald-700 border-emerald-500 hover:scale-105 transition-all">
                      Master Full Stack Track <Zap className="w-5 h-5 fill-current" />
                    </Link>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
                </motion.div>
              )}

              {slug === 'cse' && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 glass-card p-8 border border-amber-500/30 bg-gradient-to-br from-amber-600/10 to-transparent relative overflow-hidden group"
                >
                  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black mb-4 uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" /> Step 5: System Architect
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2">System Design (LLD & HLD)</h2>
                      <p className="text-slate-400 max-w-xl">Master Low Level Design patterns and High Level System architectures to crack Senior and SDE-II roles at top tech giants.</p>
                    </div>
                    <Link href="/roadmaps/cse/system-design" className="btn-primary py-4 px-8 flex items-center gap-3 whitespace-nowrap shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-amber-600 hover:bg-amber-700 border-amber-500 hover:scale-105 transition-all">
                      Master System Design <Zap className="w-5 h-5 fill-current" />
                    </Link>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-colors" />
                </motion.div>
              )}
            </div>
          )}

          {activeTab === "companies" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {branch.roadmaps.flatMap((r: any) => r.companyTracks).length === 0 ? (
                <div className="col-span-full text-center py-20 text-slate-500">No company tracks available yet.</div>
              ) : branch.roadmaps.flatMap((r: any) => r.companyTracks).map((track: any) => (
                <div key={track.id} className="glass-card p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-indigo-500" />
                      {track.companyName}
                    </h3>
                  </div>

                  <div className="mb-6">
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-emerald-500" /> Key Focus Areas
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(track.topics).map((t: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Interview Rounds</div>
                    <div className="space-y-3">
                      {JSON.parse(track.interviewRounds).map((round: string, i: number) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/30 shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-slate-300 text-sm mt-0.5">{round}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
