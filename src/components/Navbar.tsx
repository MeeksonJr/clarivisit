"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { ShieldCheck, HeartPulse, Menu, X, ArrowRight, Sparkles } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                Clari<span className="text-sky-600 dark:text-sky-400">Visit</span>
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                AI Health
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#how-it-works" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            How It Works
          </a>
          <a href="#bento-features" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
            Clinical Intelligence
          </a>
          <a href="#privacy-first" className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Zero-Data Pledge</span>
          </a>
        </nav>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 shadow-sm shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-5 space-y-4">
          <a
            href="#how-it-works"
            onClick={() => setMobileOpen(false)}
            className="block text-base font-medium text-slate-700 dark:text-slate-200"
          >
            How It Works
          </a>
          <a
            href="#bento-features"
            onClick={() => setMobileOpen(false)}
            className="block text-base font-medium text-slate-700 dark:text-slate-200"
          >
            Clinical Intelligence
          </a>
          <a
            href="#privacy-first"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 text-base font-medium text-emerald-600 dark:text-emerald-400"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span>Zero-Data Pledge</span>
          </a>
          <div className="pt-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-white bg-sky-600 dark:bg-sky-500 shadow-sm"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
