"use client";

import React, { useState, useEffect } from "react";
import { getStoredVisits, saveVisit } from "@/lib/storage";
import { ParsedVisitRecord } from "@/types/visit";
import { SAMPLE_PRIOR_VISIT_RECORD } from "@/lib/sampleVisit";
import VitalsTrendChart from "@/components/VitalsTrendChart";
import VitalsComparisonMatrix from "@/components/VitalsComparisonMatrix";
import {
  Activity,
  HeartPulse,
  Scale,
  Wind,
  ShieldCheck,
  ArrowRight,
  Info,
  AlertCircle,
  Loader2,
  Sparkles,
  Printer,
  Calendar,
  TrendingDown,
  TrendingUp,
  Minus
} from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function VitalsTrackerPage() {
  const [visits, setVisits] = useState<ParsedVisitRecord[]>([]);
  const [mounted, setMounted] = useState(false);
  const [justAddedPrior, setJustAddedPrior] = useState(false);

  const refreshVisits = () => {
    const records = getStoredVisits();
    setVisits(records);
  };

  useEffect(() => {
    setMounted(true);
    refreshVisits();
    window.addEventListener("clarivisit_data_change", refreshVisits);
    return () => window.removeEventListener("clarivisit_data_change", refreshVisits);
  }, []);

  const handleLoadPriorBaseline = () => {
    saveVisit(SAMPLE_PRIOR_VISIT_RECORD);
    setJustAddedPrior(true);
    refreshVisits();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600 dark:text-sky-400" />
        <p className="text-xs text-slate-500 font-medium">Loading vitals tracker...</p>
      </div>
    );
  }

  if (visits.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 space-y-4 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
          <HeartPulse className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Vitals Tracked Yet</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            Upload an After-Visit Summary to automatically track blood pressure, BMI, resting pulse, and oxygen saturation over time.
          </p>
        </div>
        <Link
          href="/dashboard/upload"
          className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-xs"
        >
          <span>Upload Visit Summary</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Sort visits chronologically (oldest to newest)
  const chronological = [...visits].sort((a, b) => {
    const timeA = new Date(a.visitDate || a.createdAt).getTime();
    const timeB = new Date(b.visitDate || b.createdAt).getTime();
    return timeA - timeB;
  });

  const latest = chronological[chronological.length - 1];
  const prior = chronological.length > 1 ? chronological[chronological.length - 2] : null;

  // Helper safe number parser
  const toNum = (val: string | number | null | undefined): number | null => {
    if (val === null || val === undefined) return null;
    if (typeof val === "number") return isNaN(val) ? null : val;
    const parsed = parseFloat(String(val).replace(/[^0-9.-]/g, ""));
    return isNaN(parsed) ? null : parsed;
  };

  // Compute live deltas between latest and prior
  const bpSysLatest = latest?.vitals?.bloodPressure?.systolic ?? (latest?.vitals?.bloodPressure?.raw ? toNum(latest.vitals.bloodPressure.raw.split("/")[0]) : null);
  const bpSysPrior = prior?.vitals?.bloodPressure?.systolic ?? (prior?.vitals?.bloodPressure?.raw ? toNum(prior.vitals.bloodPressure.raw.split("/")[0]) : null);
  const bpSysDiff = bpSysLatest !== null && bpSysPrior !== null ? bpSysLatest - bpSysPrior : null;

  const pulseLatest = toNum(latest?.vitals?.heartRate?.value) ?? toNum(latest?.vitals?.heartRate?.raw);
  const pulsePrior = toNum(prior?.vitals?.heartRate?.value) ?? toNum(prior?.vitals?.heartRate?.raw);
  const pulseDiff = pulseLatest !== null && pulsePrior !== null ? pulseLatest - pulsePrior : null;

  const spo2Latest = toNum(latest?.vitals?.oxygenSaturation?.value) ?? toNum(latest?.vitals?.oxygenSaturation?.raw);
  const spo2Prior = toNum(prior?.vitals?.oxygenSaturation?.value) ?? toNum(prior?.vitals?.oxygenSaturation?.raw);
  const spo2Diff = spo2Latest !== null && spo2Prior !== null ? spo2Latest - spo2Prior : null;

  const weightLatest = toNum(latest?.vitals?.weight?.value) ?? toNum(latest?.vitals?.weight?.raw);
  const weightPrior = toNum(prior?.vitals?.weight?.value) ?? toNum(prior?.vitals?.weight?.raw);
  const weightDiff = weightLatest !== null && weightPrior !== null ? weightLatest - weightPrior : null;

  const bp = latest?.vitals?.bloodPressure;
  const spo2 = latest?.vitals?.oxygenSaturation;
  const pulse = latest?.vitals?.heartRate;
  const bmi = latest?.vitals?.bmi;
  const weight = latest?.vitals?.weight;

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Cardiovascular & Metabolic Hub
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              {visits.length} {visits.length === 1 ? "Record" : "Records"} Indexed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Vitals Spectrum & Longitudinal Trends
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitoring clinical trajectories and appointment comparisons over time
          </p>
        </div>

        <div className="flex items-center gap-2">
          {visits.length === 1 && (
            <button
              onClick={handleLoadPriorBaseline}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Simulate Prior Visit (Compare)</span>
            </button>
          )}

          <Link
            href={`/dashboard/visits/${latest.id}/passport`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Passport</span>
          </Link>
        </div>
      </div>

      {/* Baseline Simulation Alert */}
      {justAddedPrior && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Baseline checkup (April 15, 2026) added! Longitudinal trend charts and comparison matrix are now comparing 2 clinical dates.
            </span>
          </div>
          <button
            onClick={() => setJustAddedPrior(false)}
            className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 hover:underline shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4 Core Metric Snapshot Cards with Deltas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Blood Pressure Card */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Blood Pressure</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {bp?.status ? bp.status.toUpperCase() : "OPTIMAL"}
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {bp?.raw || "--"} <span className="text-xs text-slate-400 font-normal">mmHg</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Target: &lt;120 / &lt;80 mmHg
            </div>
          </div>

          {/* Delta Pill */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">vs Prior Checkup:</span>
            {bpSysDiff !== null ? (
              <span className={`font-semibold inline-flex items-center gap-0.5 ${
                bpSysDiff < 0 ? "text-emerald-600 dark:text-emerald-400" : bpSysDiff > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-500"
              }`}>
                {bpSysDiff < 0 ? <TrendingDown className="w-3 h-3" /> : bpSysDiff > 0 ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                <span>{bpSysDiff > 0 ? `+${bpSysDiff}` : bpSysDiff} mmHg sys</span>
              </span>
            ) : (
              <span className="text-slate-400 italic">Baseline</span>
            )}
          </div>
        </div>

        {/* Resting Heart Rate Card */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Heart Rate</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {pulse?.status ? pulse.status.toUpperCase() : "NORMAL"}
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {pulse?.raw || "--"}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Normal: 60 - 100 bpm
            </div>
          </div>

          {/* Delta Pill */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">vs Prior Checkup:</span>
            {pulseDiff !== null ? (
              <span className={`font-semibold inline-flex items-center gap-0.5 ${
                pulseDiff < 0 ? "text-emerald-600 dark:text-emerald-400" : pulseDiff > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-500"
              }`}>
                {pulseDiff < 0 ? <TrendingDown className="w-3 h-3" /> : pulseDiff > 0 ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                <span>{pulseDiff > 0 ? `+${pulseDiff}` : pulseDiff} bpm</span>
              </span>
            ) : (
              <span className="text-slate-400 italic">Baseline</span>
            )}
          </div>
        </div>

        {/* SpO2 Oxygen Saturation Card */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-teal-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">SpO2 Oxygen</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              {spo2?.status ? spo2.status.toUpperCase() : "NORMAL"}
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {spo2?.raw || "98%"}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Optimal Floor: 95% - 100%
            </div>
          </div>

          {/* Delta Pill */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">vs Prior Checkup:</span>
            {spo2Diff !== null ? (
              <span className={`font-semibold inline-flex items-center gap-0.5 ${
                spo2Diff >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
              }`}>
                {spo2Diff > 0 ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                <span>{spo2Diff > 0 ? `+${spo2Diff}` : spo2Diff}%</span>
              </span>
            ) : (
              <span className="text-slate-400 italic">Baseline</span>
            )}
          </div>
        </div>

        {/* BMI & Weight Card */}
        <div className="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">BMI & Weight</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {bmi?.status ? bmi.status.toUpperCase() : "OPTIMAL"}
            </span>
          </div>

          <div className="space-y-0.5">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {bmi?.raw || "--"} <span className="text-xs text-slate-400 font-normal font-sans">({weight?.raw || "--"})</span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Healthy BMI: 18.5 - 24.9
            </div>
          </div>

          {/* Delta Pill */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">vs Prior Weight:</span>
            {weightDiff !== null ? (
              <span className={`font-semibold inline-flex items-center gap-0.5 ${
                weightDiff < 0 ? "text-emerald-600 dark:text-emerald-400" : weightDiff > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-500"
              }`}>
                {weightDiff < 0 ? <TrendingDown className="w-3 h-3" /> : weightDiff > 0 ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                <span>{weightDiff > 0 ? `+${weightDiff}` : weightDiff} lbs</span>
              </span>
            ) : (
              <span className="text-slate-400 italic">Baseline</span>
            )}
          </div>
        </div>
      </div>

      {/* Longitudinal Interactive Chart */}
      <VitalsTrendChart visits={visits} />

      {/* Appointment-to-Appointment Side-by-Side Comparison Matrix */}
      <VitalsComparisonMatrix
        visits={visits}
        onLoadPriorSample={visits.length === 1 ? handleLoadPriorBaseline : undefined}
      />

      {/* Historical Recorded Vitals Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Chronological Vitals Log
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete records preserved in your local browser vault
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="pb-3 font-semibold">Visit Date</th>
                <th className="pb-3 font-semibold">Facility / Clinic</th>
                <th className="pb-3 font-semibold">Blood Pressure</th>
                <th className="pb-3 font-semibold">Pulse</th>
                <th className="pb-3 font-semibold">SpO2</th>
                <th className="pb-3 font-semibold">BMI</th>
                <th className="pb-3 font-semibold">Weight</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {chronological.map((v, i) => (
                <tr key={v.id || `vital-row-${i}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-semibold text-slate-900 dark:text-white">
                    {v.visitDate || "Recent"}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {v.facilityName || "Clinic Visit"}
                  </td>
                  <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {v.vitals?.bloodPressure?.raw || "--"}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300 font-mono">
                    {v.vitals?.heartRate?.raw || "--"}
                  </td>
                  <td className="py-3 text-teal-600 dark:text-teal-400 font-semibold font-mono">
                    {v.vitals?.oxygenSaturation?.raw || "--"}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300 font-mono">
                    {v.vitals?.bmi?.raw || "--"}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300 font-mono">
                    {v.vitals?.weight?.raw || "--"}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/visits/${v.id}/passport`}
                        target="_blank"
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
                        title="Print Passport"
                      >
                        Passport
                      </Link>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <Link
                        href={`/dashboard/visits/${v.id}`}
                        className="text-sky-600 hover:underline font-bold"
                      >
                        Breakdown &rarr;
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
