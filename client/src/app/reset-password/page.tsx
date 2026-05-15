"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, Loader2, Bot, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles, Zap } from "lucide-react";
import { getBaseUrl } from "@/lib/api";
import { motion } from "framer-motion";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Password Validation State
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    setValidations({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    });
  }, [password]);

  const allValid = Object.values(validations).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Reset token is missing from the URL.");
      return;
    }
    if (!allValid) {
      setError("Please meet all password requirements.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${getBaseUrl()}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-rose-100">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-text-primary mb-3 tracking-tight">Invalid Reset Link</h2>
        <p className="text-text-secondary mb-8 font-medium leading-relaxed">No reset token was found in the URL. Please request a new password reset link.</p>
        <Link href="/forgot-password" className="btn-primary py-4 px-10 rounded-2xl font-black uppercase tracking-[0.2em] inline-flex">Request New Link</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-8 space-y-8">
        <div className="w-24 h-24 bg-emerald-50 rounded-[40px] flex items-center justify-center mx-auto border border-emerald-100 shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
        </div>
        <div className="space-y-3">
          <h2 className="text-3xl font-black text-text-primary tracking-tighter">Security Updated</h2>
          <p className="text-text-secondary font-medium leading-relaxed">Your password has been reset successfully. You can now access your account with the new credentials.</p>
        </div>
        <Link href="/login" className="w-full btn-primary py-5 rounded-[24px] flex items-center justify-center gap-4 shadow-xl shadow-primary/20">
          <span className="font-black tracking-[0.2em] uppercase text-xs">Return to Login</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
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

      <div className="space-y-4">
        <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] ml-1">New Secure Password</label>
        <div className="relative group/input">
          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-primary transition-colors" />
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-14 focus:border-primary/50 focus:bg-white focus:shadow-xl focus:shadow-primary/5 outline-none transition-all text-text-primary font-bold placeholder:text-slate-400 placeholder:font-medium"
            placeholder="••••••••"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] ml-1">Confirm New Password</label>
        <div className="relative group/input">
          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-primary transition-colors" />
          <input
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-14 pr-6 focus:border-primary/50 focus:bg-white focus:shadow-xl focus:shadow-primary/5 outline-none transition-all text-text-primary font-bold placeholder:text-slate-400 placeholder:font-medium"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 space-y-4">
        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-4">Security Strength Requirements</p>
        <div className="space-y-3">
          <Requirement met={validations.length} text="Minimum 8 characters" />
          <Requirement met={validations.uppercase} text="Contains uppercase letter" />
          <Requirement met={validations.lowercase} text="Contains lowercase letter" />
          <Requirement met={validations.number} text="Contains numerical digit" />
          <Requirement met={validations.special} text="Contains special character" />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !allValid || password !== confirmPassword}
        className="w-full btn-primary py-5 rounded-[24px] flex items-center justify-center gap-4 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-7 h-7 animate-spin" />
        ) : (
          <>
            <span className="font-black tracking-[0.2em] uppercase text-xs">Reset Master Key</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}

function Requirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-3 text-xs font-bold">
      {met ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      ) : (
        <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
      )}
      <span className={met ? "text-text-primary" : "text-text-secondary opacity-60"}>{text}</span>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-text-primary selection:bg-primary/10 flex items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-accent" />
      <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg z-10 space-y-12">
        <div className="text-center space-y-6">
          <Link href="/" className="inline-flex items-center gap-4 group mb-4">
             <div className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center group-hover:rotate-12 transition-all shadow-xl shadow-primary/20">
               <Sparkles className="w-8 h-8 text-white" />
             </div>
             <span className="text-4xl font-black tracking-tighter text-text-primary">PrepAI</span>
          </Link>
          <div className="space-y-3">
            <h1 className="text-5xl font-black tracking-tighter text-text-primary">New Security Credentials</h1>
            <p className="text-text-secondary text-lg font-medium">Please define your new master key to regain platform access.</p>
          </div>
        </div>

        <div className="saas-card p-12 relative overflow-hidden bg-white shadow-2xl shadow-slate-200/50">
          <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
