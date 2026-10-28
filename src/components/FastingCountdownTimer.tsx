"use client";

import React, { useState, useEffect } from "react";
import { FastingTimerConfig, getFastingTimerConfig, saveFastingTimerConfig } from "@/lib/storage";
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Droplets,
  Coffee,
  Sparkles,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Play,
  Pause,
  ShieldCheck,
  Check,
  X
} from "lucide-react";
import confetti from "canvas-confetti";

interface FastingCountdownTimerProps {
  defaultHours?: number;
}

export function FastingCountdownTimer({ defaultHours = 10 }: FastingCountdownTimerProps) {
  const [config, setConfig] = useState<FastingTimerConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  // Form states for setting up the timer
  // Default scheduled draw time is tomorrow at 8:00 AM
  const getDefaultTarget = () => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    tmrw.setHours(8, 0, 0, 0);
    // Format YYYY-MM-DDTHH:mm
    const tzOffset = tmrw.getTimezoneOffset() * 60000;
    return new Date(tmrw.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const [targetInput, setTargetInput] = useState(getDefaultTarget());
  const [hoursInput, setHoursInput] = useState(defaultHours);

  // Real-time ticking state
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const loaded = getFastingTimerConfig();
    if (loaded) {
      setConfig(loaded);
      setHoursInput(loaded.fastingHours);
      try {
        const d = new Date(loaded.targetDateTime);
        const tzOffset = d.getTimezoneOffset() * 60000;
        setTargetInput(new Date(d.getTime() - tzOffset).toISOString().slice(0, 16));
      } catch {
        // ignore
      }
    } else {
      // Auto-initialize default tomorrow 8:00 AM
      const initialConfig: FastingTimerConfig = {
        targetDateTime: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
        fastingHours: 10,
        isActive: true,
      };
      setConfig(initialConfig);
      saveFastingTimerConfig(initialConfig);
    }

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleStartTimer = (e: React.FormEvent) => {
    e.preventDefault();
    const targetDate = new Date(targetInput);
    if (isNaN(targetDate.getTime())) return;

    const newConfig: FastingTimerConfig = {
      targetDateTime: targetDate.toISOString(),
      fastingHours: hoursInput,
      isActive: true,
    };

    setConfig(newConfig);
    saveFastingTimerConfig(newConfig);
    setIsEditing(false);

    try {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
  };

  const handleClearTimer = () => {
    setConfig(null);
    saveFastingTimerConfig(null);
    setIsEditing(false);
  };

  // Calculations
  const targetTime = config?.targetDateTime ? new Date(config.targetDateTime).getTime() : 0;
  const fastingDurationMs = (config?.fastingHours || 10) * 3600 * 1000;
  const startTime = targetTime - fastingDurationMs;
  const currentTime = now.getTime();

  const isPreFasting = currentTime < startTime;
  const isFastingActive = currentTime >= startTime && currentTime < targetTime;
  const isCompleted = currentTime >= targetTime;

  // Compute remaining time
  const msToCount = isPreFasting
    ? startTime - currentTime
    : isFastingActive
    ? targetTime - currentTime
    : 0;

  const totalSeconds = Math.max(0, Math.floor(msToCount / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  // Progress percentage
  let progressPct = 0;
  if (isFastingActive) {
    const elapsed = currentTime - startTime;
    progressPct = Math.min(100, Math.round((elapsed / fastingDurationMs) * 100));
  } else if (isCompleted) {
    progressPct = 100;
  }

  const formatDateTime = (ms: number) => {
    if (!ms) return "--";
    return new Date(ms).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 space-y-6">
      {/* Header & Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Overnight Fasting Hub
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isFastingActive
                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse"
                    : isCompleted
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300"
                }`}
              >
                {isFastingActive ? "⏳ FASTING ACTIVE" : isCompleted ? "✓ FAST COMPLETE" : "⏰ PRE-FAST WINDOW"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              Live Fasting Countdown & Protocol
            </h2>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs self-start sm:self-auto"
        >
          {isEditing ? <X className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5 text-amber-600" />}
          <span>{isEditing ? "Close Setup" : "Adjust Appointment Time"}</span>
        </button>
      </div>

      {/* Editing Drawer Form */}
      {isEditing && (
        <form onSubmit={handleStartTimer} className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 text-xs animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Scheduled Blood Draw Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-amber-500 font-medium font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Required Fasting Duration
              </label>
              <select
                value={hoursInput}
                onChange={(e) => setHoursInput(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-amber-500 font-medium text-xs cursor-pointer"
              >
                <option value={8}>8 Hours (Standard Fast)</option>
                <option value={10}>10 Hours (Recommended Overnight Protocol)</option>
                <option value={12}>12 Hours (Strict Lipid & CMP Fast)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={handleClearTimer}
              className="text-xs font-semibold text-rose-600 hover:underline"
            >
              Reset / Disable Timer
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-xs transition-colors"
            >
              Activate Fasting Schedule
            </button>
          </div>
        </form>
      )}

      {/* Main Countdown Display Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left: Huge Live Digital Timer */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-amber-400">
              {isPreFasting ? "Time Until Fasting Begins" : isFastingActive ? "Time Remaining in Fast" : "Fasting Window Complete"}
            </span>
            <span className="font-mono text-[11px]">
              {config?.fastingHours || 10}-Hour Protocol
            </span>
          </div>

          {/* Large Clock Display */}
          <div className="flex items-center gap-2 sm:gap-4 font-mono font-black text-4xl sm:text-6xl text-amber-400 tracking-tight">
            <div className="flex flex-col items-center">
              <span>{pad(hours)}</span>
              <span className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-widest mt-1">Hours</span>
            </div>
            <span className="text-slate-600 -mt-4">:</span>
            <div className="flex flex-col items-center">
              <span>{pad(minutes)}</span>
              <span className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-widest mt-1">Mins</span>
            </div>
            <span className="text-slate-600 -mt-4">:</span>
            <div className="flex flex-col items-center">
              <span>{pad(seconds)}</span>
              <span className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-widest mt-1">Secs</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Fasting Progress</span>
              <span className="font-bold text-amber-400">{progressPct}% elapsed</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-1000"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Key Timeline Milestones */}
        <div className="space-y-3 text-xs">
          {/* Start Milestone */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              1. Fasting Commences (Last Solid Food)
            </span>
            <div className="font-extrabold text-slate-900 dark:text-white text-sm">
              {formatDateTime(startTime)}
            </div>
            <p className="text-[11px] text-slate-500">Stop all meals, snacks, juices, and coffee.</p>
          </div>

          {/* Draw Milestone */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50 space-y-1">
            <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400 block">
              2. Lab Draw Appointment & Safe to Eat
            </span>
            <div className="font-extrabold text-slate-900 dark:text-white text-sm">
              {formatDateTime(targetTime)}
            </div>
            <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80">
              Pack a nutritious snack (e.g. apple, nuts) to eat immediately after blood draw.
            </p>
          </div>
        </div>
      </div>

      {/* Accordion: What is Allowed vs Strictly Forbidden */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
        <button
          onClick={() => setRulesOpen(!rulesOpen)}
          className="w-full p-4 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center justify-between transition-colors font-bold text-slate-900 dark:text-white"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Fasting Rules of Engagement: What You Can & Cannot Ingest</span>
          </div>
          {rulesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {rulesOpen && (
          <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-200 dark:border-slate-800">
            {/* Permitted */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
              <div className="font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 text-xs">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Permitted During Overnight Fast</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <span><strong>Plain Water (Copious amount):</strong> Staying well-hydrated increases blood volume and makes veins significantly easier for the phlebotomist to locate.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Vital Prescriptions:</strong> Blood pressure and thyroid medications are generally taken with plain water unless your doctor explicitly says otherwise.</span>
                </li>
              </ul>
            </div>

            {/* Strictly Prohibited */}
            <div className="p-3.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-2">
              <div className="font-extrabold text-rose-900 dark:text-rose-200 flex items-center gap-1.5 text-xs">
                <X className="w-4 h-4 text-rose-600" />
                <span>Strictly Prohibited (Alters Lab Chemistry)</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Coffee or Tea (Even Black):</strong> Caffeine stimulates gastric acid and liver enzymes, skewing fasting glucose and metabolic readings.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span><strong>Chewing Gum, Mints & Smoking:</strong> Chewing triggers cephalic digestive insulin release; nicotine alters platelet and hormone levels.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
