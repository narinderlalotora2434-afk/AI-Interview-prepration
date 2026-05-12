"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-1 w-20 h-10 rounded-full bg-secondary border border-border" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="relative inline-flex h-10 w-20 items-center justify-center rounded-full bg-secondary p-1 border border-border shadow-inner">
      <motion.div
        className="absolute h-8 w-8 rounded-full bg-background shadow-md border border-border"
        animate={{ x: isDark ? 20 : -20 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
      <button
        onClick={() => setTheme("light")}
        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${!isDark ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        aria-label="Switch to light mode"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isDark ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        aria-label="Switch to dark mode"
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}
