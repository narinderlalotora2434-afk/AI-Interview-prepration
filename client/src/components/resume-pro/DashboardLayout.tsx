// FILE: DashboardLayout.tsx | JD-aware ATS scoring system
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { FileText } from 'lucide-react';
import { ATSScoreRing } from './ATSScoreRing';
import { CandidateProfile } from './CandidateProfile';
import { ATSBreakdownCards } from './ATSBreakdownCards';
import { RadarChartComp, SkillDistributionChart } from './AnalyticsCharts';
import { StrengthsWeaknesses } from './StrengthsWeaknesses';
import { KeywordAnalysis } from './KeywordAnalysis';
import { SkillsGapAnalysis } from './SkillsGapAnalysis';
import { SectionAnalysis } from './SectionAnalysis';
import { CareerPathDetector, RecruiterFeedback } from './CareerPathDetector';
import { JobDescriptionMatcher, AIImprovements } from './JobAndAI';
import { ImprovementRoadmap, ExportActions } from './RoadmapAndExport';
import { 
  parseJobDescription, calculateJDScore, DOMAIN_CONFIGS, detectDomain, 
  recalculateWithDomain, JDAnalysis, JDScoreResult, ResumeDomain, DomainConfig 
} from './domainConfig';

interface DashboardAnalysis {
  keywords?: any;
  skillsGap?: any;
  atsBreakdown: any;
  totalScore: number;
  placementReadiness: number;
  parsedInfo: any;
  missingDetails: string[];
  careerPath: any;
  radarData: any[];
  skillsDistribution: any[];
  strengths: string[];
  weaknesses: string[];
  sectionAnalysis: any;
  certifications: any;
  recruiterFeedback: string;
  aiImprovements: any;
  roadmap: any[];
}

