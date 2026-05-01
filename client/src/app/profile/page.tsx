"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Bot, 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Code,
  Zap,
  Map as MapIcon,
  User,
  Flame,
  Trophy,
  History,
  Mail,
  Calendar,
  LogOut,
  ChevronRight,
  Target,
  Camera
} from "lucide-react";

export default function ProfilePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`https://ai-interview-prepration-2-nadp.onrender.com/api/user/dashboard`  , {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(json => setData(json))
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
        const res = await fetch(`https://ai-interview-prepration-2-nadp.onrender.com/api/user/update-profile`  , {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ profilePic: base64String })
        });
        const updatedUser = await res.json();
        setData((prev: any) => ({ ...prev, user: updatedUser }));
        
        // Update local storage too
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...storedUser, profilePic: base64String }));
      } catch (err) {
        console.error("Failed to upload photo", err);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Bot className="w-12 h-12 text-indigo-500 animate-bounce" />
    </div>
  );

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  
  // Generate real-time heatmap data based on allActivity
  const generateHeatmapData = () => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const activityMap = new Map();
    if (data?.allActivity) {
      data.allActivity.forEach((act: any) => {
        const actDate = new Date(act.date);
        actDate.setHours(0,0,0,0);
        const dateStr = actDate.getTime();
        activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
      });
    }

    const daysList = [];
    // 98 days (14 weeks) ending today
    for (let i = 97; i >= 0; i--) {
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
    <div className="min-h-screen bg-slate-950 flex">
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
          <Link href="/interview" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-colors">
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
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 bg-white/5 text-white rounded-xl font-medium">
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
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header Card */}
          <div className="glass-card p-10 mb-8 bg-gradient-to-r from-indigo-600/10 to-transparent flex flex-col md:flex-row items-center gap-10">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/10 shadow-2xl overflow-hidden">
                {data?.user?.profilePic ? (
                  <img src={data.user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.name?.[0]
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handlePhotoUpload}
                disabled={uploading}
                accept="image/*"
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-full">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-slate-400">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email}</div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined April 2024</div>
              </div>
              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-sm font-bold rounded-full border border-indigo-500/20">LEVEL {Math.floor((data?.analytics.xp || 0) / 100) + 1}</span>
                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm font-bold rounded-full border border-emerald-500/20">ELITE PREPPER</span>
              </div>
            </div>
            <div className="flex items-center gap-8 pr-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{data?.analytics.xp}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Total XP</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div className="text-center">
                <div className="flex items-center gap-2 text-orange-500">
                  <Flame className="w-6 h-6 fill-orange-500" />
                  <span className="text-3xl font-bold">{data?.analytics.streak}</span>
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Streak</div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Col: Heatmap & Stats */}
            <div className="lg:col-span-2 space-y-8">
              {/* Activity Heatmap (LeetCode Style) */}
              <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-400" />
                  Activity Heatmap
                </h3>
                <div className="flex gap-2">
                  <div className="grid grid-rows-7 grid-flow-col gap-1.5">
                    {heatmapDays.map((day, i) => (
                      <div 
                        key={i} 
                        className="w-3.5 h-3.5 rounded-sm transition-colors duration-300" 
                        style={{ backgroundColor: `rgba(99, 102, 241, ${day.opacity})` }}
                        title={`${day.count} activities on ${day.date}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-indigo-500/5" />
                    <div className="w-3 h-3 rounded-sm bg-indigo-500/20" />
                    <div className="w-3 h-3 rounded-sm bg-indigo-500/40" />
                    <div className="w-3 h-3 rounded-sm bg-indigo-500/70" />
                    <div className="w-3 h-3 rounded-sm bg-indigo-500" />
                  </div>
                  <span>More</span>
                </div>
              </div>

              {/* Detailed Performance History */}
              <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-6">Performance Timeline</h3>
                <div className="space-y-6">
                  {data?.allActivity.length === 0 ? (
                    <p className="text-slate-500 text-center py-10">No activity recorded yet.</p>
                  ) : (
                    data?.allActivity.map((act: any, i: number) => (
                      <div key={i} className="flex items-start gap-4 group">
                        <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500 ring-4 ring-indigo-500/10" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-slate-200">{act.type} Session</h4>
                            <span className="text-xs text-slate-500">{new Date(act.date).toLocaleDateString()}</span>
                          </div>
                          <div className="text-sm text-slate-400 mb-2">Completed with a score of <span className="text-indigo-400 font-bold">{act.score}%</span></div>
                          <button className="text-xs text-indigo-400 font-bold hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: Badges & Targets */}
            <div className="space-y-8">
              {/* Badges */}
              <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Unlocked Badges
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {JSON.parse(data?.analytics.badges || "[]").length === 0 ? (
                    <div className="col-span-3 text-center py-6 text-slate-600 text-sm italic">No badges yet...</div>
                  ) : (
                    JSON.parse(data?.analytics.badges || "[]").map((b: string) => (
                      <div key={b} className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-[8px] font-bold text-slate-500 uppercase text-center">{b.replace('_', ' ')}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Skills Radar / Summary */}
              <div className="glass-card p-8">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Preparation Focus
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Technical Interviews</span>
                      <span className="text-indigo-400 font-bold">{data?.analytics.mockInterviewCount * 10}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${data?.analytics.mockInterviewCount * 10}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Coding Rounds</span>
                      <span className="text-amber-400 font-bold">{data?.analytics.codingRoundCount * 10}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${data?.analytics.codingRoundCount * 10}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Behavioral Mastery</span>
                      <span className="text-purple-400 font-bold">45%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: '45%' }} />
                    </div>
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
