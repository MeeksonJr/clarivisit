"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  HeartPulse,
  ShieldCheck,
  Activity,
  FileText,
  Apple,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  Lock,
  Calendar,
  Layers,
  ChevronRight,
  TrendingDown,
  Info,
  ExternalLink,
  Eye,
  Trash2
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"vitals" | "jargon" | "nutrition" | "vaccines">("vitals");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-sky-500 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full bg-grid-pattern">
        {/* ============================================================== */}
        {/* 1. ASYMMETRICAL SPLIT HERO SECTION                              */}
        {/* ============================================================== */}
        <section className="relative w-full pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-slate-200 dark:border-slate-800">
          {/* Subtle ambient light glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-400/15 via-teal-300/15 to-emerald-400/10 blur-3xl pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* LEFT COLUMN: Vertical Axis Content (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Clinical Trust Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/80 text-sky-800 dark:text-sky-300 text-xs font-semibold shadow-xs">
                  <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-pulse" />
                  <span>Multimodal AI for Hospital & Clinic After-Visit Summaries</span>
                </div>

                {/* Primary Headline with Editorial Typography */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                  Your doctor's visit summary,{" "}
                  <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                    finally in plain English.
                  </span>
                </h1>

                {/* Descriptive subhead */}
                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed">
                  Snap a photo of your printed After-Visit Summary (Epic, Cerner, or any clinic). ClariVisit decodes complex medical billing codes, puts your vitals in healthy perspective, maps doctor directives to real meals, and flags missed vaccines.
                </p>

                {/* Call-to-action buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-semibold text-white bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <UploadCloud className="w-5 h-5" />
                    <span>Upload & Translate Summary</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    <span>View Empty Dashboard</span>
                  </Link>
                </div>

                {/* Trust guarantee points */}
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Zero Data Selling</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Local-First Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Instant Permanent Deletion</span>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Asymmetrical Bento Box Live Card (5 cols) */}
              <div className="lg:col-span-5 relative">
                {/* Visual Glassmorphic Preview Card */}
                <div className="glass-panel rounded-3xl p-6 shadow-2xl shadow-sky-900/10 dark:shadow-black/50 border border-slate-200/80 dark:border-slate-800 space-y-4">
                  {/* Top card bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Live Clinical Translation
                      </span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                      Epic AVS Parsed
                    </span>
                  </div>

                  {/* Vitals Spectrum Highlight */}
                  <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800/80 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4 text-rose-500" />
                        Blood Pressure Reading
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        105 / 63 mmHg • Optimal
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-sky-400 w-1/4 h-full" />
                      <div className="bg-emerald-500 w-1/2 h-full" />
                      <div className="bg-amber-400 w-1/6 h-full" />
                      <div className="bg-rose-500 w-1/12 h-full" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Normal healthy baseline. Often seen in active individuals; no hypotension risk.
                    </p>
                  </div>

                  {/* Demystifier Card */}
                  <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-sky-900 dark:text-sky-200">
                      <Info className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>"Pre-Diabetes" Billing Screening</span>
                    </div>
                    <p className="text-xs text-sky-800 dark:text-sky-300 leading-snug">
                      <strong>Reassurance:</strong> Your doctor ordered routine Hemoglobin A1C bloodwork. This is a preventive baseline check, not an active diagnosis.
                    </p>
                  </div>

                  {/* Meal Swap Matrix Preview */}
                  <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/40 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-teal-900 dark:text-teal-200">
                      <span className="flex items-center gap-1.5">
                        <Apple className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        Actionable Dietary Swap
                      </span>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase">Provider Note</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/60 dark:bg-slate-900/60 border border-teal-200/50 dark:border-teal-800/40">
                      <span className="line-through text-slate-400">White rice & pasta</span>
                      <ArrowRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span className="font-semibold text-teal-700 dark:text-teal-300">Quinoa & Chickpea Pasta</span>
                    </div>
                  </div>

                  {/* Missing Vaccine Notification */}
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-medium">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Varicella (Chicken Pox): Never Done</span>
                    </div>
                    <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 underline">
                      Draft Portal Note
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. BENTO BOX CLINICAL INTELLIGENCE GRID                        */}
        {/* ============================================================== */}
        <section id="bento-features" className="w-full py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <h2 className="text-xs uppercase tracking-widest font-bold text-sky-600 dark:text-sky-400">
                End-To-End Clinical Decomposition
              </h2>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Everything doctors leave out, clarified in seconds.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Structured into an intuitive bento system designed for calm comprehension and daily execution.
              </p>
            </div>

            {/* Asymmetrical Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Box 1: Left Vertical Pillar (5 cols) */}
              <div className="lg:col-span-5 glass-panel rounded-3xl p-8 flex flex-col justify-between border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all shadow-sm">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Activity className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Vitals Spectrum & Normalcy Gauges
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    A raw number like 105/63 or 94% O2 saturation triggers unnecessary panic. ClariVisit plots your readings on visual spectrum bars, clarifying whether it's athletic, optimal, or requires attention.
                  </p>
                </div>

                <div className="pt-8 space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">BMI: 21.06</div>
                      <div className="text-[11px] text-slate-500">6' 3.25" • 169.6 lbs</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                      Healthy Range
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">Oxygen Saturation: 94%</div>
                      <div className="text-[11px] text-slate-500">Borderline normal check</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold text-[11px]">
                      Watch / Cold Hands
                    </span>
                  </div>
                </div>
              </div>

              {/* Box 2 & 3: Right Stacked Grid (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Horizontal Top Row */}
                <div className="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-all shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2 max-w-lg">
                      <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        <Apple className="w-4 h-4" />
                        <span>Actionable Meal & Workout Matrix</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        From Doctor Directives to 7-Day Groceries
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        When a provider writes "150 min exercise, cut white carbs, eat greens", we translate it into an exact weekly workout split and high-protein, fiber-rich dinner recipes.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <div className="p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-center">
                        <div className="text-2xl font-black text-teal-600 dark:text-teal-400">150</div>
                        <div className="text-[10px] uppercase font-semibold text-teal-700 dark:text-teal-300">Min/Week Target</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Split into Two Equal Sub-Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Sub-col 1: Lab Prep */}
                  <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      6-Lab Fasting Prep
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Explains CBC, CMP, A1c, Lipid Panel, and Urinalysis. Highlights exactly which tests require an 8-12 hour fast so you never have to reschedule.
                    </p>
                  </div>

                  {/* Sub-col 2: Vaccine Gaps & Calendar */}
                  <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      Vaccine Audit & Calendar
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Scans the immunization table for overdue or never-done boosters (like Varicella or MenB) and creates 1-click calendar invites for your next physical.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. ZERO-DATA COMPROMISE & PRIVACY PLEDGE                        */}
        {/* ============================================================== */}
        <section id="privacy-first" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto rounded-3xl glass-panel p-8 sm:p-12 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Privacy-By-Design & Local-First Philosophy</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Your medical data is yours alone.
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  We believe personal health summaries should never be mined, packaged, or shared. All documents are analyzed in a transient, privacy-isolated environment. Your visit history is cached in your local browser storage.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>No selling to insurers or advertisers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>1-Click Permanent Data Purge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Export your records as JSON anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Zero AI training on your records</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <ShieldCheck className="w-12 h-12 text-emerald-500" />
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Patient Vault Guarantee
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Delete your visits with zero server trace whenever you want.
                </p>
                <Link
                  href="/dashboard/settings"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  <span>Explore Privacy Settings</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. FINAL CTA BANNER                                             */}
        {/* ============================================================== */}
        <section className="w-full py-20 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Ready to understand your after-visit summary?
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              No medical jargon. No mystery billing codes. Just instant clarity and peace of mind for you and your family.
            </p>
            <div className="pt-2 flex justify-center">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold text-white bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 shadow-xl shadow-sky-500/30 transition-all hover:scale-105"
              >
                <UploadCloud className="w-6 h-6" />
                <span>Get Started In 30 Seconds</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
