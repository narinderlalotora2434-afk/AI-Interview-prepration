"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Upload,
  CheckCircle2,
  Loader2,
  Code,
  Brain,
  Cpu,
  XCircle,
  Lightbulb,
  Search,
  Sparkles,
  Menu,
  X,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  Target,
  Terminal,
  Download,
  AlertTriangle,
  Briefcase,
  ExternalLink,
  Settings,
  ArrowRight,
  Send,
  FileText,
  MousePointer2,
  Zap,
  Layers,
  History,
  Layout,
  Maximize2,
  AlertCircle,
  CheckCircle,
  Type,
  Eye,
  FileSearch,
  Wand2
} from "lucide-react";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from "recharts";
import { getBaseUrl } from "@/lib/api";
import Sidebar from "@/components/Sidebar";

// --- Types ---

interface ATSMetric {
  label: string;
  score: number;
  weight: number;
  status: 'optimal' | 'warning' | 'critical';
  details: string;
}

interface ResumeAnalysis {
  totalScore: number;
  placementReadiness: number;
  strength: "Elite" | "Competitive" | "Developing" | "Needs Revision";
  parsedInfo: {
    name: string;
    email: string;
    phone: string;
    skills: string[];
    education: string;
    experience_years: number;
  };
  metrics: ATSMetric[];
  missingKeywords: string[];
  matchedKeywords: string[];
  suggestions: {
    section: string;
    impact: 'High' | 'Medium' | 'Low';
    current: string;
    optimized: string;
  }[];
  formattingCheck: {
    label: string;
    passed: boolean;
    fix?: string;
  }[];
}

const TRACKS = [
  { id: "SDE", label: "Software Engineering", icon: Code, color: "text-primary" },
  { id: "Frontend", label: "Frontend Developer", icon: Layout, color: "text-blue-500" },
  { id: "Backend", label: "Backend Developer", icon: Terminal, color: "text-emerald-500" },
  { id: "FullStack", label: "Full Stack Developer", icon: Layers, color: "text-amber-500" },
  { id: "AI", label: "AI/ML Engineer", icon: Brain, color: "text-purple-500" },
  { id: "Data", label: "Data Science", icon: TrendingUp, color: "text-rose-500" },
];

