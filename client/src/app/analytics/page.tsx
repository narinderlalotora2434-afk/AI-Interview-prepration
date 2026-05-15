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
  Bell,
  Menu,
  ArrowRight,
  FileText,
  Sparkles
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
      backgroundColor: "#FFFFFF",
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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
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
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary flex overflow-hidden">
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <button 
               onClick={() => setMobileSidebarOpen(true)}
               className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
             >
               <Menu className="w-6 h-6" />
             </button>
             <div>
               <h1 className="text-2xl font-black tracking-tight text-text-primary">Performance Insights</h1>
               <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em]">Deep analytics of your DSA progress</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button 
               onClick={exportPDF}
               className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm"
             >
               <Download className="w-4 h-4 text-primary" /> Export Report
             </button>
          </div>
        </header>

        <div id="analytics-content" className="p-4 md:p-10 max-w-[1600px] mx-auto space-y-12 pb-20">
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: "Overall Score", value: `${Math.round(data?.avgScore || 0)}%`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/5" },
              { label: "DSA Accuracy", value: `${Math.round(data?.accuracy || 0)}%`, icon: Target, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Problems Solved", value: data?.codingRoundCount || 0, icon: Code, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Weekly XP", value: data?.xp || 0, icon: Zap, color: "text-secondary", bg: "bg-secondary/5" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="saas-card p-6 md:p-8 bg-white shadow-xl shadow-slate-200/50"
              >
                <div className="flex items-center gap-4 mb-4">
                   <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl border border-slate-100 flex items-center justify-center ${stat.bg}`}>
                      <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                   </div>
                   <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{stat.label}</span>
                </div>
                <div className="text-3xl md:text-4xl font-black text-text-primary tracking-tighter tabular-nums">{stat.value}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
            {/* Performance Radar */}
            <div className="lg:col-span-1 saas-card p-6 md:p-10 bg-white shadow-xl shadow-slate-200/50">
               <h2 className="text-xl font-black mb-10 flex items-center gap-3 text-text-primary">
                  <Brain className="w-7 h-7 text-primary" /> Topic Mastery
               </h2>
               <div className="h-[300px] md:h-[350px] w-full relative">
                 <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                   <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData.length > 0 ? radarData : [
                     { subject: "Arrays", A: 8, fullMark: 10 },
                     { subject: "Strings", A: 6, fullMark: 10 },
                     { subject: "DP", A: 4, fullMark: 10 },
                     { subject: "Trees", A: 7, fullMark: 10 },
                     { subject: "Graphs", A: 5, fullMark: 10 },
                   ]}>
                     <PolarGrid stroke="#E2E8F0" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748B", fontSize: 11, fontWeight: 700 }} />
                     <Radar
                       name="User"
                       dataKey="A"
                       stroke="#7C3AED"
                       fill="#7C3AED"
                       fillOpacity={0.15}
                       strokeWidth={3}
                     />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Progress Trend */}
            <div className="lg:col-span-2 saas-card p-6 md:p-10 bg-white shadow-xl shadow-slate-200/50">
               <h2 className="text-xl font-black mb-10 flex items-center gap-3 text-text-primary">
                  <BarChart2 className="w-7 h-7 text-secondary" /> Weekly Progress
               </h2>
               <div className="h-[300px] md:h-[350px] w-full relative">
                 <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#94A3B8" 
                        fontSize={12} 
                        fontWeight={600}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#94A3B8" 
                        fontSize={12} 
                        fontWeight={600}
                        axisLine={false}
                        tickLine={false}
                        dx={-10}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                        itemStyle={{ color: "#7C3AED", fontWeight: 800 }}
                        labelStyle={{ fontWeight: 800, color: "#0F172A", marginBottom: "4px" }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#7C3AED" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                      />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
             {/* Strength & Weakness */}
             <div className="space-y-8">
                <div className="saas-card p-10 border-l-[6px] border-l-emerald-500 bg-white shadow-xl shadow-slate-200/50">
                   <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-emerald-600">
                      <CheckCircle2 className="w-7 h-7" /> Elite Strengths
                   </h3>
                   <div className="flex flex-wrap gap-3">
                      {strongTopics.length > 0 ? strongTopics.map((t: string) => (
                        <span key={t} className="px-5 py-2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">{t}</span>
                      )) : <p className="text-sm text-text-secondary italic font-medium">Continue participating in assessments to identify your elite strengths.</p>}
                   </div>
                </div>
                <div className="saas-card p-10 border-l-[6px] border-l-rose-500 bg-white shadow-xl shadow-slate-200/50">
                   <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-rose-600">
                      <AlertCircle className="w-7 h-7" /> Focus Areas
                   </h3>
                   <div className="flex flex-wrap gap-3">
                      {weakTopics.length > 0 ? weakTopics.map((t: string) => (
                        <span key={t} className="px-5 py-2 rounded-full bg-rose-50 text-rose-700 text-[10px] font-black uppercase tracking-widest border border-rose-100 shadow-sm">{t}</span>
                      )) : <p className="text-sm text-text-secondary italic font-medium">Exceptional performance! No critical focus areas detected currently.</p>}
                   </div>
                </div>
             </div>

             {/* AI Personalized Roadmap */}
             <div className="saas-card p-10 bg-white shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                   <MapIcon className="w-64 h-64 rotate-12" />
                </div>
                <h3 className="text-2xl font-black mb-10 flex items-center gap-3 text-text-primary">
                   <Sparkles className="w-7 h-7 text-primary" /> Personalized AI Roadmap
                </h3>
                <div className="space-y-6 relative z-10">
                   {roadmap?.steps ? roadmap.steps.map((step: any, i: number) => (
                     <div key={i} className="flex items-start gap-6 p-6 rounded-[32px] bg-slate-50 border border-slate-100 group/item hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0 border border-primary/10">{i+1}</div>
                        <div className="flex-1">
                           <h4 className="font-black text-lg text-text-primary mb-1 tracking-tight">{step.topic}</h4>
                           <p className="text-sm text-text-secondary mb-4 font-medium leading-relaxed">Focus on: {step.resources.join(", ")}</p>
                           <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 group-hover/item:gap-4 transition-all">
                              Launch Module <ArrowRight className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                   )) : (
                     <div className="text-center py-16 bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                        <div className="w-20 h-20 rounded-[32px] bg-white border border-slate-100 flex items-center justify-center mx-auto mb-6 shadow-sm">
                           <Brain className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="text-base text-text-secondary font-black uppercase tracking-[0.2em] max-w-[250px] mx-auto leading-relaxed">Neural analysis pending. Complete more rounds to unlock.</p>
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
