"use client";

import React, { useState } from "react";
import { BiomarkerResult } from "@/types/visit";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Trash2,
  Edit2,
  Calendar,
  Building2,
  Info
} from "lucide-react";

interface BiomarkerGaugeCardProps {
  biomarker: BiomarkerResult;
  onEdit?: (biomarker: BiomarkerResult) => void;
  onDelete?: (id: string) => void;
}

export function BiomarkerGaugeCard({
  biomarker,
  onEdit,
  onDelete,
}: BiomarkerGaugeCardProps) {
  const [expanded, setExpanded] = useState(false);

  // Compute position percentage on the spectrum bar
  // The bar represents a range from (minRange - padding) to (maxRange + padding)
  const rangeSpan = Math.max(1, biomarker.maxRange - biomarker.minRange);
  const padding = rangeSpan * 0.45;
  const axisMin = Math.max(0, biomarker.minRange - padding);
  const axisMax = biomarker.maxRange + padding;
  const axisSpan = Math.max(1, axisMax - axisMin);

  const rawPct = ((biomarker.value - axisMin) / axisSpan) * 100;
  const clampedPct = Math.max(3, Math.min(97, rawPct));

  // Compute relative positions of min and max markers on the bar
  const minMarkPct = Math.max(5, Math.min(90, ((biomarker.minRange - axisMin) / axisSpan) * 100));
  const maxMarkPct = Math.max(10, Math.min(95, ((biomarker.maxRange - axisMin) / axisSpan) * 100));

  // Status styling
  const isOptimal = biomarker.status === "optimal";
  const isNormal = biomarker.status === "normal";
  const isElevated = biomarker.status === "elevated";
  const isHigh = biomarker.status === "high" || biomarker.status === "critical";
  const isLow = biomarker.status === "low";

  const getStatusBadge = () => {
    if (isOptimal) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>{biomarker.flagText || "Optimal"}</span>
        </span>
      );
    }
    if (isNormal) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
          <CheckCircle2 className="w-3 h-3 text-teal-600 dark:text-teal-400" />
          <span>{biomarker.flagText || "In Normal Range"}</span>
        </span>
      );
    }
    if (isElevated) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 animate-pulse">
          <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          <span>{biomarker.flagText || "Borderline / Watch"}</span>
        </span>
      );
    }
    if (isHigh) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
          <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          <span>{biomarker.flagText || "High"}</span>
        </span>
      );
    }
    // Low
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
        <Info className="w-3 h-3 text-sky-600 dark:text-sky-400" />
        <span>{biomarker.flagText || "Low"}</span>
      </span>
    );
  };

  const getMarkerColor = () => {
    if (isOptimal || isNormal) return "bg-emerald-500 border-white ring-emerald-400";
    if (isElevated) return "bg-amber-500 border-white ring-amber-400";
    if (isHigh) return "bg-rose-500 border-white ring-rose-400";
    return "bg-sky-500 border-white ring-sky-400";
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {biomarker.panel}
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{biomarker.dateRecorded}</span>
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight mt-1 break-words">
            {biomarker.name}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Source: {biomarker.labSource || "Outpatient Lab"}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {getStatusBadge()}
          {onEdit && (
            <button
              onClick={() => onEdit(biomarker)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              title="Edit value"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(biomarker.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              title="Delete biomarker"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Big Value & Target Range Readout */}
      <div className="flex items-baseline justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {biomarker.value}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
            {biomarker.unit}
          </span>
        </div>

        <div className="text-right text-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Standard Reference
          </span>
          <span className="font-mono font-bold text-slate-700 dark:text-slate-200 text-xs">
            {biomarker.minRange} - {biomarker.maxRange} {biomarker.unit}
          </span>
        </div>
      </div>

      {/* CONTINUOUS VISUAL REFERENCE SPECTRUM BAR */}
      <div className="space-y-1.5 pt-1">
        {/* Needle Pinpoint Marker */}
        <div className="relative h-6 w-full">
          <div
            className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-700 z-10"
            style={{ left: `${clampedPct}%` }}
          >
            <span className="text-[10px] font-black font-mono px-1.5 py-0.5 rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md">
              {biomarker.value}
            </span>
            <div className={`w-2.5 h-2.5 rounded-full border-2 ring-2 shadow-xs -mt-0.5 ${getMarkerColor()}`} />
          </div>
        </div>

        {/* Multi-Zone Spectrum Gradient Track */}
        <div className="relative w-full h-3 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 p-0.5">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `linear-gradient(to right, 
                #38bdf8 0%, 
                #38bdf8 ${Math.max(0, minMarkPct - 5)}%, 
                #10b981 ${minMarkPct}%, 
                #10b981 ${maxMarkPct}%, 
                #f59e0b ${Math.min(90, maxMarkPct + 10)}%, 
                #ef4444 100%)`,
            }}
          />
        </div>

        {/* Spectrum Min / Normal / Max Text Axis */}
        <div className="flex justify-between text-[10px] text-slate-400 font-mono px-0.5">
          <span>Low (&lt;{biomarker.minRange})</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            Optimal Zone ({biomarker.minRange} - {biomarker.maxRange})
          </span>
          <span>High (&gt;{biomarker.maxRange})</span>
        </div>
      </div>

      {/* Brief Meaning Line */}
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-2">
        {biomarker.plainMeaning}
      </p>

      {/* Accordion Toggle for Deep Clinical Insights & Lifestyle Swaps */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-3 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center justify-between transition-colors font-semibold text-slate-800 dark:text-slate-200"
        >
          <span className="flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Clinical Meaning & Practical Lifestyle Levers</span>
          </span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="p-4 bg-white dark:bg-slate-900 space-y-3.5 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {/* Why It Matters */}
            <div className="space-y-1">
              <strong className="text-[11px] uppercase font-bold text-slate-500 tracking-wider block">
                Why Your Doctor Analyzes This
              </strong>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {biomarker.whyItMatters}
              </p>
            </div>

            {/* Lifestyle Tips */}
            <div className="pt-3 space-y-1">
              <strong className="text-[11px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>Actionable Lifestyle & Dietary Actions</span>
              </strong>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {biomarker.lifestyleTips}
              </p>
            </div>

            {/* Questions to Ask Doctor */}
            {biomarker.doctorDiscussPoint && (
              <div className="pt-3 space-y-1">
                <strong className="text-[11px] uppercase font-bold text-sky-600 dark:text-sky-400 tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3 h-3" />
                  <span>Discussion Question for Your Doctor</span>
                </strong>
                <p className="text-slate-600 dark:text-slate-300 italic bg-sky-50 dark:bg-sky-950/40 p-2.5 rounded-xl border border-sky-100 dark:border-sky-900/50">
                  &ldquo;{biomarker.doctorDiscussPoint}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
