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
  Info,
  Database
} from "lucide-react";
import dynamic from 'next/dynamic';
import { getBaseUrl } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ThemeToggle";
import Sidebar from "@/components/Sidebar";

// Dynamically import Recharts to reduce bundle size
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const RechartsTooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });

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



// --- Main Page ---

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [tasks, setTasks] = useState([
    { id: 1, text: "Solve 5 Probability Questions", done: false, xp: 20, time: "15m" },
    { id: 2, text: "Complete 1 DSA Problem", done: true, xp: 50, time: "30m" },
    { id: 3, text: "Practice HR Interview", done: false, xp: 30, time: "20m" },
    { id: 4, text: "Revise DBMS Notes", done: false, xp: 15, time: "10m" },
  ]);

  const router = useRouter();



  const [user, setUser] = useState<{ name?: string }>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    const cachedData = localStorage.getItem("dashboard_cache");
    try {
      if (cachedData) setData(JSON.parse(cachedData));
    } catch (e) {}

    const fetchDashboardData = async () => {
      try {
        const dashboardRes = await fetch(`${getBaseUrl()}/api/user/dashboard`, {
          headers: { "Authorization": `Bearer ${token}` },
        });

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

  if (loading && !data) return (
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary flex overflow-hidden">
      <div className="w-64 border-r border-border bg-white p-6 hidden md:flex flex-col gap-8">
        <Skeleton className="h-10 w-32" />
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
      <main className="flex-1 p-4 md:p-8 lg:p-10 space-y-12">
        <header className="flex justify-between items-center mb-12">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </header>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-48 md:col-span-2 lg:col-span-2 rounded-[32px]" />
          <Skeleton className="h-48 rounded-[32px]" />
          <Skeleton className="h-48 rounded-[32px]" />
        </div>
        <div className="grid lg:grid-cols-3 gap-10">
          <Skeleton className="h-96 lg:col-span-2 rounded-[32px]" />
          <Skeleton className="h-96 rounded-[32px]" />
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary flex overflow-hidden">
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"><Menu className="w-6 h-6" /></button>
             <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input type="text" placeholder="Search AI Coach..." className="bg-slate-100 border border-border rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:w-80 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-primary/20" />
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold">
                <Flame className="w-4 h-4" /> {data?.analytics.streak || 0} DAY STREAK
             </div>
             <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white" />
             </button>
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto space-y-6 md:space-y-12">
          
          {/* SECTION 1: HERO AREA */}
          <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:col-span-2 lg:col-span-2 saas-card p-6 md:p-8 bg-white flex flex-col justify-between"
            >
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 tracking-tight">Welcome back, <span className="text-primary">{user.name || "Sachin"}</span> 👋</h1>
                <p className="text-text-secondary text-sm max-w-md">Your placement readiness has increased by 12% this week. Let&apos;s keep the momentum going!</p>
              </div>
              <div className="mt-8 md:mt-10 flex items-center gap-6">
                 <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                       <span>Placement Readiness Score</span>
                       <span className="text-primary">72%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                       <motion.div initial={{ width: 0 }} animate={{ width: "72%" }} className="h-full bg-primary rounded-full shadow-sm" />
                    </div>
                 </div>
                 <div className="w-16 h-16 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-border">
                    <span className="text-xl font-black">72</span>
                    <span className="text-[8px] font-bold text-text-secondary uppercase">PR SCORE</span>
                 </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="saas-card p-6 md:p-8 bg-white flex flex-col justify-between">
               <div>
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-6">Daily Goal Progress</h3>
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24">
                       <svg className="w-full h-full -rotate-90">
                          <circle cx="48" cy="48" r="40" className="stroke-slate-100 fill-none" strokeWidth="8" />
                          <motion.circle cx="48" cy="48" r="40" className="stroke-primary fill-none" strokeWidth="8" strokeDasharray="251.2" initial={{ strokeDashoffset: 251.2 }} animate={{ strokeDashoffset: 251.2 - (251.2 * (tasksCompleted/tasks.length)) }} transition={{ duration: 1.5, ease: "easeOut" }} />
                       </svg>
                       <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-2xl font-black">{tasksCompleted}/{tasks.length}</span>
                       </div>
                    </div>
                    <p className="text-xs text-text-secondary font-medium leading-relaxed">You are almost there! Complete 2 more tasks to hit your daily goal.</p>
                  </div>
               </div>
               <button className="w-full btn-outline py-3 text-xs font-bold flex items-center justify-center gap-2 mt-6">VIEW ALL TASKS <ArrowRight className="w-4 h-4" /></button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="saas-card p-8 border-l-4 border-secondary bg-secondary/5">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center"><Bot className="w-6 h-6" /></div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-secondary">AI Mentor Recommendation</h3>
               </div>
               <p className="text-sm font-medium leading-relaxed mb-8 italic">
                 &quot;You are improving in coding but struggling in aptitude speed. Practice timed quizzes today to boost your velocity.&quot;
               </p>
               <Link href="/aptitude" className="w-full btn-secondary py-3 text-xs font-bold shadow-sm">CONTINUE APTITUDE PRACTICE</Link>
            </motion.div>
          </section>



          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-12">
              
              {/* SECTION 3: TODAY'S PREPARATION PLAN */}
              <section className="saas-card p-5 md:p-8 bg-white">
                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-text-primary"><Calendar className="w-5 h-5 text-primary" /> Today&apos;s Preparation Plan</h2>
                    <div className="text-[10px] font-bold text-text-secondary bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest w-fit">{tasksCompleted}/{tasks.length} COMPLETED</div>
                 </div>
                 <div className="space-y-4">
                    {tasks.map((task) => (
                      <div 
                        key={task.id} 
                        onClick={() => toggleTask(task.id)}
                        className={`group flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${task.done ? 'bg-primary/5 border-primary/20' : 'bg-white border-slate-200 hover:border-primary/30 shadow-sm'}`}
                      >
                         <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.done ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-primary/50'}`}>
                            {task.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                         </div>
                         <div className="flex-1">
                            <p className={`text-sm font-bold ${task.done ? 'text-text-secondary line-through' : 'text-text-primary'}`}>{task.text}</p>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-[10px] text-text-secondary flex items-center gap-1"><Clock className="w-3 h-3" /> {task.time}</span>
                               <span className="text-[10px] text-primary flex items-center gap-1 font-black uppercase tracking-widest"><Zap className="w-3 h-3" /> +{task.xp} XP</span>
                            </div>
                         </div>
                         {!task.done && <ChevronRight className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </div>
                    ))}
                 </div>
              </section>







            </div>

            <div className="space-y-12">
              
              {/* SECTION 5: WEAKNESS ANALYSIS */}
              <section className="saas-card p-6 border-t-4 border-rose-500 bg-rose-50/30">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center"><Activity className="w-5 h-5" /></div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-rose-600">AI Weakness Analysis</h3>
                 </div>
                 <div className="space-y-4">
                    {[
                      { topic: "Probability", score: 42, action: "Watch Lesson" },
                      { topic: "Time & Work", score: 53, action: "Practice 10Q" },
                      { topic: "Recursion", score: 51, action: "Solve Easy" },
                      { topic: "Communication", score: 65, action: "Mock Interview", type: "Medium" },
                    ].map((w, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white border border-slate-100 space-y-3 group transition-all hover:border-rose-200">
                         <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-text-primary">
                            <span>{w.topic}</span>
                            <span className={w.score < 50 ? 'text-rose-600' : 'text-amber-600'}>{w.score}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${w.score}%` }} className={w.score < 50 ? 'h-full bg-rose-500' : 'h-full bg-amber-500'} />
                         </div>
                         <button className="w-full py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">IMPROVE NOW <ChevronRight className="w-3 h-3" /></button>
                      </div>
                    ))}
                 </div>
              </section>





            </div>
          </div>

          {/* SECTION 12: PERFORMANCE ANALYTICS (EXPANDED) */}
          <section className="grid lg:grid-cols-2 gap-8">

          </section>

          {/* SECTION 13: LEADERBOARD & 14: ACHIEVEMENTS */}


          {/* SECTION 15: ACTIVITY HEATMAP & 16: RECENT ACTIVITY */}
          <section className="grid lg:grid-cols-2 gap-8">

          </section>



        </div>
      </main>

      {/* SECTION 18: MOBILE STICKY NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-t border-slate-200 flex items-center justify-around px-6 z-50">
         {[
           { icon: LayoutDashboard, label: "Home" },
           { icon: Target, label: "Goals" },
           { icon: Zap, label: "Prep" },
           { icon: User, label: "Profile" },
         ].map((item, i) => (
           <button key={i} className="flex flex-col items-center gap-1 group">
              <item.icon className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
              <span className="text-[8px] font-bold text-text-secondary uppercase tracking-widest group-hover:text-primary transition-colors">{item.label}</span>
           </button>
         ))}
      </div>
    </div>
  );
}
