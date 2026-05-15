"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import { getBaseUrl } from "@/lib/api";
import Sidebar from "@/components/Sidebar";

interface UserProfile {
  name: string;
  email: string;
  profilePic?: string;
}

interface Activity {
  type: string;
  date: string;
  score: number;
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
  allActivity: Activity[];
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
              
              <div className="relative group cursor-pointer shrink-0">
                <div className="w-52 h-52 rounded-[48px] bg-slate-50 border-4 border-white shadow-2xl flex items-center justify-center text-6xl font-black overflow-hidden relative">
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
                  <h2 className="text-7xl font-black tracking-tighter text-text-primary uppercase leading-none mb-6">
                    {data?.user?.name}
                  </h2>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 text-text-secondary font-bold text-xs">
                      <Mail className="w-4 h-4 text-primary" /> {data?.user?.email}
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100 text-text-secondary font-bold text-xs">
                      <Calendar className="w-4 h-4 text-emerald-500" /> Joined April 2024
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
                <div className="saas-card p-12 space-y-10 bg-white shadow-xl shadow-slate-200/50">
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 text-text-primary"><TrendingUp className="w-7 h-7 text-secondary" /> Assessment Logs</h3>
                  <div className="space-y-4">
                    {!data?.allActivity || data.allActivity.length === 0 ? (
                      <div className="py-24 text-center text-text-secondary font-black uppercase tracking-[0.3em] text-xs border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/50">No Records Synchronized</div>
                    ) : (
                      data.allActivity.slice(0, 8).map((act, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={i} 
                          className="flex items-center justify-between p-8 bg-slate-50/50 border border-slate-100 rounded-[32px] group hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
                        >
                           <div className="flex items-center gap-8">
                              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                 {act.type.includes('Interview') ? <Bot className="w-7 h-7" /> : <Code className="w-7 h-7" />}
                              </div>
                              <div>
                                 <h4 className="font-black text-xl text-text-primary tracking-tight">{act.type} Round</h4>
                                 <div className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mt-1">{new Date(act.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-3xl font-black text-text-primary tracking-tighter tabular-nums">{act.score}%</div>
                              <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1">Verified Score</div>
                           </div>
                        </motion.div>
                      ))
                    )}
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
                    {(!data?.analytics.badges || JSON.parse(data.analytics.badges).length === 0) ? (
                      <div className="col-span-3 py-12 text-center text-text-secondary font-black uppercase text-[10px] tracking-[0.3em] bg-slate-50 rounded-3xl border border-slate-100">Status: Locked</div>
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
                          <span className="tabular-nums">{skill.val}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.val}%` }}
                            transition={{ duration: 1.5, delay: i * 0.1 }}
                            className={`h-full ${skill.color} rounded-full shadow-sm`} 
                          />
                        </div>
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
                         &quot;Candidate trajectory shows a <span className="text-primary font-black">22% efficiency gain</span> in algorithmic problem solving. High readiness for Tier-1 architecture roles.&quot;
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
