"use client";

import React from 'react';
import { motion } from 'framer-motion';
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

export const DashboardLayout = ({ analysis, onReset }: { analysis: any, onReset: () => void }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analysis Dashboard</h2>
          <p className="text-slate-500 font-medium mt-1">Comprehensive breakdown of your profile</p>
        </div>
        <button 
          onClick={onReset}
          className="px-5 py-2.5 bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-700 font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Upload Another Resume
        </button>
      </div>

      {/* Row 1: Score, Profile, Career Path */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col items-center justify-center">
          <ATSScoreRing score={analysis.totalScore} />
          <div className="text-center mt-4">
            <h3 className="font-bold text-slate-900 text-lg">
              {analysis.totalScore >= 80 ? 'Excellent! 🌟' : analysis.totalScore >= 60 ? 'Good, Needs Tweaks 👍' : 'Needs Work ⚠️'}
            </h3>
            <p className="text-sm text-slate-500">Placement Readiness: {analysis.placementReadiness}%</p>
          </div>
        </div>
        <div className="lg:col-span-5">
          <CandidateProfile info={analysis.parsedInfo} missing={analysis.missingDetails} />
        </div>
        <div className="lg:col-span-4">
          <CareerPathDetector path={analysis.careerPath} />
        </div>
      </div>

      {/* Row 2: Breakdown Cards */}
      <ATSBreakdownCards data={analysis.atsBreakdown} />

      {/* Row 3: Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <RadarChartComp data={analysis.radarData} />
        <SkillDistributionChart data={analysis.skillsDistribution} />
      </div>

      {/* Row 4: Strengths & Weaknesses */}
      <StrengthsWeaknesses strengths={analysis.strengths} weaknesses={analysis.weaknesses} />

      {/* Row 5: Keywords & Skills Gap */}
      <div className="grid lg:grid-cols-2 gap-6">
        <KeywordAnalysis keywords={analysis.keywords} />
        <SkillsGapAnalysis skillsGap={analysis.skillsGap} />
      </div>

      {/* Row 6: Section Analysis */}
      <SectionAnalysis data={analysis.sectionAnalysis} certifications={analysis.certifications} />

      {/* Row 7: Recruiter & Job Matcher */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RecruiterFeedback feedback={analysis.recruiterFeedback} />
        </div>
        <div className="lg:col-span-5">
          <JobDescriptionMatcher />
        </div>
      </div>

      {/* Row 8: AI Improvements */}
      <AIImprovements data={analysis.aiImprovements} />

      {/* Row 9: Roadmap & Export */}
      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ImprovementRoadmap roadmap={analysis.roadmap} />
        </div>
        <div className="lg:col-span-4">
          <ExportActions />
        </div>
      </div>

    </div>
  );
};
