"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { getBaseUrl } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Auto-redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Authentication failed. Please verify credentials.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
      // Note: We don't set loading(false) here to keep the spinner while redirecting
    } catch (err: any) {
      setError("Neural link failed. Verify server synchronization.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary selection:bg-primary/10 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10 space-y-12"
      >
        <div className="text-center space-y-6">
           <Link href="/" className="inline-flex items-center gap-4 group mb-4">
             <div className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center group-hover:rotate-12 transition-all shadow-xl shadow-primary/20">
               <Sparkles className="w-8 h-8 text-white" />
             </div>
             <span className="text-4xl font-black tracking-tighter text-text-primary">PrepAI</span>
           </Link>
           <div className="space-y-3">
             <h1 className="text-5xl font-black tracking-tighter text-text-primary">Welcome Back</h1>
             <p className="text-text-secondary text-lg font-medium">Continue your journey to elite engineering roles.</p>
           </div>
        </div>

        <div className="saas-card p-12 space-y-10 relative overflow-hidden bg-white shadow-2xl shadow-slate-200/50">
           <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <ShieldCheck className="w-48 h-48 rotate-[-15deg]" />
           </div>

           {error && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-black flex items-center gap-4 shadow-sm"
             >
               <Zap className="w-5 h-5 shrink-0" />
               {error}
             </motion.div>
           )}

           <form onSubmit={handleLogin} className="space-y-8 relative z-10">
             <div className="space-y-4">
               <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] ml-1">Authentication Email</label>
               <div className="relative group/input">
                 <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-primary transition-colors" />
                 <input
                   type="email"
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 focus:border-primary/50 focus:bg-white focus:shadow-xl focus:shadow-primary/5 outline-none transition-all text-text-primary font-bold placeholder:text-slate-400 placeholder:font-medium"
                   placeholder="agent@prepai.io"
                 />
               </div>
             </div>

             <div className="space-y-4">
               <div className="flex justify-between items-center px-1">
                 <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Security Cipher</label>
                 <Link href="/forgot-password" title="Recover neural access" className="text-[10px] font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-[0.2em]">
                   Forgot Key?
                 </Link>
               </div>
               <div className="relative group/input">
                 <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-primary transition-colors" />
                 <input
                   type="password"
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 focus:border-primary/50 focus:bg-white focus:shadow-xl focus:shadow-primary/5 outline-none transition-all text-text-primary font-bold placeholder:text-slate-400 placeholder:font-medium"
                   placeholder="••••••••"
                 />
               </div>
             </div>

             <button
               type="submit"
               disabled={loading}
               className="w-full btn-primary py-5 rounded-[24px] flex items-center justify-center gap-4 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
             >
               {loading ? (
                 <Loader2 className="w-7 h-7 animate-spin" />
               ) : (
                 <>
                   <span className="font-black tracking-[0.2em] uppercase text-xs">Access Platform</span>
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </>
               )}
             </button>
           </form>
        </div>

        <p className="text-center text-sm text-text-secondary font-bold">
          New Operative?{" "}
          <Link href="/signup" className="text-primary hover:text-primary/80 font-black transition-all border-b-2 border-primary/20 hover:border-primary">
            Initialize New Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
