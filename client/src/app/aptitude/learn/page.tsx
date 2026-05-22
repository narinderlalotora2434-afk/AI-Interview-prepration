"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  BookOpen, Clock, Target, ArrowRight, Play, CheckCircle2, 
  Brain, Sparkles, Database, ShieldCheck, Cpu
} from "lucide-react";
import { getBaseUrl } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import axios from "axios";

interface Topic {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  duration: string;
  progress: number;
  aiGenerated?: boolean;
  _count: {
    lessons: number;
    practiceQuestions: number;
  };
}

export default function AptitudeLearnDashboard() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTopics = async () => {
      try {
        const res = await axios.get(`${getBaseUrl()}/api/aptitude-learn/topics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTopics(res.data);
      } catch (err) {
        console.warn("Failed to load aptitude topics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-text-primary selection:bg-primary/10">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 overflow-y-auto p-6 md:p-12 relative no-scrollbar">
        
        {/* Dynamic Glowing Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <header className="mb-14 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center text-primary shadow-xl shadow-primary/5 border border-primary/10">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-800">AI Aptitude Arena</h1>
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
                 <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" /> 100% Dynamic AI Curriculum & Synthesis
              </p>
            </div>
          </div>

          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-md shadow-slate-100/50 flex items-center gap-3 shrink-0">
             <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">AI Synthesizer Active</span>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
             <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/10" />
             <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Loading topic archives...</span>
          </div>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {topics.map((topic, i) => (
              <motion.div 
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="h-full"
              >
                <Link href={`/aptitude/learn/${topic.slug}`}>
                  <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group h-full flex flex-col justify-between relative overflow-hidden">
                    
                    {/* Glowing side accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/[0.02] group-hover:bg-primary/[0.04] rounded-full blur-xl pointer-events-none transition-colors" />

                    <div>
                      {/* Top Metadata row */}
                      <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-text-secondary">
                          {topic.level}
                        </div>
                        
                        {/* Dynamic Caching Status Indicator */}
                        {topic.aiGenerated ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 text-[9px] font-black uppercase tracking-widest bg-emerald-50/50 border border-emerald-100/50 px-2 py-0.5 rounded-md">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" /> Cached
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-primary text-[9px] font-black uppercase tracking-widest bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-md animate-pulse">
                            <Cpu className="w-3 h-3 text-primary" /> AI Sync
                          </div>
                        )}
                      </div>

                      <h3 className="text-2xl font-black mb-3 group-hover:text-primary transition-colors tracking-tight text-slate-800 leading-snug">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-text-secondary font-medium leading-relaxed mb-6 block min-h-[48px]">
                        {topic.description}
                      </p>
                    </div>

                    <div className="space-y-5 pt-4 border-t border-slate-50">
                      {/* Lesson and practice counter */}
                      <div className="flex items-center justify-between text-[10px] font-black text-text-secondary uppercase tracking-widest">
                         <div className="flex items-center gap-1.5">
                           <Play className="w-4.5 h-4.5 text-primary" /> {topic._count.lessons > 0 ? `${topic._count.lessons} Lessons` : "Dynamic Roadmap"}
                         </div>
                         <div className="flex items-center gap-1.5">
                           <Target className="w-4.5 h-4.5 text-amber-500" /> {topic._count.practiceQuestions > 0 ? `${topic._count.practiceQuestions} Practice` : "AI Quiz"}
                         </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
                           <span className={topic.progress === 100 ? 'text-emerald-500' : 'text-slate-500'}>
                             {topic.progress === 100 ? 'Mastered' : 'Progress'}
                           </span>
                           <span className="text-primary">{topic.progress}%</span>
                        </div>
                        <div className="h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-0.5">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${topic.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                            style={{ width: `${topic.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {topic.progress === 100 && (
                      <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
