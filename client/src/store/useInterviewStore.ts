import { create } from 'zustand';

interface InterviewState {
  // Configuration
  role: string;
  level: string;
  interviewType: string;
  difficulty: string;
  duration: number;
  features: {
    webcam: boolean;
    emotion: boolean;
    realtimeFeedback: boolean;
    followup: boolean;
    coding: boolean;
    ats: boolean;
  };
  
  // Session Data
  interviewId: string | null;
  currentQuestionIndex: number;
  questions: any[];
  userAnswers: any[];
  isListening: boolean;
  isAnalyzing: boolean;
  analysisProgress: number;
  
  // Real-time AI Feedback
  realtimeFeedbackData: {
    confidence: number;
    emotion: string;
    suggestions: string[];
  };

  // Actions
  setRole: (role: string) => void;
  setLevel: (level: string) => void;
  setInterviewType: (type: string) => void;
  setDifficulty: (diff: string) => void;
  setDuration: (dur: number) => void;
  toggleFeature: (feature: keyof InterviewState['features']) => void;
  setInterviewData: (id: string, questions: any[]) => void;
  addQuestion: (question: any) => void;
  addAnswer: (answer: any) => void;
  setListening: (val: boolean) => void;
  setAnalyzing: (val: boolean, progress?: number) => void;
  updateRealtimeFeedback: (data: Partial<InterviewState['realtimeFeedbackData']>) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  role: 'Software Engineer',
  level: 'Fresher',
  interviewType: 'Technical Interview',
  difficulty: 'Medium',
  duration: 30,
  features: {
    webcam: false,
    emotion: false,
    realtimeFeedback: true,
    followup: true,
    coding: false,
    ats: true,
  },
  
  interviewId: null,
  currentQuestionIndex: 0,
  questions: [],
  userAnswers: [],
  isListening: false,
  isAnalyzing: false,
  analysisProgress: 0,
  
  realtimeFeedbackData: {
    confidence: 0,
    emotion: 'Neutral',
    suggestions: [],
  },

  setRole: (role) => set({ role }),
  setLevel: (level) => set({ level }),
  setInterviewType: (interviewType) => set({ interviewType }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setDuration: (duration) => set({ duration }),
  toggleFeature: (feature) => set((state) => ({ 
    features: { ...state.features, [feature]: !state.features[feature] } 
  })),
  setInterviewData: (interviewId, questions) => set({ interviewId, questions, currentQuestionIndex: 0 }),
  addQuestion: (question) => set((state) => ({ questions: [...state.questions, question] })),
  addAnswer: (answer) => set((state) => ({ userAnswers: [...state.userAnswers, answer] })),
  setListening: (isListening) => set({ isListening }),
  setAnalyzing: (isAnalyzing, analysisProgress = 0) => set({ isAnalyzing, analysisProgress }),
  updateRealtimeFeedback: (data) => set((state) => ({ 
    realtimeFeedbackData: { ...state.realtimeFeedbackData, ...data } 
  })),
  reset: () => set({
    interviewId: null,
    currentQuestionIndex: 0,
    questions: [],
    userAnswers: [],
    isListening: false,
    isAnalyzing: false,
    analysisProgress: 0,
  }),
}));
