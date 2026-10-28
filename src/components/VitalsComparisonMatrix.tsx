"use client";

import React, { useState } from "react";
import { ParsedVisitRecord } from "@/types/visit";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  HeartPulse,
  Activity,
  Scale,
  Wind,
  Sparkles
} from "lucide-react";

interface VitalsComparisonMatrixProps {
  visits: ParsedVisitRecord[];
  onLoadPriorSample?: () => void;
}

export default function VitalsComparisonMatrix({ visits, onLoadPriorSample }: VitalsComparisonMatrixProps) {
  // Sort chronologically: oldest first
  const sortedVisits = [...visits].sort((a, b) => {
    const timeA = new Date(a.visitDate || a.createdAt).getTime();
    const timeB = new Date(b.visitDate || b.createdAt).getTime();
    return timeA - timeB;
  });

  // Default baseline is the first (or older) visit, comparison is the latest visit
  const [baseId, setBaseId] = useState<string>(sortedVisits[0]?.id || "");
  const [compId, setCompId] = useState<string>(
    sortedVisits.length > 1 ? sortedVisits[sortedVisits.length - 1]?.id : sortedVisits[0]?.id || ""
  );

  const baseVisit = sortedVisits.find((v) => v.id === baseId) || sortedVisits[0];
  const compVisit = sortedVisits.find((v) => v.id === compId) || sortedVisits[sortedVisits.length - 1];

  // Helper parser for vitals
  const parseNum = (val: string | number | undefined | null): number | null => {
    if (val === null || val === undefined) return null;
    if (typeof val === "number") return isNaN(val) ? null : val;
    const clean = String(val).replace(/[^0-9.-]/g, "");
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? null : parsed;
  };

  // Extract metrics
  const getMetrics = (v: ParsedVisitRecord | undefined) => {
    if (!v) return null;
    const bpParts = v.vitals?.bloodPressure?.raw?.split("/") || [];
    const systolic = v.vitals?.bloodPressure?.systolic ?? parseNum(bpParts[0]);
    const diastolic = v.vitals?.bloodPressure?.diastolic ?? parseNum(bpParts[1]);
    const pulse = parseNum(v.vitals?.heartRate?.value) ?? parseNum(v.vitals?.heartRate?.raw);
    const spo2 = parseNum(v.vitals?.oxygenSaturation?.value) ?? parseNum(v.vitals?.oxygenSaturation?.raw);
    const bmi = parseNum(v.vitals?.bmi?.value) ?? parseNum(v.vitals?.bmi?.raw);
    const weight = parseNum(v.vitals?.weight?.value) ?? parseNum(v.vitals?.weight?.raw);

    return { systolic, diastolic, pulse, spo2, bmi, weight };
  };

  const baseData = getMetrics(baseVisit);
  const compData = getMetrics(compVisit);

  const calculateDelta = (base: number | null, comp: number | null, unit: string, isLowerBetter = true) => {
    if (base === null || comp === null) {
      return { diff: null, pct: null, direction: "neutral" as const, text: "No prior comparison" };
    }
    const diff = comp - base;
    const pct = base !== 0 ? ((diff / base) * 100).toFixed(1) : "0";

    let direction: "better" | "worse" | "neutral" = "neutral";
    if (Math.abs(diff) < 0.1) {
      direction = "neutral";
    } else if (isLowerBetter) {
      direction = diff < 0 ? "better" : "worse";
    } else {
      direction = diff > 0 ? "better" : "worse";
    }

    const sign = diff > 0 ? "+" : "";
    return {
      diff: `${sign}${diff.toFixed(1).replace(/\.0$/, "")} ${unit}`,
      pct: `${sign}${pct}%`,
      direction,
      text:
        direction === "better"
          ? "Clinically Improved"
          : direction === "worse"
          ? "Mild Elevation"
          : "Stable Baseline",
    };
  };

  const bpSysDelta = calculateDelta(baseData?.systolic ?? null, compData?.systolic ?? null, "mmHg", true);
  const bpDiaDelta = calculateDelta(baseData?.diastolic ?? null, compData?.diastolic ?? null, "mmHg", true);
  const pulseDelta = calculateDelta(baseData?.pulse ?? null, compData?.pulse ?? null, "bpm", true);
  const spo2Delta = calculateDelta(baseData?.spo2 ?? null, compData?.spo2 ?? null, "%", false);
  const bmiDelta = calculateDelta(baseData?.bmi ?? null, compData?.bmi ?? null, "kg/m²", true);
  const weightDelta = calculateDelta(baseData?.weight ?? null, compData?.weight ?? null, "lbs", true);

  const rows = [
    {
      metric: "Systolic Blood Pressure",
      icon: HeartPulse,
      iconColor: "text-rose-500",
      refRange: "< 120 mmHg (Normal)",
      baseVal: baseVisit?.vitals?.bloodPressure?.raw ? baseVisit.vitals.bloodPressure.raw.split("/")[0] + " mmHg" : "--",
      compVal: compVisit?.vitals?.bloodPressure?.raw ? compVisit.vitals.bloodPressure.raw.split("/")[0] + " mmHg" : "--",
      delta: bpSysDelta,
    },
    {
      metric: "Diastolic Blood Pressure",
      icon: HeartPulse,
      iconColor: "text-violet-500",
      refRange: "< 80 mmHg (Normal)",
      baseVal: baseVisit?.vitals?.bloodPressure?.raw ? (baseVisit.vitals.bloodPressure.raw.split("/")[1] ? baseVisit.vitals.bloodPressure.raw.split("/")[1] + " mmHg" : "--") : "--",
      compVal: compVisit?.vitals?.bloodPressure?.raw ? (compVisit.vitals.bloodPressure.raw.split("/")[1] ? compVisit.vitals.bloodPressure.raw.split("/")[1] + " mmHg" : "--") : "--",
      delta: bpDiaDelta,
    },
    {
      metric: "Resting Heart Rate",
      icon: Activity,
      iconColor: "text-emerald-500",
      refRange: "60 - 100 bpm",
      baseVal: baseVisit?.vitals?.heartRate?.raw || "--",
      compVal: compVisit?.vitals?.heartRate?.raw || "--",
      delta: pulseDelta,
    },
    {
      metric: "SpO2 Oxygen Saturation",
      icon: Wind,
      iconColor: "text-teal-500",
      refRange: "95% - 100%",
      baseVal: baseVisit?.vitals?.oxygenSaturation?.raw || "--",
      compVal: compVisit?.vitals?.oxygenSaturation?.raw || "--",
      delta: spo2Delta,
    },
    {
      metric: "Body Mass Index (BMI)",
      icon: Scale,
      iconColor: "text-indigo-500",
      refRange: "18.5 - 24.9 (Normal)",
      baseVal: baseVisit?.vitals?.bmi?.raw || "--",
      compVal: compVisit?.vitals?.bmi?.raw || "--",
      delta: bmiDelta,
    },
    {
      metric: "Recorded Weight",
      icon: Scale,
      iconColor: "text-slate-500",
      refRange: "Adult Baseline",
      baseVal: baseVisit?.vitals?.weight?.raw || "--",
      compVal: compVisit?.vitals?.weight?.raw || "--",
      delta: weightDelta,
    },
  ];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
      {/* Title & Selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Appointment-to-Appointment Vitals Comparison
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare biometric response between two recorded clinic dates
          </p>
        </div>

        {/* Visit selector controls */}
        {sortedVisits.length > 1 ? (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="font-semibold text-slate-500 dark:text-slate-400">Baseline:</span>
              <select
                value={baseId}
                onChange={(e) => setBaseId(e.target.value)}
                className="bg-transparent font-bold text-slate-800 dark:text-white outline-hidden cursor-pointer"
              >
                {sortedVisits.map((v) => (
                  <option key={`base-opt-${v.id}`} value={v.id} className="dark:bg-slate-900">
                    {v.visitDate || "Recent"} ({v.facilityName || "Clinic"})
                  </option>
                ))}
              </select>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />

            <div className="flex items-center gap-1.5 bg-sky-50 dark:bg-sky-950/70 px-3 py-1.5 rounded-xl border border-sky-200 dark:border-sky-800">
              <span className="font-semibold text-sky-600 dark:text-sky-400">Follow-Up:</span>
              <select
                value={compId}
                onChange={(e) => setCompId(e.target.value)}
                className="bg-transparent font-bold text-sky-900 dark:text-sky-200 outline-hidden cursor-pointer"
              >
                {sortedVisits.map((v) => (
                  <option key={`comp-opt-${v.id}`} value={v.id} className="dark:bg-slate-900">
                    {v.visitDate || "Recent"} ({v.facilityName || "Clinic"})
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          onLoadPriorSample && (
            <button
              onClick={onLoadPriorSample}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Simulate 6-Month Prior Baseline Visit</span>
            </button>
          )
        )}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="pb-3 font-semibold">Biometric Metric</th>
              <th className="pb-3 font-semibold">Clinical Target</th>
              <th className="pb-3 font-semibold">
                Baseline <span className="normal-case text-slate-500 font-normal">({baseVisit?.visitDate || "Prior"})</span>
              </th>
              <th className="pb-3 font-semibold text-sky-700 dark:text-sky-400">
                Follow-Up <span className="normal-case font-normal">({compVisit?.visitDate || "Latest"})</span>
              </th>
              <th className="pb-3 font-semibold">Absolute & % Shift</th>
              <th className="pb-3 font-semibold text-right">Clinical Trajectory</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((row, idx) => {
              const Icon = row.icon;
              const isSameVisit = baseVisit?.id === compVisit?.id;

              return (
                <tr key={`matrix-row-${idx}`} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${row.iconColor} shrink-0`} />
                      <span className="font-bold text-slate-900 dark:text-white">{row.metric}</span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {row.refRange}
                  </td>
                  <td className="py-3.5 pr-4 font-semibold text-slate-700 dark:text-slate-300">
                    {row.baseVal}
                  </td>
                  <td className="py-3.5 pr-4 font-bold text-sky-600 dark:text-sky-400">
                    {row.compVal}
                  </td>
                  <td className="py-3.5 pr-4 font-medium">
                    {isSameVisit ? (
                      <span className="text-slate-400">Baseline selected</span>
                    ) : row.delta.diff ? (
                      <div className="flex items-center gap-1.5 font-mono text-[11px]">
                        <span className={
                          row.delta.direction === "better"
                            ? "text-emerald-600 dark:text-emerald-400 font-bold"
                            : row.delta.direction === "worse"
                            ? "text-amber-600 dark:text-amber-400 font-bold"
                            : "text-slate-600 dark:text-slate-400"
                        }>
                          {row.delta.diff}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({row.delta.pct})
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400">--</span>
                    )}
                  </td>
                  <td className="py-3.5 text-right">
                    {isSameVisit ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        <Minus className="w-3 h-3" />
                        <span>Current</span>
                      </span>
                    ) : row.delta.direction === "better" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        <TrendingDown className="w-3 h-3" />
                        <span>Improved</span>
                      </span>
                    ) : row.delta.direction === "worse" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        <TrendingUp className="w-3 h-3" />
                        <span>Elevated</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        <Minus className="w-3 h-3" />
                        <span>Steady</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Clinical Interpretation Footer Callout */}
      <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 flex items-start gap-3 text-xs text-sky-900 dark:text-sky-200">
        <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">
            Clinical Takeaway: Longitudinal Comparison Active
          </p>
          <p className="text-[11px] text-sky-700 dark:text-sky-300 leading-relaxed">
            Comparing visits demonstrates cardiovascular adaptability. A reduction in resting pulse paired with systolic optimization reflects positive arterial response to ongoing aerobic routine and nutritional shifts.
          </p>
        </div>
      </div>
    </div>
  );
}
