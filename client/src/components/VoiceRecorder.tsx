"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceRecorderProps {
  onTranscriptChange: (transcript: string) => void;
  onFinalTranscript: (transcript: string) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  disabled?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onTranscriptChange, 
  onFinalTranscript, 
  isRecording, 
  setIsRecording,
  disabled 
}) => {
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fullTranscriptRef = useRef('');

  useEffect(() => {
    if (typeof window !== 'undefined' && ('WebkitSpeechRecognition' in window || 'speechRecognition' in window)) {
      const SpeechRecognition = (window as any).WebkitSpeechRecognition || (window as any).speechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let currentInterim = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            fullTranscriptRef.current += ' ' + transcriptSegment;
          } else {
            currentInterim += transcriptSegment;
          }
        }

        setInterimTranscript(fullTranscriptRef.current + currentInterim);
        onTranscriptChange(fullTranscriptRef.current + currentInterim);

        // Reset silence timer on speech
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          stopRecording();
        }, 2500); // Stop after 2.5 seconds of silence
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      fullTranscriptRef.current = '';
      setInterimTranscript('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      
      // Delay slightly to ensure the last 'isFinal' segments are processed
      setTimeout(() => {
        const finalValue = fullTranscriptRef.current.trim();
        if (finalValue) {
          onFinalTranscript(finalValue);
        }
      }, 500);
    }
  };


  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl"
            />
          )}
        </AnimatePresence>
        
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled}
          className={`relative z-10 p-8 rounded-full transition-all duration-500 shadow-2xl ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 scale-110' 
              : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:scale-105'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isRecording ? (
            <MicOff className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </button>
      </div>

      <div className="w-full max-w-2xl text-center">
        <p className="text-sm text-slate-400 mb-2 uppercase tracking-widest font-semibold">
          {isRecording ? "Live Transcript" : "Click to Start Answering"}
        </p>
        <div className="min-h-[100px] p-6 glass-card rounded-2xl text-lg text-slate-200 italic">
          {interimTranscript || "Waiting for speech..."}
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;
