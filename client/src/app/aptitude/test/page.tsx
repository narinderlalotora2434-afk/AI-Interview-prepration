"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Flag, 
  CheckCircle2, 
  Circle, 
  X,
  AlertTriangle,
  Loader2
} from "lucide-react";

function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "Mixed";
  const difficulty = searchParams.get("difficulty") || "Beginner";

  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes default
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/aptitude/questions/${encodeURIComponent(category)}?difficulty=${difficulty}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setTimeLeft(data.length * 90); // 1.5 mins per question
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [category, difficulty, router]);

  useEffect(() => {
    if (loading || submitting) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, submitting]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (qId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const toggleMarkForReview = (qId: string) => {
    setMarked(prev => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setShowConfirm(false);
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/aptitude/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          difficulty,
          answers,
          timeTaken: (questions.length * 90) - timeLeft,
          totalQuestions: questions.length
        })
      });
      const data = await res.json();
      router.push(`/aptitude/result/${data.id}`);
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-4" />
        <p className="text-slate-400">Preparing your test...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Questions Found</h2>
          <p className="text-slate-400 mb-6">Could not find questions for this category and difficulty.</p>
          <button onClick={() => router.push('/aptitude')} className="px-6 py-2 bg-indigo-600 rounded-lg">Go Back</button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];



  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-slate-900 flex items-center justify-between px-4 md:px-6 shrink-0 z-40 sticky top-0">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <h1 className="text-sm md:text-lg font-bold text-white truncate">{category}</h1>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-white/10 text-slate-300 text-[10px] md:text-xs rounded border border-white/10">{difficulty}</span>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-1 md:gap-2 text-rose-400 font-mono text-sm md:text-xl bg-rose-500/10 px-2 md:px-4 py-1 md:py-1.5 rounded-lg border border-rose-500/20">
            <Clock className="w-4 h-4 md:w-5 md:h-5" />
            {formatTime(timeLeft)}
          </div>
          <button onClick={() => setShowConfirm(true)} className="px-3 md:px-6 py-1.5 md:py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs md:text-sm font-bold rounded-lg transition-colors shadow-lg shadow-pink-500/20">
            Submit
          </button>
          <button onClick={() => setShowPalette(!showPalette)} className="md:hidden p-1.5 bg-white/5 rounded-lg text-slate-400">
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Test Area */}
        <div className="flex-1 flex flex-col relative overflow-y-auto">
          <div className="p-4 md:p-8 max-w-4xl mx-auto w-full flex flex-col min-h-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <h2 className="text-lg md:text-xl font-bold text-slate-300">Question {currentIdx + 1} of {questions.length}</h2>
              <button 
                onClick={() => toggleMarkForReview(currentQ.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs md:text-sm transition-colors w-full sm:w-auto justify-center ${
                  marked.has(currentQ.id) 
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                <Flag className="w-4 h-4" />
                {marked.has(currentQ.id) ? 'Marked for Review' : 'Mark for Review'}
              </button>
            </div>

            <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 md:p-8 mb-6 shadow-xl">
              <p className="text-base md:text-lg text-white leading-relaxed mb-8">{currentQ.questionText}</p>
              
              <div className="space-y-3">
                {currentQ.options.map((opt: string, i: number) => {
                  const isSelected = answers[currentQ.id] === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => handleOptionSelect(currentQ.id, opt)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 ${
                        isSelected 
                          ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.1)] text-white' 
                          : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-600 text-transparent'
                      }`}>
                        {isSelected && <div className="w-2 md:w-2.5 h-2 md:h-2.5 bg-white rounded-full" />}
                      </div>
                      <span className="text-sm md:text-base">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-auto pt-6 border-t border-white/5 gap-4">
              <button 
                onClick={() => setAnswers(prev => { const n = {...prev}; delete n[currentQ.id]; return n; })}
                className="text-slate-400 hover:text-white transition-colors text-sm font-medium order-2 sm:order-1"
              >
                Clear Response
              </button>
              <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                <button 
                  onClick={() => setCurrentIdx(p => Math.max(0, p - 1))}
                  disabled={currentIdx === 0}
                  className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <button 
                  onClick={() => setCurrentIdx(p => Math.min(questions.length - 1, p + 1))}
                  disabled={currentIdx === questions.length - 1}
                  className="flex-1 sm:flex-none px-4 md:px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Question Palette - Mobile Overlay + Desktop Sidebar */}
        <div className={`
          fixed md:relative inset-0 md:inset-auto md:w-72 md:border-l border-white/5 bg-slate-900 flex flex-col shrink-0 z-50 transition-transform duration-300
          ${showPalette ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}>
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">Question Palette</h3>
            <button onClick={() => setShowPalette(false)} className="md:hidden p-1 text-slate-400">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-4 grid grid-cols-2 gap-3 text-[10px] text-slate-400 border-b border-white/5">
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Answered</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-700" /> Not Answered</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Marked</div>
            <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded border border-indigo-500" /> Current</div>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, i) => {
                const isAnswered = !!answers[q.id];
                const isMarked = marked.has(q.id);
                const isCurrent = i === currentIdx;
                
                let bg = "bg-slate-800 text-slate-400 hover:bg-slate-700";
                if (isAnswered) bg = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
                if (isMarked) bg = "bg-amber-500/20 text-amber-400 border border-amber-500/30";
                if (isAnswered && isMarked) bg = "bg-emerald-500/20 border-b-4 border-b-amber-500 text-emerald-400";
                
                return (
                  <button
                    key={q.id}
                    onClick={() => { setCurrentIdx(i); setShowPalette(false); }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${bg} ${isCurrent ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-900 scale-110 z-10' : ''}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="p-4 border-t border-white/5 md:hidden">
            <button onClick={() => setShowPalette(false)} className="w-full py-3 bg-white/5 rounded-xl text-white font-bold">
              Close Palette
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-2xl font-bold text-white mb-2">Submit Test?</h3>
            <p className="text-slate-400 mb-6">Are you sure you want to submit your test? You cannot change your answers after submission.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{Object.keys(answers).length}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Answered</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-slate-400">{questions.length - Object.keys(answers).length}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Unanswered</div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium">
                Resume
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={submitting}
                className="flex-1 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl transition-colors font-bold flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Yes, Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AptitudeTestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <TestContent />
    </Suspense>
  );
}
