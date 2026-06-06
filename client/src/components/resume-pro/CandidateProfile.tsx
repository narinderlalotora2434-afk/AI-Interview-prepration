// ============================================
// FILE: CandidateProfile.tsx
// Changes: Fixed LinkedIn/GitHub icons and added completeness score
// ============================================
"use client";

import React from 'react';
import { User, Mail, Phone, MapPin, Briefcase, AlertTriangle, Globe, Code } from 'lucide-react';

export const CandidateProfile = ({ info, missing }: { info: any, missing: string[] }) => {
  const fields = ['name', 'email', 'phone', 'location', 'experience', 'linkedin', 'github'];
  const filled = fields.filter(f => info[f] && info[f] !== 'Not found' && info[f] !== 'N/A').length;
  const completeness = Math.round((filled / fields.length) * 100);

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-primary" /> Candidate Information
      </h3>
      
      <div className="space-y-4 flex-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{info.name || 'Unknown'}</p>
            <p className="text-xs text-slate-500 font-medium truncate">Candidate Name</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{info.email || 'Not found'}</p>
            <p className="text-xs text-slate-500 font-medium truncate">Email</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-amber-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{info.phone || 'Not found'}</p>
            <p className="text-xs text-slate-500 font-medium truncate">Phone</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{info.location || 'N/A'}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Location</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{info.experience || 'N/A'}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Experience</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{info.linkedin || 'N/A'}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">LinkedIn</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-slate-700 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{info.github || 'N/A'}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">GitHub</p>
            </div>
          </div>
        </div>

        {missing && missing.length > 0 && (
          <div className="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-xl">
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-3.5 h-3.5" /> Missing Details
            </h4>
            <div className="flex flex-wrap gap-2">
              {missing.map((item: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-white border border-rose-200 text-rose-600 rounded-md text-xs font-bold">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-slate-100 mt-auto">
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <span>Profile Completeness</span>
            <span>{completeness}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full">
            <div 
              className={`h-full rounded-full ${
                completeness >= 80 ? 'bg-emerald-500' : 
                completeness >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