export const DashboardLayout = ({ analysis, onReset }: { analysis: DashboardAnalysis, onReset: () => void }) => {
  const [jdText, setJdText] = useState<string>('');
  const [jdAnalysis, setJdAnalysis] = useState<JDAnalysis | null>(null);
  const [jdScores, setJdScores] = useState<JDScoreResult | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const [domainOverride, setDomainOverride] = useState<ResumeDomain | null>(null);

  const detectedDomain = useMemo(() => 
    domainOverride || detectDomain('', analysis.skillsGap?.found || []), 
  [analysis, domainOverride]);

  const handleJDSubmit = (text: string) => {
    setJdText(text);
    const parsed = parseJobDescription(text);
    setJdAnalysis(parsed);
    const scores = calculateJDScore(
      analysis.skillsGap?.found || [],
      parsed,
      detectedDomain
    );
    setJdScores(scores);
  };

  const recalculated = useMemo(() => {
    if (jdScores) {
      // JD provided: override ATS scores completely
      return {
        ...analysis,
        totalScore: jdScores.totalScore,
        atsBreakdown: {
          ...analysis.atsBreakdown,
          compatibility: jdScores.compatibility,
          keywordsMatch: jdScores.keywordsMatch,
          skillsCoverage: jdScores.skillsCoverage,
        },
        // Override keywords with JD-matched ones
        keywords: {
          matched: jdScores.matchedRequiredSkills
            .concat(jdScores.matchedPreferredSkills),
          missing: jdScores.missingRequiredSkills
            .concat(jdScores.missingPreferredSkills),
          priority: jdScores.missingRequiredSkills.slice(0, 5)
        }
      };
    }
    // No JD: use domain-based recalculation
    return recalculateWithDomain(analysis, detectedDomain);
  }, [analysis, jdScores, detectedDomain]);

  useEffect(() => {
    const el = document.querySelector('.dashboard-scroll-container') || window;
    const handler = () => {
      const scrollTop = el instanceof Window ? window.scrollY : el.scrollTop;
      setScrolled(scrollTop > 200);
    };
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {scrolled && (
        <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-6 py-3 flex items-center justify-between animate-in slide-in-from-top-2 duration-300">
          <span className="font-bold text-slate-700 text-sm">
            ATS Score
          </span>
          <span className={`text-2xl font-black ${
            recalculated.totalScore >= 80 ? 'text-emerald-600' : 
            recalculated.totalScore >= 60 ? 'text-amber-600' : 
            'text-rose-600'}`}>
            {recalculated.totalScore}
          </span>
        </div>
      )}

      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analysis Dashboard</h2>
          <p className="text-slate-500 font-medium mt-1">Comprehensive breakdown of your profile</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={detectedDomain}
            onChange={(e) => setDomainOverride(e.target.value as ResumeDomain)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-sm"
          >
            {Object.entries(DOMAIN_CONFIGS).map(([key, config]) => (
              <option key={key} value={key}>{config.icon} {config.label}</option>
            ))}
          </select>
          <button 
            onClick={onReset}
            className="px-5 py-2.5 bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-700 font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Upload Another Resume
          </button>
        </div>
      </div>

      {jdScores && (
        <div className="flex items-center gap-3 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <p className="text-sm font-black text-emerald-800">
            JD Mode Active — Scores recalculated against your job description
          </p>
          <button 
            onClick={() => { setJdScores(null); setJdAnalysis(null); }}
            className="ml-auto text-xs font-bold text-emerald-600 hover:text-emerald-800 underline"
          >
            Clear JD
          </button>
        </div>
      )}

      {/* Row 1: Score, Profile, Career Path */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center">
          <ATSScoreRing score={recalculated.totalScore} />
          <div className="text-center mt-4">
            <h3 className="font-bold text-slate-900 text-lg">
              {recalculated.totalScore >= 80 ? 'Excellent! 🌟' : recalculated.totalScore >= 60 ? 'Good, Needs Tweaks 👍' : 'Needs Work ⚠️'}
            </h3>
            <p className="text-sm text-slate-500">Placement Readiness: {recalculated.placementReadiness}%</p>
          </div>
        </div>
        <div className="lg:col-span-5">
          <CandidateProfile info={recalculated.parsedInfo} missing={recalculated.missingDetails} />
        </div>
        <div className="lg:col-span-4">
          <CareerPathDetector path={recalculated.careerPath} />
        </div>
      </div>

      {/* Row 2: Breakdown Cards */}
      <ATSBreakdownCards data={recalculated.atsBreakdown} />

      {/* Row 3: Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RadarChartComp data={recalculated.radarData} />
        <SkillDistributionChart data={recalculated.skillsDistribution} />
      </div>

      {/* Row 4: Strengths & Weaknesses */}
      <StrengthsWeaknesses strengths={recalculated.strengths} weaknesses={recalculated.weaknesses} />

      {/* Row 5: Keywords & Skills Gap */}
      <div className="grid lg:grid-cols-2 gap-6">
        <KeywordAnalysis keywords={recalculated.keywords} domain={detectedDomain} jdAnalysis={jdAnalysis} />
        <SkillsGapAnalysis skillsGap={recalculated.skillsGap} domain={detectedDomain} domainConfig={DOMAIN_CONFIGS[detectedDomain]} jdAnalysis={jdAnalysis} />
      </div>

      {/* Row 6: Section Analysis */}
      <SectionAnalysis data={recalculated.sectionAnalysis} certifications={recalculated.certifications} />

      {/* Row 7: Recruiter & Job Matcher */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RecruiterFeedback feedback={recalculated.recruiterFeedback} />
        </div>
        <div className="lg:col-span-5">
          <JobDescriptionMatcher onJDAnalyzed={handleJDSubmit} />
        </div>
      </div>

      {/* Row 8: AI Improvements */}
      <AIImprovements data={recalculated.aiImprovements} />

      {/* Row 9: Roadmap & Export */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ImprovementRoadmap roadmap={recalculated.roadmap} />
        </div>
        <div className="lg:col-span-4">
          <ExportActions />
        </div>
      </div>

    </div>
  );
};
