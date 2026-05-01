"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  BookOpen,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp,
  Target,
  PlayCircle
} from "lucide-react";

export default function BranchRoadmapPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [branch, setBranch] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("roadmaps");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!slug) return;

    Promise.all([
      fetch(`http://localhost:5000/api/roadmaps/branches/${slug}`, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => res.json()),
      // We will fetch progress after we get the branchId to avoid complex nested fetches
    ])
      .then(([branchData]) => {
        if (branchData.error) throw new Error(branchData.error);
        setBranch(branchData);
        
        // Expand first module of first roadmap by default
        if (branchData.roadmaps?.[0]?.modules?.[0]) {
          setExpandedModules({ [branchData.roadmaps[0].modules[0].id]: true });
        }

        return fetch(`http://localhost:5000/api/roadmaps/progress/${branchData.id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        }).then(res => res.json());
      })
      .then(progressData => {
        setProgress(progressData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug, router]);

  const toggleTopicProgress = async (topicId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    const token = localStorage.getItem("token");
    
    // Optimistic update
    setProgress(prev => {
      const existing = prev.find(p => p.topicId === topicId);
      if (existing) {
        return prev.map(p => p.topicId === topicId ? { ...p, status: newStatus } : p);
      }
      return [...prev, { topicId, status: newStatus }];
    });

    try {
      await fetch("http://localhost:5000/api/roadmaps/progress", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ topicId, status: newStatus })
      });
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  const isTopicCompleted = (topicId: string) => {
    return progress.find(p => p.topicId === topicId)?.status === 'Completed';
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col pt-32 px-10">
        <div className="w-32 h-8 bg-white/5 rounded animate-pulse mb-8" />
        <div className="w-1/2 h-12 bg-white/5 rounded animate-pulse mb-4" />
        <div className="w-1/3 h-6 bg-white/5 rounded animate-pulse mb-12" />
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="w-full h-24 bg-white/5 rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!branch) {
    return <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white">Branch not found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 pt-8 pb-4 px-6 md:px-12">
        <Link href="/roadmaps" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to All Branches
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">{branch.name}</h1>
            <p className="text-lg text-slate-400 max-w-2xl">{branch.description}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center min-w-[120px]">
              <div className="text-xl font-bold text-emerald-400">{branch.salaryRange}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Avg Package</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center min-w-[120px]">
              <div className="text-xl font-bold text-amber-400">{branch.difficulty}</div>
              <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Difficulty</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-white/10">
          <button 
            onClick={() => setActiveTab("roadmaps")}
            className={`pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative ${activeTab === 'roadmaps' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Preparation Roadmaps
            {activeTab === 'roadmaps' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
          </button>
          <button 
            onClick={() => setActiveTab("companies")}
            className={`pb-4 text-sm font-bold tracking-wide uppercase transition-colors relative ${activeTab === 'companies' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Company Tracks
            {activeTab === 'companies' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        
        {activeTab === "roadmaps" && (
          <div className="space-y-16">
            {branch.roadmaps.length === 0 ? (
              <div className="text-center py-20 text-slate-500">No roadmaps available yet.</div>
            ) : branch.roadmaps.map((roadmap: any) => (
              <div key={roadmap.id} className="relative">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Layers className="w-6 h-6 text-indigo-500" />
                    {roadmap.title}
                  </h2>
                  <p className="text-slate-400 mt-2">{roadmap.description}</p>
                </div>

                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/20 before:via-purple-500/20 before:to-transparent">
                  {roadmap.modules.map((mod: any, index: number) => {
                    const isExpanded = expandedModules[mod.id];
                    const completedTopics = mod.topics.filter((t: any) => isTopicCompleted(t.id)).length;
                    const isModuleDone = completedTopics === mod.topics.length && mod.topics.length > 0;

                    return (
                      <div key={mod.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Timeline Node */}
                        <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-slate-950 bg-slate-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                          <div className={`w-3 h-3 rounded-full ${isModuleDone ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-indigo-500'}`} />
                        </div>
                        
                        {/* Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] glass-card border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:border-indigo-500/30">
                          {/* Module Header */}
                          <div 
                            className="p-6 cursor-pointer flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.04]"
                            onClick={() => toggleModule(mod.id)}
                          >
                            <div>
                              <div className="text-indigo-400 font-mono text-xs mb-1">MODULE {index + 1}</div>
                              <h3 className="text-lg font-bold text-white">{mod.title}</h3>
                              <div className="text-sm text-slate-500 mt-1">
                                {completedTopics} of {mod.topics.length} topics completed
                              </div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400">
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </div>
                          </div>

                          {/* Module Topics */}
                          {isExpanded && (
                            <div className="border-t border-white/5 bg-slate-950/50 p-4 space-y-2">
                              {mod.topics.length === 0 ? (
                                <p className="text-slate-500 text-sm p-2">Topics coming soon.</p>
                              ) : mod.topics.map((topic: any) => {
                                const completed = isTopicCompleted(topic.id);
                                return (
                                  <div key={topic.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors group/topic">
                                    <div className="flex gap-4">
                                      <button 
                                        onClick={() => toggleTopicProgress(topic.id, completed ? 'Completed' : 'Pending')}
                                        className="shrink-0 mt-0.5 text-slate-500 hover:text-emerald-400 transition-colors"
                                      >
                                        {completed ? <CheckCircle2 className="w-6 h-6 text-emerald-500" /> : <Circle className="w-6 h-6" />}
                                      </button>
                                      <div>
                                        <h4 className={`font-bold transition-colors ${completed ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-200 group-hover/topic:text-indigo-300'}`}>
                                          {topic.title}
                                        </h4>
                                        <p className="text-sm text-slate-500 mt-1 leading-relaxed">{topic.description}</p>
                                        
                                        {/* Optional Learning Resources */}
                                        {topic.resources?.length > 0 && !completed && (
                                          <div className="mt-4 flex flex-wrap gap-2">
                                            {topic.resources.map((res: any, idx: number) => (
                                              <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-indigo-500/20 text-xs font-medium text-slate-300 hover:text-indigo-300 border border-white/10 rounded-lg transition-colors">
                                                {res.type === 'Video' ? <PlayCircle className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                                                {res.title}
                                              </a>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "companies" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {branch.roadmaps.flatMap((r: any) => r.companyTracks).length === 0 ? (
              <div className="col-span-full text-center py-20 text-slate-500">No company tracks available yet.</div>
            ) : branch.roadmaps.flatMap((r: any) => r.companyTracks).map((track: any) => (
              <div key={track.id} className="glass-card p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-indigo-500" />
                    {track.companyName}
                  </h3>
                </div>

                <div className="mb-6">
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-500" /> Key Focus Areas
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {JSON.parse(track.topics).map((t: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm">{t}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Interview Rounds</div>
                  <div className="space-y-3">
                    {JSON.parse(track.interviewRounds).map((round: string, i: number) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-6 h-6 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold border border-indigo-500/30 shrink-0">
                          {i + 1}
                        </div>
                        <span className="text-slate-300 text-sm mt-0.5">{round}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
