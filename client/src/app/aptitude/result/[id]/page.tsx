"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Trophy,
  Target,
  Clock,
  Brain,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight,
  Home,
  RotateCcw,
  Loader2,
  Download,
  Lightbulb
} from "lucide-react";

export default function ResultPage() {
  const { id } = useParams();
  const router = useRouter();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}'}`}/api/aptitude/history/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        
        // Parse details JSON
        if (typeof data.details === 'string') {
          data.parsedDetails = JSON.parse(data.details);
        } else {
          data.parsedDetails = data.details || [];
        }
        
        setResult(data);
      })
      .catch(err => {
        console.error(err);
        router.push("/aptitude");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Analyzing your performance...</p>
      </div>
    );
  }

  if (!result) return null;

  const accuracy = result.correctAnswers > 0 
    ? Math.round((result.correctAnswers / (result.correctAnswers + result.wrongAnswers)) * 100) 
    : 0;

  return <div className="min-h-screen bg-slate-950 p-6 md:p-10 font-sans text-slate-200 overflow-y-auto relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 -z-10" />

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Link href="/aptitude" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium">
            <Home className="w-5 h-5" /> Back to Dashboard
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors border border-white/5 hover:border-white/20">
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>

        {/* Hero Score Card */}
        <div className="glass-card p-10 flex flex-col md:flex-row items-center gap-10 border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-slate-900 shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="w-48 h-48 rounded-full border-8 border-slate-800 flex items-center justify-center relative shrink-0">
            {/* SVG Circle Progress */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-800" />
              <circle 
                cx="96" cy="96" r="88" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="none" 
                className="text-indigo-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                strokeDasharray={`${2 * Math.PI * 88}`} 
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - Math.max(0, result.score) / result.totalQuestions)}`}
                strokeLinecap="round" 
              />
            </svg>
            <div className="text-center">
              <div className="text-5xl font-black text-white">{Math.max(0, result.score)}</div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Score</div>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/20">
              {result.category} • {result.difficulty}
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-2">Assessment Complete!</h1>
            <p className="text-slate-400 mb-8 max-w-lg">
              You attempted {result.correctAnswers + result.wrongAnswers} out of {result.totalQuestions} questions. 
              Review your performance metrics and AI feedback below to improve.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-xl border border-white/5">
                <Target className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-lg font-bold text-white">{accuracy}%</div>
                  <div className="text-xs text-slate-400 uppercase font-medium">Accuracy</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-xl border border-white/5">
                <Clock className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-lg font-bold text-white">{Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</div>
                  <div className="text-xs text-slate-400 uppercase font-medium">Time Taken</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Detailed Stats */}
          <div className="glass-card p-8 col-span-1">
            <h2 className="text-xl font-bold text-white mb-6">Breakdown</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Correct
                </div>
                <div className="text-xl font-bold text-emerald-500">{result.correctAnswers}</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 text-slate-300">
                  <XCircle className="w-5 h-5 text-rose-500" /> Incorrect
                </div>
                <div className="text-xl font-bold text-rose-500">{result.wrongAnswers}</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 text-slate-300">
                  <AlertCircle className="w-5 h-5 text-slate-500" /> Skipped
                </div>
                <div className="text-xl font-bold text-slate-500">{result.skipped}</div>
              </div>
            </div>
          </div>

          {/* AI Feedback */}
          <div className="glass-card p-8 col-span-2 relative overflow-hidden bg-indigo-600/5 border-indigo-500/20">
            <div className="absolute -top-10 -right-10 opacity-10">
              <Brain className="w-48 h-48 text-indigo-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
              <Brain className="w-6 h-6 text-indigo-400" /> AI Performance Analysis
            </h2>
            <div className="prose prose-invert max-w-none relative z-10">
              <p className="text-slate-300 leading-relaxed text-lg">
                {result.aiFeedback}
              </p>
              <div className="mt-6 p-4 bg-black/20 rounded-xl border border-white/5 backdrop-blur-sm">
                <h4 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-2">Recommendation</h4>
                <p className="text-sm text-slate-400">
                  {accuracy < 70 
                    ? "Focus on building your foundational concepts before trying to optimize for speed. Review the detailed explanations for the questions you got wrong below."
                    : "Great accuracy! Work on increasing your speed by using shortcuts and mental math techniques for this topic."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Review Section */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Detailed Solutions</h2>
          
          <div className="space-y-6">
            {result.parsedDetails.map((detail: any, index: number) => (
              <div key={index} className="bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden">
                <div className={`h-1 w-full ${detail.correct ? 'bg-emerald-500' : detail.answer === null ? 'bg-slate-500' : 'bg-rose-500'}`} />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">Question {index + 1}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      detail.correct ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      detail.answer === null ? 'bg-slate-500/10 text-slate-400 border border-slate-500/20' : 
                      'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {detail.correct ? 'Correct' : detail.answer === null ? 'Skipped' : 'Incorrect'}
                    </div>
                  </div>

                  <p className="text-white mb-6 leading-relaxed">{detail.questionText}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mt-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Your Answer</div>
                      <div className={`font-medium ${detail.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {detail.answer || "Did not answer"}
                      </div>
                    </div>
                    
                    {!detail.correct && detail.correctAnswer && (
                      <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                        <div className="text-xs text-emerald-500/70 font-bold uppercase tracking-widest mb-1">Correct Answer</div>
                        <div className="font-medium text-emerald-400">
                          {detail.correctAnswer}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {detail.explanation && (
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-bold text-white mb-1">Explanation</div>
                          <div className="text-sm text-slate-400 leading-relaxed">
                            {detail.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {result.parsedDetails.length === 0 && (
              <p className="text-slate-500 italic">No detailed question data available for this attempt.</p>
            )}
          </div>
        </div>

        <div className="text-center pb-10">
          <button onClick={() => router.push('/aptitude')} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/20 inline-flex items-center gap-2">
            <RotateCcw className="w-5 h-5" /> Take Another Test
          </button>
        </div>
    </div>
  </div>;
}
