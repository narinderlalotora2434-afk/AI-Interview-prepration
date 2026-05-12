"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Send,
  Loader2,
  LogOut,
  Award,
  ArrowRight,
  Brain,
  Mic,
  MicOff,
  Volume2,
  Code,
  Zap,
  Target,
  Map as MapIcon,
  User,
  Sparkles,
  Menu,
  X,
  Settings,
  ShieldCheck,
  ChevronRight,
  History,
  TrendingUp,
  BrainCircuit,
  Clock,
  RefreshCcw,
  Monitor,
  Server,
  Layers,
  BarChart,
  Cpu,
  Terminal,
  Users,
  Heart,
  Binary,
  Database,
  BookOpen,
  Search,
  Video,
  Eye,
  Smile,
  FileCheck,
  Upload,
  CheckCircle2,
  Star,
  Activity,
  ChevronDown
} from "lucide-react";
import { useSpeech } from "@/lib/useSpeech";
import { getBaseUrl } from "@/lib/api";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useInterviewStore } from "@/store/useInterviewStore";
import { WebcamAI } from "@/components/WebcamAI";
import dynamic from 'next/dynamic';

// Dynamic import for Monaco Editor to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface Resume {
  id: string;
  content: string;
  atsScore: number;
}

interface Question {
  id: string;
  content: string;
}

interface Interview {
  id: string;
  questions: Question[];
}

