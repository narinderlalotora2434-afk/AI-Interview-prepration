"use client";

import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import { Activity, PieChart as PieChartIcon } from 'lucide-react';

export const RadarChartComp = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm h-full">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-primary" /> Profile Strengths (Radar)
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Radar name="Score" dataKey="A" stroke="#7C3AED" fill="#8B5CF6" fillOpacity={0.4} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const SkillDistributionChart = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-sm h-full">
      <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
        <PieChartIcon className="w-5 h-5 text-primary" /> Skill Distribution
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 13, fontWeight: 600 }} width={90} />
            <Tooltip 
              cursor={{ fill: '#f1f5f9' }} 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
