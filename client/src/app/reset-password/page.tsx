"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, Loader2, Bot, CheckCircle2, AlertCircle, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

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
      const res = await fetch("https://ai-interview-prepration-2-nadp.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Invalid Reset Link</h2>
        <p className="text-slate-400 mb-6">No reset token was found in the URL. Please request a new password reset link.</p>
        <Link href="/forgot-password" className="btn-primary py-2 px-6 inline-flex">Request New Link</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center animate-in zoom-in-95">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful!</h2>
        <p className="text-slate-400 mb-8">Your password has been changed successfully. You can now log in with your new password.</p>
        <Link href="/login" className="btn-primary py-3 px-8 inline-flex items-center gap-2 shadow-lg shadow-indigo-500/25">
          Go to Login <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-in fade-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">New Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-11 focus:border-indigo-500 outline-none transition-colors text-white"
            placeholder="••••••••"
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
          <input
            type={showPassword ? "text" : "password"}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 focus:border-indigo-500 outline-none transition-colors text-white"
            placeholder="••••••••"
          />
        </div>
      </div>

      {/* Password Requirements */}
      <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Password Requirements</p>
        <Requirement met={validations.length} text="At least 8 characters long" />
        <Requirement met={validations.uppercase} text="Contains uppercase letter" />
        <Requirement met={validations.lowercase} text="Contains lowercase letter" />
        <Requirement met={validations.number} text="Contains a number" />
        <Requirement met={validations.special} text="Contains a special character" />
      </div>

      <button
        type="submit"
        disabled={loading || !allValid || password !== confirmPassword}
        className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-bold shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Reset Password"
        )}
      </button>
    </form>
  );
}

function Requirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      ) : (
        <div className="w-4 h-4 rounded-full border border-slate-600" />
      )}
      <span className={met ? "text-slate-300" : "text-slate-500"}>{text}</span>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-300 font-sans">
      <Link href="/" className="flex items-center gap-2 mb-12 group">
        <div className="bg-indigo-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">PrepAI</span>
      </Link>

      <div className="w-full max-w-md glass-card p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
        
        <h1 className="text-3xl font-bold mb-2 text-white">Create New Password</h1>
        <p className="text-slate-400 mb-8">Please enter and confirm your new password below to regain access.</p>

        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
