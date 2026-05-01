import Image from "next/image";
import Link from "next/link";
import { MessageSquare, FileText, Code, CheckCircle, ArrowRight, Star, Users, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  return (
    <div className="relative min-h-screen selection:bg-indigo-500/30">
      <Navbar />
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full animate-glow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full animate-glow" style={{ animationDelay: '5s' }}></div>
      </div>

      <main>
        {/* Hero Section */}
        <section className="pt-40 pb-24 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                AI-Powered Interview Coaching
              </div>
              
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] sm:leading-[1] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 text-center lg:text-left">
                Master Your Next <br />
                <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">Interview with </span>
                <span className="gradient-text">AI</span>
              </h1>
              
              <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                Get real-time feedback, ATS-optimized resume analysis, and realistic mock interviews tailored to your dream role.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
                <Link href="/signup" className="btn-primary flex items-center justify-center gap-3 group">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="#demo" className="btn-secondary flex items-center justify-center gap-3">
                  Watch Demo
                </Link>
              </div>
              
              <div className="mt-16 flex items-center gap-8 animate-in fade-in duration-1000 delay-500">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-2 border-[#0d061c] bg-indigo-900/50 flex items-center justify-center overflow-hidden grayscale hover:grayscale-0 transition-all cursor-pointer">
                      <Image src={`/next.svg`} alt="User" width={24} height={24} className="opacity-60" />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-slate-400 font-medium">
                  <span className="text-white font-black text-lg mr-1">1,000+</span> candidates hired this month
                </div>
              </div>
            </div>

            <div className="relative animate-float animate-in zoom-in duration-1000 delay-300">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur-2xl opacity-20"></div>
              <div className="relative glass-card overflow-hidden p-2 bg-white/5 border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <Image 
                  src="/hero.png" 
                  alt="PrepAI Premium Dashboard" 
                  width={1000} 
                  height={800} 
                  className="rounded-[2rem] w-full h-auto object-cover shadow-2xl"
                  priority
                />
              </div>
              
              {/* Floating elements for depth */}
              <div className="absolute -top-10 -right-10 glass-card p-4 flex items-center gap-4 animate-bounce-slow">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Zap className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Confidence</div>
                  <div className="text-lg font-black">98%</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="max-w-2xl">
                <div className="text-indigo-400 font-bold tracking-[0.2em] uppercase text-sm mb-4">The Platform</div>
                <h2 className="text-4xl lg:text-6xl font-black mb-6">Everything you need <br /> to <span className="gradient-text">succeed</span></h2>
                <p className="text-slate-400 text-xl leading-relaxed">
                  Our AI-driven platform covers every aspect of the interview process, from the first application to the final offer.
                </p>
              </div>
              <Link href="/features" className="group flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
                Explore All Features
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard 
                icon={MessageSquare}
                title="AI Mock Interviews"
                description="Practice with realistic, role-specific questions and get instant feedback on your answers and body language."
              />
              <FeatureCard 
                icon={FileText}
                title="ATS Resume Scorer"
                description="Upload your resume and get it scanned by our AI to ensure it passes through Applicant Tracking Systems."
              />
              <FeatureCard 
                icon={Code}
                title="Coding Simulator"
                description="Solve technical challenges with a built-in compiler and get AI-assisted hints and optimizations."
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto glass-card p-16 lg:p-24 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-indigo-600/5 -z-10"></div>
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]"></div>
            
            <h2 className="text-5xl lg:text-7xl font-black mb-8">Ready to land your <br /><span className="gradient-text">dream job?</span></h2>
            <p className="text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who used PrepAI to ace their interviews at top tech companies.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="/signup" className="btn-primary text-xl px-12 py-5 shadow-[0_0_40px_rgba(99,102,241,0.3)]">
                Get Started Now — It's Free
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-2 text-slate-500 font-medium">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="ml-2 text-white">4.9/5 Rating</span> from 10k+ users
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg shadow-indigo-600/20">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter">PrepAI</span>
              </div>
              <p className="text-slate-400 text-lg max-w-sm mb-8">
                Empowering the next generation of professionals with AI-driven interview coaching and career growth tools.
              </p>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="w-4 h-4 bg-slate-400 rounded-sm"></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Mock Interviews</Link></li>
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Resume Scorer</Link></li>
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Coding Arena</Link></li>
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-slate-400 font-medium">
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-slate-500 font-medium">
              © 2026 PrepAI. Built for candidates everywhere.
            </div>
            <div className="flex gap-8 text-sm text-slate-500 font-medium">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
