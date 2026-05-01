"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Bot, 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Send,
  Loader2,
  LogOut,
  ChevronLeft,
  Award,
  ArrowRight,
  BrainCircuit,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Code,
  Zap,
  Map as MapIcon,
  User
} from "lucide-react";
import { useSpeech } from "@/lib/useSpeech";

export default function InterviewPage() {
  const [step, setStep] = useState<"setup" | "chat" | "result">("setup");
  const [role, setRole] = useState("Software Engineer");
  const [level, setLevel] = useState("Junior");
  const [company, setCompany] = useState("");
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interview, setInterview] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<any>(null);
  const router = useRouter();

  const { 
    isListening, 
    transcript, 
    setTranscript, 
    startListening, 
    stopListening, 
    speak, 
    hasSupport 
  } = useSpeech();

  // Sync transcript to currentAnswer
  useEffect(() => {
    if (isListening) {
      setCurrentAnswer(transcript);
    }
  }, [transcript, isListening]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5000/api/user/dashboard", {
        headers: { "Authorization": `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setResumes(data.recentResumes || []))
        .catch(err => console.error("Failed to fetch resumes", err));
    }
  }, []);

  // Read question aloud when it changes
  useEffect(() => {
    if (step === "chat" && isVoiceMode && interview?.questions[currentQuestionIndex]) {
      speak(interview.questions[currentQuestionIndex].content);
    }
  }, [currentQuestionIndex, step, isVoiceMode, interview, speak]);

  const handleStart = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/interview/generate", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ role, experienceLevel: level, company, resumeId: selectedResumeId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start interview");
      setInterview(data.interview);
      setStep("chat");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!currentAnswer.trim()) return;
    
    const newAnswers = [...userAnswers, { 
      questionId: interview.questions[currentQuestionIndex].id, 
      content: currentAnswer 
    }];
    setUserAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: any[]) => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/interview/${interview.id}/evaluate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      setEvaluation(data);
      setStep("result");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-50">
      {/* Sidebar */}
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
          <Link href="/interview" className="flex items-center gap-3 px-4 py-3 bg-white/5 text-white rounded-xl font-medium">
            <MessageSquare className="w-5 h-5" />
            Mock Interview
          </Link>
          <Link href="/coding" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
            <Code className="w-5 h-5" />
            Coding Simulator
          </Link>
          <Link href="/resume" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
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
      <main className="flex-1 p-10 flex flex-col">
        {step === "setup" && (
          <div className="max-w-2xl mx-auto w-full mt-20">
            <header className="mb-10 text-center">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                <BrainCircuit className="w-10 h-10 text-indigo-400" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Start Mock Interview</h1>
              <p className="text-slate-400 text-lg">Our AI will generate 5 customized questions to test your skills.</p>
            </header>

            <div className="glass-card p-8 space-y-8">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">Job Role</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-4 text-lg focus:border-indigo-500 outline-none appearance-none"
                >
                  <option>Software Engineer</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Data Scientist</option>
                  <option>Product Manager</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">Target Company (Optional)</label>
                <input 
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Amazon, Meta"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-4 text-lg focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">Focus on Resume (Optional)</label>
                <select 
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-4 text-lg focus:border-indigo-500 outline-none appearance-none"
                >
                  <option value="">No specific resume</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.content.replace('Uploaded file: ', '')} (Score: {r.atsScore}%)
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500">The AI will generate questions based on your specific projects and skills.</p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-400 uppercase tracking-wider">Experience Level</label>
                <div className="grid grid-cols-3 gap-4">
                  {["Junior", "Mid-Level", "Senior"].map((l) => (
                    <button 
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`py-3 rounded-xl border font-semibold transition-all ${level === l ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isVoiceMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">Voice Mode</div>
                    <div className="text-xs text-slate-500">AI reads questions aloud</div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsVoiceMode(!isVoiceMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isVoiceMode ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isVoiceMode ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <button 
                onClick={handleStart}
                disabled={loading}
                className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Start InterviewSession"}
              </button>
            </div>
          </div>
        )}

        {step === "chat" && (
          <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-bold">{role} {company ? `at ${company}` : 'Interview'}</h2>
                <p className="text-slate-400">Question {currentQuestionIndex + 1} of {interview?.questions.length}</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsVoiceMode(!isVoiceMode)}
                  className={`p-2 rounded-lg border transition-colors ${isVoiceMode ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-500'}`}
                  title={isVoiceMode ? "Voice Mode On" : "Voice Mode Off"}
                >
                  {isVoiceMode ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                <div className="px-4 py-2 bg-indigo-500/10 rounded-full text-indigo-400 font-bold text-sm border border-indigo-500/20">
                  LIVE SESSION
                </div>
              </div>
            </header>

            <div className="flex-1 space-y-8 overflow-y-auto mb-6 pr-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="glass-card p-6 bg-indigo-500/5 border-indigo-500/20 max-w-[80%]">
                  <p className="text-lg leading-relaxed text-slate-100">
                    {interview?.questions[currentQuestionIndex].content}
                  </p>
                </div>
              </div>

              {userAnswers.slice(0, currentQuestionIndex).map((ans, i) => (
                <div key={i} className="flex gap-4 justify-end">
                  <div className="glass-card p-6 max-w-[80%] bg-white/5">
                    <p className="text-slate-300">{ans.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <textarea 
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder={isListening ? "Listening..." : "Type or speak your answer here..."}
                className={`w-full bg-slate-900/50 border rounded-2xl p-6 pr-32 min-h-[150px] focus:border-indigo-500 outline-none transition-all text-lg ${isListening ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/10'}`}
              />
              <div className="absolute bottom-6 right-6 flex items-center gap-3">
                {hasSupport && (
                  <button 
                    onClick={isListening ? stopListening : startListening}
                    className={`p-3 rounded-xl transition-all border ${isListening ? 'bg-red-500/10 border-red-500/50 text-red-500 animate-pulse' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                    title={isListening ? "Stop Listening" : "Start Listening"}
                  >
                    {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  </button>
                )}
                <button 
                  onClick={handleNext}
                  disabled={!currentAnswer.trim() || loading}
                  className="p-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all disabled:opacity-50 text-white"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                </button>
              </div>
            </div>
            <p className="mt-4 text-center text-slate-500 text-sm italic">Press the button when you're ready to proceed to the next question.</p>
          </div>
        )}

        {step === "result" && (
          <div className="max-w-4xl mx-auto w-full">
            <header className="text-center mb-12">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <Award className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="text-4xl font-bold mb-2">Interview Complete!</h1>
              <p className="text-slate-400">Great job. Here is your AI-generated performance report.</p>
            </header>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="glass-card p-8 text-center bg-indigo-500/5 border-indigo-500/20">
                <div className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-2">Overall Score</div>
                <div className="text-6xl font-bold text-indigo-400">{Math.round(evaluation?.score * 10)}%</div>
              </div>
              <div className="glass-card p-8 text-center col-span-2 flex flex-col justify-center items-start">
                <h3 className="text-xl font-bold mb-2">Next Steps</h3>
                <p className="text-slate-400 text-left">Your scores show a strong understanding of core concepts. Focus on refining your system design answers for the best results.</p>
              </div>
            </div>

            <div className="space-y-6 mb-12">
              <h3 className="text-2xl font-bold">Detailed Feedback</h3>
              {evaluation?.evaluatedAnswers.map((ans: any, i: number) => (
                <div key={i} className="glass-card p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-bold text-lg text-indigo-300">Question {i + 1}</h4>
                    <span className="px-3 py-1 bg-white/5 rounded-full text-sm font-bold border border-white/10">Score: {ans.score}/10</span>
                  </div>
                  <div className="space-y-4">
                    <p className="text-slate-500 italic">"{ans.content}"</p>
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-slate-300">
                      <strong className="text-emerald-400 block mb-1 uppercase text-xs">AI FEEDBACK</strong>
                      {ans.feedback}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Link href="/dashboard" className="btn-secondary px-10">Back to Dashboard</Link>
              <button onClick={() => setStep("setup")} className="btn-primary px-10">Retake Interview</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
