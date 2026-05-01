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
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  LogOut,
  Trophy,
  BrainCircuit,
  Star,
  User
} from "lucide-react";

export default function QuestsPage() {
  const [challenges, setChallenges] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}'}`}/api/challenges/daily` , {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("token");
            router.push("/login");
          }
          throw new Error("Failed to fetch challenges");
        }
        return res.json();
      })
      .then(data => setChallenges(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Bot className="w-12 h-12 text-indigo-500 animate-bounce" />
    </div>
  );

  if (!challenges || challenges.error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Bot className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error Loading Quests</h2>
        <p className="text-slate-400 mb-6">{challenges?.error || "We couldn't load your daily quests."}</p>
        <button onClick={() => window.location.reload()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  const codingProblem = challenges?.codingProblem ? JSON.parse(challenges.codingProblem) : null;

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
          <Link href="/quests" className="flex items-center gap-3 px-4 py-3 bg-white/5 text-white rounded-xl font-medium">
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
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-amber-400 font-bold mb-4">
            <Calendar className="w-5 h-5" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Daily Quest Board</h1>
          <p className="text-slate-400 text-lg">Complete today's missions to earn <span className="text-indigo-400 font-bold">Bonus XP</span> and maintain your streak.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mission 1: Coding */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8 border-l-4 border-l-indigo-500 overflow-hidden relative group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
              <div className="flex justify-between items-start mb-6">
                <div className="px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20">MISSION 01: CODING</div>
                <div className="flex items-center gap-1 text-slate-500 text-sm"><Clock className="w-4 h-4" /> 20-30 mins</div>
              </div>
              <h2 className="text-2xl font-bold mb-4">{codingProblem?.title}</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                {codingProblem?.description}
              </p>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-xs font-bold">
                    <Star className="w-3 h-3 fill-amber-500" /> +30 XP
                  </div>
                  <div className="text-xs text-slate-500">Medium Difficulty</div>
                </div>
                <Link href="/coding" className="btn-primary py-2 px-6 text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                  Launch Solver <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Mission 2 & 3 */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Tech Question */}
              <div className="glass-card p-8 border-l-4 border-l-emerald-500 group">
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 inline-block mb-6">MISSION 02: THEORY</div>
                <h3 className="text-xl font-bold mb-4">Technical Challenge</h3>
                <p className="text-slate-400 mb-8 text-sm line-clamp-3 italic">
                  "{challenges?.techQuestion}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">+15 XP</span>
                  <Link href="/interview" className="text-sm font-bold text-slate-300 hover:text-white flex items-center gap-2">
                    Start Prep <ArrowRight className="w-4 h-4 text-emerald-500" />
                  </Link>
                </div>
              </div>

              {/* Behavioral */}
              <div className="glass-card p-8 border-l-4 border-l-purple-500 group">
                <div className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-bold rounded-full border border-purple-500/20 inline-block mb-6">MISSION 03: SOFT SKILLS</div>
                <h3 className="text-xl font-bold mb-4">Behavioral Deep-Dive</h3>
                <p className="text-slate-400 mb-8 text-sm line-clamp-3 italic">
                  "{challenges?.behavioralQuestion}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400">+15 XP</span>
                  <Link href="/interview" className="text-sm font-bold text-slate-300 hover:text-white flex items-center gap-2">
                    Start Prep <ArrowRight className="w-4 h-4 text-purple-500" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Stats */}
          <div className="space-y-8">
            <div className="glass-card p-8 bg-gradient-to-br from-indigo-600/10 to-transparent">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Quest Progress
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center text-slate-500 font-bold">1</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">Coding Mission</div>
                    <div className="text-xs text-slate-500">Incomplete</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center text-slate-500 font-bold">2</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">Technical Concept</div>
                    <div className="text-xs text-slate-500">Incomplete</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border-2 border-white/10 flex items-center justify-center text-slate-500 font-bold">3</div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">Behavioral Mastery</div>
                    <div className="text-xs text-slate-500">Incomplete</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 p-6 bg-white/5 rounded-2xl border border-white/10 text-center">
                <div className="text-3xl font-bold mb-1 text-indigo-400">0/3</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Completed Missions</div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                AI Strategy
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                "Today's challenges focus on system efficiency and conflict resolution. Completing all three will optimize your performance score by up to 12%."
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
