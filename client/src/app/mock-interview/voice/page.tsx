"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Loader2, Sparkles, User, Timer, History, ArrowLeft, Terminal, Cpu, Code as CodeIcon, Laptop, BrainCircuit } from 'lucide-react';
import VoiceRecorder from '@/components/VoiceRecorder';
import FeedbackPanel from '@/components/FeedbackPanel';
import TrackSelector from '@/components/TrackSelector';
import ResumeUploader from '@/components/ResumeUploader';
import Editor from '@monaco-editor/react';
import Link from 'next/link';

interface InterviewState {
  step: number;
  totalSteps: number;
  currentQuestion: string;
  transcript: string;
  isEvaluating: boolean;
  feedback: any | null;
  history: Array<{ question: string; answer: string; feedback: any }>;
  timer: number;
  track: 'software' | 'hardware' | null;
  skills: string[];
  projects: any[];
  code: string;
  isCodingQuestion: boolean;
}

export default function VoiceInterviewPage() {
  const [setupStep, setSetupStep] = useState<'track' | 'resume' | 'interview'>('track');
  const [state, setState] = useState<InterviewState>({
    step: 1,
    totalSteps: 6,
    currentQuestion: "Tell me about yourself.",
    transcript: "",
    isEvaluating: false,
    feedback: null,
    history: [],
    timer: 0,
    track: null,
    skills: [],
    projects: [],
    code: "// Write your code here...",
    isCodingQuestion: false,
  });

  const [isRecording, setIsRecording] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || voices[0];
      if (preferredVoice) utterance.voice = preferredVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startInterview = () => {
    setSetupStep('interview');
    speak(state.currentQuestion);
    startTimer();
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setState(prev => ({ ...prev, timer: 0 }));
    timerRef.current = setInterval(() => {
      setState(prev => ({ ...prev, timer: prev.timer + 1 }));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleFinalTranscript = async (finalAnswer: string) => {
    if (!finalAnswer || finalAnswer.trim().length < 5) return;
    
    stopTimer();
    setState(prev => ({ ...prev, isEvaluating: true }));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/voice-interview/evaluate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ 
          question: state.currentQuestion, 
          answer: finalAnswer,
          track: state.track,
          skills: state.skills,
          projects: state.projects,
          step: state.step
        })
      });
      const feedback = await res.json();
      
      setState(prev => ({ 
        ...prev, 
        isEvaluating: false, 
        feedback,
        history: [...prev.history, { question: prev.currentQuestion, answer: finalAnswer, feedback }]
      }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ ...prev, isEvaluating: false }));
    }
  };

  const proceedToNext = () => {
    if (state.step >= state.totalSteps) {
      alert("Interview Complete! Check your dashboard for the full report.");
      return;
    }

    const nextQuestion = state.feedback.nextQuestion;
    const isCoding = state.feedback.isCodingQuestion || false;

    setState(prev => ({
      ...prev,
      step: prev.step + 1,
      currentQuestion: nextQuestion,
      feedback: null,
      transcript: "",
      isCodingQuestion: isCoding
    }));
    
    speak(nextQuestion);
    startTimer();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Setup Screens ---

  if (setupStep === 'track') {
    return (
      <div className="min-h-screen bg-[#0d061c] flex items-center justify-center p-6">
        <div className="max-w-4xl w-full space-y-12 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-black gradient-text mb-4">Choose Your Track</h1>
            <p className="text-slate-400 text-lg">Select the field you're interviewing for.</p>
          </motion.div>
          <TrackSelector 
            selectedTrack={state.track} 
            onSelect={(t) => {
              setState(prev => ({ ...prev, track: t }));
              setSetupStep('resume');
            }} 
          />
        </div>
      </div>
    );
  }

  if (setupStep === 'resume') {
    return (
      <div className="min-h-screen bg-[#0d061c] flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-12 text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
             <button onClick={() => setSetupStep('track')} className="text-slate-500 hover:text-white flex items-center gap-2 mb-8 mx-auto">
               <ArrowLeft className="w-4 h-4" /> Back to Tracks
             </button>
            <h1 className="text-5xl font-black gradient-text mb-4">Personalize Your Experience</h1>
            <p className="text-slate-400 text-lg">Upload your resume to receive custom, project-specific questions.</p>
          </motion.div>
          
          <ResumeUploader onParseComplete={(data) => {
            setState(prev => ({ ...prev, skills: data.skills, projects: data.projects }));
            startInterview();
          }} />

          <button onClick={startInterview} className="text-slate-500 hover:text-white text-sm underline underline-offset-8">
            Skip for now and use generic questions
          </button>
        </div>
      </div>
    );
  }

  // --- Main Interview Screen ---

  return (
    <div className="min-h-screen bg-[#0d061c] text-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="h-20 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-[#0d061c]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-400" />
          </Link>
          <div>
             <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Interview Session</div>
             <div className="text-white font-bold flex items-center gap-2">
               {state.track === 'software' ? <CodeIcon className="w-4 h-4 text-indigo-400" /> : <Cpu className="w-4 h-4 text-rose-400" />}
               {state.track === 'software' ? 'Software Engineering' : 'Hardware Engineering'}
             </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Timer className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-sm">{formatTime(state.timer)}</span>
          </div>
          <div className="bg-indigo-500 px-6 py-2 rounded-full font-black text-sm shadow-lg shadow-indigo-500/20">
            STEP {state.step} / {state.totalSteps}
          </div>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Question & Voice */}
        <div className={`flex-1 overflow-y-auto p-12 space-y-12 transition-all duration-500 ${state.isCodingQuestion ? 'max-w-2xl' : 'max-w-4xl mx-auto w-full'}`}>
           <div className="space-y-6">
             <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-indigo-400" />
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Question from AI Interviewer</span>
             </div>
             <motion.h2 
               key={state.currentQuestion}
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="text-4xl font-black leading-tight"
             >
               {state.currentQuestion}
             </motion.h2>
             <button onClick={() => speak(state.currentQuestion)} className="btn-secondary text-xs py-2 px-4 flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> Replay Question
             </button>
           </div>

           <div className="py-12 border-y border-white/5 relative">
              <AnimatePresence mode="wait">
                {state.isEvaluating ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-20 space-y-6">
                    <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                    <p className="text-2xl font-bold gradient-text">AI is evaluating your response...</p>
                  </motion.div>
                ) : !state.feedback ? (
                  <VoiceRecorder 
                    isRecording={isRecording}
                    setIsRecording={setIsRecording}
                    onTranscriptChange={(t) => setState(prev => ({ ...prev, transcript: t }))}
                    onFinalTranscript={handleFinalTranscript}
                  />
                ) : (
                  <FeedbackPanel 
                    feedback={state.feedback} 
                    onNext={proceedToNext}
                    isLastStep={state.step === state.totalSteps}
                  />
                )}
              </AnimatePresence>
           </div>
        </div>

        {/* Right Side: Coding Simulator (Only for Software Track & Coding Step) */}
        {state.isCodingQuestion && state.track === 'software' && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            className="flex-1 border-l border-white/5 bg-[#1e1e1e]"
          >
            <div className="h-12 bg-[#252525] flex items-center justify-between px-6 border-b border-white/5">
              <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                <Laptop className="w-4 h-4" /> Code Simulator
              </span>
              <div className="flex gap-2">
                <button className="text-[10px] bg-white/5 hover:bg-white/10 px-3 py-1 rounded transition-colors uppercase font-bold">Run</button>
                <button className="text-[10px] bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded transition-colors uppercase font-bold text-white">Submit</button>
              </div>
            </div>
            <Editor
              height="calc(100vh - 80px - 48px)"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={state.code}
              onChange={(v) => setState(prev => ({ ...prev, code: v || "" }))}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                padding: { top: 20 }
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Footer / Progress Bar */}
      <div className="h-2 bg-white/5 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(state.step / state.totalSteps) * 100}%` }}
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
        />
      </div>
    </div>
  );
}
