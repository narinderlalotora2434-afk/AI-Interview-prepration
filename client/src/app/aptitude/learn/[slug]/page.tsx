"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Calculator, Target, CheckCircle2, ChevronLeft, 
  Lightbulb, Play, ArrowRight, Award, AlertTriangle, Flame,
  Brain, Send, Sparkles, RefreshCw, BarChart2, Check, HelpCircle
} from "lucide-react";
import { getBaseUrl } from "@/lib/api";
import axios from "axios";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

interface Lesson {
  id: string;
  title: string;
  content: string;
  formula?: string;
  example?: string;
  shortcut?: string;
  commonMistake?: string;
  difficulty: string;
  orderIndex: number;
}

interface Question {
  id: string;
  questionText: string;
  options: string; // JSON string array
  correctAnswer: string;
  explanation: string;
  difficulty: string;
  examTags?: string[];
}

interface TopicData {
  topic: {
    id: string;
    title: string;
    slug: string;
    description: string;
    level: string;
    duration: string;
    lessons: Lesson[];
    practiceQuestions: Question[];
  };
  progress: number;
  completedLessons: string[];
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  createdAt: Date;
}

export default function TopicLearnPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [data, setData] = useState<TopicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Tab Navigation (Roadmap vs Lesson Workspace vs AI Doubt for Mobile layout)
  const [activeTab, setActiveTab] = useState<'roadmap' | 'lesson' | 'doubt'>('lesson');
  const [studyMode, setStudyMode] = useState<'lessons' | 'practice'>('lessons');
  
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // User Stats
  const [userXp, setUserXp] = useState(150);
  const [userStreak, setUserStreak] = useState(3);
  
  // AI Assistant Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: 'ai',
      content: "Hello! I am PrepAI, your personal dynamic placement coach. Ask me any doubts about this topic, formulas, shortcut tricks, or question patterns!",
      createdAt: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Generation Steps mapping
  const generationSteps = [
    "Spinning up PrepAI dynamic curriculum processor...",
    "Drafting advanced educational roadmap for " + slug.replace(/-/g, ' ') + "...",
    "Formulating primary, secondary, and shortcut rules...",
    "Creating interactive examples with step-by-step resolutions...",
    "Compiling placement-level mock assessment questions...",
    "Storing custom course syllabus in MongoDB cache..."
  ];

  // Fetch Topic and User Stats
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Load user profile statistics for high fidelity integration
    const cachedDashboard = localStorage.getItem("dashboard_cache");
    if (cachedDashboard) {
      try {
        const parsed = JSON.parse(cachedDashboard);
        if (parsed.analytics) {
          setUserXp(parsed.analytics.xp || 150);
          setUserStreak(parsed.analytics.streak || 3);
        }
      } catch (e) {}
    }

    // Fetch live dashboard statistics to sync
    axios.get(`${getBaseUrl()}/api/user/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (res.data && res.data.analytics) {
        setUserXp(res.data.analytics.xp);
        setUserStreak(res.data.analytics.streak);
      }
    }).catch(() => {});

    // Main fetch topic
    const fetchTopic = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${getBaseUrl()}/api/aptitude-learn/topics/${slug}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Trigger generation if the topic has empty lessons or questions
        if (!res.data.topic || !res.data.topic.lessons || res.data.topic.lessons.length === 0) {
          await generateTopic();
        } else {
          setData(res.data);
          setCompleted(new Set(res.data.completedLessons));
        }
      } catch (err: any) {
        console.warn("Topic load failed, attempting automatic generator:", err.message);
        await generateTopic();
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [slug, router]);

  // Handle automatic generation
  const generateTopic = async () => {
    setGenerating(true);
    setGenStep(0);
    setError(null);

    // Dynamic steps timer simulation to keep the UI deeply engaging
    const stepInterval = setInterval(() => {
      setGenStep(prev => (prev < generationSteps.length - 1 ? prev + 1 : prev));
    }, 2800);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${getBaseUrl()}/api/aptitude-learn/topics/generate`, { slug }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      clearInterval(stepInterval);
      setGenStep(generationSteps.length - 1);
      
      setTimeout(() => {
        setData(res.data);
        setCompleted(new Set(res.data.completedLessons || []));
        setGenerating(false);
      }, 800);
      
    } catch (e: any) {
      clearInterval(stepInterval);
      console.warn("Content generation failed:", e);
      setError("AI generation limit reached or server timed out. Click below to try again.");
      setGenerating(false);
    }
  };

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  // Mark Lesson as Complete
  const markLessonComplete = async (lessonId: string) => {
    const token = localStorage.getItem("token");
    if (!token || !data) return;

    try {
      const res = await axios.post(`${getBaseUrl()}/api/aptitude-learn/progress`, {
        topicId: data.topic.id,
        lessonId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCompleted(new Set(res.data.progress.completedLessons));
      setUserXp(prev => prev + 15); // Instant visual gratification

      // Auto-advance
      if (activeLessonIndex < data.topic.lessons.length - 1) {
        setActiveLessonIndex(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setStudyMode('practice');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      console.warn("Failed to save lesson progress:", e);
    }
  };

  // Handle AI Doubt Assistant submit
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const token = localStorage.getItem("token");
    const userMsg = chatInput;
    setChatInput("");
    
    // Add user message locally
    setChatMessages(prev => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: userMsg, createdAt: new Date() }
    ]);
    setChatLoading(true);

    try {
      // Prompt refinement with current lesson context
      const currentLessonContext = data?.topic?.lessons?.[activeLessonIndex];
      const promptContext = currentLessonContext 
        ? `[Doubt relates to Lesson: "${currentLessonContext.title}" of topic "${data.topic.title}". Concept content: "${currentLessonContext.content}"] Question: ${userMsg}`
        : `[Doubt relates to topic "${data?.topic?.title}"] Question: ${userMsg}`;

      const res = await axios.post(`${getBaseUrl()}/api/assistant/chat`, {
        message: promptContext
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setChatMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'ai', content: res.data.reply, createdAt: new Date() }
      ]);
    } catch (err: any) {
      console.warn(err);
      setChatMessages(prev => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(), 
          role: 'ai', 
          content: "I'm having a momentary neural spike processing that. Let me summarize: remember that ratios are simply fractional dividers. What specific part can I re-explain?", 
          createdAt: new Date() 
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Suggest doubt questions
  const suggestDoubt = (text: string) => {
    setChatInput(text);
  };

  if (loading && !generating) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        <div className="max-w-xl w-full text-center relative z-10 space-y-8">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin" />
            <div className="absolute inset-2 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl">
               <Brain className="w-8 h-8 text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-3">
             <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] inline-block">
                Retrieving Curriculum Archive
             </div>
             <h2 className="text-2xl font-black text-white tracking-tight">Syncing with MongoDB Cache...</h2>
             <p className="text-slate-400 font-medium text-xs max-w-xs mx-auto">
                Connecting to high-speed placement nodes to retrieve cached syllabus content.
             </p>
          </div>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Futuristic glowing grid backgrounds */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
        
        <div className="max-w-xl w-full text-center relative z-10 space-y-12">
          {/* Animated AI processing circle */}
          <div className="relative w-40 h-40 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
            <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-primary animate-spin" />
            <div className="absolute inset-4 rounded-full border-b-4 border-l-4 border-amber-500 animate-spin [animation-duration:3s]" />
            <div className="absolute inset-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center shadow-2xl">
               <Brain className="w-12 h-12 text-primary animate-pulse" />
            </div>
            {/* Tiny stars floating */}
            <div className="absolute -top-2 left-10 w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce" />
            <div className="absolute bottom-2 right-6 w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.5s]" />
          </div>

          <div className="space-y-4">
             <div className="px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] inline-block">
                Curriculum Synthesizer v2.0
             </div>
             <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">AI Dynamic Generation</h2>
             <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-sm mx-auto">
                PrepAI is building your customized aptitude learning module from scratch. Please don&apos;t close this page.
             </p>
          </div>

          {/* Stepper details */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 text-left space-y-4 backdrop-blur-xl shadow-2xl max-w-lg mx-auto">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex justify-between items-center">
                <span>Compilation Logs</span>
                <span className="text-primary animate-pulse">Running</span>
             </div>
             
             <div className="space-y-3">
               {generationSteps.map((step, idx) => {
                 const isCompleted = genStep > idx;
                 const isActive = genStep === idx;
                 
                 return (
                   <div key={idx} className={`flex items-center gap-3 transition-colors ${isCompleted ? 'text-emerald-400' : isActive ? 'text-white font-bold' : 'text-slate-600'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        isActive ? 'bg-primary text-white animate-pulse' : 'bg-slate-800 text-slate-600'
                      }`}>
                         {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
                      </div>
                      <span className="text-xs leading-snug truncate">{step}</span>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-rose-500/5">
           <AlertTriangle className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">{error || "Syllabus Generation Spike"}</h2>
        <p className="text-slate-400 max-w-md mt-2 font-medium text-sm leading-relaxed">
           Our high-capacity AI nodes are experiencing heavy scheduling load. We have a robust offline fallback to get you studying instantly!
        </p>
        <div className="flex gap-4 mt-8">
          <button onClick={generateTopic} className="px-8 py-3.5 bg-primary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
             Try AI Generation Again
          </button>
          <Link href="/aptitude/learn" className="px-8 py-3.5 bg-slate-900 border border-slate-800 text-slate-300 rounded-full font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
             Back to Hub
          </Link>
        </div>
      </div>
    );
  }

  const { topic } = data;
  const activeLesson = topic.lessons[activeLessonIndex];
  const progressPercent = Math.round((completed.size / topic.lessons.length) * 100);

  // Suggested doubts helper
  const SUGGESTED_DOUBTS = [
    `Prove the shortcut for ${topic.title}.`,
    `Explain the worked example step-by-step.`,
    `What are similar questions asked in TCS NQT?`,
    `Can you make a mnemonic for this formula?`
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-text-primary overflow-hidden relative">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header bar */}
        <header className="bg-white border-b border-slate-100 h-20 flex items-center px-8 shrink-0 z-40 sticky top-0">
           <Link href="/aptitude/learn" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors font-black text-xs uppercase tracking-widest mr-6">
             <ChevronLeft className="w-5 h-5 text-primary" /> Hub
           </Link>
           
           <div className="h-8 w-px bg-slate-200 mr-6" />
           
           <div className="flex-1 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black tracking-tight flex items-center gap-2 text-slate-800">
                  {topic.title}
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-[9px] font-black uppercase text-primary tracking-widest">
                     AI Core
                  </span>
                </h1>
              </div>
              
              {/* Desktop Progress view */}
              <div className="flex items-center gap-4 hidden md:flex">
                 <div className="text-right">
                   <div className="text-[9px] font-black uppercase tracking-widest text-text-secondary">Mastery Level</div>
                   <div className="text-primary font-black text-sm">{progressPercent}%</div>
                 </div>
                 <div className="w-28 h-2.5 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden p-0.5">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                 </div>
              </div>
           </div>
        </header>

        {/* Mobile Sub-Navigation tabs */}
        <div className="bg-white border-b border-slate-100 h-14 flex items-center justify-around px-4 lg:hidden shrink-0 z-30 font-black text-[10px] uppercase tracking-widest text-text-secondary">
           <button onClick={() => setActiveTab('roadmap')} className={`pb-2 border-b-2 px-3 transition-colors ${activeTab === 'roadmap' ? 'border-primary text-primary' : 'border-transparent'}`}>
              Roadmap
           </button>
           <button onClick={() => { setActiveTab('lesson'); }} className={`pb-2 border-b-2 px-3 transition-colors ${activeTab === 'lesson' ? 'border-primary text-primary' : 'border-transparent'}`}>
              Workspace
           </button>
           <button onClick={() => setActiveTab('doubt')} className={`pb-2 border-b-2 px-3 transition-colors ${activeTab === 'doubt' ? 'border-primary text-primary' : 'border-transparent'}`}>
              AI Doubt
           </button>
        </div>

        {/* 3-Column Work Area */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT COLUMN: AI Generated Roadmap (Sidebar) */}
          <div className={`w-80 bg-white border-r border-slate-100 overflow-y-auto shrink-0 p-6 flex flex-col justify-between ${
            activeTab === 'roadmap' ? 'block absolute inset-y-20 left-0 right-0 z-50 w-full' : 'hidden lg:flex'
          }`}>
             <div className="space-y-6">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4 flex items-center justify-between">
                     <span>AI Roadmap Path</span>
                     <span className="text-primary font-black">{topic.level}</span>
                  </h3>
                  
                  {/* Vertical timeline tree */}
                  <div className="relative pl-4 border-l-2 border-slate-100 space-y-4 py-2">
                    {topic.lessons.map((lesson, idx) => {
                      const isCompleted = completed.has(lesson.id);
                      const isActive = studyMode === 'lessons' && activeLessonIndex === idx;
                      
                      return (
                        <button 
                          key={lesson.id}
                          onClick={() => { 
                            setStudyMode('lessons'); 
                            setActiveLessonIndex(idx); 
                            setActiveTab('lesson');
                          }}
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 relative -left-[25px] ${
                            isActive 
                            ? 'bg-primary/5 border-primary/20 shadow-md shadow-primary/5' 
                            : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                          }`}
                        >
                           <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black border transition-all ${
                             isCompleted 
                             ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20' 
                             : isActive
                               ? 'bg-primary text-white border-primary shadow-md shadow-primary/20 animate-pulse'
                               : 'bg-slate-100 text-text-secondary border-slate-200'
                           }`}>
                             {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                           </div>
                           <div className="pt-0.5 leading-snug">
                              <div className={`text-xs font-black ${isActive ? 'text-primary' : 'text-text-primary'}`}>
                                 {lesson.title}
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider text-text-secondary mt-1 block">
                                 {lesson.difficulty}
                              </span>
                           </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-3">Milestone</h3>
                   <button 
                     onClick={() => { setStudyMode('practice'); setActiveTab('lesson'); }}
                     className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                       studyMode === 'practice' 
                       ? 'bg-amber-500/10 border-amber-500/30 shadow-md shadow-amber-500/5' 
                       : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
                     }`}
                   >
                      <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center transition-colors ${
                        studyMode === 'practice' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'bg-amber-100 text-amber-600'
                      }`}>
                         <Target className="w-4 h-4" />
                      </div>
                      <div>
                         <div className={`text-xs font-black ${studyMode === 'practice' ? 'text-amber-800' : 'text-text-primary'}`}>
                            Roadmap Assessment
                         </div>
                         <p className="text-[9px] font-black uppercase tracking-wider text-amber-600 mt-0.5">
                            {topic.practiceQuestions.length} Practice & Quiz
                         </p>
                      </div>
                   </button>
                </div>
             </div>

             {/* Mastery indicator */}
             <div className="pt-6 border-t border-slate-100">
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                      <Award className="w-5 h-5" />
                   </div>
                   <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-text-secondary block">Badge Earned</span>
                      <span className="text-xs font-black text-slate-700">
                         {progressPercent === 100 ? `${topic.title} Master` : "Study to unlock"}
                      </span>
                   </div>
                </div>
             </div>
          </div>

          {/* MIDDLE COLUMN: Main Content Workspace */}
          <div className={`flex-1 overflow-y-auto bg-[#F8FAFC] p-6 md:p-12 scroll-smooth ${
            activeTab === 'lesson' ? 'block' : 'hidden lg:block'
          }`}>
             <div className="max-w-3xl mx-auto">
                
                {studyMode === 'lessons' && activeLesson && (
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeLesson.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-10 pb-32"
                    >
                      {/* Lesson Top Meta */}
                      <div>
                        <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-4 flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-primary" /> Lesson {activeLessonIndex + 1} of {topic.lessons.length}
                          <span className="w-1 h-1 bg-slate-300 rounded-full mx-1" />
                          <span className="text-text-secondary">{activeLesson.difficulty}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-800 mb-6 leading-tight">
                          {activeLesson.title}
                        </h2>
                        
                        {/* CONCEPT CARD */}
                        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/30 leading-relaxed font-semibold text-text-primary text-base md:text-lg">
                          {activeLesson.content}
                        </div>
                      </div>

                      {/* WORKSPACE CONCEPT BLOCKS */}
                      <div className="grid gap-6">
                        
                        {/* FORMULA CARD - Glowing, centered, memory trick */}
                        {activeLesson.formula && (
                          <div className="bg-white rounded-[32px] p-8 border-2 border-primary/20 shadow-2xl shadow-primary/5 relative overflow-hidden group">
                            {/* Visual glowing aura */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full translate-x-1/4 -translate-y-1/4 blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
                            
                            <div className="relative z-10 flex flex-col items-center">
                              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4">
                                <Calculator className="w-5 h-5" />
                              </div>
                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-3">Core Concept Equation</h4>
                              
                              <div className="text-xl md:text-3xl font-black text-slate-800 tracking-tight text-center bg-slate-50 border border-slate-100 py-4 px-6 md:px-10 rounded-2xl w-full break-words select-all font-mono">
                                {activeLesson.formula}
                              </div>
                              
                              <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-4 flex items-center gap-1.5">
                                 <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Memorize and apply directly in tests
                              </p>
                            </div>
                          </div>
                        )}

                        {/* WORKED EXAMPLE CARD */}
                        {activeLesson.example && (
                          <div className="bg-emerald-50/40 rounded-[32px] p-8 border border-emerald-100/80 shadow-md shadow-emerald-500/[0.01]">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                                <Play className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-2">Step-by-step Example</h4>
                                <p className="text-sm font-semibold text-emerald-950 leading-relaxed whitespace-pre-wrap">
                                  {activeLesson.example}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PRO SHORTCUT CARD */}
                        {activeLesson.shortcut && (
                          <div className="bg-amber-50/50 rounded-[32px] p-8 border border-amber-100 shadow-md shadow-amber-500/[0.01]">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                                <Lightbulb className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">AI Shortcut Trick</h4>
                                <p className="text-sm font-black text-amber-900 leading-relaxed whitespace-pre-wrap">
                                  {activeLesson.shortcut}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* PITFALL/MISTAKE WARNING CARD */}
                        {activeLesson.commonMistake && (
                          <div className="bg-rose-50/40 rounded-[32px] p-8 border border-rose-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                            <div className="relative z-10 flex items-start gap-4">
                              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200">
                                <AlertTriangle className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-700 mb-2">Common Student Pitfall</h4>
                                <div className="text-sm font-semibold text-rose-950 leading-relaxed whitespace-pre-wrap">
                                  {activeLesson.commonMistake}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Dynamic lesson action triggers */}
                      <div className="flex justify-end pt-8 border-t border-slate-200">
                        <button
                          onClick={() => markLessonComplete(activeLesson.id)}
                          className="px-8 py-4.5 bg-primary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3 hover:scale-105 transition-all"
                        >
                          {completed.has(activeLesson.id) ? 'Advance to Next' : 'Mark Lesson Complete'}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

                {studyMode === 'practice' && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8 pb-32"
                  >
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-amber-100 text-amber-500 border border-amber-200/50 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-amber-500/[0.05]">
                        <Award className="w-8 h-8 animate-bounce" />
                      </div>
                      <h2 className="text-3xl font-black tracking-tight text-slate-800 mb-2">Personalized Assessment</h2>
                      <p className="text-sm text-text-secondary font-bold">Custom testing suite generated by PrepAI nodes.</p>
                    </div>
                    
                    <div className="space-y-6">
                      {topic.practiceQuestions.map((q, idx) => {
                        const options = JSON.parse(q.options) as string[];
                        const isAnswered = !!answers[q.id];
                        const isCorrect = answers[q.id] === q.correctAnswer;

                        return (
                          <div key={q.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/20">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 bg-slate-100 text-text-secondary rounded text-[9px] font-black uppercase tracking-widest">Q{idx + 1}</span>
                                <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                                  q.difficulty === 'Beginner' ? 'bg-emerald-50 text-emerald-600' : 
                                  q.difficulty === 'Advanced' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                  {q.difficulty}
                                </span>
                              </div>
                              {q.examTags && q.examTags.length > 0 && (
                                <div className="flex items-center gap-1.5">
                                  {q.examTags.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-primary/5 border border-primary/10 text-primary rounded text-[8px] font-black uppercase tracking-widest">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            <h3 className="text-base md:text-lg font-black text-slate-800 mb-6 leading-relaxed whitespace-pre-wrap">{q.questionText}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {options.map((opt, i) => {
                                const isSelected = answers[q.id] === opt;
                                const isCorrectOption = opt === q.correctAnswer;
                                
                                let btnClass = "p-4 rounded-2xl border-2 border-slate-50 text-left font-bold text-xs hover:border-primary/30 hover:bg-primary/[0.02] transition-all flex items-center justify-between group";
                                
                                if (isAnswered) {
                                  if (isCorrectOption) {
                                    btnClass = "p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 text-emerald-800 text-left font-bold text-xs flex items-center justify-between shadow-md shadow-emerald-500/5";
                                  } else if (isSelected) {
                                    btnClass = "p-4 rounded-2xl border-2 border-rose-500 bg-rose-50/50 text-rose-800 text-left font-bold text-xs flex items-center justify-between shadow-md shadow-rose-500/5";
                                  } else {
                                    btnClass = "p-4 rounded-2xl border-2 border-slate-50 bg-slate-50/50 opacity-40 text-left font-bold text-xs flex items-center justify-between cursor-not-allowed";
                                  }
                                }
                                
                                return (
                                  <button 
                                    key={i}
                                    disabled={isAnswered}
                                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                    className={btnClass}
                                  >
                                    <span className="flex items-center gap-2">
                                      <span className="text-text-secondary font-black">{String.fromCharCode(65 + i)}.</span>
                                      <span>{opt}</span>
                                    </span>
                                    {isAnswered && isCorrectOption && <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />}
                                  </button>
                                );
                              })}
                            </div>
                            
                            {/* Assessment Explanation Block */}
                            {answers[q.id] && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-6 p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-50/30 border-emerald-100' : 'bg-rose-50/30 border-rose-100'}`}
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  {isCorrect ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                      <span className="font-black text-emerald-700 uppercase tracking-widest text-[9px]">Answer Verified</span>
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-black text-[9px]">X</div>
                                      <span className="font-black text-rose-700 uppercase tracking-widest text-[9px]">Incorrect Option</span>
                                    </>
                                  )}
                                </div>
                                <p className="text-text-secondary font-semibold leading-relaxed text-xs">
                                  {q.explanation || "No explanation provided."}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
             </div>
          </div>

          {/* RIGHT COLUMN: AI Doubt Assistant & Quick Stats */}
          <div className={`w-80 bg-white border-l border-slate-100 overflow-hidden shrink-0 flex flex-col justify-between ${
            activeTab === 'doubt' ? 'block absolute inset-y-20 left-0 right-0 z-50 w-full' : 'hidden lg:flex'
          }`}>
             {/* Stats Widget */}
             <div className="p-6 border-b border-slate-100 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
                   <BarChart2 className="w-4.5 h-4.5 text-primary" /> Learning Diagnostics
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500 fill-orange-500 shrink-0" />
                      <div>
                         <span className="text-[8px] font-black text-text-secondary uppercase tracking-wider block">Streak</span>
                         <span className="text-xs font-black text-slate-800">{userStreak} Days</span>
                      </div>
                   </div>
                   <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary shrink-0 animate-pulse" />
                      <div>
                         <span className="text-[8px] font-black text-text-secondary uppercase tracking-wider block">Neural XP</span>
                         <span className="text-xs font-black text-slate-800">{userXp} XP</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Doubt Messenger feed */}
             <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
                <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">PrepAI Mentor</span>
                   </div>
                   <button 
                     onClick={() => setChatMessages([{
                       id: "welcome",
                       role: 'ai',
                       content: "Chat cleared. Ask me any doubts about this topic, formulas, shortcut tricks, or question patterns!",
                       createdAt: new Date()
                     }])}
                     className="text-text-secondary hover:text-slate-800 p-1 rounded hover:bg-slate-50 transition-colors"
                     title="Clear Chat"
                   >
                     <RefreshCw className="w-3.5 h-3.5" />
                   </button>
                </div>

                {/* Messages scroll box */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                   {chatMessages.map(msg => (
                     <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                          msg.role === 'user' 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'
                        }`}>
                           <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                     </div>
                   ))}

                   {chatLoading && (
                     <div className="flex items-center gap-2 text-text-secondary font-black uppercase text-[8px] tracking-[0.2em] p-2 bg-white/80 border border-slate-100 rounded-xl max-w-[200px]">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" /> PrepAI is formulating reply...
                     </div>
                   )}
                   <div ref={chatBottomRef} />
                </div>

                {/* Suggested prompt chips */}
                {chatMessages.length === 1 && (
                  <div className="p-4 bg-white border-t border-slate-100 space-y-2 shrink-0">
                     <span className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em] block mb-1">Quick Doubts</span>
                     <div className="flex flex-wrap gap-1.5">
                        {SUGGESTED_DOUBTS.map(text => (
                          <button 
                            key={text} 
                            onClick={() => suggestDoubt(text)}
                            className="px-2 py-1 text-[9px] font-black text-primary border border-primary/20 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors max-w-full truncate text-left"
                          >
                             {text}
                          </button>
                        ))}
                     </div>
                  </div>
                )}
             </div>

             {/* Input Area */}
             <form onSubmit={handleChatSubmit} className="p-4 bg-white border-t border-slate-100 flex gap-2 shrink-0 z-10 relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask dynamic AI doubt..."
                  className="flex-1 bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl text-xs font-bold focus:outline-none focus:border-primary focus:bg-white transition-all placeholder:font-black placeholder:uppercase placeholder:text-[9px] placeholder:tracking-widest"
                />
                <button 
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="w-10 h-10 bg-primary text-white border border-primary rounded-2xl flex items-center justify-center shrink-0 hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
                >
                   <Send className="w-4 h-4" />
                </button>
             </form>
          </div>

        </div>
      </main>
    </div>
  );
}
