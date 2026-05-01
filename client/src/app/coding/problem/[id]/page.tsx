"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Editor from "@monaco-editor/react";
import { 
  Play, 
  Send, 
  ChevronLeft, 
  Settings, 
  Maximize2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Cpu,
  Loader2,
  Lightbulb,
  Building2,
  Tag,
  AlertTriangle
} from "lucide-react";

export default function ProblemIdePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState("");
  
  const [evaluating, setEvaluating] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<"description" | "submissions">("description");
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}'}`}/api/coding/problems/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setProblem(data);
        if (data.starterCode) {
          const starters = JSON.parse(data.starterCode);
          setCode(starters[language] || "");
        }
      })
      .catch(err => {
        console.error(err);
        router.push("/coding");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (problem && problem.starterCode) {
      const starters = JSON.parse(problem.starterCode);
      if (starters[newLang]) {
        setCode(starters[newLang]);
      }
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setConsoleOpen(true);
    setResult(null);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}'}`}/api/coding/run` , {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ problemId: id, code, language, input: customInput || (problem.examples ? JSON.parse(problem.examples)[0]?.input : "") })
      });
      const data = await res.json();
      setResult({ type: 'run', ...data });
    } catch (err) {
      setResult({ type: 'run', status: 'Error', error: 'Failed to connect to execution engine.' });
    } finally {
      setRunning(false);
    }
  };

  const handleSubmit = async () => {
    setEvaluating(true);
    setConsoleOpen(true);
    setResult(null);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || '${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}'}`}/api/coding/submit` , {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ problemId: id, code, language })
      });
      const data = await res.json();
      setResult({ type: 'submit', ...data });
    } catch (err) {
      setResult({ type: 'submit', status: 'Error', feedback: 'Failed to submit solution.' });
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!problem) return null;

  const parsedExamples = problem.examples ? JSON.parse(problem.examples) : [];
  const parsedConstraints = problem.constraints ? JSON.parse(problem.constraints) : [];
  const parsedTags = problem.tags ? JSON.parse(problem.tags) : [];
  const parsedCompanies = problem.companies ? JSON.parse(problem.companies) : [];

  return (
    <div className="h-screen w-full bg-[#0a0a0a] flex flex-col font-sans text-slate-300 overflow-hidden">
      
      {/* Header */}
      <header className="h-14 border-b border-white/10 bg-[#0a0a0a] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/coding" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            <ChevronLeft className="w-5 h-5" />
            <span className="font-bold hidden sm:block">Problems</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="font-semibold text-white truncate max-w-xs">{problem.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleRun}
            disabled={running || evaluating}
            className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors border border-white/5"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            Run
          </button>
          <button 
            onClick={handleSubmit}
            disabled={running || evaluating}
            className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20"
          >
            {evaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Problem Details */}
        <div className="w-1/2 border-r border-white/10 flex flex-col bg-[#0a0a0a]">
          <div className="flex border-b border-white/10 bg-[#111]">
            <button 
              className={`px-6 py-3 text-sm font-semibold border-b-2 ${activeTab === 'description' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`px-6 py-3 text-sm font-semibold border-b-2 ${activeTab === 'submissions' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'}`}
              onClick={() => setActiveTab('submissions')}
            >
              Submissions
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
            {activeTab === 'description' && (
              <div className="prose prose-invert prose-emerald max-w-none">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-bold text-white m-0">{problem.title}</h2>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md border ${
                    problem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    problem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
                
                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap mb-8">
                  {problem.description}
                </div>

                {parsedExamples.map((ex: any, i: number) => (
                  <div key={i} className="mb-6">
                    <h4 className="text-white font-bold mb-2">Example {i + 1}:</h4>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 font-mono text-sm space-y-2">
                      <div><strong className="text-slate-500">Input:</strong> <span className="text-emerald-300">{ex.input}</span></div>
                      <div><strong className="text-slate-500">Output:</strong> <span className="text-emerald-300">{ex.output}</span></div>
                      {ex.explanation && (
                        <div className="text-slate-400 mt-2 whitespace-pre-wrap border-t border-white/5 pt-2">
                          <strong className="text-slate-500">Explanation:</strong> {ex.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {parsedConstraints.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-white font-bold mb-3">Constraints:</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-400 bg-white/5 p-4 rounded-lg border border-white/10">
                      {parsedConstraints.map((c: string, i: number) => (
                        <li key={i} className="font-mono text-sm">{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-white/10">
                  {parsedTags.map((t: string) => (
                    <span key={t} className="px-3 py-1 bg-white/5 text-slate-400 rounded-full text-xs font-medium border border-white/5 flex items-center gap-1">
                      <Tag className="w-3 h-3" /> {t}
                    </span>
                  ))}
                  {parsedCompanies.map((c: string) => (
                    <span key={c} className="px-3 py-1 bg-amber-500/5 text-amber-500/80 rounded-full text-xs font-medium border border-amber-500/10 flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'submissions' && (
              <div className="text-center py-10 text-slate-500">
                <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>Submit code to see your history here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code Editor & Console */}
        <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
          
          {/* Editor Toolbar */}
          <div className="h-12 border-b border-white/5 bg-[#1e1e1e] flex items-center justify-between px-4 shrink-0">
            <select 
              value={language}
              onChange={handleLanguageChange}
              className="bg-[#2d2d2d] border border-white/10 rounded px-3 py-1 text-xs text-white outline-none hover:bg-[#3d3d3d] transition-colors"
            >
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
            </select>
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-slate-400 hover:text-white transition-colors" title="Settings"><Settings className="w-4 h-4" /></button>
              <button className="p-1.5 text-slate-400 hover:text-white transition-colors" title="Fullscreen"><Maximize2 className="w-4 h-4" /></button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language.toLowerCase()}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineHeight: 24,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth"
              }}
            />
          </div>

          {/* Console / Terminal Area */}
          <div className={`border-t border-white/10 bg-[#1e1e1e] flex flex-col transition-all duration-300 ${consoleOpen ? 'h-64' : 'h-10'}`}>
            <div 
              className="h-10 flex items-center justify-between px-4 cursor-pointer hover:bg-white/5 shrink-0"
              onClick={() => setConsoleOpen(!consoleOpen)}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-slate-300">
                Console {consoleOpen ? '▼' : '▲'}
              </div>
              {result && !consoleOpen && (
                <div className={`text-xs font-bold ${result.status === 'Accepted' || result.status === 'Success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.status}
                </div>
              )}
            </div>
            
            {consoleOpen && (
              <div className="flex-1 overflow-y-auto p-4 bg-[#111]">
                {(!result && !running && !evaluating) && (
                  <div className="text-slate-500 font-mono text-sm italic">Run code or submit to see results.</div>
                )}
                
                {(running || evaluating) && (
                  <div className="flex items-center gap-3 text-emerald-500 font-mono text-sm animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" /> 
                    {running ? 'Running tests...' : 'Evaluating submission...'}
                  </div>
                )}

                {result && result.type === 'run' && !running && (
                  <div className="font-mono text-sm space-y-4">
                    <div className={`font-bold text-lg ${result.status === 'Success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {result.status}
                    </div>
                    {result.error && (
                      <div className="p-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg whitespace-pre-wrap">
                        {result.error}
                      </div>
                    )}
                    {result.output && (
                      <div>
                        <div className="text-slate-500 mb-1 font-bold text-xs uppercase tracking-widest">Output</div>
                        <div className="p-3 bg-white/5 text-slate-300 border border-white/10 rounded-lg whitespace-pre-wrap">
                          {result.output}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {result && result.type === 'submit' && !evaluating && (
                  <div className="font-mono text-sm animate-in fade-in slide-in-from-bottom-2">
                    <div className={`flex items-center gap-2 font-bold text-xl mb-4 ${result.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {result.status === 'Accepted' ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                      {result.status}
                    </div>
                    
                    <div className="flex gap-6 mb-6">
                      {result.runtime !== undefined && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Clock className="w-4 h-4 text-slate-500" />
                          Runtime: <span className="text-white font-bold">{result.runtime} ms</span>
                        </div>
                      )}
                      {result.memory !== undefined && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Cpu className="w-4 h-4 text-slate-500" />
                          Memory: <span className="text-white font-bold">{result.memory} MB</span>
                        </div>
                      )}
                      {result.passedCases !== undefined && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500/50" />
                          Test Cases: <span className="text-white font-bold">{result.passedCases}/{result.totalCases}</span>
                        </div>
                      )}
                    </div>

                    {result.failedTestCase && (
                      <div className="mb-6 p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                        <div className="flex items-center gap-2 text-rose-400 font-bold mb-2">
                          <AlertTriangle className="w-4 h-4" /> Failed Test Case
                        </div>
                        <div className="text-slate-300 whitespace-pre-wrap font-mono text-xs bg-black/20 p-3 rounded">
                          {result.failedTestCase}
                        </div>
                      </div>
                    )}

                    {result.feedback && (
                      <div className="p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold mb-3 uppercase tracking-widest text-xs">
                          <Lightbulb className="w-4 h-4" /> AI Code Review
                        </div>
                        <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                          {result.feedback}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
