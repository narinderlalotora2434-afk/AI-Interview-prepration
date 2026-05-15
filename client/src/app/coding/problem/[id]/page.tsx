"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Editor from "@monaco-editor/react";
import { 
  Bot, 
  Code, 
  Play, 
  Send, 
  RotateCcw, 
  Settings, 
  Maximize2, 
  ChevronDown, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Layout,
  Terminal,
  MessageSquare,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Share2,
  Menu,
  Trophy,
  History,
  Target,
  Activity,
  Award,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";

// --- Types ---

interface Example {
  input: string;
  output: string;
}

interface Problem {
  id: string | string[];
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  acceptanceRate: number;
  description: string;
  examples: Example[];
  hints: string[];
}

interface ExecutionOutput {
  status: string;
  runtime: string;
  memory: string;
  stdout: string;
}

interface ProblemTemplates {
  [key: string]: string;
}

const PROBLEM_TEMPLATES: ProblemTemplates = {
  cpp: "int main() {\n    // Write your code here\n    return 0;\n}",
  java: "public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
  python: "def solve():\n    # Write your code here\n    pass\n\nif __name__ == '__main__':\n    solve()",
  javascript: "function solve() {\n    // Write your code here\n}\n\nsolve();",
};

export default function CodingWorkspace() {
  const { id } = useParams();
  const router = useRouter();
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(PROBLEM_TEMPLATES.javascript);
  const [activeTab, setActiveTab] = useState("description"); // description, solution, discussion
  const [outputTab, setOutputTab] = useState("testcases"); // testcases, console
  const [output, setOutput] = useState<ExecutionOutput | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [splitWidth, setSplitWidth] = useState(40); // Percentage for left panel
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock fetching problem data
    setTimeout(() => {
      setProblem({
        id: id || "1",
        title: "Two Sum",
        difficulty: "Easy",
        category: "Array",
        acceptanceRate: 0.48,
        description: `
Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

### Example 1:
**Input:** nums = [2,7,11,15], target = 9
**Output:** [0,1]
**Explanation:** Because nums[0] + nums[1] == 9, we return [0,1].

### Example 2:
**Input:** nums = [3,2,4], target = 6
**Output:** [1,2]

### Constraints:
- \`2 <= nums.length <= 10^4\`
- \`-10^9 <= nums[i] <= 10^9\`
- \`-10^9 <= target <= 10^9\`
- **Only one valid answer exists.**
        `,
        examples: [
          { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
          { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
        ],
        hints: [
          "Try using a hash map to store the indices of numbers you've seen.",
          "Iterate through the array once and check if (target - current_val) exists in the map."
        ]
      });
      setLoading(false);
    }, 800);
  }, [id]);

  const handleRun = () => {
    setIsRunning(true);
    setOutputTab("console");
    setTimeout(() => {
      setOutput({
        status: "Accepted",
        runtime: "45ms",
        memory: "12.4MB",
        stdout: "Output: [0,1]\nExpected: [0,1]",
      });
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setVerdict(null);
    setTimeout(() => {
      setVerdict("Accepted");
      setIsSubmitting(false);
    }, 2000);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth;
    const newWidth = (e.clientX / containerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setSplitWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
          <Code className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />
        </div>
        <p className="mt-6 text-sm font-black text-text-secondary uppercase tracking-[0.3em] animate-pulse">Initializing Neural Workspace...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F8FAFC] flex text-text-primary selection:bg-emerald-500/10 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="px-10 h-16 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <Link href="/coding" className="p-2 bg-slate-50 border border-slate-100 rounded-xl text-text-secondary hover:text-emerald-600 hover:border-emerald-100 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />
              <div>
                <h1 className="text-sm font-black tracking-tight text-text-primary uppercase leading-tight">{problem?.title}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full border ${
                    problem?.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    problem?.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {problem?.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-text-secondary hover:text-emerald-600 transition-all">
              <Settings className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleRun} 
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-text-primary hover:border-emerald-500 hover:text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 disabled:opacity-50"
              >
                {isRunning ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                Run Mission
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? <Clock className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Sync Solution
              </button>
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
          
          {/* Left Panel: Problem Details */}
          <div 
            className="flex flex-col bg-white border-r border-slate-100" 
            style={{ width: `${splitWidth}%` }}
          >
            <div className="flex items-center gap-1 border-b border-slate-100 px-4 bg-slate-50/50">
              {["Description", "Solution", "Discussion", "Submissions"].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-4 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
                    activeTab === tab.toLowerCase() ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-10 no-scrollbar scroll-smooth">
              <AnimatePresence mode="wait">
                {activeTab === "description" && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-10"
                  >
                    <div className="space-y-4">
                      <h2 className="text-3xl font-black text-text-primary tracking-tight">{problem?.title}</h2>
                      <div className="flex flex-wrap gap-3">
                        <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                          <Zap className="w-3 h-3" /> {problem?.difficulty}
                        </span>
                        <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                          <Layout className="w-3 h-3" /> {problem?.category}
                        </span>
                        <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                          <RotateCcw className="w-3 h-3" /> {problem ? Math.round(problem.acceptanceRate * 100) : 0}% Acceptance
                        </span>
                      </div>
                    </div>

                    <div className="prose prose-slate max-w-none prose-sm font-medium leading-relaxed text-text-secondary" dangerouslySetInnerHTML={{ __html: problem?.description.replace(/\n/g, '<br />') || "" }} />

                    <div className="space-y-8">
                      {problem?.examples.map((ex, i) => (
                        <div key={i} className="space-y-4">
                          <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em]">Example {i + 1}</h4>
                          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 font-mono text-sm space-y-3 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                               <Terminal className="w-16 h-16 text-emerald-600" />
                            </div>
                            <div className="relative z-10"><span className="text-slate-400 font-black uppercase text-[9px] tracking-widest mr-4">Input:</span> <span className="text-emerald-600 font-bold">{ex.input}</span></div>
                            <div className="relative z-10"><span className="text-slate-400 font-black uppercase text-[9px] tracking-widest mr-4">Output:</span> <span className="text-emerald-600 font-bold">{ex.output}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AI Hint Section */}
                    <div className="saas-card p-8 bg-emerald-50/30 border-emerald-100/50 relative overflow-hidden group cursor-pointer hover:bg-emerald-50 transition-all rounded-[32px]">
                      <div className="flex items-center gap-3 text-emerald-600 mb-3">
                        <div className="p-2 bg-emerald-500/10 rounded-xl">
                           <Bot className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Strategist Hints</span>
                      </div>
                      <p className="text-xs text-text-secondary font-medium leading-relaxed italic">&quot;Stuck on this problem? Click to synchronize with the AI for a subtle push towards the right architecture.&quot;</p>
                      <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Resizable Divider */}
          <div 
            className={`w-1 cursor-col-resize hover:bg-emerald-500/50 transition-colors bg-slate-100 z-20 ${isDragging ? 'bg-emerald-500' : ''}`}
            onMouseDown={() => setIsDragging(true)}
          />

          {/* Right Panel: Code Editor & Console */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Editor Toolbar */}
            <div className="h-12 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <select 
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      setCode(PROBLEM_TEMPLATES[e.target.value]);
                    }}
                    className="bg-transparent text-text-primary text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:text-emerald-600 transition-colors"
                   >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python 3</option>
                    <option value="java">Java 17</option>
                    <option value="cpp">C++ 20</option>
                   </select>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-emerald-600 shadow-sm border border-transparent hover:border-slate-100" title="Auto Format">
                  <Layout className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-white rounded-lg transition-all text-slate-400 hover:text-rose-500 shadow-sm border border-transparent hover:border-slate-100" title="Reset Code">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 overflow-hidden relative">
              <Editor
                height="100%"
                language={language === "python" ? "python" : language === "cpp" ? "cpp" : language}
                theme="vs-light" // Using light theme for editor to match SaaS UI
                value={code}
                onChange={(val) => setCode(val || "")}
                options={{
                  fontSize: 15,
                  fontFamily: "JetBrains Mono, monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 30 },
                  lineNumbers: "on",
                  renderLineHighlight: "all",
                  cursorBlinking: "smooth",
                  automaticLayout: true,
                  scrollbar: {
                    vertical: "visible",
                    horizontal: "visible",
                    useShadows: false,
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10
                  },
                  fontLigatures: true,
                  lineHeight: 24,
                }}
              />
              
              {/* Verdict Overlay */}
              <AnimatePresence>
                {verdict && (
                  <motion.div 
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-white/40"
                    onClick={() => setVerdict(null)}
                  >
                    <motion.div 
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-white border border-slate-100 p-12 rounded-[48px] text-center shadow-2xl max-w-sm relative overflow-hidden"
                    >
                      <div className="relative z-10 space-y-8">
                        <div className="w-24 h-24 bg-emerald-50 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-100 shadow-xl shadow-emerald-500/5">
                          <Award className="w-12 h-12 text-emerald-600" />
                        </div>
                        <div className="space-y-2">
                           <h2 className="text-4xl font-black text-text-primary uppercase tracking-tighter">Mission <span className="text-emerald-500 italic">Passed</span></h2>
                           <p className="text-text-secondary font-medium px-4">Neural synchronization successful. Optimization metrics are within elite range.</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                            <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Runtime</div>
                            <div className="text-lg font-black text-text-primary tabular-nums">45ms</div>
                          </div>
                          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                            <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Memory</div>
                            <div className="text-lg font-black text-text-primary tabular-nums">12.4MB</div>
                          </div>
                        </div>
                        
                        <button className="w-full btn-primary py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/30">
                          Next Challenge
                        </button>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Console Area */}
            <div className="h-1/3 border-t border-slate-100 flex flex-col shrink-0 bg-white">
              <div className="h-12 bg-slate-50/50 border-b border-slate-100 flex items-center px-6 justify-between shrink-0">
                <div className="flex items-center gap-1">
                  {["Testcases", "Console"].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setOutputTab(tab.toLowerCase())}
                      className={`px-4 py-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${
                        outputTab === tab.toLowerCase() ? 'text-emerald-600' : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {tab}
                      {outputTab === tab.toLowerCase() && <motion.div layoutId="consoleTab" className="absolute bottom-0 left-4 right-4 h-0.5 bg-emerald-500" />}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                   {isRunning && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                         <Clock className="w-3 h-3 animate-spin" /> Live Syncing
                      </div>
                   )}
                   <button className="text-slate-400 hover:text-text-primary transition-colors">
                      <ChevronDown className="w-5 h-5" />
                   </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 font-mono text-sm relative no-scrollbar">
                <AnimatePresence mode="wait">
                  {outputTab === "testcases" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-10"
                    >
                      <div className="flex gap-3">
                        <button className="px-6 py-2 rounded-xl bg-white border-2 border-emerald-500 text-[10px] font-black text-emerald-600 uppercase tracking-widest shadow-sm">Case 1</button>
                        <button className="px-6 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white transition-all">Case 2</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest ml-1">nums =</div>
                          <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 text-emerald-600 font-bold">[2,7,11,15]</div>
                        </div>
                        <div className="space-y-3">
                          <div className="text-[10px] text-slate-400 uppercase font-black tracking-widest ml-1">target =</div>
                          <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 text-emerald-600 font-bold">9</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {outputTab === "console" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="h-full"
                    >
                      {!output && !isRunning && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                           <Terminal className="w-10 h-10 opacity-20" />
                           <p className="text-[10px] font-black uppercase tracking-[0.3em]">Ready for execution cluster sync</p>
                        </div>
                      )}
                      {output && !isRunning && (
                        <div className="space-y-8">
                          <div className="flex items-center justify-between">
                             <div className={`text-2xl font-black uppercase tracking-tighter ${output.status === 'Accepted' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {output.status}
                             </div>
                             <div className="flex gap-6">
                                <div>
                                  <div className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Compute Time</div>
                                  <div className="text-text-primary font-black tabular-nums">{output.runtime}</div>
                                </div>
                                <div>
                                  <div className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Peak Memory</div>
                                  <div className="text-text-primary font-black tabular-nums">{output.memory}</div>
                                </div>
                             </div>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 whitespace-pre text-emerald-400 text-xs font-medium shadow-inner">
                             {output.stdout}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