export default function ResumeOptimizerPage() {
  const [activeTrack, setActiveTrack] = useState(TRACKS[0]);
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock Analysis Logic
  const startAnalysis = () => {
    if (!file) return;
    setIsAnalyzing(true);
    
    // Simulate ATS Parsing Pipeline
    setTimeout(() => {
      const mockResult: ResumeAnalysis = {
        totalScore: 82,
        placementReadiness: 88,
        strength: "Competitive",
        parsedInfo: {
          name: "Alex Rivera",
          email: "alex.rivera@tech.com",
          phone: "+1 555-0123",
          skills: ["React", "TypeScript", "Node.js", "AWS", "Docker", "GraphQL"],
          education: "B.S. Computer Science, Stanford University",
          experience_years: 3
        },
        metrics: [
          { label: "Keyword Match", score: 85, weight: 35, status: 'optimal', details: "Targeted stack alignment detected." },
          { label: "Skills Depth", score: 78, weight: 20, status: 'optimal', details: "Strong core skills, missing niche libraries." },
          { label: "Formatting", score: 92, weight: 20, status: 'optimal', details: "Highly parseable single-column layout." },
          { label: "Experience", score: 65, weight: 15, status: 'warning', details: "Quantify achievements with more metrics." },
          { label: "Readability", score: 88, weight: 10, status: 'optimal', details: "Excellent sentence structure and length." }
        ],
        missingKeywords: ["CI/CD", "Kubernetes", "Redis", "Unit Testing", "Microservices"],
        matchedKeywords: ["React", "Node.js", "AWS", "API Design", "Agile", "TypeScript"],
        suggestions: [
          { 
            section: "Professional Summary", 
            impact: 'High', 
            current: "Experienced developer looking for new opportunities in full-stack engineering.",
            optimized: "Strategic Full-Stack Engineer with 3+ years experience optimizing scalable AWS architectures. Spearheaded migration to Microservices resulting in 40% latency reduction."
          },
          { 
            section: "Experience: Project Alpha", 
            impact: 'Medium', 
            current: "Worked on a team to build a new dashboard for internal users.",
            optimized: "Architected and deployed a real-time analytics dashboard using React and GraphQL, improving internal data visibility for 200+ engineers."
          }
        ],
        formattingCheck: [
          { label: "Single Column Layout", passed: true },
          { label: "Standard Font Usage", passed: true },
          { label: "Section Headings", passed: true },
          { label: "Image/Icon Detection", passed: false, fix: "Remove social icons; ATS may misread them as text noise." },
          { label: "Margin Consistency", passed: true }
        ]
      };
      setResult(mockResult);
      setIsAnalyzing(false);
      setIsDone(true);
    }, 3500);
  };

  const reset = () => {
    setFile(null);
    setJd("");
    setIsDone(false);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-text-primary overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth">
        {/* Background Decorative */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 md:px-10 h-20 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-text-secondary"><Menu className="w-6 h-6" /></button>
              <div>
                 <h1 className="text-2xl font-black tracking-tight text-text-primary flex items-center gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
                      <FileSearch className="w-6 h-6 text-primary" />
                   </div>
                   Resume <span className="text-primary italic">Optimizer</span>
                 </h1>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full">
                 <ShieldCheck className="w-4 h-4 text-emerald-600" />
                 <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest text-nowrap">Bank-Grade Privacy</span>
              </div>
              <button className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-text-secondary">
                 <Settings className="w-5 h-5" />
              </button>
           </div>
        </header>

        <div className="p-4 md:p-10 max-w-[1600px] mx-auto pb-32">
          
          <AnimatePresence mode="wait">
            {!isDone ? (
              <motion.div 
                key="upload-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto space-y-12"
              >
                {/* Hero Section */}
                <div className="text-center space-y-6">
                   <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white border border-slate-100 shadow-sm">
                      <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Next-Gen ATS Logic v4.0</span>
                   </div>
                   <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-text-primary tracking-tighter leading-[1.1]">
                     Optimize for the <span className="text-primary italic underline decoration-primary/20 decoration-8 underline-offset-8">Algorithms.</span><br className="hidden md:block" />
                     Land the Interview.
                   </h2>
                   <p className="text-lg text-text-secondary max-w-2xl mx-auto font-medium">
                     The industry-standard AI resume optimizer used by elite candidates to bypass ATS filters and catch recruiter attention.
                   </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-10 pt-8">
                   {/* Track Selection */}
                   <div className="lg:col-span-1 space-y-4">
                      <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] px-4">1. Targeted Role</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                         {TRACKS.map(t => (
                           <button 
                             key={t.id}
                             onClick={() => setActiveTrack(t)}
                             className={`p-5 rounded-3xl border text-left transition-all duration-300 group ${activeTrack.id === t.id ? 'bg-primary border-primary shadow-xl shadow-primary/20' : 'bg-white border-slate-100 hover:border-primary/30'}`}
                           >
                              <div className="flex items-center gap-4">
                                 <div className={`p-3 rounded-xl transition-all ${activeTrack.id === t.id ? 'bg-white/20' : 'bg-slate-50 border border-slate-100 group-hover:bg-primary/5'}`}>
                                    <t.icon className={`w-5 h-5 ${activeTrack.id === t.id ? 'text-white' : t.color}`} />
                                 </div>
                                 <span className={`text-sm font-black uppercase tracking-tight ${activeTrack.id === t.id ? 'text-white' : 'text-text-primary'}`}>{t.label}</span>
                              </div>
                           </button>
                         ))}
                      </div>
                   </div>

                   {/* Upload Area */}
                   <div className="lg:col-span-2 space-y-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] px-4">2. Document Protocol</label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="saas-card bg-white p-8 md:p-16 border-4 border-dashed border-slate-100 rounded-[32px] md:rounded-[48px] text-center group hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer relative overflow-hidden"
                        >
                           <input 
                             type="file" 
                             ref={fileInputRef} 
                             className="hidden" 
                             accept=".pdf,.docx,.doc" 
                             onChange={(e) => setFile(e.target.files?.[0] || null)}
                           />
                           <div className="relative z-10 space-y-6">
                              <div className="w-24 h-24 bg-primary/5 rounded-[32px] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-xl shadow-primary/5 border border-primary/10">
                                 <Upload className="w-10 h-10 text-primary" />
                              </div>
                              <div>
                                 <h3 className="text-2xl font-black text-text-primary mb-2">{file ? file.name : "Inject Your Resume"}</h3>
                                 <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Supports PDF & DOCX (Max 10MB)</p>
                              </div>
                           </div>
                           {/* Animated Background Mesh */}
                           <div className="absolute inset-0 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent blur-3xl" />
                           </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] px-4">3. Context (Optional)</label>
                         <textarea 
                           value={jd}
                           onChange={(e) => setJd(e.target.value)}
                           placeholder="Paste the Job Description for deep semantic keyword matching..."
                           className="w-full h-48 bg-white border border-slate-100 rounded-[40px] p-10 text-sm font-medium focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all resize-none shadow-xl shadow-slate-200/30 no-scrollbar"
                         />
                      </div>

                      <div className="pt-6">
                         <button 
                           onClick={startAnalysis}
                           disabled={!file || isAnalyzing}
                           className="w-full btn-primary py-6 rounded-[32px] text-xs font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                         >
                            {isAnalyzing ? (
                               <>
                                 <Loader2 className="w-6 h-6 animate-spin" /> 
                                 <span className="animate-pulse">Parsing Semantic Nodes...</span>
                               </>
                            ) : (
                               <>
                                 <Zap className="w-6 h-6 group-hover:scale-125 transition-transform" /> 
                                 Launch High-Frequency Audit
                               </>
                            )}
                         </button>
                      </div>
                   </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 pt-12">
                   {[
                      { icon: Target, title: "ATS Bypass", desc: "Scan against 200+ proprietary ATS algorithms including Workday & Greenhouse." },
                      { icon: Wand2, title: "AI Rewriting", desc: "Get specific, high-impact bullet point suggestions optimized for recruiter psychology." },
                      { icon: Eye, title: "Heatmap Analysis", desc: "Identify the 6-second scan pattern and ensure your most critical info is seen." }
                   ].map((f, i) => (
                     <div key={i} className="saas-card p-10 bg-white border border-slate-100 shadow-sm flex flex-col gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                           <f.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                           <h4 className="text-lg font-black text-text-primary mb-2 tracking-tight">{f.title}</h4>
                           <p className="text-sm text-text-secondary font-medium leading-relaxed">{f.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="analysis-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                {/* Analysis Header */}
                <div className="flex flex-col xl:flex-row items-center justify-between gap-10 bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl shadow-slate-200/50">
                   <div className="flex items-center gap-8">
                      <div className="relative w-40 h-40 shrink-0">
                         <svg className="w-full h-full transform -rotate-90">
                           <circle cx="80" cy="80" r="72" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-slate-50" />
                           <motion.circle 
                             cx="80" cy="80" r="72" 
                             fill="transparent" 
                             stroke="currentColor" 
                             strokeWidth="12" 
                             strokeDasharray={452}
                             initial={{ strokeDashoffset: 452 }}
                             animate={{ strokeDashoffset: 452 - (452 * (result?.totalScore || 0)) / 100 }}
                             transition={{ duration: 2, ease: "circOut" }}
                             className="text-primary"
                             strokeLinecap="round"
                           />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-black text-text-primary tracking-tighter">{result?.totalScore}</span>
                            <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest mt-1">ATS INDEX</span>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-3">
                            <span className="px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest">{activeTrack.label}</span>
                            <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">{result?.strength} Strength</span>
                         </div>
                         <h2 className="text-4xl font-black text-text-primary tracking-tighter">Strategic Audit Report</h2>
                         <p className="text-text-secondary max-w-xl font-medium leading-relaxed">
                            Your resume shows high structural integrity but requires semantic optimization in technical keyword frequency to bypass enterprise-level filters.
                         </p>
                      </div>
                   </div>

                   <div className="flex flex-wrap gap-4 justify-center">
                      <button onClick={reset} className="px-8 py-4 bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary hover:bg-slate-100 transition-all">New Protocol</button>
                      <button className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3">
                        <Download className="w-4 h-4" /> Download Optimized
                      </button>
                   </div>
                </div>

                <div className="grid xl:grid-cols-12 gap-10">
                   {/* Left Column: Detailed Metrics */}
                   <div className="xl:col-span-4 space-y-10">
                      {/* Weights Breakdown */}
                      <div className="saas-card p-10 bg-white border border-slate-100 shadow-sm">
                         <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary mb-10">Optimization Blueprint</h3>
                         <div className="space-y-8">
                            {result?.metrics.map((m, i) => (
                              <div key={i} className="space-y-3">
                                 <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                       <span className="text-sm font-black text-text-primary tracking-tight">{m.label}</span>
                                       <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest mt-1">Weight: {m.weight}%</span>
                                    </div>
                                    <span className={`text-sm font-black tracking-tighter ${m.status === 'optimal' ? 'text-emerald-500' : 'text-amber-500'}`}>{m.score}%</span>
                                 </div>
                                 <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                    <motion.div 
                                      className={`h-full ${m.status === 'optimal' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'}`}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${m.score}%` }}
                                      transition={{ duration: 1.5, delay: i * 0.1 }}
                                    />
                                 </div>
                                 <p className="text-[10px] text-text-secondary font-medium italic opacity-70">Auditor: {m.details}</p>
                              </div>
                            ))}
                         </div>
                      </div>

                      {/* Formatting Checklist */}
                      <div className="saas-card p-10 bg-white border border-slate-100 shadow-sm">
                         <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary mb-10">Structural Integrity</h3>
                         <div className="space-y-6">
                            {result?.formattingCheck.map((check, i) => (
                              <div key={i} className={`p-5 rounded-2xl border flex flex-col gap-3 transition-all ${check.passed ? 'bg-emerald-50/30 border-emerald-100/50' : 'bg-rose-50/30 border-rose-100/50'}`}>
                                 <div className="flex items-center justify-between">
                                    <span className={`text-[11px] font-bold ${check.passed ? 'text-emerald-700' : 'text-rose-700'}`}>{check.label}</span>
                                    {check.passed ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                                 </div>
                                 {!check.passed && check.fix && (
                                   <p className="text-[10px] font-medium text-rose-600/80 leading-relaxed">Fix: {check.fix}</p>
                                 )}
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Right Column: Keyword matching & Suggestions */}
                   <div className="xl:col-span-8 space-y-10">
                      
                      {/* Keyword System */}
                      <div className="grid md:grid-cols-2 gap-10">
                         <div className="saas-card p-10 bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="relative z-10">
                               <div className="flex items-center justify-between mb-8">
                                  <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                                     <CheckCircle className="w-4 h-4" /> Semantic Matches
                                  </h3>
                                  <span className="text-[10px] font-black text-text-secondary">{result?.matchedKeywords.length} Nodes</span>
                               </div>
                               <div className="flex flex-wrap gap-2.5">
                                  {result?.matchedKeywords.map(k => (
                                    <span key={k} className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform cursor-default">
                                       {k}
                                    </span>
                                  ))}
                               </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                               <CheckCircle className="w-48 h-48 text-emerald-500" />
                            </div>
                         </div>

                         <div className="saas-card p-10 bg-white border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="relative z-10">
                               <div className="flex items-center justify-between mb-8">
                                  <h3 className="text-xs font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                                     <AlertTriangle className="w-4 h-4" /> Detected Gaps
                                  </h3>
                                  <span className="text-[10px] font-black text-text-secondary">{result?.missingKeywords.length} Missing</span>
                               </div>
                               <div className="flex flex-wrap gap-2.5">
                                  {result?.missingKeywords.map(k => (
                                    <span key={k} className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform cursor-default">
                                       + {k}
                                    </span>
                                  ))}
                               </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                               <AlertTriangle className="w-48 h-48 text-rose-500" />
                            </div>
                         </div>
                      </div>

                      {/* AI Suggestions / Rewrites */}
                      <div className="saas-card p-10 bg-white border border-slate-100 shadow-sm">
                         <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xs font-black uppercase tracking-widest text-text-secondary">AI Content Optimization</h3>
                            <div className="px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                               <Brain className="w-3.5 h-3.5" /> Recruiter Simulation Mode
                            </div>
                         </div>
                         
                         <div className="space-y-8">
                            {result?.suggestions.map((s, i) => (
                              <div key={i} className="group relative">
                                 <div className="absolute -left-4 top-0 bottom-0 w-1 bg-slate-100 rounded-full group-hover:bg-primary transition-colors" />
                                 <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                       <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">{s.section}</span>
                                       <span className={`text-[8px] px-2 py-0.5 rounded uppercase font-black tracking-tighter ${s.impact === 'High' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>
                                          {s.impact} Impact Fix
                                       </span>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                       <div className="p-6 rounded-[28px] bg-slate-50/50 border border-slate-100 opacity-60">
                                          <div className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-3">Legacy Content</div>
                                          <p className="text-xs font-medium text-text-secondary italic leading-relaxed">"{s.current}"</p>
                                       </div>
                                       <div className="p-6 rounded-[28px] bg-primary/5 border border-primary/20 relative group/suggestion">
                                          <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-3">Optimized Logic</div>
                                          <p className="text-xs font-black text-text-primary leading-relaxed">"{s.optimized}"</p>
                                          <button className="absolute top-4 right-4 p-2 bg-primary text-white rounded-xl shadow-lg opacity-0 group-hover/suggestion:opacity-100 transition-all hover:scale-110">
                                             <MousePointer2 className="w-3.5 h-3.5" />
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>

                      {/* Recruiter Insights */}
                      <div className="saas-card p-12 bg-white border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
                         <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                            <div className="w-24 h-24 rounded-[32px] bg-primary/10 flex items-center justify-center border border-primary/10 shrink-0">
                               <Briefcase className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-6">
                               <h3 className="text-3xl font-black tracking-tighter italic text-text-primary">Recruiter Feedback Loop</h3>
                               <p className="text-text-secondary font-medium leading-relaxed max-w-2xl">
                                  "This candidate shows strong technical alignment for a mid-level {activeTrack.id} role. The academic pedigree and technical stack are clear. To reach the top 5th percentile, they should refine their summary to emphasize architecting decisions over implementation tasks."
                               </p>
                               <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-[10px] text-white">AI</div>
                                  <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Aggregated from 50+ Top-Tier Recruiter Models</span>
                               </div>
                            </div>
                         </div>
                         <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:scale-110 transition-transform duration-1000">
                            <Bot className="w-64 h-64 rotate-12" />
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Floating Action Button for Chat Assistant */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-10 right-10 w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/40 z-50 group border border-white/20"
      >
         <Bot className="w-8 h-8 group-hover:animate-pulse" />
         <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white animate-bounce" />
      </motion.button>
    </div>
  );
}
