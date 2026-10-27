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
  Info,
  ExternalLink,
  Users,
  Baby,
  GraduationCap,
  Stethoscope,
  HeartHandshake
} from "lucide-react";

type AudienceType = "teens" | "parents" | "adults" | "clinicians";

interface DemoScenario {
  title: string;
  badge: string;
  bp: string;
  bpStatus: string;
  bpText: string;
  jargonTitle: string;
  jargonExplanation: string;
  swapAvoid: string;
  swapAlternative: string;
  swapReason: string;
  vaccineNotice: string;
}

const DEMO_SCENARIOS: Record<string, DemoScenario> = {
  wellness: {
    title: "Annual Preventive Physical",
    badge: "Routine Adult Exam",
    bp: "118 / 76 mmHg",
    bpStatus: "Optimal",
    bpText: "Excellent arterial elasticity and cardiovascular efficiency. Well within healthy guidelines.",
    jargonTitle: "Routine Metabolic Panel Order",
    jargonExplanation: "Reassurance: Baseline screening to verify liver and kidney wellness, not a sign of illness.",
    swapAvoid: "White breads & refined pastas",
    swapAlternative: "Quinoa, rolled oats & brown rice",
    swapReason: "Supplies steady energy and healthy fiber without glucose spikes.",
    vaccineNotice: "Tetanus (Tdap) Booster: Recommended every 10 years",
  },
  pediatric: {
    title: "Well-Child Pediatric Visit",
    badge: "Age 6 Checkup",
    bp: "96 / 62 mmHg",
    bpStatus: "Normal Pediatric",
    bpText: "Normal healthy blood pressure for children aged 5-8.",
    jargonTitle: "Developmental Screening Tool",
    jargonExplanation: "Standard growth milestone assessment verifying fine motor skills and speech progression.",
    swapAvoid: "Sugary fruit juices & sodas",
    swapAlternative: "Water infused with berries & orange slices",
    swapReason: "Protects developing teeth and avoids afternoon energy crashes.",
    vaccineNotice: "MMR Booster: Due before 1st grade entry",
  },
  senior: {
    title: "Medicare Wellness Check",
    badge: "Healthy Aging Protocol",
    bp: "124 / 78 mmHg",
    bpStatus: "Controlled / Healthy",
    bpText: "Normal target range for active seniors under current clinical guidelines.",
    jargonTitle: "Cognitive & Mobility Assessment",
    jargonExplanation: "Annual wellness check of balance, joint flexibility, and memory retention.",
    swapAvoid: "High-sodium processed soups",
    swapAlternative: "Low-sodium homemade bone broth & lentils",
    swapReason: "Eases kidney workload and supports cardiovascular balance.",
    vaccineNotice: "Shingles (Shingrix) 2-dose series: Complete",
  },
};

