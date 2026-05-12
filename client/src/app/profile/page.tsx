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
  Bot
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
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-full max-w-4xl h-96 bg-primary/10 blur-[150px] pointer-events-none" />

      <div className="flex relative z-10">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="px-8 h-20 border-b border-border flex items-center justify-between bg-background/50 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-muted-foreground hover:text-white">
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-bold tracking-tight">Agent Profile</h1>
            </div>
            <div className="flex items-center gap-6">
               <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest hidden sm:block">
                  Level {data ? Math.floor((data.analytics.xp || 0) / 500) + 1 : 1} Operative
               </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-10 pb-20">
              
              {/* Profile Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-10 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Sparkles className="w-64 h-64" />
                </div>
                
                <div className="relative group cursor-pointer shrink-0">
                  <div className="w-44 h-44 rounded-[40px] bg-secondary border border-border flex items-center justify-center text-5xl font-bold overflow-hidden shadow-2xl relative">
                    {data?.user?.profilePic ? (
                      <Image src={data.user.profilePic} alt="Profile" width={176} height={176} className="w-full h-full object-cover" />
                    ) : (
                      data?.user?.name?.[0] || "U"
                    )}
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <Camera className="w-10 h-10 text-white mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Update Photo</span>
                    </div>
                  </div>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePhotoUpload} disabled={uploading} accept="image/*" />
                  {uploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-[40px] backdrop-blur-md"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}
                  
                  {/* Streak badge on profile pic */}
                  <div className="absolute -bottom-4 -right-4 bg-[#0B1120] border border-border rounded-2xl p-3 shadow-2xl flex items-center gap-2 group-hover:scale-110 transition-transform">
                     <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                     <span className="text-xl font-bold tabular-nums">{data?.analytics.streak || 0}</span>
                  </div>
                </div>

                <div className="flex-1 text-center lg:text-left space-y-6">
                  <div>
                    <h2 className="text-5xl font-bold tracking-tighter mb-4 accent-gradient-text uppercase">{data?.user?.name}</h2>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px]">
                      <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-lg border border-border"><Mail className="w-4 h-4 text-primary" /> {data?.user?.email}</div>
                      <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-lg border border-border"><Calendar className="w-4 h-4 text-accent-cyan" /> Joined Q2 2024</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center lg:justify-start gap-12 pt-4">
                    <div className="space-y-1">
                       <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Neural XP</div>
                       <div className="text-3xl font-bold tabular-nums">{data?.analytics.xp || 0}</div>
                    </div>
                    <div className="w-px h-12 bg-secondary hidden sm:block" />
                    <div className="space-y-1">
                       <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Interviews</div>
                       <div className="text-3xl font-bold tabular-nums">{data?.analytics.mockInterviewCount || 0}</div>
                    </div>
                    <div className="w-px h-12 bg-secondary hidden sm:block" />
                    <div className="space-y-1">
                       <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Code Rounds</div>
                       <div className="text-3xl font-bold tabular-nums">{data?.analytics.codingRoundCount || 0}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                  
                  {/* Contribution Heatmap */}
                  <div className="glass-card p-10 space-y-8">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-bold flex items-center gap-3"><History className="w-6 h-6 text-primary" /> Activity Pulse</h3>
                       <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Last 19 Weeks</div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-none">
                      <div className="grid grid-rows-7 grid-flow-col gap-2 min-w-max">
                        {heatmapDays.map((day, i) => (
                          <div 
                            key={i} 
                            className="w-4.5 h-4.5 rounded-md transition-all hover:scale-150 cursor-help border border-white/[0.03]" 
                            style={{ backgroundColor: day.count > 0 ? `rgba(124, 58, 237, ${day.opacity})` : 'rgba(255,255,255,0.03)' }}
                            title={`${day.count} activities on ${day.date}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest pt-4 border-t border-border">
                      <span>Neural Dormancy</span>
                      <div className="flex gap-2 items-center">
                        {[0.05, 0.25, 0.5, 0.75, 1].map((op, i) => (
                          <div key={i} className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: `rgba(124, 58, 237, ${op})` }} />
                        ))}
                      </div>
                      <span>Peak Activity</span>
                    </div>
                  </div>

                  {/* Performance Log */}
                  <div className="glass-card p-10 space-y-8">
                    <h3 className="text-xl font-bold flex items-center gap-3"><TrendingUp className="w-6 h-6 text-accent-cyan" /> Assessment Logs</h3>
                    <div className="space-y-4">
                      {!data?.allActivity || data.allActivity.length === 0 ? (
                        <div className="py-20 text-center text-muted-foreground font-bold uppercase tracking-widest text-xs border-2 border-dashed border-border rounded-3xl">No Records Synchronized</div>
                      ) : (
                        data.allActivity.slice(0, 8).map((act, i) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={i} 
                            className="flex items-center justify-between p-6 bg-secondary border border-border rounded-2xl group hover:bg-white/[0.07] transition-all"
                          >
                             <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                   {act.type.includes('Interview') ? <Bot className="w-6 h-6" /> : <Code className="w-6 h-6" />}
                                </div>
                                <div>
                                   <h4 className="font-bold text-lg">{act.type} Round</h4>
                                   <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(act.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                                </div>
                             </div>
                             <div className="text-right">
                                <div className="text-2xl font-bold accent-gradient-text tabular-nums">{act.score}%</div>
                                <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Certified</div>
                             </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                    <button className="w-full btn-glass py-4 text-[10px] font-bold uppercase tracking-[0.2em]">Synchronize Full History</button>
                  </div>
                </div>

                <div className="space-y-10">
                  {/* Achievements */}
                  <div className="glass-card p-8 space-y-8">
                    <h3 className="text-lg font-bold flex items-center gap-3">
                      <Award className="w-5 h-5 text-amber-500" /> Neural Badges
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {(!data?.analytics.badges || JSON.parse(data.analytics.badges).length === 0) ? (
                        <div className="col-span-3 py-10 text-center text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Locked</div>
                      ) : (
                        JSON.parse(data.analytics.badges).map((b: string) => (
                          <div key={b} className="group relative">
                             <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/20 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-500 group-hover:shadow-primary/20 group-hover:rotate-12">
                                <Zap className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
                             </div>
                             <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0B1120] border border-border px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
                                {b.replace('_', ' ')}
                             </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Domain Mastery */}
                  <div className="glass-card p-8 space-y-8">
                    <h3 className="text-lg font-bold flex items-center gap-3">
                      <Target className="w-5 h-5 text-accent-cyan" /> Field Competency
                    </h3>
                    <div className="space-y-8">
                      {[
                        { label: "Technical Logic", val: Math.min((data?.analytics.mockInterviewCount || 0) * 15, 100), color: "from-primary to-purple-600" },
                        { label: "Algorithmic Speed", val: Math.min((data?.analytics.codingRoundCount || 0) * 12, 100), color: "from-amber-500 to-orange-500" },
                        { label: "Neural Aptitude", val: 68, color: "from-accent-cyan to-blue-500" }
                      ].map((skill, i) => (
                        <div key={i} className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-muted-foreground">{skill.label}</span>
                            <span className="text-white tabular-nums">{skill.val}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden border border-border">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.val}%` }}
                              transition={{ duration: 1.5, delay: i * 0.1 }}
                              className={`h-full bg-gradient-to-r ${skill.color} rounded-full`} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AI Strategist Card */}
                  <div className="glass-card p-8 border-dashed border-2 border-primary/20 bg-primary/5 relative overflow-hidden group">
                     <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-20 transition-opacity">
                        <Bot className="w-40 h-48" />
                     </div>
                     <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                           <Brain className="w-4 h-4" /> AI Evaluation
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/50 pl-4">
                           &quot;Agent performance shows a <span className="text-white font-bold">22% increase</span> in algorithmic efficiency. Recommend targeting Tier-1 system design roles for maximum impact.&quot;
                        </p>
                        <button className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] group/btn">
                           Full Analysis <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
