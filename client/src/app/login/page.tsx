"use client";

import { useState } from "react";
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
    } catch (err: any) {
      setError("Neural link failed. Verify server synchronization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] animate-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-cyan/10 rounded-full blur-[120px] animate-glow pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10 space-y-10"
      >
        <div className="text-center space-y-4">
           <Link href="/" className="inline-flex items-center gap-3 group mb-4">
             <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center group-hover:rotate-12 transition-all shadow-[0_0_30px_rgba(124,58,237,0.4)]">
               <Sparkles className="w-7 h-7 text-white" />
             </div>
             <span className="text-3xl font-bold tracking-tighter">PrepAI</span>
           </Link>
           <h1 className="text-4xl font-bold tracking-tight accent-gradient-text">Welcome Back</h1>
           <p className="text-slate-400 font-medium tracking-wide">Enter your neural keys to continue</p>
        </div>

        <div className="glass-card p-10 space-y-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <ShieldCheck className="w-32 h-32" />
           </div>

           {error && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold flex items-center gap-3"
             >
               <Zap className="w-4 h-4 shrink-0" />
               {error}
             </motion.div>
           )}

           <form onSubmit={handleLogin} className="space-y-6 relative z-10">
             <div className="space-y-3">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Authentication Email</label>
               <div className="relative group/input">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-primary transition-colors" />
                 <input
                   type="email"
                   required
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-primary/50 focus:bg-white/10 outline-none transition-all text-white font-medium"
                   placeholder="agent@prepai.io"
                 />
               </div>
             </div>

             <div className="space-y-3">
               <div className="flex justify-between items-center px-1">
                 <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Security Cipher</label>
                 <Link href="/forgot-password" title="Recover neural access" className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
                   Recover Key?
                 </Link>
               </div>
               <div className="relative group/input">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-primary transition-colors" />
                 <input
                   type="password"
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-primary/50 focus:bg-white/10 outline-none transition-all text-white font-medium"
                   placeholder="••••••••"
                 />
               </div>
             </div>

             <button
               type="submit"
               disabled={loading}
               className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all"
             >
               {loading ? (
                 <Loader2 className="w-6 h-6 animate-spin" />
               ) : (
                 <>
                   <span className="font-bold tracking-widest uppercase text-sm">Access Dashboard</span>
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </>
               )}
             </button>
           </form>
        </div>

        <p className="text-center text-sm text-muted-foreground font-medium">
          New Operative?{" "}
          <Link href="/signup" className="text-primary hover:text-primary/80 font-bold transition-colors">
            Initialize Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
