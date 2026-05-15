"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, Sparkles, ShieldCheck, Key, ArrowLeft, Zap } from "lucide-react";
import { getBaseUrl } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Recovery request failed. Verify email status.");
        setLoading(false);
        return;
      }

      setMessage("Neural recovery key sent. Please check your inbox.");
    } catch {
      setError("Neural link failed. Verify server synchronization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary selection:bg-primary/10 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

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
             <h1 className="text-5xl font-black tracking-tighter text-text-primary">Password Recovery</h1>
             <p className="text-text-secondary text-lg font-medium">Request a secure reset link for your account.</p>
           </div>
        </div>

        <div className="saas-card p-12 space-y-10 relative overflow-hidden bg-white shadow-2xl shadow-slate-200/50">
           <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <Key className="w-48 h-48 rotate-[-15deg]" />
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

           {message && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="p-6 rounded-[32px] bg-emerald-50 border border-emerald-100 text-emerald-700 text-center space-y-4"
             >
                <ShieldCheck className="w-12 h-12 mx-auto" />
                <p className="font-black text-lg tracking-tight">{message}</p>
                <Link href="/login" className="inline-flex items-center gap-2 text-sm font-black text-emerald-800 hover:gap-3 transition-all">
                  Return to login <ArrowRight className="w-4 h-4" />
                </Link>
             </motion.div>
           )}

           {!message && (
             <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
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

               <button
                 type="submit"
                 disabled={loading}
                 className="w-full btn-primary py-5 rounded-[24px] flex items-center justify-center gap-4 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
               >
                 {loading ? (
                   <Loader2 className="w-7 h-7 animate-spin" />
                 ) : (
                   <>
                     <span className="font-black tracking-[0.2em] uppercase text-xs">Send Recovery Link</span>
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </button>
             </form>
           )}
        </div>

        <p className="text-center text-sm text-text-secondary font-bold">
          Remembered your credentials?{" "}
          <Link href="/login" className="text-primary hover:text-primary/80 font-black transition-all border-b-2 border-primary/20 hover:border-primary inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
