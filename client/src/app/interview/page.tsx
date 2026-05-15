"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  MessageSquare, 
  FileText, 
  Loader2,
  LogOut,
  Award,
  ArrowRight,
  Brain,
  Mic,
  MicOff,
  Code,
  Zap,
  Target,
  Sparkles,
  Menu,
  ShieldCheck,
  ChevronRight,
  History,
  BrainCircuit,
  Clock,
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
  Smile,
  FileCheck,
  Upload,
  CheckCircle2,
  Activity,
  ChevronLeft,
  Settings,
  User
} from "lucide-react";
import { useSpeech } from "@/lib/useSpeech";
import { getBaseUrl } from "@/lib/api";
import { useInterviewStore } from "@/store/useInterviewStore";
import { WebcamAI } from "@/components/WebcamAI";
import dynamic from 'next/dynamic';
import Sidebar from "@/components/Sidebar";

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
    let currentResumeId = selectedResumeId;

    if (uploadedFile || selectedResumeId) {
       setStep("resume-analysis");
       setAnalyzing(true, 0);
       
       // Simulate analysis progress
       const progressInterval = setInterval(() => {
          useInterviewStore.setState(state => ({ analysisProgress: Math.min(state.analysisProgress + 5, 95) }));
       }, 150);
       
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
             currentResumeId = data.resumeId;
             setSelectedResumeId(data.resumeId);
          } catch (err) {
             console.error("Resume analysis failed:", err);
          }
       }
       clearInterval(progressInterval);
       useInterviewStore.setState({ analysisProgress: 100 });
       await new Promise(r => setTimeout(r, 500));
    }

    startInterview(token, currentResumeId);
  };

  const startInterview = async (token: string | null, resumeIdToUse?: string) => {
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
          resumeId: resumeIdToUse || selectedResumeId,
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
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary selection:bg-primary/10 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="px-4 md:px-10 h-20 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-black tracking-tight text-text-primary">PrepAI Arena</h1>
          </div>
          
          <div className="flex items-center gap-6">
            {step === "chat" || step === "coding" ? (
               <div className="flex items-center gap-4">
                  <div className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Session Active
                  </div>
                  <div className="px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                  </div>
               </div>
            ) : (
               <div className="px-5 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] hidden sm:flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  AI Interviewer Ready
               </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 no-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-12 pb-20">
            <AnimatePresence mode="wait">
              {step === "setup" && (
                <motion.div 
                  key="setup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-16"
                >
                  <div className="text-center max-w-3xl mx-auto space-y-6">
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="w-24 h-24 bg-primary rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/20"
                    >
                      <BrainCircuit className="w-12 h-12 text-white" />
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-text-primary uppercase leading-none">
                      Configure Your <span className="text-primary italic">AI Session</span>
                    </h2>
                    <p className="text-text-secondary text-xl font-medium leading-relaxed">
                      Personalized mock interviews powered by advanced neural analysis based on your target role and experience.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                      {/* Role Selection */}
                      <section className="saas-card p-6 md:p-12 space-y-8 bg-white shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                              <User className="w-6 h-6" />
                           </div>
                           <h3 className="text-2xl font-black tracking-tight">Target Specialization</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                               className={`p-6 rounded-[32px] border text-left transition-all group relative overflow-hidden bg-white ${role === item.id ? 'border-primary shadow-xl shadow-primary/5 bg-primary/5' : 'border-slate-100 hover:border-primary/20'}`}
                             >
                               <item.icon className={`w-8 h-8 mb-4 transition-colors ${role === item.id ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
                               <p className={`font-black text-xs uppercase tracking-widest ${role === item.id ? 'text-primary' : 'text-text-secondary'}`}>{item.id}</p>
                             </button>
                           ))}
                        </div>
                      </section>

                      {/* Interview Type */}
                      <section className="saas-card p-6 md:p-12 space-y-8 bg-white shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary border border-secondary/10">
                              <Binary className="w-6 h-6" />
                           </div>
                           <h3 className="text-2xl font-black tracking-tight">Assessment Type</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {[
                             { id: "Technical Interview", icon: Terminal, desc: "Domain knowledge and core engineering fundamentals." },
                             { id: "HR Interview", icon: Users, desc: "Culture fit, soft skills, and behavioral evaluation." },
                             { id: "Behavioral Round", icon: Heart, desc: "STAR method based situational analysis." },
                             { id: "DSA Round", icon: Binary, desc: "Problem solving and algorithmic complexity." },
                             { id: "System Design", icon: Database, desc: "Architecture, scalability, and design patterns." },
                             { id: "Aptitude Round", icon: BookOpen, desc: "Logical reasoning and quantitative analysis." },
                           ].map((item) => (
                             <button
                               key={item.id}
                               onClick={() => setInterviewType(item.id)}
                               className={`p-8 rounded-[40px] border text-left transition-all group relative overflow-hidden bg-white ${interviewType === item.id ? 'border-secondary shadow-xl shadow-secondary/5 bg-secondary/5' : 'border-slate-100 hover:border-secondary/20'}`}
                             >
                               <div className="flex items-start gap-6">
                                  <div className={`p-4 rounded-2xl transition-colors ${interviewType === item.id ? 'bg-secondary text-white' : 'bg-slate-50 text-slate-400 group-hover:text-secondary'}`}>
                                     <item.icon className="w-6 h-6" />
                                  </div>
                                  <div className="flex-1">
                                     <p className={`font-black text-sm uppercase tracking-widest mb-1 ${interviewType === item.id ? 'text-secondary' : 'text-text-primary'}`}>{item.id}</p>
                                     <p className="text-xs text-text-secondary font-medium leading-relaxed">{item.desc}</p>
                                  </div>
                               </div>
                             </button>
                           ))}
                        </div>
                      </section>

                      {/* Resume Selection */}
                      <section className="saas-card p-6 md:p-12 space-y-8 bg-white shadow-xl shadow-slate-200/50">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                 <FileCheck className="w-6 h-6" />
                              </div>
                              <h3 className="text-2xl font-black tracking-tight">Neural Profile <span className="text-emerald-500 italic">(Resume)</span></h3>
                           </div>
                           <div className="px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[9px] font-black text-emerald-600 uppercase tracking-widest">Optional Context</div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                           <div 
                             onClick={() => document.getElementById('resume-upload')?.click()}
                             className={`p-6 md:p-10 border-4 border-dashed rounded-[32px] md:rounded-[40px] text-center cursor-pointer transition-all group relative overflow-hidden ${uploadedFile ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary/30 hover:bg-slate-50'}`}
                           >
                              <input 
                                type="file" 
                                id="resume-upload" 
                                className="hidden" 
                                accept=".pdf,.docx" 
                                onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                              />
                              <div className="relative z-10 space-y-4">
                                 <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center transition-all ${uploadedFile ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'bg-slate-100 text-slate-400 group-hover:scale-110'}`}>
                                    <Upload className="w-8 h-8" />
                                 </div>
                                 <div>
                                    <p className="font-black text-sm text-text-primary uppercase tracking-widest">{uploadedFile ? uploadedFile.name : "Inject New Resume"}</p>
                                    <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-1">PDF / DOCX (MAX 5MB)</p>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-4">
                              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] px-4">Recent Synced Profiles</p>
                              <div className="space-y-3 max-h-[200px] overflow-y-auto no-scrollbar pr-2">
                                 {resumes.length > 0 ? resumes.map((res) => (
                                   <button
                                     key={res.id}
                                     onClick={() => setSelectedResumeId(res.id)}
                                     className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between group ${selectedResumeId === res.id ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-slate-100 bg-white hover:border-emerald-200'}`}
                                   >
                                      <div className="flex items-center gap-4">
                                         <div className={`p-2.5 rounded-xl transition-colors ${selectedResumeId === res.id ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:text-emerald-500'}`}>
                                            <FileText className="w-4 h-4" />
                                         </div>
                                         <span className="text-[11px] font-bold text-text-primary uppercase tracking-tight">Archive_{res.id.slice(-6)}</span>
                                      </div>
                                      <div className="text-right">
                                         <div className="text-[10px] font-black text-emerald-600">ATS: {res.atsScore}%</div>
                                      </div>
                                   </button>
                                 )) : (
                                   <div className="py-12 text-center bg-slate-50 border border-dashed border-slate-100 rounded-3xl text-[9px] font-black text-slate-400 uppercase tracking-widest">No Recent Syncs</div>
                                 )}
                              </div>
                           </div>
                        </div>
                      </section>
                    </div>

                    <div className="space-y-12">
                      {/* AI Features */}
                      <section className="saas-card p-6 md:p-10 space-y-10 bg-white shadow-xl shadow-slate-200/50">
                        <div className="flex items-center gap-3">
                           <Sparkles className="w-6 h-6 text-primary" />
                           <h3 className="text-xl font-black tracking-tight">Neural Enhancements</h3>
                        </div>
                        <div className="space-y-4">
                           {[
                                 { id: 'webcam', label: 'AI Proctoring', icon: Video },
                                 { id: 'emotion', label: 'Sentiment Analysis', icon: Smile },
                                 { id: 'realtimeFeedback', label: 'Live AI Tips', icon: Zap },
                                 { id: 'followup', label: 'Dynamic Follow-ups', icon: MessageSquare },
                                 { id: 'coding', label: 'Integrated IDE', icon: Code },
                           ].map((feat) => (
                             <div 
                               key={feat.id}
                               onClick={() => toggleFeature(feat.id as any)}
                               className={`flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all bg-white ${features[feat.id as keyof typeof features] ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-primary/20'}`}
                             >
                                <div className="flex items-center gap-4">
                                   <feat.icon className={`w-5 h-5 ${features[feat.id as keyof typeof features] ? 'text-primary' : 'text-slate-400'}`} />
                                   <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${features[feat.id as keyof typeof features] ? 'text-text-primary' : 'text-text-secondary'}`}>{feat.label}</span>
                                </div>
                                <div className={`w-10 h-5 rounded-full transition-all relative ${features[feat.id as keyof typeof features] ? 'bg-primary' : 'bg-slate-200'}`}>
                                   <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${features[feat.id as keyof typeof features] ? 'left-6' : 'left-1'}`} />
                                </div>
                             </div>
                           ))}
                        </div>
                      </section>

                      {/* Difficulty & Duration */}
                      <section className="saas-card p-6 md:p-10 space-y-10 bg-white shadow-xl shadow-slate-200/50">
                        <div className="space-y-10">
                           <div>
                              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-6">Simulation Intensity</p>
                              <div className="flex gap-3">
                                 {["Easy", "Medium", "Hard"].map((diff) => (
                                   <button
                                     key={diff}
                                     onClick={() => setDifficulty(diff)}
                                     className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${difficulty === diff ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 border-slate-100 text-text-secondary hover:border-primary/30'}`}
                                   >
                                     {diff}
                                   </button>
                                 ))}
                              </div>
                           </div>

                           <div>
                              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-6">Session Timeline</p>
                              <div className="grid grid-cols-2 gap-3">
                                 {[15, 30, 45, 60].map((min) => (
                                   <button
                                     key={min}
                                     onClick={() => setDuration(min)}
                                     className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${duration === min ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'bg-slate-50 border-slate-100 text-text-secondary hover:border-primary/30'}`}
                                   >
                                     {min} Mins
                                   </button>
                                 ))}
                              </div>
                           </div>
                        </div>
                      </section>

                      <button 
                        onClick={handleStart}
                        disabled={loading}
                        className="w-full btn-primary py-8 text-base flex items-center justify-center gap-4 group relative overflow-hidden rounded-[32px] shadow-2xl shadow-primary/30"
                      >
                         {loading ? (
                           <Loader2 className="w-8 h-8 animate-spin" />
                         ) : (
                           <>
                              <span className="relative z-10 font-black tracking-[0.3em] uppercase text-sm">Initialize Arena</span>
                              <Sparkles className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform" />
                           </>
                         )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === "resume-analysis" && (
                <motion.div 
                  key="resume-analysis"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center justify-center py-40 text-center space-y-12"
                >
                  <div className="relative w-64 h-64">
                     <div className="absolute inset-0 rounded-[64px] border-8 border-primary/10 border-t-primary animate-spin" />
                     <div className="absolute inset-8 rounded-[48px] border-4 border-secondary/10 border-b-secondary animate-spin-slow" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Bot className="w-20 h-20 text-primary animate-pulse" />
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <h2 className="text-5xl font-black tracking-tighter uppercase">Analyzing <span className="text-primary italic">Neural Profile</span></h2>
                     <p className="text-text-secondary text-xl font-medium max-w-xl mx-auto leading-relaxed">
                        Extracting technical expertise and project heuristics to customize your interview trajectory.
                     </p>
                  </div>
                  
                  <div className="w-full max-w-2xl h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                     <motion.div 
                       className="h-full bg-primary rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                       initial={{ width: 0 }}
                       animate={{ width: `${analysisProgress}%` }}
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                     {[
                       { label: "Skills Detected", done: analysisProgress > 30 },
                       { label: "Experience Mapping", done: analysisProgress > 60 },
                       { label: "Query Optimization", done: analysisProgress > 90 },
                       { label: "Sync Complete", done: analysisProgress > 95 },
                     ].map((item, i) => (
                       <div key={i} className={`p-5 rounded-2xl border flex items-center gap-4 transition-all ${item.done ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                          {item.done ? <CheckCircle2 className="w-5 h-5" /> : <Loader2 className="w-5 h-5 animate-spin" />}
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
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
                  className="grid lg:grid-cols-3 gap-12"
                >
                  <div className="lg:col-span-2 space-y-8 md:space-y-12">
                    <div className="saas-card aspect-video lg:h-auto relative overflow-hidden bg-slate-900 rounded-[32px] md:rounded-[48px] shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                      
                      {features.webcam ? (
                        <WebcamAI />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-12">
                          <motion.div 
                            animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0, -5, 0] }}
                            transition={{ duration: 10, repeat: Infinity }}
                            className="w-52 h-52 rounded-full bg-primary/10 p-1 shadow-[0_0_80px_rgba(124,58,237,0.2)] border border-primary/20"
                          >
                            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
                                <Bot className="w-24 h-24 text-primary" />
                            </div>
                          </motion.div>
                          
                          <div className="flex flex-col items-center gap-6">
                            <div className="waveform h-8 flex items-center gap-1.5">
                                {[...Array(16)].map((_, i) => (
                                  <motion.div 
                                    key={i} 
                                    animate={{ height: isSpeaking ? [12, 40, 12] : [6, 12, 6] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                                    className={`w-1.5 rounded-full ${isSpeaking ? 'bg-secondary' : 'bg-primary'}`} 
                                  />
                                ))}
                            </div>
                            <p className={`text-[11px] font-black tracking-[0.4em] uppercase ${isSpeaking ? 'text-secondary' : 'text-primary'}`}>
                              {isSpeaking ? "Neural Audio Transmission..." : isListening ? "Neural Input Active..." : "System Idle"}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Live Question Display */}
                      <div className="absolute bottom-4 left-4 right-4 md:bottom-12 md:left-12 md:right-12 p-6 md:p-8 bg-white/95 backdrop-blur-md border border-slate-200 rounded-[24px] md:rounded-[32px] shadow-2xl">
                          <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            ROUND {currentQuestionIndex + 1} • {interviewType}
                          </div>
                          <p className="text-2xl font-black leading-tight text-slate-800 tracking-tight min-h-[4rem]">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                  {[0, 1, 2].map(i => (
                                      <motion.span
                                        key={i}
                                        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                        className="w-3 h-3 rounded-full bg-primary"
                                      />
                                  ))}
                                </span>
                            ) : (
                                `"${questions[currentQuestionIndex]?.content}"`
                            )}
                          </p>
                      </div>
                    </div>

                    <div className="saas-card p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 bg-white shadow-xl shadow-slate-200/50 rounded-[32px] md:rounded-[40px]">
                        <textarea 
                          value={currentAnswer}
                          onChange={(e) => setCurrentAnswer(e.target.value)}
                          placeholder={isListening ? "Listening to neural input..." : "Draft your technical response here..."}
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-[24px] md:rounded-[32px] p-6 md:p-10 min-h-[150px] md:min-h-[180px] focus:outline-none focus:border-primary/50 focus:bg-white transition-all text-lg md:text-xl font-medium resize-none text-slate-800 placeholder:text-slate-300"
                        />
                        <div className="flex flex-row md:flex-col gap-6 justify-center">
                          {hasSupport && (
                            <button 
                              onClick={isListening ? stopListening : startListening}
                              className={`w-20 h-20 rounded-[32px] flex items-center justify-center transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse shadow-xl shadow-rose-200' : 'bg-slate-50 hover:bg-white border border-slate-100 text-slate-400 hover:text-primary hover:border-primary/20 shadow-sm'}`}
                            >
                              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                            </button>
                          )}
                          <button 
                            onClick={handleNext}
                            disabled={!currentAnswer.trim() || loading}
                            className="w-20 h-20 rounded-[32px] bg-primary hover:bg-primary/90 flex items-center justify-center transition-all disabled:opacity-50 shadow-2xl shadow-primary/30 text-white"
                          >
                            {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <ChevronRight className="w-10 h-10" />}
                          </button>
                        </div>
                    </div>
                  </div>

                  <div className="space-y-8 md:space-y-12">
                    <div className="saas-card p-6 md:p-10 border-primary/10 bg-primary/5 shadow-xl shadow-primary/5 space-y-8 md:space-y-10 rounded-[32px] md:rounded-[40px]">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-3">
                          <Zap className="w-5 h-5" /> Strategic Insight
                       </h3>
                       <div className="space-y-6">
                          {[
                            { label: "Confidence Pulse", value: "Stable", color: "text-emerald-500" },
                            { label: "Neural Clarity", value: "Optimal", color: "text-primary" },
                            { label: "Speech Velocity", value: "Balanced", color: "text-blue-500" },
                          ].map((stat, i) => (
                            <div key={i} className="flex justify-between items-center p-5 rounded-[24px] bg-white border border-slate-50 shadow-sm">
                               <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{stat.label}</span>
                               <span className={`text-xs font-black uppercase tracking-widest ${stat.color}`}>{stat.value}</span>
                            </div>
                          ))}
                       </div>
                       
                       <div className="pt-10 border-t border-primary/10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-6">AI Mentor Suggestions</p>
                          <div className="p-6 rounded-[28px] bg-white border border-primary/10 text-sm leading-relaxed italic text-text-secondary shadow-sm font-medium">
                             &quot;Targeting core concepts of {role}. Emphasize architectural scalability in your current explanation.&quot;
                          </div>
                       </div>
                    </div>

                   <div className="saas-card p-6 md:p-10 bg-white shadow-xl shadow-slate-200/50 rounded-[32px] md:rounded-[40px] space-y-8">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary flex items-center gap-3">
                         <Target className="w-5 h-5 text-secondary" /> Active Domains
                      </h3>
                      <div className="flex flex-wrap gap-3">
                         {role.split(' ').map(s => (
                            <span key={s} className="px-5 py-2 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black text-text-secondary uppercase tracking-widest group-hover:bg-primary/5 transition-colors">
                               {s}
                            </span>
                         ))}
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
                  className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:h-[75vh]"
                >
                   <div className="saas-card p-12 flex flex-col space-y-10 bg-white shadow-xl shadow-slate-200/50 rounded-[48px]">
                      <div className="flex items-center justify-between">
                         <h3 className="text-2xl font-black flex items-center gap-4 text-text-primary uppercase tracking-tight">
                            <Terminal className="w-8 h-8 text-primary" /> Coding Challenge
                         </h3>
                         <div className="px-5 py-2.5 rounded-full bg-rose-50 text-rose-600 text-xs font-black border border-rose-100 flex items-center gap-3 tabular-nums shadow-sm">
                            <Clock className="w-5 h-5" />
                            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                         </div>
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-slate-100 overflow-y-auto no-scrollbar">
                         <p className="text-xl font-medium leading-relaxed text-text-primary">
                            {questions[currentQuestionIndex]?.content || "Implement a high-performance function to solve the given technical challenge."}
                         </p>
                      </div>
                   </div>
                   
                   <div className="saas-card flex flex-col overflow-hidden border-slate-100 bg-[#1e1e1e] rounded-[32px] md:rounded-[48px] shadow-2xl h-[500px] lg:h-auto">
                      <div className="bg-slate-800 p-6 border-b border-slate-700 flex items-center justify-between">
                         <div className="flex gap-2.5">
                            <div className="w-3.5 h-3.5 rounded-full bg-rose-500" />
                            <div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                         </div>
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Integrated Terminal v2.0</span>
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
                               fontSize: 16,
                               padding: { top: 30, bottom: 30 },
                               lineNumbersMinChars: 3,
                               scrollBeyondLastLine: false,
                               fontFamily: 'JetBrains Mono, monospace'
                            }}
                         />
                      </div>
                      <div className="p-8 bg-slate-800 border-t border-slate-700 flex justify-end">
                         <button 
                            onClick={handleNext}
                            disabled={loading}
                            className="btn-primary py-5 px-12 text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 shadow-2xl shadow-primary/30"
                         >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Run Neural Analysis"} <ArrowRight className="w-5 h-5" />
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
                  className="space-y-16 pb-20"
                >
                  <div className="text-center space-y-4 max-w-3xl mx-auto">
                     <div className="w-24 h-24 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-emerald-100 shadow-xl shadow-emerald-500/5">
                        <Award className="w-12 h-12 text-emerald-600" />
                     </div>
                     <h2 className="text-6xl font-black tracking-tighter text-text-primary uppercase leading-none">Neural Performance <span className="text-primary italic">Audit</span></h2>
                     <p className="text-text-secondary text-xl font-medium">Your session evaluation is complete. View detailed metrics and AI-driven growth trajectory.</p>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-12">
                     <div className="saas-card p-12 text-center bg-white shadow-xl shadow-slate-200/50 rounded-[48px] space-y-8 flex flex-col justify-center">
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em]">Aggregated Session Score</p>
                        <div className="text-9xl font-black text-primary tracking-tighter leading-none">{evaluation ? Math.round(evaluation.score * 10) : 0}<span className="text-4xl text-text-secondary">%</span></div>
                        <div className="pt-8 border-t border-slate-50 flex flex-col items-center gap-4">
                           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em] bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
                             Status: {evaluation && evaluation.score >= 8 ? "ELITE" : evaluation && evaluation.score >= 6 ? "READY" : "IN PROGRESS"}
                           </span>
                        </div>
                     </div>
                     
                     <div className="saas-card p-12 col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-10 bg-white shadow-xl shadow-slate-200/50 rounded-[48px]">
                        {[
                          { label: "Technical Precision", value: `${evaluation?.metrics?.technical ? evaluation.metrics.technical * 10 : 85}%`, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
                          { label: "Neural Clarity", value: evaluation?.metrics?.communication ? `${evaluation.metrics.communication}/10` : "8.5/10", icon: MessageSquare, color: "text-primary", bg: "bg-primary/5" },
                          { label: "Logic Velocity", value: evaluation?.metrics?.logic ? `${evaluation.metrics.logic}/10` : "9.0/10", icon: Brain, color: "text-secondary", bg: "bg-secondary/5" },
                          { label: "Confidence Index", value: evaluation?.metrics?.confidence ? `${evaluation.metrics.confidence * 10}%` : "78%", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
                        ].map((m, i) => (
                          <div key={i} className="flex items-center gap-8 group">
                             <div className={`w-20 h-20 rounded-[28px] ${m.bg} border border-slate-50 ${m.color} flex items-center justify-center transition-all group-hover:scale-110 shadow-sm`}>
                                <m.icon className="w-10 h-10" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-2">{m.label}</p>
                                <p className="text-3xl font-black text-text-primary tracking-tight">{m.value}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-12">
                     <h3 className="text-3xl font-black tracking-tight flex items-center gap-4 text-text-primary uppercase">
                        <History className="w-8 h-8 text-text-secondary" /> Tactical Breakdown
                     </h3>
                     <div className="space-y-10">
                        {evaluation?.evaluatedAnswers.map((ans, i) => (
                           <div key={i} className="saas-card p-12 border-l-[8px] border-l-primary bg-white shadow-xl shadow-slate-200/50 rounded-[48px] space-y-10">
                              <div className="flex flex-wrap items-center justify-between gap-8">
                                 <div>
                                   <h4 className="font-black text-2xl text-text-primary tracking-tight">Round {i + 1} Assessment</h4>
                                   <div className="flex gap-6 mt-3">
                                      {ans.timeComplexity && <span className="text-[10px] font-black text-secondary uppercase tracking-widest bg-secondary/5 px-4 py-1.5 rounded-full border border-secondary/10">Complexity: {ans.timeComplexity}</span>}
                                      {ans.spaceComplexity && <span className="text-[10px] font-black text-accent uppercase tracking-widest bg-accent/5 px-4 py-1.5 rounded-full border border-accent/10">Memory: {ans.spaceComplexity}</span>}
                                   </div>
                                 </div>
                                 <div className="px-6 py-2.5 rounded-[20px] bg-primary/5 border border-primary/10 text-sm font-black text-primary tabular-nums">SCORE: {ans.score}/10</div>
                              </div>
                              <div className="space-y-8">
                                 <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 text-lg font-medium italic text-text-secondary leading-relaxed border-l-[6px] border-l-slate-200">
                                    &quot;{ans.content}&quot;
                                 </div>
                                 <div className="p-10 rounded-[40px] bg-white border border-slate-100 shadow-inner">
                                    <div className="flex items-center gap-3 mb-6">
                                       <Bot className="w-6 h-6 text-primary" />
                                       <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">AI Mentor Review</span>
                                    </div>
                                    <p className="text-text-secondary leading-relaxed text-base font-medium">{ans.feedback}</p>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="flex justify-center gap-6 pt-10">
                     <Link href="/dashboard" className="px-12 py-5 rounded-[28px] border border-slate-200 font-black text-xs uppercase tracking-[0.2em] text-text-secondary hover:bg-white hover:shadow-xl transition-all">Back to Command Center</Link>
                     <button onClick={() => setStep("setup")} className="btn-primary px-12 py-5 rounded-[28px] text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30">New Neural Sync</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
