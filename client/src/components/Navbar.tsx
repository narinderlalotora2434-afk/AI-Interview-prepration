"use client";

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 px-4 md:px-6 py-4 md:py-6">
      <div className="max-w-7xl mx-auto glass-card px-4 md:px-8 py-3 md:py-4 border border-white/10 bg-white/5 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="bg-indigo-600 p-1.5 md:p-2 rounded-lg md:rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-600/30">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter">PrepAI</span>
          </Link>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-300">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#about" className="hover:text-white transition-colors">About</Link>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-300 hover:text-white transition-colors">Login</Link>
            <Link href="/signup" className="btn-primary text-xs md:text-sm py-2 md:py-3 px-4 md:px-6">
              Get Started
            </Link>
            
            {/* Mobile Toggle */}
            <button 
              className="md:hidden p-2 text-slate-300 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full mt-4 glass-card p-6 border border-white/10 bg-slate-900/95 backdrop-blur-3xl animate-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col gap-6 text-lg font-bold text-slate-300">
              <Link href="#features" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Pricing</Link>
              <Link href="#about" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">About</Link>
              <hr className="border-white/10" />
              <Link href="/login" onClick={() => setIsOpen(false)} className="hover:text-white transition-colors">Login</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
