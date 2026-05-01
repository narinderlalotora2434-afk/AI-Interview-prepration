"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, Bot, CheckCircle2 } from "lucide-react";

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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}'}`}/api/auth/forgot-password` , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send request");

      setMessage(data.message);
      
      // For local testing without real SMTP, we might get the token back
      if (data.testToken) {
        console.log("Local Test Token:", data.testToken);
        // We'll also show it just for easy testing if it's there
        setMessage(`${data.message} (Test Token: ${data.testToken})`);
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-300 font-sans">
      <Link href="/" className="flex items-center gap-2 mb-12 group">
        <div className="bg-indigo-600 p-2 rounded-lg group-hover:rotate-12 transition-transform">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white">PrepAI</span>
      </Link>

      <div className="w-full max-w-md glass-card p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
        
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-white">Reset Password</h1>
        <p className="text-slate-400 mb-8">Enter your email address and we'll send you a link to reset your password.</p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        {message ? (
          <div className="mb-6 p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center animate-in zoom-in-95">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="text-emerald-300 font-medium mb-1">Check your inbox</p>
            <p className="text-emerald-400/80 text-sm">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-11 pr-4 focus:border-indigo-500 outline-none transition-colors text-white"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-bold shadow-lg shadow-indigo-500/25"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
