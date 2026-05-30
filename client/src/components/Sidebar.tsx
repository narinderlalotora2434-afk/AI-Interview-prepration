"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  LayoutDashboard, 
  Zap, 
  Map as MapIcon, 
  Brain, 
  Code, 
  MessageSquare, 
  FileText, 
  Settings,
  User,
  Mic,
  BarChart2,
  LogOut,
  X,
  Sparkles
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/quests", label: "Daily Quests", icon: Zap, color: "text-amber-500" },
    { href: "/roadmaps", label: "Roadmaps", icon: MapIcon, color: "text-primary" },
    { href: "/aptitude", label: "Aptitude", icon: Brain, color: "text-accent" },
    { href: "/coding", label: "Coding Arena", icon: Code, color: "text-emerald-500" },
    { href: "/interview", label: "AI Interview", icon: MessageSquare, color: "text-primary" },
    { href: "/analytics", label: "Performance", icon: BarChart2, color: "text-secondary" },
    { href: "/resume", label: "Resume Pro", icon: FileText, color: "text-primary" },
    { href: "/profile", label: "Profile", icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [level, setLevel] = useState<number>(1);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const dashboardCache = localStorage.getItem("dashboard_cache");
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }

    if (dashboardCache) {
      try {
        const data = JSON.parse(dashboardCache);
        if (data?.analytics?.xp) {
          setLevel(Math.floor(data.analytics.xp / 100) + 1);
        }
      } catch (e) {
        console.error("Failed to parse dashboard cache", e);
      }
    }
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-72 md:w-64 border-r border-border bg-white p-6 flex flex-col shrink-0 z-[70] transition-transform duration-500 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center group-hover:rotate-12 transition-transform shadow-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-primary">PrepAI</span>
          </Link>
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link 
                key={item.href}
                href={item.href} 
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all group relative ${
                  isActive 
                    ? 'bg-primary/5 text-primary' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${item.color || ''}`} />
                <span className="whitespace-nowrap">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute left-0 w-1 h-6 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-border space-y-4">
          {user && (
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary border border-border shadow-sm">
                {user.name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate text-text-primary">{user.name}</p>
                <p className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Level {level} Member</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between gap-2">
            <button 
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-text-secondary hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all group border border-transparent hover:border-rose-100"
            >
              <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
