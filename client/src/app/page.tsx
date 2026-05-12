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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid z-0" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-glow" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-cyan/10 rounded-full blur-[100px] animate-glow" />

      <Navbar />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side */}
            <motion.div 
              initial="initial"
              animate="animate"
              variants={{
                animate: { transition: { staggerChildren: 0.1 } }
              }}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-accent-cyan text-sm font-medium mb-8 backdrop-blur-md">
                <Sparkles className="w-4 h-4" />
                <span>The Future of Interview Prep is Here</span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
                Ace Your Dream Placement with <span className="accent-gradient-text">AI-Powered</span> Interviews
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
                Get real-time feedback, ATS-optimized resume analysis, and realistic mock interviews tailored to your dream role. Used by students at top tech companies.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/signup" className="btn-primary flex items-center justify-center gap-3 group">
                  Start Mock Interview
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/resume" className="btn-glass flex items-center justify-center gap-3">
                  Analyze Resume
                </Link>
              </motion.div>
              
              {/* Quick Stats Badges */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-muted-foreground">ATS Score: 95+</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border backdrop-blur-sm">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Confidence: 98%</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary border border-border backdrop-blur-sm">
                  <ShieldCheck className="w-4 h-4 text-accent-cyan" />
                  <span className="text-sm font-medium text-muted-foreground">Comm. Rating: Expert</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Animated AI Visuals */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square flex items-center justify-center">
                {/* AI Orb */}
                <div className="absolute w-[300px] h-[300px] bg-primary/30 rounded-full blur-[60px] animate-pulse" />
                <div className="relative w-64 h-64 rounded-full border-2 border-border flex items-center justify-center bg-secondary backdrop-blur-3xl shadow-[0_0_50px_rgba(124,58,237,0.3)]">
                  <div className="waveform">
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i} 
                        className="waveform-bar" 
                        style={{ animationDelay: `${i * 0.1}s` }} 
                      />
                    ))}
                  </div>
                  <div className="absolute -bottom-8 bg-white/10 border border-border px-4 py-2 rounded-full backdrop-blur-md flex items-center gap-2">
                    <Mic className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold tracking-widest uppercase">Listening...</span>
                  </div>
                </div>

                {/* Floating Analytics Cards */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 right-0 glass-card p-4 w-48"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">Performance</span>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  </div>
                  <div className="text-xl font-bold mb-1">High Accuracy</div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%]" />
                  </div>
                </motion.div>

                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-10 -left-10 glass-card p-4 w-48"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-cyan/20 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-accent-cyan" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-muted-foreground">Skill Score</div>
                      <div className="text-lg font-bold">92%</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Our AI-driven platform covers every aspect of the interview process, from the first application to the final offer.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { 
                  icon: MessageSquare, 
                  title: "AI Mock Interviews", 
                  desc: "Practice with realistic, role-specific questions and get instant feedback on your performance.",
                  color: "from-primary/20 to-transparent"
                },
                { 
                  icon: FileText, 
                  title: "ATS Resume Scorer", 
                  desc: "Upload your resume and get it scanned by our AI to ensure it passes through modern ATS systems.",
                  color: "from-accent-cyan/20 to-transparent"
                },
                { 
                  icon: Code, 
                  title: "Coding Simulator", 
                  desc: "Solve technical challenges with a built-in compiler and get AI-assisted hints and optimizations.",
                  color: "from-accent-pink/20 to-transparent"
                }
              ].map((f, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ y: -5 }}
                  className={`glass-card p-8 border-l-4 border-l-primary/50 relative overflow-hidden group`}
                >
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-6 border border-border group-hover:bg-primary/20 transition-colors">
                      <f.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">{f.desc}</p>
                    <Link href="#" className="flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative glass-card p-12 lg:p-20 text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-accent-cyan/10 -z-10" />
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join 10,000+ candidates who used PrepAI to ace their interviews at Google, Amazon, and Microsoft.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup" className="btn-primary px-10 py-4 text-lg">
                  Get Started for Free
                </Link>
                <Link href="/login" className="btn-glass px-10 py-4 text-lg">
                  Login to Account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">PrepAI</span>
          </div>
          <div className="text-muted-foreground text-sm">
            © 2026 PrepAI. All rights reserved.
          </div>
          <div className="flex gap-6">
            {["Twitter", "GitHub", "LinkedIn"].map(s => (
              <Link key={s} href="#" className="text-muted-foreground hover:text-white transition-colors text-sm font-medium">{s}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
