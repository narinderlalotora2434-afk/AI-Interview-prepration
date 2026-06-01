"use client";

import { useEffect, useState } from "react";
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
import { getBaseUrl } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
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
  topicPerformance?: string;
  roadmap: string;
}

interface InterviewRecord {
  id: string;
  type: string;
  score: number;
  createdAt: string;
}

interface ResumeRecord {
  id: string;
  atsScore: number;
  createdAt: string;
}

interface ModuleProgress {
  id: string;
  title: string;
  progress: number;
  status: string;
  lastActivity: string;
  category: string;
}

interface ActivityRecord {
  type: string;
  date: string;
  score: number;
}

interface DashboardData {
  analytics: UserAnalytics;
  recentInterviews: InterviewRecord[];
  recentResumes: ResumeRecord[];
  allActivity: ActivityRecord[];
  moduleProgresses: ModuleProgress[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Example Static Daily Quests (Ideally connect to a Quests API)
  const [tasks, setTasks] = useState([
    { id: 1, text: "Complete 1 Aptitude Test", done: false, xp: 20, time: "15m", link: "/aptitude" },
    { id: 2, text: "Solve 1 Coding Problem", done: true, xp: 50, time: "30m", link: "/coding" },
    { id: 3, text: "Take an AI Mock Interview", done: false, xp: 100, time: "20m", link: "/interview" },
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

  // Dynamically calculate weaknesses using REAL scores from all data sources
  const parseWeaknesses = () => {
    try {
      const allWeakAreas: { topic: string; score: number; action: string; source: string }[] = [];

      // 1. Interview topic performance (scores are stored on a 0-10 scale, convert to %)
      let performanceMap: Record<string, number> = {};
      if (data?.analytics?.topicPerformance) {
        const rawPerf = JSON.parse(data.analytics.topicPerformance);
        Object.entries(rawPerf).forEach(([topic, rawScore]) => {
          const percentScore = Math.round(Number(rawScore) * 10); // Convert 0-10 → 0-100
          performanceMap[topic] = percentScore;
          if (percentScore < 70) {
            allWeakAreas.push({
              topic: topic.toUpperCase(),
              score: percentScore,
              action: percentScore < 30 ? "Start Basics" : percentScore < 50 ? "Practice More" : "Refine Skills",
              source: "Interview"
            });
          }
        });
      }

      // 2. Aptitude performance from recent activity
      if (data?.allActivity) {
        const aptitudeActivities = data.allActivity.filter(a => a.type === 'Aptitude');
        if (aptitudeActivities.length > 0) {
          const avgAptitude = Math.round(
            aptitudeActivities.reduce((sum, a) => sum + (a.score || 0), 0) / aptitudeActivities.length
          );
          if (avgAptitude < 70) {
            allWeakAreas.push({
              topic: "APTITUDE & REASONING",
              score: avgAptitude,
              action: avgAptitude < 40 ? "Take Practice Tests" : "Review Weak Categories",
              source: "Aptitude"
            });
          }
        }

        // 3. Coding performance from recent activity
        const codingActivities = data.allActivity.filter(a => a.type === 'Coding');
        if (codingActivities.length > 0) {
          const avgCoding = Math.round(
            codingActivities.reduce((sum, a) => sum + (a.score || 0), 0) / codingActivities.length
          );
          if (avgCoding < 70) {
            allWeakAreas.push({
              topic: "CODING ACCURACY",
              score: avgCoding,
              action: avgCoding < 40 ? "Solve Easy Problems" : "Attempt Medium Level",
              source: "Coding"
            });
          }
        }
      }

      // 3b. Also add weak topics from analytics even if not in topicPerformance map
      if (data?.analytics?.weakTopics) {
        const weakTopicsList = JSON.parse(data.analytics.weakTopics);
        if (Array.isArray(weakTopicsList)) {
          weakTopicsList.forEach((t: string) => {
            const already = allWeakAreas.find(w => w.topic === t.toUpperCase());
            if (!already) {
              const rawScore = performanceMap[t.toUpperCase()] ?? performanceMap[t];
              const score = rawScore !== undefined ? rawScore : 35;
              allWeakAreas.push({
                topic: t.toUpperCase(),
                score,
                action: score < 30 ? "Start Basics" : "Practice More",
                source: "Interview"
              });
            }
          });
        }
      }

      // Sort by lowest score first (worst weaknesses first) and take top 4
      if (allWeakAreas.length > 0) {
        return allWeakAreas
          .sort((a, b) => a.score - b.score)
          .slice(0, 4);
      }
    } catch (e) {
      console.error("Error parsing weaknesses:", e);
    }
    // Fallback only if no data exists at all
    return [
      { topic: "PROBABILITY", score: 42, action: "Practice", source: "Fallback" },
      { topic: "SYSTEM DESIGN", score: 53, action: "Watch Lesson", source: "Fallback" },
      { topic: "DYNAMIC PROG.", score: 51, action: "Solve Easy", source: "Fallback" },
    ];
  };

  const weaknesses = parseWeaknesses();

  // Loading State
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

  const prScore = Math.round(data?.analytics?.avgScore || 72); // Placement Readiness Score
  const activeRoadmap = data?.moduleProgresses?.[0]; // Get most recently active roadmap

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
                <input type="text" placeholder="Search resources..." className="bg-slate-100 border border-border rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:w-80 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-primary/20" />
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold">
                <Flame className="w-4 h-4" /> {data?.analytics?.streak || 0} DAY STREAK
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
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black mb-2 tracking-tight">Welcome back, <span className="text-primary">{user.name || "User"}</span> 👋</h1>
                <p className="text-text-secondary text-sm max-w-md">Keep up the great work! Your placement readiness is tracking beautifully.</p>
              </div>
              <div className="mt-8 md:mt-10 flex items-center gap-6">
                 <div className="flex-1">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                       <span>Placement Readiness Score</span>
                       <span className="text-primary">{prScore}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${prScore}%` }} className="h-full bg-primary rounded-full shadow-sm" />
                    </div>
                 </div>
                 <div className="w-16 h-16 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-border">
                    <span className="text-xl font-black">{prScore}</span>
                    <span className="text-[8px] font-bold text-text-secondary uppercase">PR SCORE</span>
                 </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="saas-card p-6 md:p-8 bg-white flex flex-col justify-between">
               <div>
                  <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-6">Daily Quests</h3>
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
                    <p className="text-xs text-text-secondary font-medium leading-relaxed">Complete your daily quests to earn bonus XP!</p>
                  </div>
               </div>
               <Link href="/quests" className="w-full btn-outline py-3 text-xs font-bold flex items-center justify-center gap-2 mt-6 hover:bg-slate-50">VIEW QUESTS <ArrowRight className="w-4 h-4" /></Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="saas-card p-8 border-l-4 border-secondary bg-secondary/5 flex flex-col justify-between">
               <div>
                  <div className="flex items-center gap-3 mb-6">
                     <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center"><MapIcon className="w-6 h-6" /></div>
                     <h3 className="text-xs font-black uppercase tracking-widest text-secondary">Active Roadmap</h3>
                  </div>
                  {activeRoadmap ? (
                    <div>
                      <p className="text-sm font-bold text-text-primary mb-2">{activeRoadmap.title}</p>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${activeRoadmap.progress}%` }} className="h-full bg-secondary" />
                      </div>
                      <p className="text-[10px] text-text-secondary font-bold uppercase">{activeRoadmap.progress}% Completed</p>
                    </div>
                  ) : (
                    <p className="text-sm font-medium leading-relaxed text-text-secondary italic">
                      You haven&apos;t started any roadmap yet. Start a curated path today!
                    </p>
                  )}
               </div>
               <Link href="/roadmaps" className="w-full btn-secondary py-3 text-xs font-bold shadow-sm flex justify-center items-center gap-2 mt-6">GO TO ROADMAPS <ArrowRight className="w-4 h-4" /></Link>
            </motion.div>
          </section>

          {/* SECTION 2: CORE FEATURES */}
          <section className="grid md:grid-cols-3 gap-6">
            <div className="saas-card p-6 bg-white border border-slate-200 hover:border-primary/30 transition-all flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Mic className="w-7 h-7" /></div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-text-primary">AI Interview</h4>
                <p className="text-xs text-text-secondary mt-1">Last Score: <span className="font-bold text-primary">{data?.recentInterviews?.[0]?.score || '--'}%</span></p>
              </div>
              <Link href="/interview" className="p-3 bg-slate-50 hover:bg-primary hover:text-white rounded-xl transition-colors text-text-secondary"><ChevronRight className="w-5 h-5" /></Link>
            </div>
            <div className="saas-card p-6 bg-white border border-slate-200 hover:border-emerald-500/30 transition-all flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Code className="w-7 h-7" /></div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-text-primary">Coding Arena</h4>
                <p className="text-xs text-text-secondary mt-1">Submissions: <span className="font-bold text-emerald-500">{data?.analytics?.codingRoundCount || 0}</span></p>
              </div>
              <Link href="/coding" className="p-3 bg-slate-50 hover:bg-emerald-500 hover:text-white rounded-xl transition-colors text-text-secondary"><ChevronRight className="w-5 h-5" /></Link>
            </div>
            <div className="saas-card p-6 bg-white border border-slate-200 hover:border-blue-500/30 transition-all flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500"><FileText className="w-7 h-7" /></div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-text-primary">Resume Pro</h4>
                <p className="text-xs text-text-secondary mt-1">ATS Score: <span className="font-bold text-blue-500">{data?.recentResumes?.[0]?.atsScore || '--'}%</span></p>
              </div>
              <Link href="/resume" className="p-3 bg-slate-50 hover:bg-blue-500 hover:text-white rounded-xl transition-colors text-text-secondary"><ChevronRight className="w-5 h-5" /></Link>
            </div>
          </section>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-12">
              
              {/* SECTION 3: DAILY QUESTS */}
              <section className="saas-card p-5 md:p-8 bg-white">
                 <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-text-primary"><Target className="w-5 h-5 text-primary" /> Today&apos;s Quests</h2>
                    <div className="text-[10px] font-bold text-text-secondary bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest w-fit">{tasksCompleted}/{tasks.length} COMPLETED</div>
                 </div>
                 <div className="space-y-4">
                    {tasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${task.done ? 'bg-primary/5 border-primary/20' : 'bg-white border-slate-200 shadow-sm'}`}
                      >
                         <div onClick={() => toggleTask(task.id)} className={`cursor-pointer w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.done ? 'bg-primary border-primary' : 'border-slate-300 hover:border-primary/50'}`}>
                            {task.done && <CheckCircle2 className="w-4 h-4 text-white" />}
                         </div>
                         <div className="flex-1">
                            <p className={`text-sm font-bold ${task.done ? 'text-text-secondary line-through' : 'text-text-primary'}`}>{task.text}</p>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-[10px] text-text-secondary flex items-center gap-1"><Clock className="w-3 h-3" /> {task.time}</span>
                               <span className="text-[10px] text-primary flex items-center gap-1 font-black uppercase tracking-widest"><Zap className="w-3 h-3" /> +{task.xp} XP</span>
                            </div>
                         </div>
                         {!task.done && (
                           <Link href={task.link} className="px-3 py-1.5 bg-slate-100 hover:bg-primary hover:text-white rounded-lg text-xs font-bold text-text-secondary transition-colors">
                             START
                           </Link>
                         )}
                      </div>
                    ))}
                 </div>
              </section>

              {/* SECTION 4: RECENT ACTIVITY TIMELINE */}
              <section className="saas-card p-5 md:p-8 bg-white">
                 <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold flex items-center gap-3 text-text-primary"><History className="w-5 h-5 text-primary" /> Recent Activity</h2>
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Latest</span>
                 </div>
                 
                 {data?.allActivity && data.allActivity.length > 0 ? (
                   <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                     {data.allActivity.slice(0, 4).map((activity, i) => (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                           {/* Icon */}
                           <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 group-hover:bg-primary group-hover:text-white text-text-secondary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors z-10">
                              {activity.type === 'Interview' && <Mic className="w-4 h-4" />}
                              {activity.type === 'Resume' && <FileText className="w-4 h-4" />}
                              {activity.type === 'Coding' && <Code className="w-4 h-4" />}
                              {activity.type === 'Aptitude' && <Brain className="w-4 h-4" />}
                           </div>
                           {/* Content */}
                           <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm group-hover:border-primary/30 transition-colors">
                              <div className="flex items-center justify-between mb-1">
                                 <h4 className="text-sm font-bold text-text-primary">{activity.type} Practice</h4>
                                 <span className="text-[10px] font-bold text-text-secondary bg-slate-50 px-2 py-0.5 rounded-md">Score: {activity.score}</span>
                              </div>
                              <span className="text-[10px] text-text-secondary font-medium">{new Date(activity.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                           </div>
                        </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-text-secondary">No recent activity found. Start practicing!</p>
                   </div>
                 )}
              </section>

            </div>

            <div className="space-y-12">
              
              {/* SECTION 5: WEAKNESS ANALYSIS */}
              <section className="saas-card p-6 border-t-4 border-rose-500 bg-rose-50/30">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center"><Activity className="w-5 h-5" /></div>
                       <h3 className="text-xs font-black uppercase tracking-widest text-rose-600">AI Weakness Analysis</h3>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-rose-400 bg-rose-100 px-2 py-1 rounded-full">REAL-TIME</span>
                 </div>
                 <div className="space-y-4">
                    {weaknesses.map((w, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white border border-slate-100 space-y-3 group transition-all hover:border-rose-200 hover:shadow-sm">
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                               <span className="text-xs font-bold uppercase tracking-wider text-text-primary">{w.topic}</span>
                               {'source' in w && w.source !== 'Fallback' && (
                                 <span className={`text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                                   w.source === 'Interview' ? 'bg-primary/10 text-primary' :
                                   w.source === 'Coding' ? 'bg-emerald-50 text-emerald-600' :
                                   'bg-amber-50 text-amber-600'
                                 }`}>{w.source}</span>
                               )}
                            </div>
                            <span className={`text-xs font-black ${w.score < 30 ? 'text-rose-600' : w.score < 50 ? 'text-rose-500' : 'text-amber-600'}`}>{w.score}%</span>
                         </div>
                         <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${w.score}%` }} transition={{ duration: 1, delay: i * 0.15 }} className={`h-full rounded-full ${w.score < 30 ? 'bg-rose-600' : w.score < 50 ? 'bg-rose-500' : 'bg-amber-500'}`} />
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">{w.action}</span>
                            <button className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">IMPROVE <ChevronRight className="w-3 h-3" /></button>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              {/* SECTION 6: STATS SUMMARY */}
              <section className="saas-card p-6 bg-white">
                <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> Overall Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-text-secondary">Total XP</span>
                    <span className="text-sm font-black text-primary">{data?.analytics?.xp || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-text-secondary">Mock Interviews</span>
                    <span className="text-sm font-black text-text-primary">{data?.analytics?.mockInterviewCount || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                    <span className="text-xs font-bold text-text-secondary">Average Score</span>
                    <span className="text-sm font-black text-text-primary">{prScore}%</span>
                  </div>
                </div>
              </section>

            </div>
          </div>

        </div>
      </main>

      {/* MOBILE STICKY NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-t border-slate-200 flex items-center justify-around px-6 z-50">
         {[
           { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
           { icon: Target, label: "Quests", href: "/quests" },
           { icon: Zap, label: "Prep", href: "/aptitude" },
           { icon: User, label: "Profile", href: "/profile" },
         ].map((item, i) => (
           <Link href={item.href} key={i} className="flex flex-col items-center gap-1 group">
              <item.icon className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
              <span className="text-[8px] font-bold text-text-secondary uppercase tracking-widest group-hover:text-primary transition-colors">{item.label}</span>
           </Link>
         ))}
      </div>
    </div>
  );
}
