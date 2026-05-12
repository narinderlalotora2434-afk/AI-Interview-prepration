"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Upload,
  CheckCircle2,
  Loader2,
  LogOut,
  ChevronLeft,
  Code,
  User,
  Zap,
  Map as MapIcon,
  Brain,
  XCircle,
  Lightbulb,
  Search,
  Cpu,
  Sparkles,
  Menu,
  X,
  TrendingUp,
  ShieldCheck,
  ZapOff,
  ChevronRight,
  Target,
  Terminal,
  Database,
  History,
  Download,
  AlertTriangle,
  Briefcase,
  ExternalLink,
  Info,
  CheckCircle,
  Settings,
  Edit3,
  Languages,
  PenTool,
  Layers,
  ArrowRight,
  Send,
  BookOpen
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
import { ThemeToggle } from "@/components/ThemeToggle";
import { getBaseUrl } from "@/lib/api";

// --- Types ---

interface AnalyticsData {
  mockInterviewCount: number;
  codingRoundCount: number;
  avgScore: number;
  xp: number;
  streak: number;
  badges: string;
}

interface ResumeAnalysis {
  totalScore: number;
  placementReadiness: number;
  strength: "Strong" | "Average" | "Needs Work";
  parsedInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    skills: string[];
    education: string;
  };
  breakdown: {
    format: number;
    skills: number;
    projects: number;
    experience: number;
    keywords: number;
    certifications: number;
    grammar: number;
  };
  jdMatchScore?: number;
  missingKeywords: string[];
  matchedKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  actionVerbAnalysis: {
     score: number;
     weakPhrases: string[];
     replacements: Record<string, string>;
  };
  formattingWarnings: string[];
}

const STEPS = [
  { id: 1, title: "Career Track", desc: "Select your specialization" },
  { id: 2, title: "Upload Resume", desc: "Supported: PDF, DOCX, TXT" },
  { id: 3, title: "Job Analysis", desc: "Optional JD matching" },
  { id: 4, title: "ATS Report", desc: "View detailed insights" },
  { id: 5, title: "AI Optimization", desc: "Rewrite weak sections" }
];

const TRACKS = [
  { id: "Software Engineering", icon: Code, color: "text-primary" },
  { id: "Frontend Developer", icon: LayoutDashboard, color: "text-accent-cyan" },
  { id: "Backend Developer", icon: Terminal, color: "text-emerald-400" },
  { id: "Full Stack Developer", icon: Layers, color: "text-amber-400" },
  { id: "Data Analyst", icon: TrendingUp, color: "text-blue-400" },
  { id: "AI/ML Engineer", icon: Brain, color: "text-accent-pink" },
  { id: "Hardware Engineering", icon: Cpu, color: "text-rose-400" },
];

