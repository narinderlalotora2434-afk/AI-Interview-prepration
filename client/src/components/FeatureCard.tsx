import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: string;
}

export default function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <div className="bg-card border border-border p-8 rounded-xl shadow-md group hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1">
      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
        <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white uppercase tracking-tight">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">
        {description}
      </p>
    </div>
  );
}
