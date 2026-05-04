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
  Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Mock Data ---

const PROBLEM_TEMPLATES: any = {
  cpp: "int main() {\n    // Write your code here\n    return 0;\n}",
  java: "public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}",
  python: "def solve():\n    # Write your code here\n    pass\n\nif __name__ == '__main__':\n    solve()",
  javascript: "function solve() {\n    // Write your code here\n}\n\nsolve();",
};

export default function CodingWorkspace() {
  const { id } = useParams();
  const router = useRouter();
  
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(PROBLEM_TEMPLATES.javascript);
  const [activeTab, setActiveTab] = useState("description"); // description, solution, discussion
  const [outputTab, setOutputTab] = useState("testcases"); // testcases, console
  const [output, setOutput] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verdict, setVerdict] = useState<string | null>(null);
  
  const [splitWidth, setSplitWidth] = useState(40); // Percentage for left panel
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mock fetching problem data
    // In real app, fetch from API
    setTimeout(() => {
      setProblem({
        id,
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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-medium">Initializing Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#0a0a0a] flex flex-col text-slate-300 font-sans overflow-hidden">
      {/* Navbar */}
      <header className="h-14 border-b border-white/5 bg-[#111] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/coding" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
            <span className="font-bold text-sm">Problem List</span>
          </Link>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-white font-bold tracking-tight">{problem?.title}</span>
            <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
              problem?.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : 
              problem?.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
            }`}>
              {problem?.difficulty}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
            <Settings className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-emerald-900/20 active:scale-95" onClick={handleRun} disabled={isRunning}>
            {isRunning ? <Clock className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            Run
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-white text-black hover:bg-slate-200 rounded-lg font-bold text-sm transition-all active:scale-95" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Clock className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 fill-current" />}
            Submit
          </button>
          <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xs cursor-pointer">
            JD
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
        
        {/* Left Panel: Description & Stats */}
        <div 
          className="flex flex-col bg-[#0a0a0a] border-r border-white/5" 
          style={{ width: `${splitWidth}%` }}
        >
          <div className="flex items-center gap-1 border-b border-white/5 px-2 bg-[#161616]">
            {["Description", "Solution", "Discussion", "Submissions"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-3 text-xs font-bold transition-all border-b-2 ${
                  activeTab === tab.toLowerCase() ? 'border-emerald-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
            <AnimatePresence mode="wait">
              {activeTab === "description" && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="prose prose-invert prose-emerald max-w-none"
                >
                  <h1 className="text-2xl font-black text-white mb-6 tracking-tight">{problem?.title}</h1>
                  <div className="flex flex-wrap gap-4 mb-8 text-[11px] font-black uppercase">
                    <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                      <Zap className="w-3 h-3" /> {problem?.difficulty}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/10">
                      <Layout className="w-3 h-3" /> {problem?.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/10">
                      <RotateCcw className="w-3 h-3" /> Acceptance: {Math.round(problem?.acceptanceRate * 100)}%
                    </span>
                  </div>

                  <div className="text-slate-300 leading-relaxed space-y-4 text-sm" dangerouslySetInnerHTML={{ __html: problem?.description.replace(/\n/g, '<br />') }} />

                  <div className="mt-12 space-y-8">
                    {problem?.examples.map((ex: any, i: number) => (
                      <div key={i} className="space-y-3">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest text-[10px]">Example {i + 1}</h4>
                        <div className="bg-white/5 border border-white/5 rounded-xl p-4 font-mono text-sm space-y-2">
                          <div><span className="text-slate-500">Input:</span> <span className="text-emerald-400">{ex.input}</span></div>
                          <div><span className="text-slate-500">Output:</span> <span className="text-emerald-400">{ex.output}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Hint Section */}
                  <div className="mt-12 p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 relative overflow-hidden group cursor-pointer hover:bg-indigo-500/10 transition-all">
                    <div className="flex items-center gap-3 text-indigo-400 mb-2">
                      <Bot className="w-5 h-5" />
                      <span className="text-xs font-black uppercase tracking-widest">AI Intelligent Hints</span>
                    </div>
                    <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Stuck on this problem? Ask Nexus AI for a subtle push towards the right architecture.</p>
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Resizable Divider */}
        <div 
          className={`w-1 cursor-col-resize hover:bg-emerald-500/50 transition-colors bg-white/5 z-20 ${isDragging ? 'bg-emerald-500' : ''}`}
          onMouseDown={() => setIsDragging(true)}
        />

        {/* Right Panel: Editor & Terminal */}
        <div className="flex-1 flex flex-col bg-[#111] overflow-hidden">
          {/* Editor Header */}
          <div className="h-11 bg-[#161616] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-3">
              <select 
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setCode(PROBLEM_TEMPLATES[e.target.value]);
                }}
                className="bg-transparent text-slate-400 text-xs font-bold outline-none cursor-pointer hover:text-white transition-colors"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python 3</option>
                <option value="java">Java 17</option>
                <option value="cpp">C++ 20</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:bg-white/5 rounded transition-colors text-slate-500 hover:text-white" title="Auto Format">
                <Layout className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:bg-white/5 rounded transition-colors text-slate-500 hover:text-white" title="Reset Code">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden relative">
            <Editor
              height="100%"
              language={language === "python" ? "python" : language === "cpp" ? "cpp" : language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{
                fontSize: 14,
                fontFamily: "var(--font-geist-mono), monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 20 },
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
                backgroundColor: "#111"
              }}
            />
            
            {/* Verdict Overlay */}
            <AnimatePresence>
              {verdict && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                  onClick={() => setVerdict(null)}
                >
                  <div className="bg-[#1a1a1a] border border-emerald-500/30 p-10 rounded-3xl text-center shadow-2xl max-w-xs relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/40">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                      </div>
                      <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Accepted</h2>
                      <p className="text-slate-400 text-sm mb-6 font-medium tracking-tight">You've successfully solved the problem with optimal time complexity.</p>
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <div className="text-[10px] text-slate-500 uppercase font-black">Runtime</div>
                          <div className="text-sm font-bold text-white">45ms</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <div className="text-[10px] text-slate-500 uppercase font-black">Memory</div>
                          <div className="text-sm font-bold text-white">12.4MB</div>
                        </div>
                      </div>
                      <button className="w-full btn-primary py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/40 active:scale-95 transition-all">
                        Next Challenge
                      </button>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Console / Testcases Bar */}
          <div className="h-1/3 border-t border-white/5 flex flex-col shrink-0 bg-[#0a0a0a]">
            <div className="h-10 bg-[#161616] border-b border-white/5 flex items-center px-4 justify-between shrink-0">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setOutputTab("testcases")}
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    outputTab === "testcases" ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Test Cases
                </button>
                <button 
                  onClick={() => setOutputTab("console")}
                  className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                    outputTab === "console" ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Console {isRunning && <Clock className="w-3 h-3 animate-spin" />}
                </button>
              </div>
              <button className="text-slate-500 hover:text-white transition-colors" onClick={() => setOutputTab("console")}>
                <ChevronRight className="w-4 h-4 rotate-90" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 font-mono text-sm relative">
              <AnimatePresence mode="wait">
                {outputTab === "testcases" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-xs text-white font-bold">Case 1</button>
                      <button className="px-3 py-1.5 rounded-lg hover:bg-white/5 text-xs text-slate-500 transition-colors">Case 2</button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">nums =</div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5 text-emerald-400">[2,7,11,15]</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">target =</div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/5 text-emerald-400">9</div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {outputTab === "console" && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {!output && !isRunning && (
                      <div className="h-full flex items-center justify-center text-slate-600 italic">
                        No execution output yet. Hit 'Run' to see results.
                      </div>
                    )}
                    {isRunning && (
                      <div className="flex items-center gap-3 text-slate-500">
                        <Terminal className="w-4 h-4" />
                        Running code against public test cases...
                      </div>
                    )}
                    {output && !isRunning && (
                      <div className="space-y-4">
                        <div className={`text-lg font-black ${output.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {output.status}
                        </div>
                        <div className="grid grid-cols-2 gap-8 mb-4">
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Runtime</div>
                            <div className="text-white font-bold">{output.runtime}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Memory</div>
                            <div className="text-white font-bold">{output.memory}</div>
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-xl p-4 whitespace-pre text-slate-400 text-xs">
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
      
      {/* Global CSS for Editor scrollbar */}
      <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
