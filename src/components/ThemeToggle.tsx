"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs">
      <button
        onClick={() => setTheme("light")}
        title="Light Mode"
        className={`p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
          theme === "light"
            ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        }`}
        aria-label="Switch to Light Theme"
      >
        <Sun className="w-4 h-4" />
        {showLabel && <span>Light</span>}
      </button>

      <button
        onClick={() => setTheme("dark")}
        title="Dark Mode"
        className={`p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
          theme === "dark"
            ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        }`}
        aria-label="Switch to Dark Theme"
      >
        <Moon className="w-4 h-4" />
        {showLabel && <span>Dark</span>}
      </button>

      <button
        onClick={() => setTheme("system")}
        title="System Preference"
        className={`p-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
          theme === "system"
            ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-xs"
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        }`}
        aria-label="Follow System Theme"
      >
        <Laptop className="w-4 h-4" />
        {showLabel && <span>Auto</span>}
      </button>
    </div>
  );
}
