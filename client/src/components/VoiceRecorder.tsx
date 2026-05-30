"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Add types for Speech Recognition
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    length: number;
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface WebkitWindow extends Window {
  WebkitSpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
  SpeechRecognition?: new () => SpeechRecognition;
  speechRecognition?: new () => SpeechRecognition;
}


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
  const [elapsedTime, setElapsedTime] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fullTranscriptRef = useRef('');
  const isRecordingRef = useRef(isRecording);

  useEffect(() => {
    isRecordingRef.current = isRecording;
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const stopRecording = useCallback(() => {
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
  }, [setIsRecording, onFinalTranscript]);

  const startRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        // Stop any existing instance just in case to avoid InvalidStateError
        recognitionRef.current.stop();
        
        fullTranscriptRef.current = '';
        setInterimTranscript('');
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'name' in e && e.name === 'InvalidStateError') {
          // If already started, just sync the UI state
          setIsRecording(true);
        } else {
          console.warn("Failed to start speech recognition:", e);
        }
      }
    }
  }, [setIsRecording]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as unknown as WebkitWindow;
      const SpeechRecognition = win.WebkitSpeechRecognition || win.SpeechRecognition || win.webkitSpeechRecognition || win.speechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        if (recognitionRef.current) {
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;

          recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
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

          recognitionRef.current.onend = () => {
            setIsRecording(false);
          };

          recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
            console.warn('Speech recognition error:', event.error);
            
            if (event.error === 'network') {
              // Try to restart if it's a transient network error
              console.warn("Network error in speech recognition. Attempting to recover...");
              setIsRecording(false);
              // Small delay before allowing restart or auto-restarting
              setTimeout(() => {
                if (isRecordingRef.current) startRecording();
              }, 1000);
            } else if (event.error === 'not-allowed') {
              setIsRecording(false);
              alert("Microphone permission denied. Please allow microphone access in your browser settings.");
            } else if (event.error === 'no-speech') {
              // Just stop recording quietly if no speech was detected
              setIsRecording(false);
            } else {
              setIsRecording(false);
            }
          };
        }
      }
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, [onTranscriptChange, setIsRecording, stopRecording]);

  const wordCount = interimTranscript.trim() ? interimTranscript.trim().split(/\s+/).length : 0;

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
        <div className="flex justify-between items-center mb-2 px-2">
          <p className="text-sm text-slate-400 uppercase tracking-widest font-semibold">
            {isRecording ? "Live Transcript" : "Click to Start Answering"}
          </p>
          {(wordCount > 0 || elapsedTime > 0) && (
            <div className="flex items-center gap-4 text-xs font-black text-slate-500 uppercase tracking-widest">
              <span>{Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}</span>
              <span>{wordCount} Words</span>
            </div>
          )}
        </div>
        <div className="min-h-[100px] p-6 glass-card rounded-2xl text-lg text-slate-200 italic relative">
          {interimTranscript || "Waiting for speech..."}
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;
