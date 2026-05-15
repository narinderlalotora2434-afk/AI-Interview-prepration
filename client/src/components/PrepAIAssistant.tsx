"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Code, 
  Brain, 
  FileText, 
  MessageSquare, 
  Zap,
  Mic,
  Maximize2,
  Minimize2,
  Trash2,
  Command,
  History,
  ChevronDown
} from "lucide-react";
import { getBaseUrl } from "@/lib/api";
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export const PrepAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Load history on mount
  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${getBaseUrl()}/api/assistant/history`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data.map(m => ({ role: m.role as any, content: m.content })));
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleSend = async (msg?: string) => {
    const text = msg || input;
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${getBaseUrl()}/api/assistant/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) {
        throw new Error("Assistant API failed");
      }

      const data = await res.json();
      if (data.reply) {
        setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      }
    } catch (err) {
      console.error("Assistant error", err);
      setMessages(prev => [...prev, { role: 'ai', content: "I'm having a bit of trouble connecting to my brain. Please try again in a moment! 🧠" }]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${getBaseUrl()}/api/assistant/history`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  const quickActions = [
    { label: "Fix My Code", icon: Code, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Generate Study Plan", icon: Zap, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Explain Concept", icon: Brain, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Improve ATS Score", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Mock Interview", icon: MessageSquare, color: "text-pink-500", bg: "bg-pink-50" },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[1000] font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-[24px] bg-primary flex items-center justify-center shadow-2xl shadow-primary/30 border-2 border-white group relative overflow-hidden"
          >
            <Bot className="w-8 h-8 text-white relative z-10" />
            <motion.div 
               className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-white"
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              x: 0,
              width: isExpanded ? "800px" : "420px",
              height: isExpanded ? "700px" : "620px"
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            className="saas-card flex flex-col bg-white border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden rounded-[40px]"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Bot className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight text-text-primary uppercase">PrepAI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Neural Sync Active</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)} 
                  className="p-2 hover:bg-white rounded-xl text-text-secondary hover:text-primary transition-all hover:shadow-sm"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={clearHistory} 
                  className="p-2 hover:bg-white rounded-xl text-text-secondary hover:text-rose-500 transition-all hover:shadow-sm"
                  title="Clear Neural History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 hover:bg-white rounded-xl text-text-secondary hover:text-text-primary transition-all hover:shadow-sm ml-1"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth no-scrollbar"
            >
              {messages.length === 0 && (
                <div className="text-center py-16 space-y-6">
                  <div className="w-20 h-20 bg-primary/5 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-primary/10">
                    <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black tracking-tight text-text-primary uppercase">Placement Intelligence</h4>
                    <p className="text-[10px] text-text-secondary max-w-[280px] mx-auto uppercase font-black tracking-[0.2em] leading-loose">
                      Neural-mapped mentorship for engineering excellence.
                    </p>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[85%] p-5 rounded-[28px] text-sm leading-relaxed font-medium
                    ${msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none shadow-xl shadow-primary/20' 
                      : 'bg-slate-50 border border-slate-100 text-text-primary rounded-tl-none'}
                  `}>
                    <div className="markdown-content">
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 border border-slate-100 p-5 rounded-[28px] rounded-tl-none flex items-center gap-4">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(n => (
                        <motion.div
                          key={n}
                          className="w-2 h-2 bg-primary/40 rounded-full"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ repeat: Infinity, duration: 1, delay: n * 0.2 }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Neural Processing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-8 pb-4 overflow-x-auto flex gap-3 no-scrollbar shrink-0">
              {quickActions.map(action => (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.label)}
                  className={`flex items-center gap-3 px-5 py-2.5 ${action.bg} border border-transparent hover:border-slate-200 rounded-2xl whitespace-nowrap transition-all group shrink-0 shadow-sm`}
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                  <span className={`text-[10px] font-black uppercase tracking-widest ${action.color}`}>{action.label}</span>
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-8 pt-4 bg-slate-50/50 border-t border-slate-100">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask nexus intelligence..."
                  className="w-full bg-white border border-slate-200 rounded-[24px] py-5 pl-6 pr-20 text-sm focus:outline-none focus:border-primary/50 focus:shadow-xl focus:shadow-primary/5 transition-all placeholder:text-slate-400 font-medium"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-all">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="p-3 bg-primary rounded-xl text-white shadow-lg shadow-primary/20 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-center gap-6 text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2"><Command className="w-3 h-3 text-primary/40" /> NEURAL CMDS</div>
                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                <div className="flex items-center gap-2"><History className="w-3 h-3 text-primary/40" /> SYNCED HISTORY</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .markdown-content pre {
          background: #0F172A;
          padding: 1.25rem;
          border-radius: 1rem;
          margin: 0.75rem 0;
          overflow-x: auto;
          color: #f8fafc;
        }
        .markdown-content code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.85rem;
          color: #8b5cf6;
        }
        .markdown-content p {
          margin-bottom: 0.75rem;
        }
        .markdown-content p:last-child {
          margin-bottom: 0;
        }
        .markdown-content ul, .markdown-content ol {
          padding-left: 1.5rem;
          margin: 0.75rem 0;
        }
        .markdown-content li {
          margin-bottom: 0.4rem;
        }
      `}</style>
    </div>
  );
};
