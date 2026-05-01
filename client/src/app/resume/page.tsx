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
  Phone,
  GraduationCap,
  Briefcase,
  Award,
  Globe,
  Brain,
  Mail
} from "lucide-react";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("http://localhost:5000/api/resume/analyze", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data.resume);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar (Same as Dashboard) */}
      <aside className="w-64 border-r border-white/5 bg-slate-950 p-6 flex flex-col">
        <Link href="/" className="flex items-center gap-2 mb-10">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">PrepAI</span>
        </Link>
        <nav className="space-y-1 flex-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/quests" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <Zap className="w-5 h-5 text-amber-400" />
            Daily Quests
          </Link>
          <Link href="/roadmaps" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <MapIcon className="w-5 h-5" />
            Placement Roadmaps
          </Link>
          <Link href="/interview" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <MessageSquare className="w-5 h-5" />
            Mock Interview
          </Link>
          <Link href="/coding" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <Code className="w-5 h-5" />
            Coding Simulator
          </Link>
          <Link href="/resume" className="flex items-center gap-3 px-4 py-3 bg-white/5 text-white rounded-xl font-medium">
            <FileText className="w-5 h-5" />
            Resume Analyzer
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <User className="w-5 h-5 text-indigo-400" />
            Profile
          </Link>
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors mt-auto">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-1">ATS Resume Analyzer</h1>
          <p className="text-slate-400">Optimize your resume for search engines and recruiters.</p>
        </header>

        <div className="max-w-4xl">
          {!result ? (
            <div className="glass-card p-12 text-center border-dashed border-2 border-white/10 hover:border-indigo-500/50 transition-colors">
              <form onSubmit={handleUpload}>
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold mb-2">Upload your Resume</h2>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                  Drag and drop your file here, or click to browse. Supported formats: PDF, DOCX, TXT.
                </p>
                
                <input 
                  type="file" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden" 
                  id="file-upload"
                  accept=".pdf,.docx,.txt"
                />
                <label 
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-semibold mb-6 transition-colors border border-white/10"
                >
                  {file ? file.name : "Select File"}
                </label>

                {error && <p className="text-red-400 text-sm mb-6 flex items-center justify-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</p>}

                <div>
                  <button 
                    type="submit"
                    disabled={!file || loading}
                    className="btn-primary w-full max-w-xs"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Run AI Analysis"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Score Card & Breakdown */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 flex items-center gap-8 bg-gradient-to-br from-indigo-600/10 to-transparent">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                      <circle 
                        cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={364.4}
                        strokeDashoffset={364.4 - (364.4 * result.atsScore) / 100}
                        className="text-indigo-500 transition-all duration-1000" 
                      />
                    </svg>
                    <span className="absolute text-3xl font-bold">{result.atsScore}%</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Overall Score</h2>
                    <p className="text-slate-400 text-sm italic">Weighted ATS Compatibility</p>
                    <button 
                      onClick={() => setResult(null)}
                      className="mt-4 px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-colors border border-white/10 flex items-center gap-2"
                    >
                      <ChevronLeft className="w-3 h-3" /> Re-upload
                    </button>
                  </div>
                </div>

                <div className="glass-card p-8">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Evaluation Matrix</h3>
                  <div className="space-y-4">
                    {result.breakdown && Object.entries(result.breakdown).map(([key, val]: [string, any]) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-400">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-slate-200 font-bold">{val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 transition-all duration-1000" 
                            style={{ width: `${val}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                    {!result.breakdown && (
                      <div className="text-xs text-slate-500 italic">Detailed breakdown unavailable for this scan.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  AI Actionable Feedback
                </h3>
                <div className="bg-slate-900/50 p-6 rounded-xl border border-white/5 text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {result.feedback}
                </div>
              </div>

              {/* Resume Insights Section */}
              {result.extractedData && (
                <div className="glass-card p-8 mt-8 border-t-4 border-t-indigo-500">
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-indigo-400" />
                    Resume Intelligence Insights
                  </h3>

                  <div className="grid md:grid-cols-2 gap-10">
                    {/* Personal & Skills */}
                    <div className="space-y-8">
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Contact Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-slate-300">
                            <User className="w-4 h-4 text-indigo-400" />
                            <span className="font-semibold">{result.extractedData.Name || "Not Found"}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-300">
                            <Mail className="w-4 h-4 text-indigo-400" />
                            <span>{result.extractedData.Email || "Not Found"}</span>
                          </div>
                          <div className="flex items-center gap-3 text-slate-300">
                            <Phone className="w-4 h-4 text-indigo-400" />
                            <span>{result.extractedData.Phone || "Not Found"}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Core Skills Extracted</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.extractedData.Skills?.map((skill: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Education</h4>
                        <div className="space-y-4">
                          {result.extractedData.Education?.map((edu: any, i: number) => (
                            <div key={i} className="flex gap-3">
                              <GraduationCap className="w-5 h-5 text-indigo-400 shrink-0" />
                              <div>
                                <div className="text-sm font-bold text-slate-200">{edu.degree}</div>
                                <div className="text-xs text-slate-500">{edu.school} • {edu.year}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Experience & Projects */}
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Work Experience</h4>
                        <div className="space-y-6">
                          {result.extractedData.Experience?.map((exp: any, i: number) => (
                            <div key={i} className="relative pl-6 border-l border-white/10">
                              <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-indigo-500 rounded-full" />
                              <div className="text-sm font-bold text-slate-200">{exp.role}</div>
                              <div className="text-xs text-indigo-400 mb-2">{exp.company} • {exp.duration}</div>
                              <p className="text-xs text-slate-500 leading-relaxed">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Key Projects</h4>
                        <div className="space-y-4">
                          {result.extractedData.Projects?.map((proj: any, i: number) => (
                            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5">
                              <div className="flex items-center gap-2 mb-1 text-sm font-bold text-slate-200">
                                <Globe className="w-4 h-4 text-indigo-400" />
                                {proj.title}
                              </div>
                              <p className="text-xs text-slate-500">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {result.extractedData.Certifications?.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Certifications</h4>
                          <div className="flex flex-wrap gap-3">
                            {result.extractedData.Certifications.map((cert: string, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                <Award className="w-4 h-4 text-amber-400" />
                                {cert}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
