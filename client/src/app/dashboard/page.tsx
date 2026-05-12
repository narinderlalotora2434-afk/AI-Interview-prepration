"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  History,
  ArrowRight,
  LogOut,
  Plus,
  Code,
  Flame,
  Target,
  Trophy,
  Zap,
  Map as MapIcon,
  User,
  Brain,
  Award,
  CheckCircle,
  Menu,
  X,
  Mic,
  Sparkles,
  Search,
  Bell,
  ChevronRight,
  Clock,
  ChevronLeft,
  Settings,
  Star,
  AlertCircle,
  Briefcase,
  Layers,
  Terminal,
  Activity,
  Calendar,
  Filter,
  Users,
  CheckCircle2,
  ExternalLink,
  Info,
  Database
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { getBaseUrl } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ThemeToggle";
import Sidebar from "@/components/Sidebar";

// --- Types ---

interface UserAnalytics {
  xp: number;
  streak: number;
  mockInterviewCount: number;
  avgScore: number;
  accuracy: number;
  codingRoundCount: number;
  badges: string;
  strongTopics: string;
  weakTopics: string;
  roadmap: string;
}

interface InterviewRecord {
  id: string;
  type: string;
  score: number;
  createdAt: string;
}

interface ModuleProgress {
  id: string;
  moduleId: string;
  category: string;
  title: string;
  progress: number;
  status: string;
  lastActivity: string;
  state: string;
  accuracy: number;
  streak: number;
  estimatedTime?: string;
  recommendation?: string;
}

interface DashboardData {
  analytics: UserAnalytics;
  recentInterviews: InterviewRecord[];
  moduleProgresses: ModuleProgress[];
}

interface DailyChallenge {
  codingProblem: string;
  techQuestion: string;
  behavioralQuestion: string;
}

// --- Mock Data ---

const MOCK_COMPANIES = [
  { id: "TCS", name: "TCS", color: "from-blue-600 to-blue-400", focus: ["Aptitude", "English", "Coding"] },
  { id: "Infosys", name: "Infosys", color: "from-blue-700 to-indigo-600", focus: ["Puzzles", "DBMS", "Java"] },
  { id: "Wipro", name: "Wipro", color: "from-cyan-600 to-blue-500", focus: ["Writing", "Fundamentals", "C++"] },
  { id: "Amazon", name: "Amazon", color: "from-orange-500 to-amber-400", focus: ["Medium DSA", "Behavioral", "System Design"] },
  { id: "Google", name: "Google", color: "from-red-500 via-yellow-500 to-green-500", focus: ["Hard DSA", "System Design", "Go/Python"] },
];

const MOCK_DRIVES = [
  { company: "Infosys", role: "Specialist Programmer", eligibility: "6.5+ CGPA", deadline: "12 May", icon: "I" },
  { company: "Capgemini", role: "Analyst", eligibility: "No Backlogs", deadline: "15 May", icon: "C" },
  { company: "Accenture", role: "ASE", eligibility: "All Branches", deadline: "20 May", icon: "A" },
];

