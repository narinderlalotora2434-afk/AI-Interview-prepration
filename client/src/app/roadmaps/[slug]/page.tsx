"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Check,
  Wrench,
  Settings,
  Activity,
  ChevronDown, 
  ChevronUp, 
  Zap, 
  LayoutDashboard,
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
  Briefcase,
  Layers,
  Target,
  PlayCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Cpu
} from "lucide-react";
import { getBaseUrl } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";

interface Resource {
  type: 'Video' | 'Article';
  title: string;
  url: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
}

interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

interface CompanyTrack {
  id: string;
  companyName: string;
  topics: string; // JSON string
  interviewRounds: string; // JSON string
}

interface Roadmap {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  companyTracks: CompanyTrack[];
}

interface Branch {
  id: string;
  name: string;
  description: string;
  salaryRange: string;
  difficulty: string;
  roadmaps: Roadmap[];
}

interface Progress {
  topicId: string;
  status: 'Completed' | 'Pending';
}

export default function BranchRoadmapPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [branch, setBranch] = useState<Branch | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("roadmaps");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!slug) return;

    // Load from local storage cache first for instantaneous rendering
    const cachedBranch = localStorage.getItem(`branch_cache_${slug}`);
    if (cachedBranch) {
      try {
        const branchData = JSON.parse(cachedBranch);
        setBranch(branchData);
        if (branchData.roadmaps?.[0]?.modules?.[0]) {
          setExpandedModules(prev => {
            if (Object.keys(prev).length === 0) {
              return { [branchData.roadmaps[0].modules[0].id]: true };
            }
            return prev;
          });
        }
        setLoading(false);
      } catch (e) {
        localStorage.removeItem(`branch_cache_${slug}`);
      }
    }

    fetch(`${getBaseUrl()}/api/roadmaps/branches/${slug}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(branchData => {
        if (branchData.error) throw new Error(branchData.error);
        setBranch(branchData);
        localStorage.setItem(`branch_cache_${slug}`, JSON.stringify(branchData));
        
        setExpandedModules(prev => {
          if (Object.keys(prev).length === 0 && branchData.roadmaps?.[0]?.modules?.[0]) {
            return { [branchData.roadmaps[0].modules[0].id]: true };
          }
          return prev;
        });

        return fetch(`${getBaseUrl()}/api/roadmaps/progress/${branchData.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        }).then(res => res.json());
      })
      .then(progressData => {
        if (progressData) {
          setProgress(progressData);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug, router]);

  const toggleTopicProgress = async (topicId: string, currentStatus: string) => {
    const newStatus = (currentStatus === 'Completed' ? 'Pending' : 'Completed') as 'Completed' | 'Pending';
    const token = localStorage.getItem("token");
    
    setProgress(prev => {
      const existing = prev.find(p => p.topicId === topicId);
      if (existing) {
        return prev.map(p => p.topicId === topicId ? { ...p, status: newStatus } : p);
      }
      return [...prev, { topicId, status: newStatus }];
    });

    try {
      await fetch(`${getBaseUrl()}/api/roadmaps/progress`, {
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
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col pt-32 px-10 items-center">
         <div className="w-full max-w-4xl space-y-12">
            <div className="space-y-4">
              <div className="w-32 h-6 bg-slate-200 rounded-full animate-pulse" />
              <div className="w-1/2 h-16 bg-slate-200 rounded-2xl animate-pulse" />
              <div className="w-3/4 h-8 bg-slate-200 rounded-xl animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="h-32 bg-slate-200 rounded-3xl animate-pulse" />
              <div className="h-32 bg-slate-200 rounded-3xl animate-pulse" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map(i => <div key={i} className="w-full h-24 bg-slate-200 rounded-3xl animate-pulse" />)}
            </div>
         </div>
      </div>
    );
  }

  if (!branch) {
    return <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center text-text-primary gap-6">
       <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center border border-rose-100">
          <X className="w-10 h-10 text-rose-500" />
       </div>
       <div className="text-center">
         <h1 className="text-2xl font-black tracking-tight mb-2">Branch Not Found</h1>
         <p className="text-text-secondary font-medium mb-8">The requested specialized track could not be identified.</p>
         <Link href="/roadmaps" className="btn-primary py-3 px-8 rounded-2xl font-black text-xs uppercase tracking-widest inline-flex">Return to Tracks</Link>
       </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-text-primary overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth">
        {/* Background Decorative Element */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-10 pt-8 pb-4">
          <div className="max-w-[1600px] mx-auto">
            <Link href="/roadmaps" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-black uppercase tracking-widest text-[10px] mb-8 group">
              <ArrowLeft className="w-4 h-4" /> Back to All Branches
            </Link>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Specialized Curriculum</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter mb-4">{branch.name}</h1>
                <p className="text-lg text-text-secondary max-w-3xl font-medium leading-relaxed">{branch.description}</p>
              </div>
              <div className="flex gap-6">

                <div className="saas-card p-5 bg-white shadow-xl shadow-slate-200/50 flex flex-col justify-center min-w-[160px] border border-slate-100">
                  <div className="text-2xl font-black text-amber-600 tracking-tighter">{branch.difficulty}</div>
                  <div className="text-[10px] text-text-secondary uppercase tracking-widest font-black mt-1 flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Difficulty
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-12">
              {[
                { id: "roadmaps", label: "Preparation Roadmaps", icon: Layers },
                { id: "companies", label: "Company Specific Tracks", icon: Briefcase }
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 pb-5 text-[10px] font-black tracking-[0.2em] uppercase transition-all relative ${activeTab === tab.id ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-primary' : 'text-slate-400'}`} />
                  {tab.label}
                  {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-t-full shadow-[0_-4px_10px_rgba(124,58,237,0.3)]" />}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="px-10 py-16 max-w-[1600px] mx-auto">
          {activeTab === "roadmaps" && (
            <div className="space-y-24">
              {branch.roadmaps.length === 0 ? (
                <div className="text-center py-32 saas-card bg-white/50 border-dashed border-2 border-slate-200">
                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Layers className="w-8 h-8 text-slate-400" />
                   </div>
                   <p className="text-text-secondary font-black text-xs uppercase tracking-widest">No curricula available for this track yet.</p>
                </div>
              ) : branch.roadmaps.map((roadmap) => (
                <div key={roadmap.id} className="relative">
                  <div className="mb-12 flex items-center justify-between">
                    <div className="max-w-2xl">
                      <h2 className="text-3xl font-black text-text-primary tracking-tighter flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                          <Layers className="w-5 h-5 text-primary" />
                        </div>
                        {roadmap.title}
                      </h2>
                      <p className="text-text-secondary font-medium leading-relaxed">{roadmap.description}</p>
                    </div>
                    <div className="hidden lg:block">
                       <div className="px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-full border border-emerald-100 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 100% Industry Verified
                       </div>
                    </div>
                  </div>

                  <div className="space-y-8 relative before:absolute before:inset-0 before:ml-10 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary/20 before:via-secondary/20 before:to-transparent">
                    {roadmap.modules.map((mod, index) => {
                      const isExpanded = expandedModules[mod.id];
                      const completedTopicsCount = mod.topics.filter((t) => isTopicCompleted(t.id)).length;
                      const isModuleDone = completedTopicsCount === mod.topics.length && mod.topics.length > 0;

                      return (
                        <div key={mod.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                          {/* Timeline Node */}
                          <div className={`flex items-center justify-center w-20 h-20 rounded-[32px] border-8 border-[#F8FAFC] shadow-2xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10 transition-all duration-500 ${isModuleDone ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-white shadow-slate-200'}`}>
                            {isModuleDone ? (
                              <Check className="w-8 h-8 text-white" />
                            ) : (
                              <span className="text-xl font-black text-text-primary">{index + 1}</span>
                            )}
                          </div>
                          
                          {/* Card */}
                          <div className={`w-[calc(100%-6rem)] md:w-[calc(50%-5rem)] saas-card overflow-hidden transition-all duration-500 bg-white shadow-xl shadow-slate-200/30 ${isExpanded ? 'ring-2 ring-primary/20 shadow-2xl shadow-slate-200' : 'hover:shadow-2xl hover:shadow-slate-200/50'}`}>
                            {/* Module Header */}
                            <div 
                              className={`p-8 cursor-pointer flex justify-between items-center transition-colors ${isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                              onClick={() => toggleModule(mod.id)}
                            >
                              <div className="flex-1">
                                <div className="text-primary font-black uppercase tracking-[0.3em] text-[9px] mb-2 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  Stage 0{index + 1}
                                </div>
                                <h3 className="text-xl font-black text-text-primary tracking-tight">{mod.title}</h3>
                                <div className="flex items-center gap-4 mt-3">
                                   <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-primary" style={{ width: `${(completedTopicsCount / (mod.topics.length || 1)) * 100}%` }} />
                                   </div>
                                   <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{completedTopicsCount}/{mod.topics.length} Milestones</span>
                                </div>
                              </div>
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 transition-all duration-500 ${isExpanded ? 'bg-white shadow-md' : 'bg-transparent'}`} style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                <ChevronDown className="w-6 h-6" />
                              </div>
                            </div>

                            {/* Module Topics */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.5, ease: "circOut" }}
                                  className="border-t border-slate-100 bg-slate-50/30 p-6 space-y-4"
                                >
                                  {mod.topics.length === 0 ? (
                                    <div className="text-center py-8">
                                       <p className="text-text-secondary text-[10px] font-black uppercase tracking-widest">Expansion Content Pending</p>
                                    </div>
                                  ) : mod.topics.map((topic) => {
                                    const completed = isTopicCompleted(topic.id);
                                    return (
                                      <div key={topic.id} className={`p-6 rounded-[24px] border transition-all duration-500 group/topic ${completed ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-lg shadow-sm'}`}>
                                        <div className="flex gap-5">
                                          <button 
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleTopicProgress(topic.id, completed ? 'Completed' : 'Pending');
                                            }}
                                            className="shrink-0 transition-all duration-500"
                                          >
                                            {completed ? (
                                              <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                                 <Check className="w-6 h-6" />
                                              </div>
                                            ) : (
                                              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover/topic:border-primary/50 group-hover/topic:text-primary transition-all">
                                                 <Circle className="w-6 h-6" />
                                              </div>
                                            )}
                                          </button>
                                          <div className="flex-1">
                                            <h4 className={`text-base font-black tracking-tight transition-colors ${completed ? 'text-text-secondary line-through decoration-emerald-500/50' : 'text-text-primary group-hover/topic:text-primary'}`}>
                                              {topic.title}
                                            </h4>
                                            <p className="text-sm text-text-secondary mt-1 font-medium leading-relaxed">{topic.description}</p>
                                            
                                            {/* Optional Learning Resources */}
                                            {topic.resources?.length > 0 && !completed && (
                                              <div className="mt-5 flex flex-wrap gap-3">
                                                {topic.resources.map((res, idx) => (
                                                  <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-primary hover:border-primary/50 hover:shadow-lg transition-all">
                                                    {res.type === 'Video' ? <PlayCircle className="w-4 h-4 text-rose-500" /> : <BookOpen className="w-4 h-4 text-blue-500" />}
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
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Special Track Cards */}
              <div className="space-y-8 pt-12">
                 {slug === 'ece' && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { title: "Core Fundamentals Mastery", desc: "ECE Fundamentals track with interactive progress tracking and expert-curated paths.", href: "/roadmaps/ece/fundamentals", icon: Cpu, accent: "primary" },
                        { title: "Advanced Electronics Mastery", desc: "Master Communication, Control Systems, and Signal Processing with interview-centric paths.", href: "/roadmaps/ece/advanced", icon: Zap, accent: "secondary" },
                        { title: "VLSI Design Track", desc: "RTL Design, Verification (UVM), STA, and Physical Design for semiconductor giants.", href: "/roadmaps/ece/vlsi", icon: Layers, accent: "emerald" },
                        { title: "Embedded Systems Track", desc: "Master Embedded C, RTOS, and Protocols (I2C, SPI, CAN) for firmware roles.", href: "/roadmaps/ece/embedded", icon: Brain, accent: "amber" }
                      ].map((card, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="saas-card p-10 bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group"
                        >
                          <div className="relative z-10">
                            <div className={`w-14 h-14 rounded-2xl bg-${card.accent}-50 flex items-center justify-center mb-8 border border-${card.accent}-100`}>
                               <card.icon className={`w-7 h-7 text-${card.accent}-600`} />
                            </div>
                            <h2 className="text-3xl font-black text-text-primary tracking-tighter mb-3">{card.title}</h2>
                            <p className="text-text-secondary font-medium leading-relaxed mb-8">{card.desc}</p>
                            <Link href={card.href} className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-primary group-hover:gap-5 transition-all">
                               Launch Masterclass <ArrowRight className="w-5 h-5" />
                            </Link>
                          </div>
                          <div className={`absolute -bottom-12 -right-12 w-48 h-48 bg-${card.accent}-500/5 rounded-full blur-3xl group-hover:bg-${card.accent}-500/10 transition-all duration-1000`} />
                        </motion.div>
                      ))}
                   </div>
                 )}

                 {slug === 'cse' && (
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {[
                        { title: "Foundation & Programming", desc: "Master C++/Java OOPs and Data Structures basics for elite programming roles.", href: "/roadmaps/cse/foundation", icon: Code, accent: "primary" },
                        { title: "Advanced DSA & CP", desc: "Dynamic Programming, Graphs, and Segment Trees to crack top product giants.", href: "/roadmaps/cse/advanced-dsa", icon: Zap, accent: "rose" },
                        { title: "Computer Science Core", desc: "High-impact OS, DBMS, and Networking interview preparation guides.", href: "/roadmaps/cse/core", icon: Cpu, accent: "secondary" },
                        { title: "Full Stack Development", desc: "Master React, Node.js, and DevOps to build and deploy scalable applications.", href: "/roadmaps/cse/fullstack", icon: Layers, accent: "emerald" },
                        { title: "System Design Masterclass", desc: "Low Level Design patterns and High Level System architectures for SDE-II roles.", href: "/roadmaps/cse/system-design", icon: Target, accent: "amber" }
                      ].map((card, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="saas-card p-10 bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group"
                        >
                           <div className="relative z-10">
                            <div className={`w-14 h-14 rounded-2xl bg-${card.accent}-50 flex items-center justify-center mb-8 border border-${card.accent}-100`}>
                               <card.icon className={`w-7 h-7 text-${card.accent}-600`} />
                            </div>
                            <h2 className="text-3xl font-black text-text-primary tracking-tighter mb-3">{card.title}</h2>
                            <p className="text-text-secondary font-medium leading-relaxed mb-8">{card.desc}</p>
                            <Link href={card.href} className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-primary group-hover:gap-5 transition-all">
                               Explore Module <ArrowRight className="w-5 h-5" />
                            </Link>
                          </div>
                          <div className={`absolute -bottom-12 -right-12 w-48 h-48 bg-${card.accent}-500/5 rounded-full blur-3xl group-hover:bg-${card.accent}-500/10 transition-all duration-1000`} />
                        </motion.div>
                      ))}
                   </div>
                 )}

                 {slug === 'me' && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { title: "Mechanical Fundamentals", desc: "Statics, Dynamics, Thermodynamics, and Material Science for heavy industry roles.", href: "/roadmaps/me/fundamentals", icon: Wrench, accent: "orange" },
                        { title: "Advanced Design & FEA", desc: "Master CAD/CAM, Robotics, and Finite Element Analysis for R&D roles.", href: "/roadmaps/me/advanced", icon: Settings, accent: "orange" },
                        { title: "Automotive Engineering", desc: "Vehicle Dynamics, IC Engines, and EV Systems for the future of mobility.", href: "/roadmaps/me/automotive", icon: Activity, accent: "orange" },
                        { title: "Mechatronics Track", desc: "Integrating Mechanical, Electronics, and Control systems for automation.", href: "/roadmaps/me/mechatronics", icon: Cpu, accent: "orange" }
                      ].map((card, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="saas-card p-10 bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group"
                        >
                          <div className="relative z-10">
                            <div className={`w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-8 border border-orange-100`}>
                               <card.icon className={`w-7 h-7 text-orange-600`} />
                            </div>
                            <h2 className="text-3xl font-black text-text-primary tracking-tighter mb-3">{card.title}</h2>
                            <p className="text-text-secondary font-medium leading-relaxed mb-8">{card.desc}</p>
                            <Link href={card.href} className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-orange-600 group-hover:gap-5 transition-all">
                               Launch Module <ArrowRight className="w-5 h-5" />
                            </Link>
                          </div>
                          <div className={`absolute -bottom-12 -right-12 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-all duration-1000`} />
                        </motion.div>
                      ))}
                   </div>
                 )}
              </div>
            </div>
          )}

          {activeTab === "companies" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {branch.roadmaps.flatMap((r) => r.companyTracks).length === 0 ? (
                <div className="col-span-full text-center py-32 saas-card bg-white/50 border-dashed border-2 border-slate-200">
                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Briefcase className="w-8 h-8 text-slate-400" />
                   </div>
                   <p className="text-text-secondary font-black text-xs uppercase tracking-widest">Corporate tracks are currently under curation.</p>
                </div>
              ) : branch.roadmaps.flatMap((r) => r.companyTracks).map((track) => (
                <div key={track.id} className="saas-card p-12 bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 group hover:shadow-primary/5 transition-all duration-500">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-3xl font-black text-text-primary tracking-tighter flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      {track.companyName}
                    </h3>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                       <Sparkles className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="mb-10">
                    <div className="text-[10px] text-text-secondary font-black uppercase tracking-[0.25em] mb-5 flex items-center gap-3">
                      <Target className="w-4 h-4 text-emerald-500" /> Strategic Focus Areas
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {(JSON.parse(track.topics) as string[]).map((t: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-slate-50 text-text-primary border border-slate-100 rounded-xl text-xs font-bold shadow-sm hover:border-primary/20 hover:bg-white transition-all cursor-default">{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                    <div className="text-[10px] text-text-secondary font-black uppercase tracking-[0.25em] mb-6 px-2">Interview Pipeline</div>
                    <div className="space-y-4">
                      {(JSON.parse(track.interviewRounds) as string[]).map((round: string, i: number) => (
                        <div key={i} className="flex gap-5 items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm group/round hover:border-primary/30 transition-all">
                          <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center text-sm font-black border border-primary/10 group-hover/round:bg-primary group-hover/round:text-white transition-all shrink-0">
                            {i + 1}
                          </div>
                          <span className="text-text-primary text-sm font-bold tracking-tight">{round}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