interface EvaluatedAnswer {
  questionId: string;
  content: string;
  score: number;
  feedback: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

interface Evaluation {
  score: number;
  evaluatedAnswers: EvaluatedAnswer[];
  metrics?: {
    technical: number;
    communication: number;
    logic: number;
    confidence: number;
  };
  recommendation?: string;
}

export default function InterviewPage() {
  const {
    role, setRole,
    level, setLevel,
    interviewType, setInterviewType,
    difficulty, setDifficulty,
    duration, setDuration,
    features, toggleFeature,
    interviewId, setInterviewData,
    questions, addQuestion,
    userAnswers, addAnswer,
    isListening, setListening,
    isAnalyzing, setAnalyzing,
    analysisProgress,
    currentQuestionIndex,
    reset
  } = useInterviewStore();

  const [step, setStep] = useState<"setup" | "resume-analysis" | "chat" | "result" | "coding">("setup");
  const [company, setCompany] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [code, setCode] = useState("// Write your code here\n");
  
  const [aiState, setAiState] = useState<"idle" | "listening" | "thinking" | "generating">("idle");
  
  const router = useRouter();
  const pathname = usePathname();

  const { 
    isListening: isSpeechListening,
    isSpeaking,
    transcript, 
    startListening, 
    stopListening, 
    speak, 
    hasSupport 
  } = useSpeech();

  useEffect(() => {
    setListening(isSpeechListening);
  }, [isSpeechListening, setListening]);

  // Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "chat" || step === "coding") {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  useEffect(() => {
    if (isListening) {
      setCurrentAnswer(transcript);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const cachedDashboard = localStorage.getItem("dashboard_cache");
      if (cachedDashboard) {
        try {
          const data = JSON.parse(cachedDashboard);
          setResumes(data.recentResumes || []);
        } catch { }
      }

      fetch(`${getBaseUrl()}/api/user/dashboard`, {
        headers: { "Authorization": `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setResumes(data.recentResumes || []);
        })
        .catch(err => console.error("Failed to fetch resumes", err));
    }
  }, []);

  useEffect(() => {
    if (step === "chat" && questions[currentQuestionIndex]) {
      speak(questions[currentQuestionIndex].content);
    }
  }, [currentQuestionIndex, step, questions, speak]);

  const handleStart = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (uploadedFile || selectedResumeId) {
       setStep("resume-analysis");
       setAnalyzing(true, 0);
       
       // Simulate analysis progress
       for (let i = 0; i <= 100; i += 5) {
          setAnalyzing(true, i);
          await new Promise(r => setTimeout(r, 100));
       }
       
       if (uploadedFile) {
          try {
             const formData = new FormData();
             formData.append('resume', uploadedFile);
             formData.append('track', role.toLowerCase().includes('ece') || role.toLowerCase().includes('vlsi') ? 'hardware' : 'software');
             
             const res = await fetch(`${getBaseUrl()}/api/resume/analyze`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
             });
             const data = await res.json();
             setSelectedResumeId(data.resumeId);
          } catch (err) {
             console.error("Resume analysis failed:", err);
          }
       }
    }

    startInterview(token);
  };

  const startInterview = async (token: string | null) => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/interview/generate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          role, 
          experienceLevel: level, 
          company, 
          resumeId: selectedResumeId,
          interviewType,
          difficulty,
          duration,
          features
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start interview");
      
      setInterviewData(data.interview.id, [{ id: data.interview.questions[0].id, content: data.nextQuestion }]);
      setTimeLeft(duration * 60);
      setStep(features.coding && currentQuestionIndex === 3 ? "coding" : "chat");
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("quota")) {
        alert("API Quota Exceeded: Please check your billing details or wait for the limit to reset.");
      } else {
        alert(err.message || "Failed to start the interview. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if ((step === "chat" && !currentAnswer.trim()) || !interviewId) return;
    
    setLoading(true);
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`${getBaseUrl()}/api/interview/${interviewId}/next`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          answer: step === "coding" ? code : currentAnswer,
          currentStep: currentQuestionIndex + 1
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to progress");

      if (data.isFinished) {
         handleSubmit();
         return;
      }

      addQuestion({ id: Date.now().toString(), content: data.nextQuestion });
      addAnswer({ 
        questionId: questions[currentQuestionIndex].id, 
        content: step === "coding" ? code : currentAnswer 
      });
      
      setCurrentAnswer("");
      setAiState("generating");
      setTimeout(() => setAiState("idle"), 2000);
      
      // If coding round is enabled and we are at a certain point, switch to coding
      if (features.coding && currentQuestionIndex === 2) {
        setStep("coding");
      } else {
        setStep("chat");
      }
      
      useInterviewStore.setState({ currentQuestionIndex: currentQuestionIndex + 1 });
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to get the next question. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!interviewId) return;
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${getBaseUrl()}/api/user/dashboard`, {
          headers: { "Authorization": `Bearer ${token}` }
      });
      const dashData = await res.json();
      const lastInterview = dashData.recentInterviews?.[0] || { id: interviewId };
      
      setEvaluation({
         score: (lastInterview.score || 80) / 10,
         evaluatedAnswers: lastInterview.questions?.map((q: any) => ({
            questionId: q.id,
            content: q.answers?.[0]?.content || "No answer recorded",
            score: q.answers?.[0]?.score || 0,
            feedback: q.answers?.[0]?.feedback || "No feedback available"
         })) || []
      });
      
      setStep("result");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to submit interview for evaluation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      
      <header className="relative z-10 px-8 h-20 border-b border-border flex items-center justify-between bg-background/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <LogOut className="w-5 h-5 rotate-180" />
          </Link>
          <div className="h-6 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold tracking-tight">AI Interview Arena</span>
          </div>
        </div>

        {step === "chat" && (
           <div className="flex items-center gap-6">
              <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-primary" />
                 <span className="text-sm font-bold text-primary">Live Session Active</span>
              </div>
           </div>
        )}

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="w-10 h-10 rounded-full bg-foreground/10 border border-border flex items-center justify-center font-bold">
            U
          </div>
        </div>
      </header>

      <main className="relative z-10 p-8 max-w-7xl mx-auto min-h-[calc(100vh-80px)] flex flex-col items-center">
        <AnimatePresence mode="wait">
          {step === "setup" && (
            <motion.div 
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-6xl space-y-12"
            >
              {/* AI Status Indicator */}
              <div className="flex justify-end mb-4">
                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    AI Interviewer Ready
                 </div>
              </div>

              {/* Progress Flow */}
              <div className="flex justify-center items-center gap-4 mb-12">
                 {[
                   { id: 'setup', label: 'Setup', active: true, done: false },
                   { id: 'resume', label: 'Analysis', active: false, done: false },
                   { id: 'interview', label: 'Interview', active: false, done: false },
                   { id: 'feedback', label: 'Report', active: false, done: false },
                 ].map((s, i) => (
                   <div key={s.id} className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${s.active ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-secondary/50 border-border text-muted-foreground'}`}>
                         <span className="text-xs font-bold">{i + 1}</span>
                         <span className="text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
                      </div>
                      {i < 3 && <div className="w-8 h-px bg-border" />}
                   </div>
                 ))}
              </div>

              <div className="text-center mb-16">
                 <motion.div 
                   animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                   transition={{ duration: 5, repeat: Infinity }}
                   className="w-24 h-24 bg-gradient-to-br from-primary via-accent-cyan to-accent-pink rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-[0_0_40px_rgba(124,58,237,0.2)]"
                 >
                    <BrainCircuit className="w-12 h-12 text-white" />
                 </motion.div>
                 <h1 className="text-5xl font-black mb-4 tracking-tighter">Configure Your AI Interview</h1>
                 <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Personalized mock interviews powered by AI based on your skills, resume, and target company experience.</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-12">
                  {/* Role Selection */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <User className="w-5 h-5" />
                       </div>
                       <h2 className="text-xl font-bold">Target Role Selection</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                       {[
                         { id: "Software Engineer", icon: Code },
                         { id: "Frontend Developer", icon: Monitor },
                         { id: "Backend Developer", icon: Server },
                         { id: "Full Stack", icon: Layers },
                         { id: "Data Science", icon: BarChart },
                         { id: "AI/ML", icon: Cpu },
                         { id: "VLSI Engineer", icon: Activity },
                         { id: "Embedded Systems", icon: Settings },
                         { id: "Core ECE", icon: Brain },
                       ].map((item) => (
                         <button
                           key={item.id}
                           onClick={() => setRole(item.id)}
                           className={`p-6 rounded-2xl border text-left transition-all group relative overflow-hidden ${role === item.id ? 'bg-primary/5 border-primary shadow-[0_0_20px_rgba(124,58,237,0.1)]' : 'bg-secondary/30 border-border hover:border-primary/50'}`}
                         >
                           {role === item.id && (
                             <motion.div layoutId="role-bg" className="absolute inset-0 bg-primary/5 pointer-events-none" />
                           )}
                           <item.icon className={`w-8 h-8 mb-4 transition-colors ${role === item.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                           <p className={`font-bold text-sm ${role === item.id ? 'text-primary' : 'text-muted-foreground'}`}>{item.id}</p>
                         </button>
                       ))}
                    </div>
                  </section>

                  {/* Experience Level */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-2 rounded-lg bg-accent-cyan/10 text-accent-cyan">
                          <Activity className="w-5 h-5" />
                       </div>
                       <h2 className="text-xl font-bold">Experience Level</h2>
                    </div>
                    <div className="flex p-1.5 bg-secondary/50 border border-border rounded-2xl w-full max-w-md">
                       {["Fresher", "Junior", "Intermediate", "Experienced"].map((lvl) => (
                         <button
                           key={lvl}
                           onClick={() => setLevel(lvl)}
                           className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${level === lvl ? 'bg-background text-primary shadow-xl border border-border' : 'text-muted-foreground hover:text-foreground'}`}
                         >
                           {lvl}
                         </button>
                       ))}
                    </div>
                  </section>

                  {/* Interview Type */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-2 rounded-lg bg-accent-pink/10 text-accent-pink">
                          <Terminal className="w-5 h-5" />
                       </div>
                       <h2 className="text-xl font-bold">Session Type</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {[
                         { id: "Technical Interview", icon: Terminal, desc: "Focus on domain knowledge and core fundamentals." },
                         { id: "HR Interview", icon: Users, desc: "Culture fit, soft skills, and salary negotiation." },
                         { id: "Behavioral Round", icon: Heart, desc: "STAR method based situational questions." },
                         { id: "DSA Round", icon: Binary, desc: "Problem solving and algorithmic complexity." },
                         { id: "System Design", icon: Database, desc: "Architecture, scalability, and design patterns." },
                         { id: "Aptitude Round", icon: BookOpen, desc: "Logical reasoning and quantitative analysis." },
                         { id: "Resume-Based Interview", icon: Search, desc: "In-depth discussion on your projects and skills." },
                       ].map((item) => (
                         <button
                           key={item.id}
                           onClick={() => setInterviewType(item.id)}
                           className={`p-6 rounded-2xl border text-left transition-all group relative overflow-hidden ${interviewType === item.id ? 'bg-accent-pink/5 border-accent-pink shadow-[0_0_20px_rgba(244,63,94,0.1)]' : 'bg-secondary/30 border-border hover:border-accent-pink/50'}`}
                         >
                           <div className="flex items-start gap-4">
                              <div className={`p-3 rounded-xl transition-colors ${interviewType === item.id ? 'bg-accent-pink text-white' : 'bg-secondary text-muted-foreground group-hover:text-accent-pink'}`}>
                                 <item.icon className="w-6 h-6" />
                              </div>
                              <div>
                                 <p className={`font-bold text-sm mb-1 ${interviewType === item.id ? 'text-accent-pink' : 'text-foreground'}`}>{item.id}</p>
                                 <p className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</p>
                              </div>
                           </div>
                         </button>
                       ))}
                    </div>
                  </section>

                  {/* Resume Section */}
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                          <FileText className="w-5 h-5" />
                       </div>
                       <h2 className="text-xl font-bold">Resume Intelligence</h2>
                    </div>
                    <div className="glass-card p-10 border-dashed border-2 border-border hover:border-primary/50 transition-colors cursor-pointer group">
                       <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                             <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <h3 className="text-lg font-bold mb-2">Upload Your Resume</h3>
                          <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">Upload PDF/DOCX for AI to analyze your skills and projects for specific interview questions.</p>
                          
                          {resumes.length > 0 && (
                            <div className="w-full max-w-md space-y-4">
                               <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Or select from history</p>
                               <select 
                                  value={selectedResumeId}
                                  onChange={(e) => setSelectedResumeId(e.target.value)}
                                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-4 text-sm font-bold focus:outline-none focus:border-primary transition-all"
                               >
                                  <option value="">No Resume (General Questions)</option>
                                  {resumes.map((r) => (
                                    <option key={r.id} value={r.id}>ATS {r.atsScore}% - {r.content.substring(0, 30)}...</option>
                                  ))}
                               </select>
                            </div>
                          )}
                       </div>
                    </div>
                  </section>
                </div>

                <div className="space-y-10">
                  {/* AI Features */}
                  <section className="glass-card p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                    <div className="flex items-center gap-3 mb-8">
                       <Sparkles className="w-5 h-5 text-primary" />
                       <h2 className="text-lg font-bold">AI Features</h2>
                    </div>
                    <div className="space-y-4">
                       {[
                             { id: 'webcam', label: 'AI Webcam Proctoring', icon: Video, desc: 'Tracks attention, eye contact & movement' },
                             { id: 'emotion', label: 'Emotion Recognition', icon: Smile, desc: 'Analyzes facial expressions & confidence' },
                             { id: 'realtimeFeedback', label: 'Real-time AI Feedback', icon: Activity, desc: 'Live tips during your response' },
                             { id: 'followup', label: 'AI Follow-up Questions', icon: MessageSquare, desc: 'AI asks deeper questions based on your answer' },
                             { id: 'coding', label: 'Coding Assessment', icon: Code, desc: 'Integrated IDE for technical rounds' },
                             { id: 'ats', label: 'ATS Resume Scoring', icon: FileCheck, desc: 'Score your resume against job criteria' },
                       ].map((feat) => (
                         <div 
                           key={feat.id}
                           onClick={() => toggleFeature(feat.id as any)}
                           className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${features[feat.id as keyof typeof features] ? 'bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(124,58,237,0.1)]' : 'bg-secondary/30 border-border hover:bg-secondary/50'}`}
                         >
                            <div className="flex items-center gap-3">
                               <feat.icon className={`w-4 h-4 ${features[feat.id as keyof typeof features] ? 'text-primary' : 'text-muted-foreground'}`} />
                               <span className={`text-sm font-bold ${features[feat.id as keyof typeof features] ? 'text-foreground' : 'text-muted-foreground'}`}>{feat.label}</span>
                            </div>
                            <div className={`w-10 h-5 rounded-full transition-all relative ${features[feat.id as keyof typeof features] ? 'bg-primary' : 'bg-white/10'}`}>
                               <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${features[feat.id as keyof typeof features] ? 'left-6' : 'left-1'}`} />
                            </div>
                         </div>
                       ))}
                    </div>
                  </section>

                  {/* Difficulty & Duration */}
                  <section className="glass-card p-8">
                     <div className="space-y-8">
                        <div>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Difficulty Level</p>
                           <div className="flex gap-2">
                              {["Easy", "Medium", "Hard"].map((diff) => (
                                <button
                                  key={diff}
                                  onClick={() => setDifficulty(diff)}
                                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border ${difficulty === diff ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}
                                >
                                  {diff}
                                </button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-4">Interview Duration</p>
                           <div className="grid grid-cols-2 gap-2">
                              {[15, 30, 45, 60].map((min) => (
                                <button
                                  key={min}
                                  onClick={() => setDuration(min)}
                                  className={`py-3 rounded-xl text-xs font-bold transition-all border ${duration === min ? 'bg-background border-primary text-primary shadow-lg' : 'bg-secondary border-border text-muted-foreground hover:text-foreground'}`}
                                >
                                  {min} Mins
                                </button>
                              ))}
                           </div>
                        </div>
                     </div>
                  </section>

                  {/* Live AI Preview */}
                  <section className="glass-card p-8 bg-black/40 border-white/5 relative overflow-hidden group">
                     <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6 relative">
                           <Bot className="w-10 h-10 text-primary" />
                           <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-background" />
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-center gap-1">
                              {[1, 2, 3, 4, 5].map(i => (
                                <motion.div 
                                  key={i}
                                  animate={{ height: [8, 16, 8] }}
                                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                  className="w-1 bg-primary rounded-full"
                                />
                              ))}
                           </div>
                           <motion.div 
                             key={role + interviewType}
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="space-y-2"
                           >
                              <p className="text-xs font-bold italic text-foreground tracking-tight">
                                {loading ? (
                                  <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                  >
                                    AI is analyzing your response and preparing the next question...
                                  </motion.span>
                                ) : (
                                   `"${questions[currentQuestionIndex]?.content}"`
                                )}
                              </p>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-2">
                                {loading ? "Analyzing Logic..." : "Live Interviewer"}
                              </p>
                            </motion.div>
                            
                            {/* Timer & Meta Preview */}
                            <div className="mt-6 flex flex-wrap justify-center gap-4">
                              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-sm">
                                <Clock className="w-4 h-4" />
                                {duration} Mins
                              </div>
                              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan font-mono text-sm">
                                <Zap className="w-4 h-4" />
                                {difficulty} Mode
                              </div>
                            </div>
                        </div>
                     </div>
                  </section>

                  {/* Session Summary */}
                  <section className="glass-card p-8 bg-primary/5 border-primary/20">
                     <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">Session Summary</h3>
                     <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Est. Duration</span>
                           <span className="font-bold text-foreground">{duration} Mins</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Difficulty</span>
                           <span className="font-bold text-foreground">{difficulty}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">AI Accuracy</span>
                           <span className="font-bold text-emerald-400">98.5%</span>
                        </div>
                        <div className="w-full h-px bg-border my-4" />
                        <button 
                           onClick={handleStart}
                           disabled={loading}
                           className="w-full btn-primary py-5 text-base flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                           {loading ? (
                             <Loader2 className="w-6 h-6 animate-spin" />
                           ) : (
                             <>
                               <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
                               <span className="relative z-10 font-black tracking-widest uppercase text-sm">Start AI Interview</span>
                               <Sparkles className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                             </>
                           )}
                        </button>
                     </div>
                  </section>
                </div>
              </div>

              {/* Analytics Preview */}
              <div className="grid md:grid-cols-3 gap-6 pt-12 pb-20">
                 {[
                   { label: "Communication Score", icon: MessageSquare },
                   { label: "Technical Mastery", icon: Cpu },
                   { label: "ATS Compatibility", icon: FileCheck },
                 ].map((a, i) => (
                   <div key={i} className="flex items-center gap-4 p-6 glass-card border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary">
                         <a.icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">{a.label} Analysis Included</span>
                   </div>
                 ))}
              </div>
            </motion.div>
          )}

          {step === "resume-analysis" && (
            <motion.div 
              key="resume-analysis"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-2xl text-center py-20"
            >
              <div className="relative w-48 h-48 mx-auto mb-12">
                 <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                 <div className="absolute inset-4 rounded-full border-4 border-accent-cyan/20 border-b-accent-cyan animate-spin-slow" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Bot className="w-16 h-16 text-primary animate-pulse" />
                 </div>
              </div>
              
              <h2 className="text-4xl font-black mb-6 tracking-tight">AI Resume Intelligence</h2>
              <p className="text-muted-foreground text-lg mb-12">Our neural networks are extracting skills, projects, and key technologies from your resume to customize your interview.</p>
              
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border mb-16">
                 <motion.div 
                   className="h-full bg-primary shadow-[0_0_20px_rgba(124,58,237,0.5)]"
                   initial={{ width: 0 }}
                   animate={{ width: `${analysisProgress}%` }}
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: "Skills Detected", done: analysisProgress > 30 },
                   { label: "Projects Analyzed", done: analysisProgress > 60 },
                   { label: "AI Topics Generated", done: analysisProgress > 90 },
                   { label: "Profile Matched", done: analysisProgress > 95 },
                 ].map((item, i) => (
                   <div key={i} className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${item.done ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-secondary/50 border-border text-muted-foreground'}`}>
                      {item.done ? <CheckCircle2 className="w-4 h-4" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                      <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                   </div>
                 ))}
              </div>
            </motion.div>
          )}

          {step === "chat" && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-5xl space-y-8"
            >
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="glass-card aspect-video relative overflow-hidden bg-secondary border-border group">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    
                    {features.webcam ? (
                      <WebcamAI />
                    ) : (
                      /* AI Avatar Visualizer */
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8">
                        <motion.div 
                          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 6, repeat: Infinity }}
                          className="w-40 h-40 rounded-full bg-gradient-to-br from-primary via-accent-cyan to-accent-pink p-1 animate-glow shadow-[0_0_50px_rgba(124,58,237,0.3)]"
                        >
                          <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                              <Bot className="w-16 h-16 text-primary" />
                          </div>
                        </motion.div>
                        
                        <div className="flex flex-col items-center gap-4">
                          <div className="waveform h-6">
                              {[...Array(12)].map((_, i) => (
                                <div key={i} className={`waveform-bar ${isSpeaking ? 'bg-accent-cyan' : 'bg-primary'}`} style={{ animationDelay: `${i * 0.1}s`, width: '4px', animationDuration: isSpeaking ? '0.5s' : '1s' }} />
                              ))}
                          </div>
                          <p className={`text-xs font-bold tracking-[0.3em] uppercase animate-pulse ${isSpeaking ? 'text-accent-cyan' : 'text-primary'}`}>
                            {isSpeaking ? "AI is Speaking..." : isListening ? "Listening..." : aiState === "thinking" ? "AI is Thinking..." : aiState === "generating" ? "Generating follow-up..." : "AI Ready"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Live Question Display */}
                    <div className="absolute bottom-8 left-8 right-8 p-6 bg-[#0B1120]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          ROUND {currentQuestionIndex + 1}
                        </div>
                        <p className="text-xl font-medium leading-relaxed italic text-foreground min-h-[3rem]">
                          {loading ? (
                              <span className="flex items-center gap-1">
                                {[0, 1, 2].map(i => (
                                    <motion.span
                                      key={i}
                                      animate={{ opacity: [0.3, 1, 0.3] }}
                                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                      className="w-2 h-2 rounded-full bg-primary"
                                    />
                                ))}
                              </span>
                          ) : (
                              `"${questions[currentQuestionIndex]?.content}"`
                          )}
                        </p>
                    </div>
                  </div>

                  {/* User Input Area */}
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent-cyan/20 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                    <div className="relative glass-card p-6 flex flex-col md:flex-row gap-6">
                        <textarea 
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          placeholder={isListening ? "Listening... Speak clearly." : "Draft your response here..."}
                          className="flex-1 bg-secondary border border-border rounded-2xl p-6 min-h-[120px] focus:outline-none focus:border-primary/50 transition-all text-lg font-medium resize-none"
                        />
                        <div className="flex flex-row md:flex-col gap-4 justify-center">
                          {hasSupport && (
                            <button 
                              onClick={isListening ? stopListening : startListening}
                              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-secondary hover:bg-foreground/10 border border-border'}`}
                            >
                              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                            </button>
                          )}
                          <button 
                            onClick={handleNext}
                            disabled={!currentAnswer.trim() || loading}
                            className="w-16 h-16 rounded-2xl bg-primary hover:bg-primary/90 flex items-center justify-center transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                          >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <ChevronRight className="w-7 h-7" />}
                          </button>
                        </div>
                    </div>
                  </div>
                </div>

                {/* Real-time AI Coaching Panel */}
                <div className="space-y-6">
                   <div className="glass-card p-6 border-primary/20 bg-primary/5">
                      <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                         <Zap className="w-4 h-4" /> AI Coaching Panel
                      </h3>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center p-3 rounded-xl bg-background/50 border border-border">
                            <span className="text-xs text-muted-foreground">{interviewType === 'HR Interview' ? 'Nervousness' : 'Attention'}</span>
                            <span className={`text-xs font-bold ${interviewType === 'HR Interview' ? 'text-amber-400' : 'text-emerald-400'}`}>
                               {interviewType === 'HR Interview' ? 'Low' : 'Stable'}
                            </span>
                         </div>
                         <div className="flex justify-between items-center p-3 rounded-xl bg-background/50 border border-border">
                            <span className="text-xs text-muted-foreground">{interviewType === 'HR Interview' ? 'Fluency' : 'Filler Words'}</span>
                            <span className="text-xs font-bold text-emerald-400">
                               {interviewType === 'HR Interview' ? 'High' : 'Minimal'}
                            </span>
                         </div>
                         <div className="flex justify-between items-center p-3 rounded-xl bg-background/50 border border-border">
                            <span className="text-xs text-muted-foreground">Pace</span>
                            <span className="text-xs font-bold text-blue-400">Optimal</span>
                         </div>
                      </div>
                      
                      <div className="mt-8 pt-6 border-t border-border">
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Live Suggestions</p>
                         <div className="space-y-3">
                            <div className="p-4 rounded-xl bg-secondary/50 border border-border text-xs leading-relaxed italic">
                               "Your confidence score is rising! Keep maintaining steady eye contact while explaining complex logic."
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="glass-card p-6 border-accent-cyan/20 bg-accent-cyan/5">
                      <h3 className="text-sm font-black uppercase tracking-widest text-accent-cyan mb-4 flex items-center gap-2">
                         <Award className="w-4 h-4" /> Skill Analysis
                      </h3>
                      <div className="flex flex-wrap gap-2">
                         {role.split(' ').map(s => (
                            <span key={s} className="px-3 py-1 rounded-full bg-background border border-border text-[9px] font-bold text-accent-cyan">
                               {s.toUpperCase()}
                            </span>
                         ))}
                         <span className="px-3 py-1 rounded-full bg-background border border-border text-[9px] font-bold text-accent-cyan">
                            CORE CONCEPTS
                         </span>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === "coding" && (
            <motion.div 
              key="coding"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full h-[70vh] grid lg:grid-cols-2 gap-8"
            >
               <div className="glass-card p-8 flex flex-col space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-xl font-bold flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-primary" /> Coding Challenge
                     </h3>
                     <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">
                        <Clock className="w-4 h-4" />
                        {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                     </div>
                  </div>
                  <div className="flex-1 bg-secondary/50 rounded-2xl p-6 border border-border">
                     <p className="text-lg leading-relaxed text-foreground">
                        {questions[currentQuestionIndex]?.content || "Implement a function to find the maximum subarray sum."}
                     </p>
                  </div>
               </div>
               
               <div className="glass-card flex flex-col overflow-hidden border-primary/20">
                  <div className="bg-secondary/80 p-4 border-b border-border flex items-center justify-between">
                     <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-rose-500" />
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Editor: main.js</span>
                  </div>
                  <div className="flex-1">
                     <Editor
                        height="100%"
                        defaultLanguage="javascript"
                        theme="vs-dark"
                        value={code}
                        onChange={(val) => setCode(val || "")}
                        options={{
                           minimap: { enabled: false },
                           fontSize: 14,
                           padding: { top: 20 },
                        }}
                     />
                  </div>
                  <div className="p-4 bg-secondary/80 border-t border-border flex justify-end">
                     <button 
                        onClick={handleNext}
                        disabled={loading}
                        className="btn-primary py-3 px-8 text-sm flex items-center gap-2"
                     >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Run & Next"} <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </motion.div>
          )}

          {step === "result" && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-5xl space-y-8"
            >
              <div className="text-center">
                 <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                    <Award className="w-10 h-10 text-green-500" />
                 </div>
                 <h1 className="text-4xl font-bold mb-2">Performance Summary</h1>
                 <p className="text-muted-foreground">Your AI session has been evaluated with detailed DSA metrics.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                 <div className="glass-card p-8 text-center bg-gradient-to-br from-primary/10 to-transparent">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Overall Score</p>
                    <div className="text-6xl font-bold accent-gradient-text">{evaluation ? Math.round(evaluation.score * 10) : 0}%</div>
                    <p className="text-[10px] text-muted-foreground mt-4 font-bold uppercase tracking-widest">Performance Level: {evaluation && evaluation.score >= 8 ? "EXPERT" : evaluation && evaluation.score >= 6 ? "INTERMEDIATE" : "BEGINNER"}</p>
                 </div>
                 
                 <div className="glass-card p-8 col-span-2 grid grid-cols-2 gap-6">
                    {[
                      { label: "Coding Accuracy", value: `${evaluation?.metrics?.technical ? evaluation.metrics.technical * 10 : 85}%`, icon: Target, color: "text-green-500" },
                      { label: "Communication", value: evaluation?.metrics?.communication ? `${evaluation.metrics.communication}/10` : "8.5/10", icon: MessageSquare, color: "text-primary" },
                      { label: "Logic & Reasoning", value: evaluation?.metrics?.logic ? `${evaluation.metrics.logic}/10` : "9/10", icon: Brain, color: "text-accent-cyan" },
                      { label: "Confidence", value: evaluation?.metrics?.confidence ? `${evaluation.metrics.confidence * 10}%` : "78%", icon: Zap, color: "text-amber-500" },
                    ].map((m, i) => (
                      <div key={i} className="flex items-center gap-4">
                         <div className={`p-2 rounded-lg bg-secondary border border-border ${m.color}`}>
                            <m.icon className="w-4 h-4" />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{m.label}</p>
                            <p className="text-lg font-bold">{m.value}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-xl font-bold flex items-center gap-3">
                    <History className="w-5 h-5 text-muted-foreground" /> Question Breakdown
                 </h3>
                 {evaluation?.evaluatedAnswers.map((ans, i) => (
                    <div key={i} className="glass-card p-8 border-l-4 border-primary">
                       <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                          <div>
                            <h4 className="font-bold text-lg">Question {i + 1} Analysis</h4>
                            <div className="flex gap-4 mt-1">
                               {ans.timeComplexity && <span className="text-[10px] font-bold text-accent-cyan uppercase">Time: {ans.timeComplexity}</span>}
                               {ans.spaceComplexity && <span className="text-[10px] font-bold text-accent-pink uppercase">Space: {ans.spaceComplexity}</span>}
                            </div>
                          </div>
                          <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary">SCORE: {ans.score}/10</div>
                       </div>
                       <div className="space-y-6">
                          <p className="text-muted-foreground font-medium italic pl-4 border-l-2 border-border">&quot;{ans.content}&quot;</p>
                          <div className="p-6 rounded-2xl bg-secondary border border-border">
                             <div className="flex items-center gap-2 mb-3">
                                <Bot className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">AI Feedback</span>
                             </div>
                             <p className="text-muted-foreground leading-relaxed text-sm">{ans.feedback}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="flex justify-center gap-4 pb-10">
                 <Link href="/dashboard" className="btn-glass px-10 py-4">Return to Dashboard</Link>
                 <button onClick={() => setStep("setup")} className="btn-primary px-10 py-4">New Session</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
