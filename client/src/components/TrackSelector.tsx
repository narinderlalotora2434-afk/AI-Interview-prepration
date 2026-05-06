"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, CheckCircle2 } from 'lucide-react';

interface TrackSelectorProps {
  selectedTrack: 'software' | 'hardware' | null;
  onSelect: (track: 'software' | 'hardware') => void;
}

const TrackSelector: React.FC<TrackSelectorProps> = ({ selectedTrack, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect('software')}
        className={`p-8 rounded-3xl border-2 transition-all text-left relative overflow-hidden group ${
          selectedTrack === 'software' 
            ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]' 
            : 'bg-white/5 border-white/10 hover:border-white/20'
        }`}
      >
        <div className="relative z-10">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
            selectedTrack === 'software' ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400 group-hover:text-white'
          }`}>
            <Code className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Software Track</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            DSA, Web Development, Backend, and System Design. Perfect for SWE roles.
          </p>
        </div>
        {selectedTrack === 'software' && (
          <CheckCircle2 className="absolute top-6 right-6 w-6 h-6 text-indigo-500" />
        )}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect('hardware')}
        className={`p-8 rounded-3xl border-2 transition-all text-left relative overflow-hidden group ${
          selectedTrack === 'hardware' 
            ? 'bg-rose-600/10 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.2)]' 
            : 'bg-white/5 border-white/10 hover:border-white/20'
        }`}
      >
        <div className="relative z-10">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
            selectedTrack === 'hardware' ? 'bg-rose-500 text-white' : 'bg-white/10 text-slate-400 group-hover:text-white'
          }`}>
            <Cpu className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Hardware Track</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            VLSI, Embedded Systems, Digital Electronics, and Circuit Design.
          </p>
        </div>
        {selectedTrack === 'hardware' && (
          <CheckCircle2 className="absolute top-6 right-6 w-6 h-6 text-rose-500" />
        )}
      </motion.button>
    </div>
  );
};

export default TrackSelector;
