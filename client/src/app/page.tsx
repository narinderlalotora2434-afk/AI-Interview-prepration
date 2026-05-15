"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  FileText, 
  Code, 
  CheckCircle, 
  ArrowRight, 
  Star, 
  Zap,
  Mic,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Brain
} from "lucide-react";
import Navbar from "@/components/Navbar";

import { useState, useEffect } from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Performance Optimization: Prefetch dashboard data if logged in
    if (token) {
      import("@/lib/api").then(({ getBaseUrl }) => {
        fetch(`${getBaseUrl()}/api/user/dashboard`, {
          headers: { "Authorization": `Bearer ${token}` },
        })
          .then(res => res.ok ? res.json() : null)
          .then(data => {
            if (data) localStorage.setItem("dashboard_cache", JSON.stringify(data));
          })
          .catch(() => {});
      });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-text-primary overflow-hidden selection:bg-primary/10">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />
      
      <Navbar />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Side */}
            <motion.div 
              initial="initial"
              animate="animate"
              variants={{
                animate: { transition: { staggerChildren: 0.1 } }
              }}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Future of Interview Prep</span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-6xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-text-primary">
                Ace Your <span className="text-primary italic">Placements</span> with AI Mentor
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-xl text-text-secondary mb-12 leading-relaxed max-w-xl font-medium">
                Real-time technical feedback, ATS-optimized resume analysis, and realistic mock interviews tailored to your dream role. Used by students at top tech companies.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-16">
                {isLoggedIn ? (
                  <Link href="/dashboard" className="btn-primary flex items-center justify-center gap-3 group px-10 py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                    Access Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link href="/signup" className="btn-primary flex items-center justify-center gap-3 group px-10 py-4 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                    Get Started
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
                <Link href="/resume" className="flex items-center justify-center gap-3 px-10 py-4 text-sm font-black uppercase tracking-widest border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-text-secondary">
                  Analyze Resume
                </Link>
              </motion.div>
              
              {/* Quick Stats Badges */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-6 border-t border-slate-100 pt-10">
                <div className="flex flex-col gap-1">
                   <span className="text-2xl font-black text-text-primary tracking-tighter">95+</span>
                   <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">ATS Score Avg.</span>
                </div>
                <div className="w-[1px] h-10 bg-slate-100 hidden sm:block" />
                <div className="flex flex-col gap-1">
                   <span className="text-2xl font-black text-text-primary tracking-tighter">98%</span>
                   <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">User Confidence</span>
                </div>
                <div className="w-[1px] h-10 bg-slate-100 hidden sm:block" />
                <div className="flex flex-col gap-1">
                   <span className="text-2xl font-black text-text-primary tracking-tighter">10k+</span>
                   <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Successful Offers</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Premium AI Visuals */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square flex items-center justify-center">
                {/* Modern Decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl" />
                
                <div className="relative w-80 h-80 rounded-[48px] border border-slate-100 flex items-center justify-center bg-white shadow-2xl">
                  <div className="waveform flex items-center gap-1.5">
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-1.5 bg-primary rounded-full animate-pulse" 
                        style={{ 
                          height: isMounted ? `${Math.random() * 60 + 20}%` : "40%",
                          animationDuration: isMounted ? `${Math.random() * 0.5 + 0.5}s` : "1s",
                          opacity: isMounted ? Math.random() * 0.5 + 0.5 : 0.5
                        }} 
                      />
                    ))}
                  </div>
                  <div className="absolute -bottom-6 bg-white border border-slate-100 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-text-primary">AI ENGINE ACTIVE</span>
                  </div>
                </div>

                {/* Floating Analytics Cards */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -right-4 saas-card p-6 w-56 bg-white shadow-2xl border-slate-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-black text-text-secondary tracking-widest">Performance</span>
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-xl font-black mb-2 text-text-primary tracking-tight">High Accuracy</div>
                  <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%]" />
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-4 -left-12 saas-card p-6 w-56 bg-white shadow-2xl border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-black text-text-secondary tracking-widest">Skill Score</div>
                      <div className="text-xl font-black text-text-primary tracking-tight">92.4%</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6 bg-slate-50/50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="text-5xl font-black tracking-tighter mb-6 text-text-primary">Everything You Need <br /><span className="text-primary italic">To Succeed</span></h2>
              <p className="text-text-secondary max-w-2xl mx-auto font-medium">Our AI-driven platform covers every aspect of the interview process, from the first application to the final offer.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {[
                { 
                  icon: MessageSquare, 
                  title: "AI Mock Interviews", 
                  desc: "Practice with realistic, role-specific questions and get instant feedback on your performance.",
                  color: "text-primary",
                  bg: "bg-primary/5"
                },
                { 
                  icon: FileText, 
                  title: "ATS Resume Scorer", 
                  desc: "Upload your resume and get it scanned by our AI to ensure it passes through modern ATS systems.",
                  color: "text-emerald-500",
                  bg: "bg-emerald-50"
                },
                { 
                  icon: Code, 
                  title: "Coding Simulator", 
                  desc: "Solve technical challenges with a built-in compiler and get AI-assisted hints and optimizations.",
                  color: "text-amber-500",
                  bg: "bg-amber-50"
                }
              ].map((f, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -8 }}
                  className="saas-card p-10 bg-white shadow-xl hover:shadow-2xl transition-all border-slate-100 relative group"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 ${f.bg} transition-transform group-hover:scale-110`}>
                    <f.icon className={`w-7 h-7 ${f.color}`} />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-text-primary tracking-tight">{f.title}</h3>
                  <p className="text-text-secondary leading-relaxed mb-8 font-medium">{f.desc}</p>
                  <Link href="#" className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${f.color} hover:gap-3 transition-all`}>
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="saas-card p-16 lg:p-24 text-center bg-text-primary border-none shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -mr-48 -mt-48 blur-3xl group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full -ml-48 -mb-48 blur-3xl" />
              
              <h2 className="text-5xl lg:text-7xl font-black mb-8 text-white tracking-tighter relative z-10 leading-[0.9]">Ready to Land Your <br />Dream Job?</h2>
              <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium relative z-10">
                Join 10,000+ candidates who used PrepAI to ace their interviews at Google, Amazon, and Microsoft.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                {isLoggedIn ? (
                  <Link href="/dashboard" className="bg-white text-text-primary px-12 py-5 text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl">
                    Access My Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/signup" className="bg-white text-text-primary px-12 py-5 text-sm font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-2xl">
                      Get Started for Free
                    </Link>
                    <Link href="/login" className="px-12 py-5 text-sm font-black uppercase tracking-widest rounded-2xl border border-white/20 text-white hover:bg-white/5 transition-all">
                      Login to Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-slate-100 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-text-primary">PrepAI</span>
            </div>
            <p className="text-text-secondary max-w-xs font-medium leading-relaxed mb-8">
              Empowering the next generation of tech talent with AI-powered interview preparation and career optimization tools.
            </p>
            <div className="flex gap-6">
              {["Twitter", "GitHub", "LinkedIn"].map(s => (
                <Link key={s} href="#" className="text-text-secondary hover:text-primary transition-colors text-xs font-black uppercase tracking-widest">{s}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em] mb-8">Product</h4>
            <ul className="space-y-4">
              {["Mock Interviews", "Resume Scorer", "Coding Hub", "Career Path"].map(item => (
                <li key={item}><Link href="#" className="text-text-secondary hover:text-primary transition-colors text-sm font-medium">{item}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em] mb-8">Company</h4>
            <ul className="space-y-4">
              {["About Us", "Privacy Policy", "Terms of Service", "Contact"].map(item => (
                <li key={item}><Link href="#" className="text-text-secondary hover:text-primary transition-colors text-sm font-medium">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-100 mt-20 pt-10 text-center">
          <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.2em]">© 2026 PrepAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