export default function ResumeProPage() {
  const [step, setStep] = useState(1);
  const [track, setTrack] = useState(TRACKS[0].id);
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysis | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [improvingSection, setImprovingSection] = useState<string | null>(null);
  const [improvedContent, setImprovedContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New: Analysis Mode (Dashboard or Split)
  const [analysisMode, setAnalysisMode] = useState<"dashboard" | "split">("dashboard");
  
  // AI Chat Assistant State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "Hi! I'm your AI Resume Coach. How can I help you optimize your resume for placements today?" }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleAnalysis = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setScanning(true);
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("track", track);
    if (jd) formData.append("jobDescription", jd);

    try {
      const res = await fetch(`${getBaseUrl()}/api/resume/analyze`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      
      // Artificial delay for scanning effect
      setTimeout(() => {
        setResult(data.analysis);
        fetchHistory();
        setScanning(false);
        setStep(4);
      }, 3000);
    } catch (err: any) {
      setError(err.message);
      setScanning(false);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    window.print();
  };

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${getBaseUrl()}/api/resume/history`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleImprove = async (section: string, content: string) => {
    setImprovingSection(section);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${getBaseUrl()}/api/resume/improve`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ section, content, track }),
      });
      const data = await res.json();
      setImprovedContent(data.improvedContent);
      setStep(5);
    } catch (err) {
      console.error(err);
    } finally {
      setImprovingSection(null);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput("");
    setIsChatLoading(true);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${getBaseUrl()}/api/resume/chat`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMsg, track, resumeData: result }),
      });
      const data = await res.json();
      const aiReply = data.reply || "I'm currently optimizing my systems to give you better advice. In the meantime, focus on quantifying your achievements in your projects!";
      setChatMessages(prev => [...prev, { role: 'ai', content: aiReply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I'm having trouble connecting right now. Try focusing on strong action verbs like 'Architected' or 'Spearheaded' while I reconnect!" }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400";
    if (score >= 70) return "text-primary";
    if (score >= 50) return "text-amber-400";
    return "text-rose-500";
  };

  const radarData = useMemo(() => {
    if (!result || !result.breakdown) return [];
    return [
      { subject: 'Format', A: ((result.breakdown.format || 0) / 15) * 100 },
      { subject: 'Skills', A: ((result.breakdown.skills || 0) / 25) * 100 },
      { subject: 'Projects', A: ((result.breakdown.projects || 0) / 20) * 100 },
      { subject: 'Experience', A: ((result.breakdown.experience || 0) / 20) * 100 },
      { subject: 'Keywords', A: ((result.breakdown.keywords || 0) / 10) * 100 },
      { subject: 'Grammar', A: ((result.breakdown.grammar || 0) / 5) * 100 },
    ];
  }, [result]);

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden selection:bg-primary/30">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />

      <main className="flex-1 relative overflow-y-auto no-scrollbar">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-xl border-b border-white/5 h-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
             <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-xl transition-all"><ChevronLeft className="w-5 h-5" /></Link>
             <div>
                <h1 className="text-xl font-black tracking-tight">Resume <span className="text-primary text-2xl">Pro</span></h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">AI ATS OPTIMIZER</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <ThemeToggle />
             <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center font-bold text-primary shadow-lg shadow-primary/20">U</div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12">
          
          {/* Progress Steps */}
          <div className="flex justify-between max-w-4xl mx-auto relative px-4">
             <div className="absolute top-5 left-8 right-8 h-[2px] bg-white/5 z-0" />
             {STEPS.map((s) => (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                   <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${step >= s.id ? 'bg-primary border-primary shadow-[0_0_20px_rgba(124,58,237,0.4)]' : 'bg-secondary border-white/10 text-muted-foreground'}`}>
                      {step > s.id ? <CheckCircle className="w-5 h-5" /> : <span className="text-xs font-black">{s.id}</span>}
                   </div>
                   <div className="text-center hidden md:block">
                      <p className={`text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-foreground' : 'text-muted-foreground'}`}>{s.title}</p>
                   </div>
                </div>
             ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Scanning Animation */}
            {scanning && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-2xl flex flex-col items-center justify-center space-y-8">
                 <div className="relative w-64 h-64">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
                    <motion.div 
                       className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
                       animate={{ rotate: 360 }}
                       transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                    <div className="absolute inset-4 rounded-full border border-white/5 flex flex-col items-center justify-center text-center">
                       <Bot className="w-12 h-12 text-primary animate-bounce" />
                       <p className="text-[10px] font-black text-primary uppercase mt-2">AI ENGINE SCANNING</p>
                    </div>
                    {/* Scanning Bar */}
                    <motion.div 
                       className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_rgba(124,58,237,0.8)] z-50"
                       animate={{ top: ["0%", "100%", "0%"] }}
                       transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />
                 </div>
                 <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black tracking-tighter">Analyzing Resume...</h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest animate-pulse">Extracting skills and evaluating technical depth</p>
                 </div>
              </motion.div>
            )}
            {/* Step 1: Track Selection */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12 py-10">
                 <div className="text-center space-y-4">
                    <h2 className="text-5xl font-black tracking-tighter">Choose Your <span className="text-primary">Career Path</span></h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">Select the role you are targeting to optimize your ATS score and technical recommendations.</p>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {TRACKS.map((t) => (
                      <button 
                        key={t.id}
                        onClick={() => { setTrack(t.id); setStep(2); }}
                        className={`group glass-card p-8 flex flex-col items-center text-center gap-4 transition-all hover:border-primary/50 ${track === t.id ? 'border-primary bg-primary/5' : ''}`}
                      >
                         <div className={`p-4 rounded-2xl bg-secondary border border-white/5 group-hover:scale-110 transition-transform ${t.color}`}>
                            <t.icon className="w-8 h-8" />
                         </div>
                         <span className="text-sm font-black uppercase tracking-tight">{t.id}</span>
                      </button>
                    ))}
                 </div>
              </motion.div>
            )}

            {/* Step 2 & 3: Upload & JD */}
            {(step === 2 || step === 3) && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-4xl mx-auto space-y-10">
                 <div className="glass-card p-10 space-y-10">
                    <div className="relative group">
                       <input 
                         type="file" 
                         ref={fileInputRef}
                         onChange={(e) => { setFile(e.target.files?.[0] || null); setStep(3); }}
                         className="hidden" 
                         accept=".pdf,.docx,.doc,.txt"
                       />
                       <div 
                         onClick={() => fileInputRef.current?.click()}
                         className="border-4 border-dashed border-white/5 rounded-[40px] p-20 text-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all relative overflow-hidden cursor-pointer"
                       >
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative z-10">
                             <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(124,58,237,0.2)]">
                                <Upload className="w-10 h-10 text-primary" />
                             </div>
                             <h3 className="text-2xl font-black mb-2">{file ? file.name : "Drop your resume here"}</h3>
                             <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.3em]">PDF • DOCX • TXT (MAX 5MB)</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="flex items-center justify-between">
                          <label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Job Description (Optional)</label>
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">JD Matching Enabled</span>
                       </div>
                       <textarea 
                          value={jd}
                          onChange={(e) => setJd(e.target.value)}
                          placeholder="Paste the job description here to check keyword match and role relevance..."
                          className="w-full h-40 bg-secondary/50 border border-white/5 rounded-3xl p-6 text-sm focus:ring-1 focus:ring-primary outline-none transition-all resize-none no-scrollbar"
                       />
                    </div>

                    <div className="flex gap-4">
                       <button onClick={() => setStep(1)} className="btn-glass flex-1 py-4 text-xs font-black uppercase tracking-widest">GO BACK</button>
                       <button 
                         onClick={handleAnalysis}
                         disabled={!file || loading}
                         className="flex-[2] btn-primary py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(124,58,237,0.3)]"
                       >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Zap className="w-5 h-5" /> ANALYZE RESUME PRO</>}
                       </button>
                    </div>
                 </div>
              </motion.div>
            )}

            {/* Step 4: Analysis Report - Split Screen Mode */}
            {step === 4 && result && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 pb-20">
                 
                 {/* Top Controls */}
                 <div className="flex items-center justify-between bg-white/5 p-4 rounded-3xl border border-white/10">
                    <div className="flex items-center gap-4">
                       <button 
                          onClick={() => setAnalysisMode("dashboard")} 
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${analysisMode === 'dashboard' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-white/5'}`}
                       >
                          Summary Dashboard
                       </button>
                       <button 
                          onClick={() => setAnalysisMode("split")} 
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${analysisMode === 'split' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-white/5'}`}
                       >
                          Split-Screen Editor
                       </button>
                    </div>
                    <div className="flex items-center gap-2">
                       <button onClick={() => setStep(1)} className="p-2 hover:bg-white/5 rounded-xl text-muted-foreground"><History className="w-4 h-4" /></button>
                       <button onClick={handleExport} className="btn-glass py-2 px-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Download className="w-3.5 h-3.5" /> EXPORT PDF</button>
                    </div>
                 </div>

                 {analysisMode === "dashboard" ? (
                   <div className="space-y-10">
                      <div className="grid lg:grid-cols-4 gap-8">
                         {/* Main Score */}
                         <div className="glass-card p-10 flex flex-col items-center justify-center text-center relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                            <div className="relative z-10 w-40 h-40 mb-6">
                               <svg className="w-full h-full -rotate-90">
                                  <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                                  <motion.circle 
                                     cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="10" fill="transparent" 
                                     strokeDasharray={452}
                                     initial={{ strokeDashoffset: 452 }}
                                     animate={{ strokeDashoffset: 452 - (452 * result.totalScore) / 100 }}
                                     transition={{ duration: 2 }}
                                     className={`${getScoreColor(result.totalScore)} transition-all`} 
                                     strokeLinecap="round"
                                  />
                               </svg>
                               <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-5xl font-black tracking-tighter">{result.totalScore}</span>
                                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">ATS SCORE</span>
                               </div>
                            </div>
                            <p className="text-[10px] font-black uppercase text-primary">Strength: {result.strength}</p>
                         </div>

                         {/* Placement Readiness */}
                         <div className="glass-card p-10 flex flex-col items-center justify-center text-center">
                            <div className="w-40 h-40 mb-6 relative">
                               <svg className="w-full h-full -rotate-90">
                                  <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
                                  <motion.circle 
                                     cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="10" fill="transparent" 
                                     strokeDasharray={452}
                                     initial={{ strokeDashoffset: 452 }}
                                     animate={{ strokeDashoffset: 452 - (452 * result.placementReadiness) / 100 }}
                                     transition={{ duration: 2, delay: 0.5 }}
                                     className="text-emerald-400" 
                                     strokeLinecap="round"
                                  />
                               </svg>
                               <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-5xl font-black tracking-tighter">{result.placementReadiness}%</span>
                                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">PLACEMENT READY</span>
                               </div>
                            </div>
                            <div className="p-2 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest">Target: {track}</div>
                         </div>

                         {/* Dimensional Analysis */}
                         <div className="glass-card p-6 lg:col-span-2">
                            <div className="h-full w-full">
                               <ResponsiveContainer width="100%" height="100%">
                                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                     <PolarGrid stroke="#333" />
                                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#666', fontSize: 10, fontWeight: 'bold' }} />
                                     <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                                     <Radar name="Resume" dataKey="A" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.5} />
                                  </RadarChart>
                               </ResponsiveContainer>
                            </div>
                         </div>
                      </div>

                      {/* Middle Row: JD Match & History */}
                      <div className="grid lg:grid-cols-3 gap-8">
                         <div className="glass-card p-8 bg-gradient-to-br from-accent-cyan/10 to-transparent">
                            <div className="flex items-center justify-between mb-8">
                               <h3 className="text-xs font-black uppercase tracking-widest text-accent-cyan">Keyword Trend Analysis</h3>
                               <Target className="w-5 h-5 text-accent-cyan" />
                            </div>
                            <div className="space-y-6">
                               <div>
                                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3">Matched Keywords ({result.matchedKeywords?.length || 0})</p>
                                  <div className="flex flex-wrap gap-2">
                                     {result.matchedKeywords?.map(k => (
                                       <span key={k} className="px-3 py-1 rounded-lg bg-emerald-400/10 border border-emerald-400/20 text-[10px] font-bold text-emerald-400">{k}</span>
                                     ))}
                                  </div>
                               </div>
                               <div>
                                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-3">Critical Gaps ({result.missingKeywords?.length || 0})</p>
                                  <div className="flex flex-wrap gap-2">
                                     {result.missingKeywords?.map(k => (
                                       <span key={k} className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold text-rose-500">{k}</span>
                                     ))}
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* History Timeline */}
                         <div className="glass-card p-8 lg:col-span-2">
                            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-8">Score Improvement Timeline</h3>
                            <div className="h-48 w-full">
                               <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={history.map(h => ({ date: new Date(h.createdAt).toLocaleDateString(), score: h.atsScore })).reverse()}>
                                     <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#666' }} axisLine={false} tickLine={false} />
                                     <YAxis hide domain={[0, 100]} />
                                     <Tooltip 
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                                        labelStyle={{ color: '#888', fontSize: '10px', fontWeight: 'bold' }}
                                     />
                                     <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                                        {history.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={index === history.length - 1 ? '#7c3aed' : '#333'} />
                                        ))}
                                     </Bar>
                                  </BarChart>
                               </ResponsiveContainer>
                            </div>
                         </div>
                      </div>
                   </div>
                 ) : (
                   <div className="grid lg:grid-cols-2 gap-10 h-[800px]">
                      {/* Left: Analysis & Suggestions */}
                      <div className="flex flex-col gap-6 overflow-y-auto no-scrollbar pr-4">
                         <div className="glass-card p-8 border-l-4 border-primary">
                            <h3 className="text-xs font-black uppercase tracking-widest text-primary mb-6">AI Rewrite Opportunities</h3>
                            <div className="space-y-4">
                               {result.suggestions?.map((s, i) => (
                                 <div key={i} className="flex flex-col gap-4 p-4 rounded-2xl bg-secondary/50 border border-white/5 hover:border-primary/30 transition-all group">
                                    <p className="text-[11px] text-muted-foreground font-medium italic">&quot;{s}&quot;</p>
                                    <button 
                                       onClick={() => { setImprovedContent(s); setStep(5); }}
                                       className="w-full py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                       Optimize This Section
                                    </button>
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div className="glass-card p-8 border-l-4 border-amber-400">
                            <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-6">Action Verb Comparison</h3>
                            <div className="space-y-4">
                               {result.actionVerbAnalysis?.replacements && Object.entries(result.actionVerbAnalysis.replacements).map(([weak, strong], i) => (
                                 <div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 bg-background p-4 rounded-2xl border border-white/5">
                                    <span className="text-[10px] font-bold text-rose-500/50 line-through truncate">{weak}</span>
                                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-[10px] font-black text-emerald-400 truncate">{strong}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>

                      {/* Right: Live Resume Extraction Preview */}
                      <div className="glass-card p-10 overflow-y-auto no-scrollbar bg-secondary/20 border-white/5">
                         <div className="mb-10 text-center">
                            <h2 className="text-3xl font-black tracking-tight">{result.parsedInfo.name}</h2>
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mt-2">{track} | {result.parsedInfo.email}</p>
                         </div>
                         
                         <div className="space-y-10">
                            <div>
                               <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">Technical Core</h4>
                               <div className="flex flex-wrap gap-2">
                                  {result.parsedInfo?.skills?.map(s => (
                                    <span key={s} className="px-3 py-1.5 bg-white/5 rounded-lg text-[10px] font-bold border border-white/5">{s}</span>
                                  ))}
                               </div>
                            </div>
                            
                            <div>
                               <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">Education Extraction</h4>
                               <p className="text-xs font-medium leading-relaxed">{result.parsedInfo.education}</p>
                            </div>

                            <div>
                               <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-2">AI Project Diagnostic</h4>
                               <div className="p-6 rounded-[32px] bg-primary/5 border border-primary/20 italic text-[11px] text-muted-foreground leading-relaxed">
                                  &quot;Your project implementations show high technical complexity. To improve, ensure you mention specific libraries and version control practices used.&quot;
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                 )}

                 {/* Fixed Footer for Split View */}
                 <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-background/80 backdrop-blur-2xl p-4 rounded-[32px] border border-white/10 shadow-2xl z-50">
                    <button onClick={() => setStep(1)} className="btn-glass px-8 py-3 text-xs font-black uppercase tracking-widest">NEW SCAN</button>
                    <button onClick={() => setStep(5)} className="btn-primary px-8 py-3 text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_10px_30px_rgba(124,58,237,0.4)]">
                       <Sparkles className="w-4 h-4" /> REWRITE ENGINE
                    </button>
                    <button className="p-3 rounded-2xl bg-secondary border border-white/5 hover:bg-white/10 transition-all"><Download className="w-5 h-5" /></button>
                 </div>
              </motion.div>
            )}

            {/* Step 5: AI Optimization Interface */}
            {step === 5 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-5xl mx-auto py-10 space-y-12">
                 <div className="text-center space-y-4">
                    <h2 className="text-5xl font-black tracking-tighter">AI <span className="text-primary">Rewrite Engine</span></h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">Select a section from your resume below to optimize it using senior recruiter-level AI wording.</p>
                 </div>

                 <div className="grid lg:grid-cols-2 gap-8">
                    <div className="glass-card p-8 space-y-8">
                       <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Original Section Content</h3>
                       <textarea 
                          placeholder="Paste the section content you want to improve..."
                          className="w-full h-80 bg-secondary/50 border border-white/5 rounded-3xl p-6 text-sm focus:ring-1 focus:ring-primary outline-none transition-all resize-none no-scrollbar font-mono"
                          onChange={(e) => setImprovedContent(e.target.value)}
                       />
                       <button 
                         onClick={() => handleImprove("General Section", improvedContent)}
                         disabled={!improvedContent || improvingSection !== null}
                         className="w-full btn-primary py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3"
                       >
                          {improvingSection ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> REWRITE WITH AI</>}
                       </button>
                    </div>

                    <div className="glass-card p-8 space-y-8 border-l-4 border-emerald-500 relative">
                       <div className="flex items-center justify-between">
                          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Improved AI Version</h3>
                          <div className="flex gap-2">
                             <button className="p-2 hover:bg-white/5 rounded-lg transition-all text-muted-foreground"><Database className="w-4 h-4" /></button>
                             <button className="p-2 hover:bg-white/5 rounded-lg transition-all text-muted-foreground"><Languages className="w-4 h-4" /></button>
                          </div>
                       </div>
                       
                       <div className="h-80 w-full bg-emerald-500/5 rounded-3xl border border-emerald-500/10 p-6 text-sm font-medium leading-relaxed italic overflow-y-auto no-scrollbar">
                          {improvedContent || "Your optimized AI content will appear here..."}
                       </div>

                       <div className="flex gap-4">
                          <button className="btn-glass flex-1 py-3 text-[10px] font-black uppercase tracking-widest">REGENERATE</button>
                          <button className="btn-primary flex-1 py-3 text-[10px] font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-400 border-none shadow-[0_10px_30px_rgba(16,185,129,0.3)]">COPY TO RESUME</button>
                       </div>
                    </div>
                 </div>

                 <div className="text-center">
                    <button onClick={() => setStep(4)} className="text-xs font-black uppercase text-muted-foreground tracking-[0.2em] hover:text-primary transition-all flex items-center gap-2 mx-auto">
                       <ChevronLeft className="w-4 h-4" /> BACK TO REPORT
                    </button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* AI Assistant FAB */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/40 z-50 group"
      >
         <Bot className="w-8 h-8 group-hover:animate-pulse" />
      </motion.button>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-32 right-10 w-[400px] h-[550px] bg-background/80 backdrop-blur-2xl border border-white/10 rounded-[32px] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-primary/10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white"><Bot className="w-6 h-6" /></div>
                  <div>
                     <h4 className="text-sm font-black uppercase tracking-tight">Resume Coach</h4>
                     <p className="text-[10px] font-bold text-primary uppercase">Always Active</p>
                  </div>
               </div>
               <button onClick={() => setIsChatOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
               {chatMessages.map((m, i) => (
                 <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-medium leading-relaxed ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-secondary border border-white/5 text-muted-foreground rounded-tl-none'}`}>
                       {m.content}
                    </div>
                 </div>
               ))}
               {isChatLoading && (
                 <div className="flex justify-start">
                    <div className="bg-secondary border border-white/5 p-4 rounded-2xl rounded-tl-none"><Loader2 className="w-4 h-4 animate-spin text-primary" /></div>
                 </div>
               )}
            </div>

            <div className="p-6 border-t border-white/5">
               <div className="relative">
                  <input 
                     type="text" 
                     value={chatInput}
                     onChange={(e) => setChatInput(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                     placeholder="Ask for resume tips..."
                     className="w-full bg-secondary border border-white/5 rounded-2xl py-3 pl-4 pr-12 text-xs focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                  <button onClick={handleChat} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/20"><Send className="w-4 h-4" /></button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