// --- Main Page ---

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [learningSearch, setLearningSearch] = useState("");
  const [learningFilter, setLearningFilter] = useState("All");
  const [tasks, setTasks] = useState([
    { id: 1, text: "Solve 5 Probability Questions", done: false, xp: 20, time: "15m" },
    { id: 2, text: "Complete 1 DSA Problem", done: true, xp: 50, time: "30m" },
    { id: 3, text: "Practice HR Interview", done: false, xp: 30, time: "20m" },
    { id: 4, text: "Revise DBMS Notes", done: false, xp: 15, time: "10m" },
  ]);

  const router = useRouter();

  const filteredLearningModules = useMemo(() => {
    const baseData = data?.moduleProgresses?.length ? data.moduleProgresses : [
       { id: '1', moduleId: 'dsa-arrays', category: 'DSA', title: 'Arrays & Strings Masterclass', progress: 85, status: 'In Progress', lastActivity: '2h ago', accuracy: 78, streak: 3, estimatedTime: '15 mins left', recommendation: 'Focus on Sliding Window edge cases.' },
       { id: '2', moduleId: 'apt-quant', category: 'Aptitude', title: 'Quantitative Reasoning', progress: 42, status: 'Revision Needed', lastActivity: 'Yesterday', accuracy: 65, streak: 1, estimatedTime: '2h left', recommendation: 'Review Time & Work formulas.' },
       { id: '3', moduleId: 'int-hr', category: 'Interview', title: 'HR Interview Preparation', progress: 30, status: 'Recommended', lastActivity: '3d ago', accuracy: 90, streak: 0, estimatedTime: '1h left', recommendation: 'Practice the STAR method more.' }
    ];

    return baseData.filter(m => {
       const matchesSearch = m.title.toLowerCase().includes(learningSearch.toLowerCase()) || m.category.toLowerCase().includes(learningSearch.toLowerCase());
       const matchesFilter = learningFilter === "All" || (learningFilter === "In Progress" && m.status === "In Progress") || (learningFilter === "Revision Needed" && m.status === "Revision Needed") || (m.category === learningFilter);
       return matchesSearch && matchesFilter;
    });
  }, [data?.moduleProgresses, learningSearch, learningFilter]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const cachedData = localStorage.getItem("dashboard_cache");
    const cachedChallenges = localStorage.getItem("challenges_cache");
    
    try {
      if (cachedData) setData(JSON.parse(cachedData));
      if (cachedChallenges) setDailyChallenges(JSON.parse(cachedChallenges));
    } catch (e) {}

    const fetchDashboardData = async () => {
      try {
        const [challengesRes, dashboardRes] = await Promise.all([
          fetch(`${getBaseUrl()}/api/challenges/daily`, {
            headers: { "Authorization": `Bearer ${token}` },
          }),
          fetch(`${getBaseUrl()}/api/user/dashboard`, {
            headers: { "Authorization": `Bearer ${token}` },
          })
        ]);

        if (challengesRes.ok) {
          const challengesJson = await challengesRes.json();
          setDailyChallenges(challengesJson);
          localStorage.setItem("challenges_cache", JSON.stringify(challengesJson));
        }

        if (dashboardRes.ok) {
          const dashboardJson = await dashboardRes.json();
          setData(dashboardJson);
          localStorage.setItem("dashboard_cache", JSON.stringify(dashboardJson));
        } else {
          // If dashboard fails but cache exists, use cache (already set above)
          // Otherwise, we at least have mock fallbacks in the UI
          console.warn("Dashboard API failed with status:", dashboardRes.status);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const tasksCompleted = tasks.filter(t => t.done).length;
  const user = JSON.parse(typeof window !== 'undefined' ? localStorage.getItem("user") || "{}" : "{}");

  if (loading && !data) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden selection:bg-primary/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.15),transparent_50%)] pointer-events-none" />
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b border-white/5 px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2"><Menu className="w-6 h-6" /></button>
             <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Search AI Coach..." className="bg-secondary/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:w-80 transition-all outline-none" />
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold">
                <Flame className="w-4 h-4" /> {data?.analytics.streak || 0} DAY STREAK
             </div>
             <button className="relative"><Bell className="w-5 h-5 text-muted-foreground" /><span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" /></button>
             <ThemeToggle />
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-12">
          
          {/* SECTION 1: HERO AREA */}
          <section className="grid lg:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 glass-card p-8 bg-gradient-to-br from-primary/10 via-transparent to-transparent flex flex-col justify-between"
            >
              <div>
                <h1 className="text-4xl font-black mb-2 tracking-tight">Welcome back, <span className="text-primary">{user.name || "Sachin"}</span> 👋</h1>
                <p className="text-muted-foreground text-sm max-w-md">Your placement readiness has increased by 12% this week. Let&apos;s keep the momentum going!</p>
              </div>
              <div className="mt-10 flex items-center gap-6">
                 <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                       <span>Placement Readiness Score</span>
                       <span className="text-primary">72%</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                       <motion.div initial={{ width: 0 }} animate={{ width: "72%" }} className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
                    </div>
                 </div>
                 <div className="w-16 h-16 rounded-2xl bg-secondary flex flex-col items-center justify-center border border-white/5">
                    <span className="text-xl font-black">72</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">PR SCORE</span>
                 </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 flex flex-col justify-between">
               <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">Daily Goal Progress</h3>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                       <svg className="w-full h-full -rotate-90">
                          <circle cx="48" cy="48" r="40" className="stroke-white/5 fill-none" strokeWidth="8" />
                          <motion.circle cx="48" cy="48" r="40" className="stroke-primary fill-none" strokeWidth="8" strokeDasharray="251.2" initial={{ strokeDashoffset: 251.2 }} animate={{ strokeDashoffset: 251.2 - (251.2 * (tasksCompleted/tasks.length)) }} transition={{ duration: 1.5, ease: "easeOut" }} />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-2xl font-black">{tasksCompleted}/{tasks.length}</span>
                       </div>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">You are almost there! Complete 2 more tasks to hit your daily goal.</p>
                  </div>
               </div>
               <button className="w-full btn-glass py-3 text-xs font-bold flex items-center justify-center gap-2 mt-6">VIEW ALL TASKS <ArrowRight className="w-4 h-4" /></button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8 border-l-4 border-accent-cyan bg-accent-cyan/5">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center"><Bot className="w-6 h-6" /></div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-accent-cyan">AI Mentor Recommendation</h3>
               </div>
               <p className="text-sm font-medium leading-relaxed mb-8 italic">
                 &quot;You are improving in coding but struggling in aptitude speed. Practice timed quizzes today to boost your velocity.&quot;
               </p>
               <Link href="/aptitude" className="w-full btn-primary bg-accent-cyan hover:bg-accent-cyan/90 py-3 text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.2)]">CONTINUE APTITUDE PRACTICE</Link>
            </motion.div>
          </section>

          {/* SECTION 2: QUICK ACTIONS */}
          <section>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-3"><Zap className="w-5 h-5 text-amber-400" /> Accelerate Your Prep</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
               {[
                 { label: "Start Mock Interview", icon: MessageSquare, href: "/interview", color: "from-primary/20", desc: "Real-time AI Feedback" },
                 { label: "Practice Aptitude", icon: Brain, href: "/aptitude", color: "from-accent-pink/20", desc: "Timed Quant & Logic" },
                 { label: "Solve DSA Problem", icon: Code, href: "/coding", color: "from-emerald-500/20", desc: "Top Interview Questions" },
                 { label: "Analyze Resume", icon: FileText, href: "/resume", color: "from-amber-500/20", desc: "ATS Score & Optimization" },
                 { label: "Revise Weak Topics", icon: History, href: "/analytics", color: "from-rose-500/20", desc: "AI-Driven Revision" },
                 { label: "Join Coding Contest", icon: Trophy, href: "/challenges", color: "from-accent-cyan/20", desc: "Weekly Competitions" },
               ].map((action, i) => (
                 <Link key={i} href={action.href} className="group relative">
                   <div className="absolute -inset-[1px] bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="glass-card p-5 h-full flex flex-col items-center text-center gap-3 group-hover:bg-white/5 transition-all">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} to-transparent border border-white/5 group-hover:scale-110 transition-transform`}>
                         <action.icon className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold mb-1 leading-tight">{action.label}</div>
                        <div className="text-[9px] text-muted-foreground font-medium uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">{action.desc}</div>
                      </div>
                   </div>
                 </Link>
               ))}
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-12">
              
              {/* SECTION 3: TODAY'S PREPARATION PLAN */}
              <section className="glass-card p-8">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold flex items-center gap-3"><Calendar className="w-5 h-5 text-primary" /> Today&apos;s Preparation Plan</h2>
                    <div className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-lg uppercase tracking-widest">{tasksCompleted}/{tasks.length} COMPLETED</div>
                 </div>
                 <div className="space-y-4">
                    {tasks.map((task) => (
                      <div 
                        key={task.id} 
                        onClick={() => toggleTask(task.id)}
                        className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${task.done ? 'bg-primary/5 border-primary/20' : 'bg-secondary/30 border-white/5 hover:border-white/10'}`}
                      >
                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.done ? 'bg-primary border-primary' : 'border-white/20 group-hover:border-primary/50'}`}>
                            {task.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                         </div>
                         <div className="flex-1">
                            <p className={`text-sm font-bold ${task.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{task.text}</p>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {task.time}</span>
                               <span className="text-[10px] text-primary flex items-center gap-1 font-black uppercase tracking-widest"><Zap className="w-3 h-3" /> +{task.xp} XP</span>
                            </div>
                         </div>
                         {!task.done && <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </div>
                    ))}
                 </div>
              </section>

              {/* SECTION 4: SMART CONTINUE LEARNING SYSTEM */}
              <section className="space-y-6">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                       <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
                          <Terminal className="w-6 h-6 text-accent-cyan" /> 
                          Continue Learning
                       </h2>
                       <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">AI-Powered Personalized Path</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <input 
                             type="text" 
                             placeholder="Search modules..." 
                             value={learningSearch}
                             onChange={(e) => setLearningSearch(e.target.value)}
                             className="bg-secondary/50 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:ring-1 focus:ring-primary outline-none transition-all w-full md:w-48"
                          />
                       </div>
                       <Link href="/analytics" className="btn-glass py-1.5 px-3 text-[10px] font-black uppercase tracking-widest">Analytics</Link>
                    </div>
                 </div>

                 {/* Filters */}
                 <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                    {["All", "In Progress", "Aptitude", "DSA", "Interview", "Revision Needed"].map((f) => (
                       <button 
                         key={f}
                         onClick={() => setLearningFilter(f)}
                         className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${learningFilter === f ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-secondary/50 border-white/5 text-muted-foreground hover:border-white/20'}`}
                       >
                          {f}
                       </button>
                    ))}
                 </div>

                 <div className="grid md:grid-cols-2 gap-6">
                    {filteredLearningModules.map((module, i) => (
                          <motion.div 
                            layout
                            key={module.id} 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card group hover:bg-white/5 transition-all relative overflow-hidden"
                          >
                             {/* Category Accent */}
                             <div className={`absolute top-0 left-0 w-1 h-full ${module.category === 'DSA' ? 'bg-emerald-500' : module.category === 'Aptitude' ? 'bg-accent-pink' : 'bg-primary'}`} />
                             
                             <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                   <div className="flex items-center gap-4">
                                      <div className={`p-3 rounded-2xl bg-secondary border border-white/5 ${module.category === 'DSA' ? 'text-emerald-400' : module.category === 'Aptitude' ? 'text-accent-pink' : 'text-primary'}`}>
                                         {module.category === 'DSA' ? <Code className="w-6 h-6" /> : module.category === 'Aptitude' ? <Brain className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
                                      </div>
                                      <div>
                                         <h4 className="font-black text-sm group-hover:text-primary transition-colors">{module.title}</h4>
                                         <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{module.category} MODULE</span>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${module.status === 'Revision Needed' ? 'text-rose-500' : 'text-emerald-500'}`}>{module.status}</span>
                                         </div>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">STREAK</span>
                                      <span className="text-sm font-black flex items-center gap-1 justify-end"><Flame className="w-3.5 h-3.5 text-orange-500" /> {module.streak}d</span>
                                   </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                   <div className="flex items-center justify-between text-xs font-bold">
                                      <span className="text-muted-foreground uppercase tracking-tighter">Progress: <span className="text-foreground">{module.progress}%</span></span>
                                      <span className="text-muted-foreground uppercase tracking-tighter">Accuracy: <span className="text-primary">{module.accuracy}%</span></span>
                                   </div>
                                   <div className="h-2 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                                      <motion.div 
                                         initial={{ width: 0 }} 
                                         animate={{ width: `${module.progress}%` }} 
                                         className={`h-full rounded-full ${module.category === 'DSA' ? 'bg-emerald-500' : module.category === 'Aptitude' ? 'bg-accent-pink' : 'bg-primary'} shadow-[0_0_10px_rgba(124,58,237,0.3)]`} 
                                      />
                                   </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 mb-6">
                                   <div>
                                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-1">Time Left</span>
                                      <span className="text-xs font-bold flex items-center gap-1.5"><Clock className="w-3 h-3 text-primary" /> {module.estimatedTime}</span>
                                   </div>
                                   <div>
                                      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-1">Last Activity</span>
                                      <span className="text-xs font-bold">{module.lastActivity}</span>
                                   </div>
                                </div>

                                {module.recommendation && (
                                   <div className="p-3 rounded-xl bg-secondary/50 border border-white/5 flex items-start gap-3 mb-6 group-hover:border-primary/20 transition-all">
                                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                      <p className="text-[10px] text-muted-foreground italic font-medium leading-relaxed">&quot;{module.recommendation}&quot;</p>
                                   </div>
                                )}

                                <button className="w-full btn-primary py-3 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 group-hover:shadow-primary/30 transition-all">
                                   RESUME LEARNING <ChevronRight className="w-4 h-4" />
                                </button>
                             </div>
                          </motion.div>
                       ))}
                 </div>
              </section>

              {/* SECTION 6: COMPANY TARGET MODE */}
              <section className="glass-card p-8 bg-gradient-to-br from-primary/5 to-transparent">
                 <h2 className="text-xl font-bold mb-8 flex items-center gap-3"><Briefcase className="w-5 h-5 text-primary" /> Company Target Mode</h2>
                 <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-8">
                    {MOCK_COMPANIES.map((company) => (
                      <button 
                        key={company.id}
                        onClick={() => setSelectedCompany(company.id)}
                        className={`p-3 rounded-2xl border transition-all flex flex-col items-center gap-2 ${selectedCompany === company.id ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10' : 'bg-secondary/30 border-white/5 hover:border-white/10'}`}
                      >
                         <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${company.color} flex items-center justify-center text-white font-black text-xs shadow-lg`}>
                            {company.name[0]}
                         </div>
                         <span className="text-[10px] font-bold uppercase tracking-wider">{company.name}</span>
                      </button>
                    ))}
                 </div>
                 
                 <AnimatePresence mode="wait">
                    {selectedCompany ? (
                      <motion.div 
                        key={selectedCompany}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-6 rounded-2xl bg-secondary/50 border border-white/10"
                      >
                         <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                               <span className="text-xs font-black uppercase tracking-widest text-emerald-500">{selectedCompany} Mode Enabled</span>
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Difficulty: High</span>
                         </div>
                         <div className="grid md:grid-cols-3 gap-6 mt-6">
                            <div className="space-y-4">
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pattern Focus</p>
                               <div className="flex flex-wrap gap-2">
                                  {MOCK_COMPANIES.find(c => c.id === selectedCompany)?.focus.map(f => (
                                    <span key={f} className="px-3 py-1 rounded-lg bg-background border border-white/5 text-[10px] font-bold text-primary">{f}</span>
                                  ))}
                               </div>
                            </div>
                            <div className="space-y-4">
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Aptitude Pattern</p>
                               <div className="space-y-2">
                                  <div className="flex justify-between text-xs font-bold"><span>Logical</span><span>70%</span></div>
                                  <div className="w-full h-1 bg-white/5 rounded-full"><div className="w-[70%] h-full bg-accent-cyan" /></div>
                               </div>
                            </div>
                            <div className="flex flex-col justify-end">
                               <button className="btn-primary py-3 text-xs font-bold w-full">START {selectedCompany.toUpperCase()} PREP</button>
                            </div>
                         </div>
                      </motion.div>
                    ) : (
                      <div className="text-center py-10 rounded-2xl border border-dashed border-white/10">
                         <Info className="w-8 h-8 text-muted-foreground/30 mx-auto mb-4" />
                         <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Select a company to enable tailored AI coaching</p>
                      </div>
                    )}
                 </AnimatePresence>
              </section>

              {/* SECTION 7: DAILY CHALLENGE */}
              <section>
                 <div className="glass-card p-8 border-l-4 border-amber-400 relative group cursor-pointer overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-400/5 rounded-full blur-3xl transition-all group-hover:bg-amber-400/10" />
                    <div className="flex items-start justify-between mb-8">
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center border border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                             <Terminal className="w-6 h-6" />
                          </div>
                          <div>
                             <h3 className="text-xl font-bold">Daily Coding Challenge</h3>
                             <div className="flex items-center gap-3 mt-1">
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest">Easy</span>
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Strings • 10 mins</span>
                             </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-xs font-bold text-primary mb-1 uppercase tracking-widest">REWARD</div>
                          <div className="text-2xl font-black flex items-center gap-2 justify-end"><Zap className="w-5 h-5 text-amber-400" /> +50 XP</div>
                       </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5 mb-8 font-mono text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                       {dailyChallenges?.codingProblem || "Reverse the order of words in a given string without using built-in methods."}
                    </div>
                    <div className="flex items-center gap-4">
                       <Link href="/coding" className="btn-primary py-3 px-8 text-xs font-bold flex items-center gap-2">SOLVE CHALLENGE <ChevronRight className="w-4 h-4" /></Link>
                       <span className="text-xs text-muted-foreground font-medium italic">428 students solved this today</span>
                    </div>
                 </div>
              </section>

            </div>

            <div className="space-y-12">
              
              {/* SECTION 5: WEAKNESS ANALYSIS */}
              <section className="glass-card p-6 border-t-4 border-rose-500 bg-rose-500/5">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center"><Activity className="w-5 h-5" /></div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-rose-500">AI Weakness Analysis</h3>
                 </div>
                 <div className="space-y-4">
                    {[
                      { topic: "Probability", score: 42, action: "Watch Lesson" },
                      { topic: "Time & Work", score: 53, action: "Practice 10Q" },
                      { topic: "Recursion", score: 51, action: "Solve Easy" },
                      { topic: "Communication", score: 65, action: "Mock Interview", type: "Medium" },
                    ].map((w, i) => (
                      <div key={i} className="p-4 rounded-xl bg-secondary/50 border border-white/5 space-y-3 group transition-all hover:bg-rose-500/10">
                         <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                            <span>{w.topic}</span>
                            <span className={w.score < 50 ? 'text-rose-500' : 'text-amber-500'}>{w.score}%</span>
                         </div>
                         <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${w.score}%` }} className={w.score < 50 ? 'h-full bg-rose-500' : 'h-full bg-amber-500'} />
                         </div>
                         <button className="w-full py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">IMPROVE NOW <ChevronRight className="w-3 h-3" /></button>
                      </div>
                    ))}
                 </div>
              </section>

              {/* SECTION 8: MOCK INTERVIEW ANALYTICS */}
              <section className="glass-card p-6">
                 <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Interview Performance</h3>
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-secondary border border-white/5 text-center">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Total Rounds</p>
                       <p className="text-xl font-black">{data?.analytics.mockInterviewCount || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary border border-white/5 text-center">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Avg Score</p>
                       <p className="text-xl font-black text-primary">{data?.analytics.avgScore || 0}%</p>
                    </div>
                 </div>
                 <div className="space-y-4">
                    {[
                      { label: "Confidence", val: 8.5, color: "bg-accent-cyan" },
                      { label: "Communication", val: 7.8, color: "bg-primary" },
                      { label: "Technical Accuracy", val: 9.2, color: "bg-emerald-500" },
                    ].map((m, i) => (
                      <div key={i} className="space-y-1.5">
                         <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span>{m.label}</span>
                            <span>{m.val}/10</span>
                         </div>
                         <div className="w-full h-1 bg-white/5 rounded-full"><motion.div initial={{ width: 0 }} animate={{ width: `${m.val * 10}%` }} className={`h-full ${m.color}`} /></div>
                      </div>
                    ))}
                 </div>
              </section>

              {/* SECTION 9: RESUME ATS SCORE */}
              <section className="glass-card p-6 bg-gradient-to-br from-emerald-500/10 to-transparent">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500">Resume ATS Score</h3>
                    <Award className="w-5 h-5 text-emerald-500" />
                 </div>
                 <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 flex items-center justify-center flex-col">
                       <span className="text-2xl font-black text-emerald-500">82</span>
                       <span className="text-[8px] font-bold text-muted-foreground uppercase">ATS</span>
                    </div>
                    <div className="flex-1 space-y-2">
                       <p className="text-xs font-bold">Suggestions:</p>
                       <ul className="text-[10px] text-muted-foreground space-y-1 list-disc pl-3">
                          <li>Add quantified achievements</li>
                          <li>Improve action verbs</li>
                          <li>Add technical keywords</li>
                       </ul>
                    </div>
                 </div>
                 <Link href="/resume" className="w-full btn-glass py-3 text-[10px] font-black uppercase tracking-[0.2em] border-emerald-500/20 text-emerald-500 flex items-center justify-center gap-2">OPTIMIZE RESUME <ChevronRight className="w-4 h-4" /></Link>
              </section>

              {/* SECTION 10: REVISION ZONE */}
              <section className="glass-card p-6 border-l-4 border-accent-pink">
                 <h3 className="text-xs font-black uppercase tracking-widest text-accent-pink mb-6 flex items-center gap-2"><Clock className="w-4 h-4" /> Smart Revision Zone</h3>
                 <div className="space-y-3">
                    {[
                      { topic: "SQL Joins", due: "Today", icon: Database },
                      { topic: "Percentage Formulas", due: "Today", icon: Brain },
                      { topic: "OOPS Concepts", due: "Tomorrow", icon: Code },
                    ].map((r, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-white/5 group hover:border-accent-pink/30 transition-all cursor-pointer">
                         <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent-pink/10 text-accent-pink"><r.icon className="w-3.5 h-3.5" /></div>
                            <span className="text-xs font-bold">{r.topic}</span>
                         </div>
                         <span className="text-[10px] font-black uppercase text-accent-pink opacity-50 group-hover:opacity-100 transition-opacity">{r.due}</span>
                      </div>
                    ))}
                 </div>
              </section>

              {/* SECTION 11: ROADMAP PROGRESS */}
              <section className="glass-card p-6">
                 <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Learning Path Progress</h3>
                 <div className="space-y-6">
                    <div>
                       <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold">Software Engineer</span>
                          <span className="text-xs font-black text-primary">80%</span>
                       </div>
                       <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div initial={{ width: 0 }} animate={{ width: "80%" }} className="h-full bg-primary" />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       {[
                         { l: "Aptitude", d: true }, { l: "DSA", d: true },
                         { l: "DBMS", d: true }, { l: "OS", d: false },
                         { l: "Resume", d: true }, { l: "Interview", d: false },
                       ].map((m, i) => (
                         <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-white/5">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${m.d ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'}`}>
                               {m.d && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                            </div>
                            <span className={`text-[10px] font-bold ${m.d ? 'text-foreground' : 'text-muted-foreground'}`}>{m.l}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </section>

            </div>
          </div>

          {/* SECTION 12: PERFORMANCE ANALYTICS (EXPANDED) */}
          <section className="grid lg:grid-cols-2 gap-8">
             <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-xl font-bold flex items-center gap-3"><Activity className="w-5 h-5 text-accent-cyan" /> Topic-wise Accuracy</h2>
                   <Filter className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={[
                        { name: "Aptitude", score: 82 },
                        { name: "DSA", score: 65 },
                        { name: "Technical", score: 78 },
                        { name: "DBMS", score: 60 },
                        { name: "OS", score: 55 },
                     ]}>
                        <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <RechartsTooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }} />
                        <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                           {[0, 1, 2, 3, 4].map((entry, index) => (
                              <Cell key={index} fill={index === 0 ? "#7c3aed" : index === 1 ? "#ec4899" : "#06b6d4"} />
                           ))}
                        </Bar>
                     </BarChart>
                  </ResponsiveContainer>
                </div>
             </div>
             
             <div className="glass-card p-8 bg-gradient-to-br from-secondary/30 to-transparent">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-xl font-bold">Productivity Insights</h2>
                   <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg text-primary text-[10px] font-black uppercase tracking-widest">Live</div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-6">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Weekly Study Time</p>
                         <p className="text-3xl font-black">24.5<span className="text-sm font-bold ml-1">hrs</span></p>
                         <p className="text-[10px] text-emerald-500 font-bold mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +3.2h from last week</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Coding Consistency</p>
                         <p className="text-3xl font-black text-amber-400">92%</p>
                         <div className="w-full h-1 bg-white/5 rounded-full mt-2"><div className="w-[92%] h-full bg-amber-400" /></div>
                      </div>
                   </div>
                   <div className="flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full border-8 border-white/5 border-t-primary border-r-accent-cyan animate-spin-slow flex items-center justify-center">
                         <div className="text-center">
                            <p className="text-xl font-black">A+</p>
                            <p className="text-[8px] font-bold text-muted-foreground uppercase">RATING</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* SECTION 13: LEADERBOARD & 14: ACHIEVEMENTS */}
          <section className="grid lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-xl font-bold flex items-center gap-3"><Users className="w-5 h-5 text-primary" /> Leaderboard</h2>
                   <div className="flex p-1 bg-secondary rounded-xl">
                      {["Global", "College", "Friends"].map((f) => (
                        <button key={f} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${f === 'Global' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground'}`}>{f}</button>
                      ))}
                   </div>
                </div>
                <div className="space-y-2">
                   {[
                     { name: "Arjun Mehta", college: "IIT Delhi", xp: 5240, rank: 1, avatar: "A" },
                     { name: "Sanya Roy", college: "NSUT", xp: 4890, rank: 2, avatar: "S" },
                     { name: "Priya V.", college: "DTU", xp: 4120, rank: 3, avatar: "P" },
                     { name: "You", college: "LPU", xp: data?.analytics.xp, rank: 124, avatar: "U", isMe: true },
                   ].map((item, i) => (
                     <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${item.isMe ? 'bg-primary/10 border-primary/40 shadow-xl shadow-primary/5' : 'bg-secondary/30 border-white/5 hover:bg-secondary transition-colors'}`}>
                        <div className="flex items-center gap-4">
                           <span className={`text-sm font-black w-6 ${item.rank <= 3 ? 'text-amber-400' : 'text-muted-foreground'}`}>{item.rank}</span>
                           <div className="w-10 h-10 rounded-full bg-foreground/10 border border-white/5 flex items-center justify-center text-sm font-black">{item.avatar}</div>
                           <div>
                              <p className={`text-sm font-bold ${item.isMe ? 'text-primary' : 'text-foreground'}`}>{item.name}</p>
                              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{item.college}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black">{item.xp} XP</p>
                           {item.isMe && <p className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1"><TrendingUp className="w-2 h-2" /> UP 12 RANKS</p>}
                        </div>
                     </div>
                   ))}
                </div>
                <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-white/5 flex items-center justify-between">
                   <p className="text-xs font-bold">🚀 You are ahead of 82% of students this week!</p>
                   <button className="text-xs font-black uppercase text-primary hover:underline">See full ranking</button>
                </div>
             </div>

             <div className="glass-card p-8">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3"><Award className="w-5 h-5 text-amber-400" /> Achievements</h2>
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { name: "Aptitude Master", icon: Brain, color: "text-accent-pink", bg: "bg-accent-pink/10" },
                     { name: "DSA Warrior", icon: Code, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                     { name: "7-Day Streak", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
                     { name: "Interview Expert", icon: MessageSquare, color: "text-primary", bg: "bg-primary/10" },
                     { name: "Resume Pro", icon: FileText, color: "text-accent-cyan", bg: "bg-accent-cyan/10" },
                   ].map((badge, i) => (
                     <motion.div 
                        key={i} 
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className={`p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-3 text-center transition-all hover:bg-white/5`}
                     >
                        <div className={`w-12 h-12 rounded-2xl ${badge.bg} ${badge.color} flex items-center justify-center shadow-lg border border-white/5`}>
                           <badge.icon className="w-7 h-7" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{badge.name}</span>
                     </motion.div>
                   ))}
                   <div className="p-4 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center opacity-50">
                      <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Locked</span>
                   </div>
                </div>
             </div>
          </section>

          {/* SECTION 15: ACTIVITY HEATMAP & 16: RECENT ACTIVITY */}
          <section className="grid lg:grid-cols-2 gap-8">
             <div className="glass-card p-8">
                <div className="flex items-center justify-between mb-8">
                   <h2 className="text-xl font-bold flex items-center gap-3"><Activity className="w-5 h-5 text-emerald-400" /> Learning Consistency</h2>
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Past 4 Months</span>
                </div>
                {/* Heatmap Mockup */}
                <div className="flex gap-1.5 flex-wrap">
                   {[...Array(91)].map((_, i) => (
                     <div 
                        key={i} 
                        className={`w-4 h-4 rounded-sm transition-all hover:scale-125 ${i % 7 === 0 || i % 13 === 0 ? 'bg-primary' : i % 5 === 0 ? 'bg-primary/50' : i % 3 === 0 ? 'bg-primary/20' : 'bg-white/5'}`} 
                        title={`Activity: ${Math.floor(Math.random() * 10)} sessions`}
                     />
                   ))}
                </div>
                <div className="mt-6 flex items-center justify-end gap-3">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">Less</span>
                   <div className="flex gap-1">
                      <div className="w-3 h-3 bg-white/5 rounded-sm" />
                      <div className="w-3 h-3 bg-primary/20 rounded-sm" />
                      <div className="w-3 h-3 bg-primary/50 rounded-sm" />
                      <div className="w-3 h-3 bg-primary rounded-sm" />
                   </div>
                   <span className="text-[10px] font-bold text-muted-foreground uppercase">More</span>
                </div>
             </div>

             <div className="glass-card p-8">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3"><History className="w-5 h-5 text-primary" /> Recent Activity</h2>
                <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
                   {[
                     { text: "Completed Arrays Quiz", date: "Today, 2:40 PM", icon: CheckCircle2, color: "text-emerald-500" },
                     { text: "Uploaded Revised Resume", date: "Yesterday, 10:15 AM", icon: FileText, color: "text-primary" },
                     { text: "Solved Daily Coding Challenge", date: "May 10, 6:30 PM", icon: Zap, color: "text-amber-400" },
                     { text: "Practiced Mock Interview (Technical)", date: "May 09, 4:00 PM", icon: MessageSquare, color: "text-accent-cyan" },
                   ].map((activity, i) => (
                     <div key={i} className="relative pl-10 group">
                        <div className={`absolute left-0 top-1 w-6 h-6 rounded-full bg-background border border-white/10 flex items-center justify-center transition-all group-hover:border-primary/50 ${activity.color}`}>
                           <activity.icon className="w-3 h-3" />
                        </div>
                        <p className="text-sm font-bold group-hover:text-primary transition-colors">{activity.text}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">{activity.date}</p>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] border border-white/5 rounded-2xl hover:bg-white/5 transition-all">View All Activity</button>
             </div>
          </section>

          {/* SECTION 17: UPCOMING PLACEMENT DRIVES */}
          <section className="pb-10">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black flex items-center gap-4 tracking-tight"><Briefcase className="w-7 h-7 text-primary" /> Upcoming Placement Drives</h2>
                <button className="flex items-center gap-2 text-xs font-black uppercase text-muted-foreground hover:text-primary transition-colors"><Filter className="w-4 h-4" /> Filter Drives</button>
             </div>
             <div className="grid md:grid-cols-3 gap-6">
                {MOCK_DRIVES.map((drive, i) => (
                  <div key={i} className="glass-card p-6 group hover:bg-gradient-to-br hover:from-primary/5 hover:to-transparent transition-all border-b-4 border-b-transparent hover:border-b-primary">
                     <div className="flex items-start justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-secondary border border-white/10 flex items-center justify-center text-2xl font-black text-primary shadow-lg">
                           {drive.icon}
                        </div>
                        <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest border border-rose-500/20">Closes Soon</span>
                     </div>
                     <h3 className="text-lg font-bold mb-1">{drive.company} Hiring Drive</h3>
                     <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-6">{drive.role}</p>
                     
                     <div className="space-y-3 mb-8">
                        <div className="flex items-center justify-between text-xs font-bold">
                           <span className="text-muted-foreground">Eligibility</span>
                           <span className="text-foreground">{drive.eligibility}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-bold">
                           <span className="text-muted-foreground">Deadline</span>
                           <span className="text-foreground">{drive.deadline}</span>
                        </div>
                     </div>
                     
                     <div className="flex gap-2">
                        <button className="flex-1 btn-primary py-3 text-xs font-bold">APPLY NOW</button>
                        <button className="p-3 rounded-xl bg-secondary border border-white/5 hover:bg-white/5 transition-all"><ExternalLink className="w-4 h-4" /></button>
                     </div>
                  </div>
                ))}
             </div>
          </section>

        </div>
      </main>

      {/* SECTION 18: MOBILE STICKY NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-2xl border-t border-white/5 flex items-center justify-around px-6 z-50">
         {[
           { icon: LayoutDashboard, label: "Home" },
           { icon: Target, label: "Goals" },
           { icon: Zap, label: "Prep" },
           { icon: User, label: "Profile" },
         ].map((item, i) => (
           <button key={i} className="flex flex-col items-center gap-1 group">
              <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest group-hover:text-primary transition-colors">{item.label}</span>
           </button>
         ))}
      </div>
    </div>
  );
}
