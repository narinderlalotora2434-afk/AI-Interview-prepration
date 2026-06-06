"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Flame,
  Trophy,
  History,
  Mail,
  Calendar,
  Target,
  Camera,
  Brain,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Menu,
  ChevronRight,
  Code,
  Bot,
  ArrowRight,
  FileText,
  MessageSquare,
  Activity,
  Lock
} from "lucide-react";
import Image from "next/image";
import { getBaseUrl } from "@/lib/api";
import Sidebar from "@/components/Sidebar";

interface UserProfile {
  name: string;
  email: string;
  profilePic?: string;
  joinedAt?: string;
}

interface ActivityItem {
  type: string;
  date: string;
  score?: number;
}

interface DashboardData {
  user: UserProfile;
  analytics: {
    xp: number;
    streak: number;
    badges: string;
    mockInterviewCount: number;
    codingRoundCount: number;
  };
  allActivity: ActivityItem[];
}

export default function ProfilePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const cachedData = localStorage.getItem("dashboard_cache");
    if (cachedData) {
      try {
        setData(JSON.parse(cachedData));
        setLoading(false);
      } catch (e) {}
    }

    fetch(`${getBaseUrl()}/api/user/dashboard`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(json => {
        setData(json);
        try {
          localStorage.setItem("dashboard_cache", JSON.stringify(json));
        } catch (e) {
          console.warn("Failed to cache dashboard data:", e);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const token = localStorage.getItem("token");
      
      try {
        const res = await fetch(`${getBaseUrl()}/api/user/update-profile`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ profilePic: base64String })
        });
        const updatedUser = await res.json();
        if (data) {
          setData({ ...data, user: updatedUser });
        }
        
        const storedUserString = localStorage.getItem("user");
        const storedUser = storedUserString ? JSON.parse(storedUserString) : {};
        try {
          localStorage.setItem("user", JSON.stringify({ ...storedUser, profilePic: base64String }));
        } catch (e) {
          console.warn("Failed to store updated user data:", e);
        }
      } catch (err) {
        console.error("Failed to upload photo", err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading && !data) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const generateHeatmapData = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const activityMap = new Map<number, number>();
    if (data?.allActivity) {
      data.allActivity.forEach((act) => {
        const actDate = new Date(act.date);
        actDate.setHours(0,0,0,0);
        const dateStr = actDate.getTime();
        activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
      });
    }

    const daysList: { count: number; opacity: number; date: string }[] = [];
    for (let i = 132; i >= 0; i--) {
      const d = new Date(today.getTime() - (i * 24 * 60 * 60 * 1000));
      const count = activityMap.get(d.getTime()) || 0;
      let opacity = 0.05;
      if (count > 0) opacity = 0.2 + Math.min(count * 0.15, 0.8);
      daysList.push({ count, opacity, date: d.toLocaleDateString() });
    }
    return daysList;
  };

  const heatmapDays = generateHeatmapData();

  // 🔧 FIX 2: Null score handling
  const formatScore = (score: number | null | undefined): string => {
    if (score === null || score === undefined || isNaN(Number(score))) return "—";
    return `${score}%`;
  };

  const getScoreColor = (score: number | null | undefined) => {
    if (score === null || score === undefined || isNaN(Number(score))) return "text-slate-400";
    if (score >= 70) return "text-emerald-600";
    if (score >= 40) return "text-amber-600";
    return "text-slate-400";
  };

  // ✨ IMPROVEMENT 2: Score Trend Indicator
  const getTrendPill = (score: number | null | undefined) => {
    if (score === null || score === undefined || isNaN(Number(score))) {
      return { text: "Pending", classes: "bg-slate-100 text-slate-500" };
    }
    if (score >= 70) return { text: "Strong", classes: "bg-emerald-100 text-emerald-700" };
    if (score >= 50) return { text: "Good", classes: "bg-amber-100 text-amber-700" };
    return { text: "Needs Work", classes: "bg-slate-100 text-slate-500" };
  };

  // ✨ IMPROVEMENT 3: Activity type icons
  const getActivityIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('interview')) return Bot;
    if (t.includes('resume')) return FileText;
    if (t.includes('aptitude')) return Brain;
    if (t.includes('coding')) return Code;
    if (t.includes('behavioral')) return MessageSquare;
    return Activity;
  };

  // 🔧 FIX 6: Dynamic Strategic Insight
  const generateInsight = (analytics?: DashboardData['analytics']) => {
    if (!analytics) return "";
    const interviews = analytics.mockInterviewCount || 0;
    const coding = analytics.codingRoundCount || 0;
    const xp = analytics.xp || 0;
    const level = Math.floor(xp / 500) + 1;
    
    if (interviews === 0 && coding === 0) {
      return "No sessions recorded yet. Complete your first mock interview or coding round to unlock personalized AI insights.";
    }
    if (coding > interviews) {
      return `Strong algorithmic focus detected with ${coding} coding rounds completed. Recommend balancing with behavioral interview practice to reach Tier-1 readiness.`;
    }
    if (interviews > 0) {
      return `${interviews} interview session${interviews > 1 ? 's' : ''} completed. Trajectory indicates Level ${level} proficiency. Consistent daily practice recommended for placement acceleration.`;
    }
    return `Level ${level} operative profile. XP accumulation rate suggests strong engagement. Keep the momentum going.`;
  };

  const lockedBadges = [
    { label: "First Interview", hint: "Complete your first mock interview" },
    { label: "Code Warrior", hint: "Complete 5 coding rounds" },
    { label: "Streak Master", hint: "Maintain a 7-day streak" },
    { label: "Top Scorer", hint: "Score 90%+ on any round" },
    { label: "Speed Coder", hint: "Complete DSA round in under 20 mins" },
    { label: "All Rounder", hint: "Complete all 5 interview types" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary selection:bg-primary/10 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="px-10 h-20 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-black tracking-tight text-text-primary">Agent Profile</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="px-5 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Level {data ? Math.floor((data.analytics.xp || 0) / 500) + 1 : 1} Operative
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 no-scrollbar scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-12 pb-20">
            
            {/* Profile Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="saas-card p-12 flex flex-col lg:flex-row items-center gap-16 relative overflow-hidden bg-white shadow-xl shadow-slate-200/50"
            >
              <div className="absolute top-0 right-0 p-12 opacity-[0.02]">
                 <Sparkles className="w-80 h-80 rotate-12" />
              </div>
              
              {/* ✨ IMPROVEMENT 5: Responsive Header Avatar */}
              <div className="relative group cursor-pointer shrink-0 overflow-visible">
                <div className="w-36 h-36 lg:w-52 lg:h-52 rounded-[48px] bg-slate-50 border-4 border-white shadow-2xl flex items-center justify-center text-6xl font-black overflow-hidden relative">
                  {data?.user?.profilePic ? (
                    <Image src={data.user.profilePic} alt="Profile" width={208} height={208} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary">{data?.user?.name?.[0] || "U"}</span>
                  )}
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
                    <Camera className="w-10 h-10 text-white mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Change Avatar</span>
                  </div>
                </div>
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handlePhotoUpload} disabled={uploading} accept="image/*" />
                {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-[48px] backdrop-blur-md z-20"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20" /></div>}
                
                {/* Streak badge on profile pic */}
                <div className="absolute -bottom-4 -right-4 bg-white border border-slate-100 rounded-3xl p-4 shadow-2xl flex items-center gap-3 group-hover:scale-110 transition-transform duration-500">
                   <Flame className="w-8 h-8 text-orange-500 fill-orange-500" />
                   <span className="text-3xl font-black tabular-nums tracking-tighter text-text-primary">{data?.analytics.streak || 0}</span>
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left space-y-8">
                <div>
                  {/* ✨ IMPROVEMENT 5: Responsive Header Name */}
                  <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-text-primary uppercase leading-none mb-6">
                    {data?.user?.name}
                  </h2>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 text-text-secondary font-bold text-xs">
                      <Mail className="w-4 h-4 text-primary" /> {data?.user?.email}
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 text-text-secondary font-bold text-xs">
                      {/* 🔧 FIX 5: Dynamic Join Date */}
                      <Calendar className="w-4 h-4 text-emerald-500" /> 
                      {data?.user?.joinedAt 
                        ? new Date(data.user.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : "Member"}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-16 pt-4 border-t border-slate-50">
                  <div className="space-y-2">
                     <div className="text-[10px] text-text-secondary uppercase font-black tracking-[0.2em]">Neural XP</div>
                     <div className="text-5xl font-black tabular-nums tracking-tighter text-primary">{data?.analytics.xp || 0}</div>
                  </div>
                  <div className="space-y-2">
                     <div className="text-[10px] text-text-secondary uppercase font-black tracking-[0.2em]">Interviews</div>
                     <div className="text-5xl font-black tabular-nums tracking-tighter text-text-primary">{data?.analytics.mockInterviewCount || 0}</div>
                  </div>
                  <div className="space-y-2 col-span-2 sm:col-span-1">
                     <div className="text-[10px] text-text-secondary uppercase font-black tracking-[0.2em]">Code Rounds</div>
                     <div className="text-5xl font-black tabular-nums tracking-tighter text-text-primary">{data?.analytics.codingRoundCount || 0}</div>
                     {/* ✨ IMPROVEMENT 4: Code Rounds CTA */}
                     {data?.analytics.codingRoundCount === 0 && (
                        <Link href="/coding" className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1 mt-1 justify-center lg:justify-start">
                          Start First Round <ChevronRight className="w-3 h-3" />
                        </Link>
                     )}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                
                {/* Contribution Heatmap */}
                <div className="saas-card p-12 space-y-10 bg-white shadow-xl shadow-slate-200/50">
                  <div className="flex items-center justify-between">
                     <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 text-text-primary"><History className="w-7 h-7 text-primary" /> Activity Pulse</h3>
                     <div className="text-[9px] font-black text-text-secondary uppercase tracking-[0.3em] bg-slate-50 px-4 py-2 rounded-full border border-slate-100">Last 19 Weeks</div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
                    <div className="grid grid-rows-7 grid-flow-col gap-2.5 min-w-max">
                      {heatmapDays.map((day, i) => (
                        <div 
                          key={i} 
                          className="w-5 h-5 rounded-lg transition-all hover:scale-150 cursor-help border border-slate-100 shadow-sm" 
                          style={{ backgroundColor: day.count > 0 ? `rgba(124, 58, 237, ${day.opacity})` : '#F1F5F9' }}
                          title={`${day.count} activities on ${day.date}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-text-secondary font-black uppercase tracking-[0.2em] pt-8 border-t border-slate-50">
                    <span>Neural Dormancy</span>
                    <div className="flex gap-2 items-center">
                      {[0.05, 0.25, 0.5, 0.75, 1].map((op, i) => (
                        <div key={i} className="w-4 h-4 rounded-md border border-slate-100" style={{ backgroundColor: `rgba(124, 58, 237, ${op})` }} />
                      ))}
                    </div>
                    <span>Peak Intensity</span>
                  </div>
                </div>

                {/* Performance Log */}
                <div className="saas-card p-12 space-y-10 bg-white shadow-xl shadow-slate-200/50 relative">
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 text-text-primary"><TrendingUp className="w-7 h-7 text-secondary" /> Assessment Logs</h3>
                  
                  {/* ✨ IMPROVEMENT 1: Responsive Assessment Log Max Height & Gradients */}
                  <div className="relative">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
                    
                    <div className="space-y-4 max-h-[600px] overflow-y-auto no-scrollbar scroll-smooth py-2">
                      {!data?.allActivity || data.allActivity.length === 0 ? (
                        <div className="py-24 text-center text-text-secondary font-black uppercase tracking-[0.3em] text-xs border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/50">No Records Synchronized</div>
                      ) : (
                        data.allActivity.map((act, i) => {
                          const ActIcon = getActivityIcon(act.type);
                          const trend = getTrendPill(act.score);
                          return (
                            // 🔧 FIX 1: Broken Assessment Log Layout on Small Windows
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              key={i} 
                              className="flex items-center gap-4 p-6 bg-slate-50/50 border border-slate-100 rounded-[32px] group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 min-w-0"
                            >
                               <div className="flex items-center gap-4 flex-1 min-w-0">
                                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                     <ActIcon className="w-7 h-7" />
                                  </div>
                                  <div className="min-w-0">
                                     <h4 className="font-black text-xl text-text-primary tracking-tight truncate">{act.type} Round</h4>
                                     <div className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mt-1 truncate">
                                       {new Date(act.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                     </div>
                                  </div>
                               </div>
                               <div className="shrink-0 text-right ml-auto flex flex-col items-end gap-1">
                                  {/* ✨ IMPROVEMENT 2: Score Trend Indicator */}
                                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${trend.classes}`}>
                                    {trend.text}
                                  </span>
                                  <div className={`text-3xl font-black tracking-tighter tabular-nums ${getScoreColor(act.score)}`}>
                                    {formatScore(act.score)}
                                  </div>
                                  <div className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Verified Score</div>
                               </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <button className="w-full p-6 rounded-[32px] border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-lg transition-all text-[11px] font-black uppercase tracking-[0.3em] text-text-secondary">View Full Assessment History</button>
                </div>
              </div>

              <div className="space-y-12">
                {/* Achievements */}
                <div className="saas-card p-10 space-y-10 bg-white shadow-xl shadow-slate-200/50">
                  <h3 className="text-xl font-black tracking-tight flex items-center gap-3 text-text-primary">
                    <Award className="w-6 h-6 text-amber-500" /> Neural Badges
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    {/* 🔧 FIX 4: Badges "Status: Locked" Fix */}
                    {(!data?.analytics.badges || JSON.parse(data.analytics.badges).length === 0) ? (
                      lockedBadges.map((badge, i) => (
                        <div key={i} className="group relative" title={badge.hint}>
                           <div className="aspect-square bg-slate-50 border border-slate-100 border-dashed opacity-60 rounded-3xl flex items-center justify-center shadow-sm hover:scale-110 transition-all duration-500">
                              <Lock className="w-6 h-6 text-slate-300" />
                           </div>
                           <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-text-primary text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-2xl">
                              {badge.label}
                           </div>
                        </div>
                      ))
                    ) : (
                      JSON.parse(data.analytics.badges).map((b: string) => (
                        <div key={b} className="group relative">
                           <div className="aspect-square bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-all duration-500 group-hover:bg-primary group-hover:border-primary group-hover:rotate-12 hover:shadow-xl hover:shadow-primary/20">
                              <Zap className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
                           </div>
                           <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-text-primary text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 shadow-2xl">
                              {b.replace('_', ' ')}
                           </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Domain Mastery */}
                <div className="saas-card p-10 space-y-10 bg-white shadow-xl shadow-slate-200/50">
                  <h3 className="text-xl font-black tracking-tight flex items-center gap-3 text-text-primary">
                    <Target className="w-6 h-6 text-secondary" /> Field Competency
                  </h3>
                  <div className="space-y-10">
                    {[
                      { label: "Technical Logic", val: Math.min((data?.analytics.mockInterviewCount || 0) * 15, 100), color: "bg-primary" },
                      { label: "Algorithmic Speed", val: Math.min((data?.analytics.codingRoundCount || 0) * 12, 100), color: "bg-amber-500" },
                      { label: "Soft Skill Mastery", val: 68, color: "bg-emerald-500" }
                    ].map((skill, i) => (
                      <div key={i} className="space-y-4">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">
                          <span>{skill.label}</span>
                          {/* 🔧 FIX 3: Field Competency Zero Bar Looks Broken */}
                          {skill.val > 0 && <span className="tabular-nums">{skill.val}%</span>}
                        </div>
                        {skill.val === 0 ? (
                          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black py-1">
                            No sessions recorded yet
                          </div>
                        ) : (
                          <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.val}%` }}
                              transition={{ duration: 1.5, delay: i * 0.1 }}
                              className={`h-full ${skill.color} rounded-full shadow-sm`} 
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Strategist Card */}
                <div className="saas-card p-10 border-2 border-dashed border-primary/20 bg-primary/5 relative overflow-hidden group">
                   <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                      <Bot className="w-48 h-56 rotate-[-15deg]" />
                   </div>
                   <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[0.3em]">
                         <Brain className="w-5 h-5" /> Strategic Insight
                      </div>
                      <p className="text-base text-text-secondary leading-relaxed italic border-l-4 border-primary/20 pl-6 py-2 font-medium">
                         {/* 🔧 FIX 6: Fully Hardcoded Strategic Insight */}
                         &quot;{data?.analytics ? generateInsight(data.analytics) : "Initializing neural analysis..."}&quot;
                      </p>
                      <button className="flex items-center gap-3 text-[11px] font-black text-primary uppercase tracking-[0.3em] group/btn hover:gap-5 transition-all">
                         Read Deep Analysis <ArrowRight className="w-5 h-5" />
                      </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
