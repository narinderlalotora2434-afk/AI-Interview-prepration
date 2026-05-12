"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Award, 
  Brain, 
  Code, 
  BarChart2, 
  Download, 
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Map as MapIcon,
  Flame,
  Search,
  Bell
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { getBaseUrl } from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface AnalyticsData {
  mockInterviewCount: number;
  codingRoundCount: number;
  avgScore: number;
  totalCodingTime: number;
  accuracy: number;
  xp: number;
  streak: number;
  strongTopics: string; // JSON
  weakTopics: string; // JSON
  topicPerformance: string; // JSON
  roadmap?: string; // JSON
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${getBaseUrl()}/api/user/dashboard`, {
      headers: { "Authorization": `Bearer ${token}` },
    })
    .then(res => res.json())
    .then(json => {
      setData(json.analytics);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [router]);

  const exportPDF = async () => {
    const element = document.getElementById("analytics-content");
    if (!element) return;
    
    const canvas = await html2canvas(element, {
      backgroundColor: "#000",
      scale: 2
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("PrepAI_Performance_Report.pdf");
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const topicPerf = data?.topicPerformance ? JSON.parse(data.topicPerformance) : {};
  const radarData = Object.entries(topicPerf).map(([topic, score]) => ({
    subject: topic,
    A: score as number,
    fullMark: 10
  }));

  const strongTopics = data?.strongTopics ? JSON.parse(data.strongTopics) : [];
  const weakTopics = data?.weakTopics ? JSON.parse(data.weakTopics) : [];
  const roadmap = data?.roadmap ? JSON.parse(data.roadmap) : null;

  // Mock Trend Data
  const trendData = [
    { name: "Week 1", score: 65 },
    { name: "Week 2", score: 72 },
    { name: "Week 3", score: 68 },
    { name: "Week 4", score: 85 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <main className="flex-1 relative overflow-y-auto no-scrollbar">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-background/50 backdrop-blur-xl border-b border-border px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <h1 className="text-xl font-bold">DSA Analytics Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={exportPDF}
               className="btn-glass py-2 px-4 text-sm flex items-center gap-2"
             >
               <Download className="w-4 h-4" /> Export PDF
             </button>
             <ThemeToggle />
          </div>
        </header>

        <div id="analytics-content" className="p-8 max-w-[1400px] mx-auto space-y-8">
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Overall Score", value: `${Math.round(data?.avgScore || 0)}%`, icon: TrendingUp, color: "text-primary" },
              { label: "DSA Accuracy", value: `${Math.round(data?.accuracy || 0)}%`, icon: Target, color: "text-green-500" },
              { label: "Problems Solved", value: data?.codingRoundCount || 0, icon: Code, color: "text-amber-500" },
              { label: "Weekly XP", value: data?.xp || 0, icon: Zap, color: "text-accent-cyan" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center gap-4 mb-2">
                   <div className={`p-2 rounded-lg bg-secondary border border-border ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                   </div>
                   <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Performance Radar */}
            <div className="lg:col-span-1 glass-card p-8">
               <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" /> Topic Mastery
               </h2>
               <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData.length > 0 ? radarData : [
                     { subject: "Arrays", A: 8, fullMark: 10 },
                     { subject: "Strings", A: 6, fullMark: 10 },
                     { subject: "DP", A: 4, fullMark: 10 },
                     { subject: "Trees", A: 7, fullMark: 10 },
                     { subject: "Graphs", A: 5, fullMark: 10 },
                   ]}>
                     <PolarGrid stroke="#333" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: "#999", fontSize: 10 }} />
                     <Radar
                       name="User"
                       dataKey="A"
                       stroke="#7c3aed"
                       fill="#7c3aed"
                       fillOpacity={0.6}
                     />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Progress Trend */}
            <div className="lg:col-span-2 glass-card p-8">
               <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-accent-cyan" /> Weekly Progress
               </h2>
               <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "8px" }}
                        itemStyle={{ color: "#7c3aed" }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#7c3aed" fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
             {/* Strength & Weakness */}
             <div className="space-y-6">
                <div className="glass-card p-8 border-l-4 border-green-500">
                   <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-500">
                      <CheckCircle2 className="w-5 h-5" /> Strong Topics
                   </h3>
                   <div className="flex flex-wrap gap-2">
                      {strongTopics.length > 0 ? strongTopics.map((t: string) => (
                        <span key={t} className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20">{t}</span>
                      )) : <p className="text-sm text-muted-foreground italic">Keep practicing to discover your strengths!</p>}
                   </div>
                </div>
                <div className="glass-card p-8 border-l-4 border-rose-500">
                   <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-500">
                      <AlertCircle className="w-5 h-5" /> Weak Topics (Needs Focus)
                   </h3>
                   <div className="flex flex-wrap gap-2">
                      {weakTopics.length > 0 ? weakTopics.map((t: string) => (
                        <span key={t} className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold border border-rose-500/20">{t}</span>
                      )) : <p className="text-sm text-muted-foreground italic">Great job! No major weak areas detected.</p>}
                   </div>
                </div>
             </div>

             {/* AI Personalized Roadmap */}
             <div className="glass-card p-8 bg-gradient-to-br from-primary/5 to-transparent">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                   <MapIcon className="w-5 h-5 text-primary" /> Personalized AI Roadmap
                </h3>
                <div className="space-y-4">
                   {roadmap?.steps ? roadmap.steps.map((step: any, i: number) => (
                     <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-secondary border border-border group hover:border-primary/30 transition-all">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">{i+1}</div>
                        <div className="flex-1">
                           <h4 className="font-bold text-sm mb-1">{step.topic}</h4>
                           <p className="text-xs text-muted-foreground mb-3">Focus on: {step.resources.join(", ")}</p>
                           <button className="text-[10px] font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                              Start Module <ChevronRight className="w-3 h-3" />
                           </button>
                        </div>
                     </div>
                   )) : (
                     <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                           <Brain className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Complete more interviews to generate your roadmap!</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
