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
  History
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
    { label: "Fix My Code", icon: Code, color: "text-blue-400" },
    { label: "Generate Study Plan", icon: Zap, color: "text-amber-400" },
    { label: "Explain Concept", icon: Brain, color: "text-purple-400" },
    { label: "Improve ATS Score", icon: FileText, color: "text-emerald-400" },
    { label: "Mock Interview", icon: MessageSquare, color: "text-pink-400" },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-[1000] font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.5)] border border-white/20 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Bot className="w-8 h-8 text-white relative z-10" />
            <motion.div 
               className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-950"
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
              width: isExpanded ? "800px" : "400px",
              height: isExpanded ? "700px" : "600px"
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9, x: 50 }}
            className="glass-card flex flex-col border border-white/10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-sm tracking-tight text-white uppercase">PrepAI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">AI Mentor Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsExpanded(!isExpanded)} 
                  className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button 
                  onClick={clearHistory} 
                  className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-rose-500 transition-colors"
                  title="Clear Chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10"
            >
              {messages.length === 0 && (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h4 className="text-lg font-black tracking-tight">Your AI Placement Mentor</h4>
                  <p className="text-xs text-muted-foreground max-w-[250px] mx-auto uppercase tracking-widest leading-loose">
                    Solve doubts, fix code, and optimize your roadmap for top companies.
                  </p>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none shadow-[0_10px_20px_rgba(124,58,237,0.3)]' 
                      : 'bg-white/5 border border-white/5 text-slate-200 rounded-tl-none'}
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
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(n => (
                        <motion.div
                          key={n}
                          className="w-1.5 h-1.5 bg-primary rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.6, delay: n * 0.1 }}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="px-6 pb-2 overflow-x-auto flex gap-2 scrollbar-none">
              {quickActions.map(action => (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.label)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl whitespace-nowrap transition-all group shrink-0"
                >
                  <action.icon className={`w-3.5 h-3.5 ${action.color}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{action.label}</span>
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 pt-2">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything about placements..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button className="p-2 hover:bg-white/10 rounded-xl text-muted-foreground transition-colors">
                    <Mic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="p-2.5 bg-primary rounded-xl text-white shadow-lg shadow-primary/20 disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-center gap-4 text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                <div className="flex items-center gap-1.5"><Command className="w-3 h-3" /> COMMANDS</div>
                <div className="w-1 h-1 bg-white/10 rounded-full" />
                <div className="flex items-center gap-1.5"><History className="w-3 h-3" /> MEMORY ACTIVE</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .markdown-content pre {
          background: rgba(0,0,0,0.3);
          padding: 1rem;
          border-radius: 0.75rem;
          margin: 0.5rem 0;
          overflow-x: auto;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .markdown-content code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.8rem;
          color: #a78bfa;
        }
        .markdown-content p {
          margin-bottom: 0.5rem;
        }
        .markdown-content p:last-child {
          margin-bottom: 0;
        }
        .markdown-content ul, .markdown-content ol {
          padding-left: 1.25rem;
          margin: 0.5rem 0;
        }
        .markdown-content li {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};
