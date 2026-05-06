"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Bot, 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Upload,
  CheckCircle2,
  AlertCircle,
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
  Trophy,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [track, setTrack] = useState<"software" | "hardware">("software");
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("track", track);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/resume/analyze`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data.analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "text-emerald-400", bg: "bg-emerald-500/10" };
    if (score >= 75) return { label: "Good", color: "text-indigo-400", bg: "bg-indigo-500/10" };
    if (score >= 50) return { label: "Average", color: "text-amber-400", bg: "bg-amber-500/10" };
    return { label: "Needs Improvement", color: "text-rose-400", bg: "bg-rose-500/10" };
  };

  const categoryConfig: any = {
    content: { label: "Content Quality", max: 25, icon: FileText },
    skills: { label: "Skills Match", max: 20, icon: Brain },
    ats: { label: "ATS Compatibility", max: 15, icon: Search },
    projects: { label: "Projects Quality", max: 15, icon: Code },
    experience: { label: "Experience Impact", max: 10, icon: Zap },
    formatting: { label: "Formatting", max: 15, icon: Sparkles }
  };

  return (
    <div className="min-h-screen bg-[#0d061c] flex text-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0d061c] p-6 flex flex-col hidden md:flex">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">PrepAI</span>
        </Link>
        <nav className="space-y-1 flex-1">
          {[
            { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
            { href: "/quests", label: "Daily Quests", icon: Zap },
            { href: "/roadmaps", label: "Roadmaps", icon: MapIcon },
            { href: "/resume", label: "Resume Analyzer", icon: FileText, active: true },
            { href: "/interview", label: "Mock Interview", icon: MessageSquare },
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                item.active ? 'bg-white/5 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full relative">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors mb-4 text-sm uppercase tracking-widest font-bold">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Link>
            <h1 className="text-4xl font-black mb-2">Professional <span className="gradient-text">ATS Analyzer</span></h1>
            <p className="text-slate-400">Get detailed feedback and actionable suggestions to land more interviews.</p>
          </header>

          {!result ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 md:p-12"
            >
              <div className="max-w-2xl mx-auto space-y-10">
                {/* Track Selection */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block text-center">Select Your Target Track</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setTrack("software")}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                        track === "software" ? "bg-indigo-600/10 border-indigo-500 text-white" : "bg-white/5 border-white/10 text-slate-400"
                      }`}
                    >
                      <Code className="w-8 h-8" />
                      <span className="font-bold">Software</span>
                    </button>
                    <button 
                      onClick={() => setTrack("hardware")}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                        track === "hardware" ? "bg-rose-600/10 border-rose-500 text-white" : "bg-white/5 border-white/10 text-slate-400"
                      }`}
                    >
                      <Cpu className="w-8 h-8" />
                      <span className="font-bold">Hardware</span>
                    </button>
                  </div>
                </div>

                <div className="border-2 border-dashed border-white/10 rounded-3xl p-10 text-center hover:border-indigo-500/50 transition-colors relative group">
                  <input 
                    type="file" 
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    accept=".pdf,.docx,.txt"
                  />
                  <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-indigo-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{file ? file.name : "Drop your resume here"}</h2>
                  <p className="text-slate-400 text-sm mb-0">PDF, DOCX, or TXT (Max 5MB)</p>
                </div>

                <button 
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className="btn-primary w-full py-5 text-xl"
                >
                  {loading ? <div className="flex items-center justify-center gap-3"><Loader2 className="w-6 h-6 animate-spin" /> Analyzing...</div> : "Run AI Analysis"}
                </button>
                {error && <p className="text-rose-400 text-center text-sm font-medium">{error}</p>}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8 pb-20">
              {/* Score Dashboard */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Total Score Card */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card p-10 flex flex-col items-center justify-center text-center relative overflow-hidden lg:col-span-1"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Trophy className="w-32 h-32" />
                  </div>
                  <div className="relative w-40 h-40 mb-6">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                      <motion.circle 
                        cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                        strokeDasharray={440}
                        initial={{ strokeDashoffset: 440 }}
                        animate={{ strokeDashoffset: 440 - (440 * result.totalScore) / 100 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={getScoreLabel(result.totalScore).color} 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black">{result.totalScore}</span>
                      <span className="text-slate-500 text-xs font-bold uppercase">Points</span>
                    </div>
                  </div>
                  <div className={`px-6 py-2 rounded-full font-black text-sm uppercase tracking-widest ${getScoreLabel(result.totalScore).bg} ${getScoreLabel(result.totalScore).color}`}>
                    {getScoreLabel(result.totalScore).label}
                  </div>
                  <button onClick={() => setResult(null)} className="mt-8 text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4" /> Start New Scan
                  </button>
                </motion.div>

                {/* Breakdown Progress */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card p-8 lg:col-span-2"
                >
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> Scoring Breakdown
                  </h3>
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
                    {Object.entries(result.breakdown).map(([key, score]: [string, any]) => {
                      const config = categoryConfig[key];
                      const Icon = config.icon;
                      const percentage = (score / config.max) * 100;
                      return (
                        <div key={key} className="space-y-3">
                          <div className="flex justify-between items-end">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400">
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-sm text-slate-200">{config.label}</span>
                            </div>
                            <span className="text-xs font-black text-slate-400">{score}<span className="text-slate-600"> / {config.max}</span></span>
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className={`h-full rounded-full ${percentage > 80 ? 'bg-emerald-500' : percentage > 50 ? 'bg-indigo-500' : 'bg-rose-500'}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </div>

              {/* Actionable Feedback Tabs */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Strengths & Weaknesses */}
                <div className="space-y-8">
                  <div className="glass-card p-8 border-l-4 border-l-emerald-500/50">
                    <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5" /> Key Strengths
                    </h3>
                    <ul className="space-y-4">
                      {result.strengths.map((s: string, i: number) => (
                        <li key={i} className="flex gap-3 text-slate-300 text-sm">
                          <span className="text-emerald-500 font-black">•</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass-card p-8 border-l-4 border-l-rose-500/50">
                    <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-rose-400">
                      <XCircle className="w-5 h-5" /> Critical Weaknesses
                    </h3>
                    <ul className="space-y-4">
                      {result.weaknesses.map((w: string, i: number) => (
                        <li key={i} className="flex gap-3 text-slate-300 text-sm">
                          <span className="text-rose-500 font-black">•</span>
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Suggestions & Keywords */}
                <div className="space-y-8">
                  <div className="glass-card p-8 border-l-4 border-l-indigo-500/50">
                    <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-indigo-400">
                      <Lightbulb className="w-5 h-5" /> Actionable Suggestions
                    </h3>
                    <ul className="space-y-4">
                      {result.suggestions.map((s: string, i: number) => (
                        <li key={i} className="flex gap-3 text-slate-300 text-sm leading-relaxed">
                          <div className="w-5 h-5 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-[10px] font-black shrink-0">{i+1}</div>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="glass-card p-8">
                    <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-amber-400">
                      <Search className="w-5 h-5" /> Missing Keywords
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {result.missingKeywords.map((k: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-amber-500/5 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/10 hover:bg-amber-500/10 transition-colors">
                          + {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              </div>
          )}
        </div>
      </main>
    </div>
  );
}