export default function LandingPage() {
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>("teens");
  const [activeScenarioKey, setActiveScenarioKey] = useState<string>("wellness");

  const currentScenario = DEMO_SCENARIOS[activeScenarioKey];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-sky-500 selection:text-white">
      <Navbar />

      <main className="flex-1 w-full bg-grid-pattern">
        {/* ============================================================== */}
        {/* 1. ASYMMETRICAL SPLIT HERO SECTION                              */}
        {/* ============================================================== */}
        <section className="relative w-full pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-slate-200 dark:border-slate-800">
          {/* Subtle ambient light glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-gradient-to-tr from-sky-500/15 via-teal-400/15 to-emerald-400/10 blur-3xl pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* LEFT COLUMN: Vertical Axis Content (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Clinical Trust Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-semibold shadow-xs">
                  <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-pulse" />
                  <span>Multimodal Health Intelligence for Hospital & Clinic Summaries</span>
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
                  Snap a photo of your printed After-Visit Summary from any clinic. ClariVisit decodes complex billing codes, puts your vitals in healthy perspective, maps doctor directives into real meals, and flags missed vaccines.
                </p>

                {/* Call-to-action buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl text-base font-semibold text-white bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <UploadCloud className="w-5 h-5" />
                    <span>Upload & Decode Summary</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    <span>Open Dashboard</span>
                  </Link>
                </div>

                {/* Trust guarantee points */}
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
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
                <div className="glass-panel rounded-3xl p-6 shadow-2xl shadow-sky-900/10 dark:shadow-black/60 border border-slate-200/90 dark:border-slate-800 space-y-4">
                  {/* Top card bar with scenario selector */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Interactive Live Preview
                      </span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/80">
                      {currentScenario.badge}
                    </span>
                  </div>

                  {/* Scenario Toggle Pills */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-[11px] font-semibold">
                    <button
                      onClick={() => setActiveScenarioKey("wellness")}
                      className={`py-1.5 rounded-lg transition-all ${
                        activeScenarioKey === "wellness"
                          ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                      }`}
                    >
                      Adult Physical
                    </button>
                    <button
                      onClick={() => setActiveScenarioKey("pediatric")}
                      className={`py-1.5 rounded-lg transition-all ${
                        activeScenarioKey === "pediatric"
                          ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                      }`}
                    >
                      Child / Parent
                    </button>
                    <button
                      onClick={() => setActiveScenarioKey("senior")}
                      className={`py-1.5 rounded-lg transition-all ${
                        activeScenarioKey === "senior"
                          ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                      }`}
                    >
                      Senior Care
                    </button>
                  </div>

                  {/* Vitals Spectrum Highlight */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4 text-rose-500" />
                        Blood Pressure Spectrum
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/80">
                        {currentScenario.bp} • {currentScenario.bpStatus}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-sky-400 w-1/4 h-full" />
                      <div className="bg-emerald-500 w-1/2 h-full" />
                      <div className="bg-amber-400 w-1/6 h-full" />
                      <div className="bg-rose-500 w-1/12 h-full" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {currentScenario.bpText}
                    </p>
                  </div>

                  {/* Demystifier Card */}
                  <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/60 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-sky-900 dark:text-sky-200">
                      <Info className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <span>{currentScenario.jargonTitle}</span>
                    </div>
                    <p className="text-xs text-sky-800 dark:text-sky-300 leading-snug">
                      {currentScenario.jargonExplanation}
                    </p>
                  </div>

                  {/* Meal Swap Matrix Preview */}
                  <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-100 dark:border-teal-900/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-teal-900 dark:text-teal-200">
                      <span className="flex items-center gap-1.5">
                        <Apple className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                        Actionable Dietary Guidance
                      </span>
                      <span className="text-[10px] text-teal-600 dark:text-teal-400 uppercase font-bold">Swap</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-teal-200/60 dark:border-teal-800/60">
                      <span className="line-through text-slate-400">{currentScenario.swapAvoid}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mx-1" />
                      <span className="font-semibold text-teal-700 dark:text-teal-300 truncate">
                        {currentScenario.swapAlternative}
                      </span>
                    </div>
                  </div>

                  {/* Vaccine / Preventive Alert */}
                  <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/70 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-medium">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span className="truncate">{currentScenario.vaccineNotice}</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase shrink-0">
                      Calendar Sync
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. WHO CLARIVISIT EMPOWERS (PATIENT AUDIENCES SECTION)         */}
        {/* ============================================================== */}
        <section className="w-full py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-sky-600 dark:text-sky-400">
                Tailored Health Clarity
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                Built for every stage of your healthcare journey.
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Whether you're taking charge of your first physical or managing a child's immunizations, ClariVisit adapts to your needs.
              </p>
            </div>

            {/* Audience Category Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setSelectedAudience("teens")}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  selectedAudience === "teens"
                    ? "bg-sky-600 text-white shadow-md shadow-sky-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Teens & Young Adults</span>
              </button>

              <button
                onClick={() => setSelectedAudience("parents")}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  selectedAudience === "parents"
                    ? "bg-sky-600 text-white shadow-md shadow-sky-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Baby className="w-4 h-4" />
                <span>Parents & Families</span>
              </button>

              <button
                onClick={() => setSelectedAudience("adults")}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  selectedAudience === "adults"
                    ? "bg-sky-600 text-white shadow-md shadow-sky-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>Adults & Longevity</span>
              </button>

              <button
                onClick={() => setSelectedAudience("clinicians")}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  selectedAudience === "clinicians"
                    ? "bg-sky-600 text-white shadow-md shadow-sky-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <Stethoscope className="w-4 h-4" />
                <span>Doctors & Care Teams</span>
              </button>
            </div>

            {/* Audience Spotlight Box */}
            <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 max-w-4xl mx-auto shadow-sm">
              {selectedAudience === "teens" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-8 space-y-4">
                    <span className="text-xs uppercase font-bold text-sky-600 dark:text-sky-400 tracking-wider">
                      Empowering Young Adults
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Taking ownership of your first independent medical physicals.
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Leaving pediatricians for adult clinics can feel overwhelming. ClariVisit demystifies routine lab orders, teaches you what blood pressure and resting heart rates mean, and translates doctor exercise targets into fun workout routines.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300 pt-2 font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Demystifies confusing billing diagnosis codes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Fasting preparation reminders for morning blood draws</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-4 p-6 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-center space-y-2">
                    <GraduationCap className="w-10 h-10 text-sky-600 mx-auto" />
                    <div className="font-bold text-sm text-sky-900 dark:text-sky-200">
                      100% Private to You
                    </div>
                    <p className="text-xs text-sky-700 dark:text-sky-400">
                      Your summary stays encrypted in your personal browser vault.
                    </p>
                  </div>
                </div>
              )}

              {selectedAudience === "parents" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-8 space-y-4">
                    <span className="text-xs uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider">
                      Peace of Mind for Families
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Never wonder what the pediatrician noted on the summary.
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Track immunization tables, school vaccination requirements, and developmental percentiles. ClariVisit alerts you when required boosters are marked "Never done" so your child never falls behind for school registrations.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300 pt-2 font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Flags missing school & camp vaccines</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Drafts pre-written portal questions for the pediatrician</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-4 p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-center space-y-2">
                    <Baby className="w-10 h-10 text-teal-600 mx-auto" />
                    <div className="font-bold text-sm text-teal-900 dark:text-teal-200">
                      Family Vaccine Guard
                    </div>
                    <p className="text-xs text-teal-700 dark:text-teal-400">
                      Catches documentation errors before school forms are due.
                    </p>
                  </div>
                </div>
              )}

              {selectedAudience === "adults" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-8 space-y-4">
                    <span className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                      Longevity & Metabolic Wellness
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Actionable protocols that bridge clinical advice and daily meals.
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Physicians rarely have time to explain how to reduce simple carbohydrates or hit 150 minutes of weekly aerobic conditioning. ClariVisit generates high-fiber recipes, grocery shopping lists, and 30-minute cardio splits.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300 pt-2 font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Low-glycemic carb swap matrix for dinner</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>CMP, Lipid Panel, and A1c fasting checklists</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-4 p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                    <Apple className="w-10 h-10 text-emerald-600 mx-auto" />
                    <div className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                      From Clinic to Kitchen
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      Turns clinical directives into actual shopping cart items.
                    </p>
                  </div>
                </div>
              )}

              {selectedAudience === "clinicians" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-8 space-y-4">
                    <span className="text-xs uppercase font-bold text-sky-600 dark:text-sky-400 tracking-wider">
                      Provider & Primary Care Support
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Patients who understand their instructions adhere 2.5x better.
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Clinicians spend hours managing post-visit phone calls from anxious patients misinterpreting routine billing codes. ClariVisit enhances health literacy, ensures patients fast properly for labs, and encourages proactive annual follow-ups.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300 pt-2 font-medium">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>Eliminates cancelled blood draws due to non-fasting</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>1-Click .ics calendar sync for next year's physical</span>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-4 p-6 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-center space-y-2">
                    <Stethoscope className="w-10 h-10 text-sky-600 mx-auto" />
                    <div className="font-bold text-sm text-sky-900 dark:text-sky-200">
                      Higher Patient Adherence
                    </div>
                    <p className="text-xs text-sky-700 dark:text-sky-400">
                      Reinforces the doctor-patient relationship with calm clarity.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. BENTO BOX CLINICAL INTELLIGENCE GRID                        */}
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
                    Raw vital figures trigger unnecessary panic. ClariVisit plots your readings on visual spectrum bars, clarifying whether it's athletic, optimal, or requires attention.
                  </p>
                </div>

                <div className="pt-8 space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">BMI: 22.4</div>
                      <div className="text-[11px] text-slate-500">5' 10" • 155 lbs</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                      Healthy Range
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">Oxygen Saturation: 98%</div>
                      <div className="text-[11px] text-slate-500">Optimal room-air reading</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                      Optimal
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
                      <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-center">
                        <div className="text-2xl font-black text-teal-600 dark:text-teal-400">150</div>
                        <div className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300">Min/Week Target</div>
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
                      Lab Fasting Preparation
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Explains CMP, Lipid Panels, and Hemoglobin A1C. Highlights exactly which tests require an 8-12 hour fast so you never have to reschedule.
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
                      Scans immunization records for overdue or never-done boosters and creates 1-click calendar invites for your next physical.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. ZERO-DATA COMPROMISE & PRIVACY PLEDGE                        */}
        {/* ============================================================== */}
        <section id="privacy-first" className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto rounded-3xl glass-panel p-8 sm:p-12 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Privacy-By-Design & Local-First Architecture</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Your medical data is yours alone.
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  We believe personal health summaries should never be mined, packaged, or shared. All documents are analyzed in a transient, privacy-isolated environment. Your visit history is cached in your local browser storage.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300 pt-2 font-medium">
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
                    <span>Zero AI training on your private records</span>
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
        {/* 5. FINAL CALL TO ACTION                                         */}
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
