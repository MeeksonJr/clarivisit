"use client";

import React, { useState } from "react";
import { ParsedVisitRecord } from "@/types/visit";
import { Activity, HeartPulse, Scale, Wind, CheckCircle2, AlertTriangle, ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

export type MetricType = "bp" | "pulse" | "weight_bmi" | "spo2";

interface VitalsTrendChartProps {
  visits: ParsedVisitRecord[];
}

export default function VitalsTrendChart({ visits }: VitalsTrendChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricType>("bp");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sort visits chronologically (oldest to newest for left-to-right charting)
  const sortedVisits = [...visits].sort((a, b) => {
    const timeA = new Date(a.visitDate || a.createdAt).getTime();
    const timeB = new Date(b.visitDate || b.createdAt).getTime();
    return timeA - timeB;
  });

  // Helper safe number parser
  const toNum = (val: string | number | null | undefined): number | null => {
    if (val === null || val === undefined) return null;
    if (typeof val === "number") return isNaN(val) ? null : val;
    const parsed = parseFloat(String(val).replace(/[^0-9.-]/g, ""));
    return isNaN(parsed) ? null : parsed;
  };

  // Extract data points based on metric
  const chartData = sortedVisits.map((v, idx) => {
    const dateStr = v.visitDate || new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const bpParts = v.vitals?.bloodPressure?.raw ? v.vitals.bloodPressure.raw.split("/") : [];
    const bpSystolic = v.vitals?.bloodPressure?.systolic ?? toNum(bpParts[0]);
    const bpDiastolic = v.vitals?.bloodPressure?.diastolic ?? toNum(bpParts[1]);
    const pulse = toNum(v.vitals?.heartRate?.value) ?? toNum(v.vitals?.heartRate?.raw);
    const spo2 = toNum(v.vitals?.oxygenSaturation?.value) ?? toNum(v.vitals?.oxygenSaturation?.raw);
    const bmi = toNum(v.vitals?.bmi?.value) ?? toNum(v.vitals?.bmi?.raw);
    const weight = toNum(v.vitals?.weight?.value) ?? toNum(v.vitals?.weight?.raw);

    return {
      index: idx,
      id: v.id,
      date: dateStr,
      facility: v.facilityName || "Clinic Visit",
      provider: v.providerName || "Physician",
      bpSystolic,
      bpDiastolic,
      pulse,
      spo2,
      bmi,
      weight,
      rawBp: v.vitals?.bloodPressure?.raw || "--",
      rawPulse: v.vitals?.heartRate?.raw || "--",
      rawSpo2: v.vitals?.oxygenSaturation?.raw || "--",
      rawBmi: v.vitals?.bmi?.raw || "--",
      rawWeight: v.vitals?.weight?.raw || "--",
      explanation: v.vitals?.bloodPressure?.plainExplanation || "",
    };
  });

  // SVG dimensions
  const width = 800;
  const height = 300;
  const paddingX = 70;
  const paddingY = 40;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  // Compute X coordinates for data points
  const getX = (i: number) => {
    if (chartData.length <= 1) return width / 2;
    return paddingX + (i / (chartData.length - 1)) * plotWidth;
  };

  // Determine Y scale based on active metric
  let minY = 60;
  let maxY = 150;
  let unit = "";
  let metricLabel = "";

  if (activeMetric === "bp") {
    minY = 50;
    maxY = 160;
    unit = "mmHg";
    metricLabel = "Blood Pressure (Systolic & Diastolic)";
  } else if (activeMetric === "pulse") {
    minY = 50;
    maxY = 120;
    unit = "bpm";
    metricLabel = "Resting Heart Rate (Pulse)";
  } else if (activeMetric === "spo2") {
    minY = 90;
    maxY = 100;
    unit = "%";
    metricLabel = "SpO2 Oxygen Saturation";
  } else if (activeMetric === "weight_bmi") {
    minY = 15;
    maxY = 35;
    unit = "BMI (kg/m²)";
    metricLabel = "Body Mass Index (BMI)";
  }

  const getY = (val: number | null) => {
    if (val === null) return plotHeight + paddingY;
    const clamped = Math.max(minY, Math.min(maxY, val));
    const ratio = (clamped - minY) / (maxY - minY);
    return height - paddingY - ratio * plotHeight;
  };

  // Generate SVG path for a given value key
  const buildLinePath = (getValue: (d: (typeof chartData)[0]) => number | null) => {
    const validPoints = chartData
      .map((d, i) => ({ x: getX(i), y: getY(getValue(d)), val: getValue(d) }))
      .filter((p) => p.val !== null);

    if (validPoints.length === 0) return "";
    if (validPoints.length === 1) {
      return `M ${validPoints[0].x - 40} ${validPoints[0].y} L ${validPoints[0].x + 40} ${validPoints[0].y}`;
    }

    return validPoints.reduce((acc, p, i) => `${acc} ${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, "");
  };

  const systolicPath = buildLinePath((d) => d.bpSystolic);
  const diastolicPath = buildLinePath((d) => d.bpDiastolic);
  const pulsePath = buildLinePath((d) => d.pulse);
  const spo2Path = buildLinePath((d) => d.spo2);
  const bmiPath = buildLinePath((d) => d.bmi);

  const activePoint = hoveredIndex !== null ? chartData[hoveredIndex] : chartData[chartData.length - 1];

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
      {/* Header and Metric Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              Longitudinal Biometric Trends
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              {chartData.length} {chartData.length === 1 ? "Checkup" : "Checkups Tracked"}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            {metricLabel}
          </h2>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 self-start md:self-auto">
          <button
            onClick={() => { setActiveMetric("bp"); setHoveredIndex(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeMetric === "bp"
                ? "bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Blood Pressure</span>
          </button>

          <button
            onClick={() => { setActiveMetric("pulse"); setHoveredIndex(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeMetric === "pulse"
                ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Pulse</span>
          </button>

          <button
            onClick={() => { setActiveMetric("weight_bmi"); setHoveredIndex(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeMetric === "weight_bmi"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>BMI & Weight</span>
          </button>

          <button
            onClick={() => { setActiveMetric("spo2"); setHoveredIndex(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeMetric === "spo2"
                ? "bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>SpO2 Oxygen</span>
          </button>
        </div>
      </div>

      {/* Interactive SVG Chart Viewport */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900/40 dark:to-slate-950/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-2 sm:p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none overflow-visible"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="systolicGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="bmiGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Reference Background Bands */}
          {activeMetric === "bp" && (
            <>
              {/* Normal BP Target Band (Systolic < 120, Diastolic < 80) */}
              <rect
                x={paddingX}
                y={getY(120)}
                width={plotWidth}
                height={getY(80) - getY(120)}
                fill="#10b981"
                fillOpacity="0.07"
              />
              <line
                x1={paddingX}
                y1={getY(120)}
                x2={width - paddingX}
                y2={getY(120)}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
              <text
                x={paddingX + 8}
                y={getY(120) - 4}
                className="text-[10px] fill-emerald-600 dark:fill-emerald-400 font-semibold"
              >
                Normal Systolic Limit (120 mmHg)
              </text>

              <line
                x1={paddingX}
                y1={getY(80)}
                x2={width - paddingX}
                y2={getY(80)}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth="1"
                strokeOpacity="0.5"
              />
              <text
                x={paddingX + 8}
                y={getY(80) + 12}
                className="text-[10px] fill-emerald-600 dark:fill-emerald-400 font-semibold"
              >
                Normal Diastolic Limit (80 mmHg)
              </text>
            </>
          )}

          {activeMetric === "pulse" && (
            <>
              {/* Healthy Adult Resting Band (60 - 100 bpm) */}
              <rect
                x={paddingX}
                y={getY(100)}
                width={plotWidth}
                height={getY(60) - getY(100)}
                fill="#10b981"
                fillOpacity="0.08"
              />
              <line
                x1={paddingX}
                y1={getY(100)}
                x2={width - paddingX}
                y2={getY(100)}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <text
                x={paddingX + 8}
                y={getY(100) - 4}
                className="text-[10px] fill-amber-600 dark:fill-amber-400 font-semibold"
              >
                Tachycardia Threshold (100 bpm)
              </text>

              <line
                x1={paddingX}
                y1={getY(60)}
                x2={width - paddingX}
                y2={getY(60)}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <text
                x={paddingX + 8}
                y={getY(60) + 12}
                className="text-[10px] fill-emerald-600 dark:fill-emerald-400 font-semibold"
              >
                Optimal Resting Baseline (60 bpm)
              </text>
            </>
          )}

          {activeMetric === "spo2" && (
            <>
              {/* Normal SpO2 Zone (95 - 100%) */}
              <rect
                x={paddingX}
                y={getY(100)}
                width={plotWidth}
                height={getY(95) - getY(100)}
                fill="#10b981"
                fillOpacity="0.08"
              />
              <line
                x1={paddingX}
                y1={getY(95)}
                x2={width - paddingX}
                y2={getY(95)}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <text
                x={paddingX + 8}
                y={getY(95) + 12}
                className="text-[10px] fill-emerald-600 dark:fill-emerald-400 font-semibold"
              >
                Optimal Room-Air Floor (95%)
              </text>
            </>
          )}

          {activeMetric === "weight_bmi" && (
            <>
              {/* Normal BMI Bracket (18.5 - 24.9) */}
              <rect
                x={paddingX}
                y={getY(24.9)}
                width={plotWidth}
                height={getY(18.5) - getY(24.9)}
                fill="#10b981"
                fillOpacity="0.08"
              />
              <line
                x1={paddingX}
                y1={getY(24.9)}
                x2={width - paddingX}
                y2={getY(24.9)}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                strokeWidth="1"
                strokeOpacity="0.6"
              />
              <text
                x={paddingX + 8}
                y={getY(24.9) - 4}
                className="text-[10px] fill-amber-600 dark:fill-amber-400 font-semibold"
              >
                Overweight Cutoff (BMI 25.0)
              </text>
            </>
          )}

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const val = minY + pct * (maxY - minY);
            const y = getY(val);
            return (
              <g key={`grid-y-${idx}`}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="0.75"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 dark:fill-slate-500 font-medium font-mono"
                >
                  {Math.round(val)} {idx === 4 ? unit : ""}
                </text>
              </g>
            );
          })}

          {/* Vertical Grid & Dates */}
          {chartData.map((d, i) => {
            const x = getX(i);
            const isHovered = hoveredIndex === i;
            return (
              <g key={`x-axis-${i}`}>
                <line
                  x1={x}
                  y1={paddingY}
                  x2={x}
                  y2={height - paddingY}
                  stroke="currentColor"
                  className={isHovered ? "stroke-sky-500 dark:stroke-sky-400" : "stroke-slate-200/60 dark:stroke-slate-800/60"}
                  strokeWidth={isHovered ? "1.5" : "0.75"}
                  strokeDasharray={isHovered ? "none" : "2 2"}
                />
                <text
                  x={x}
                  y={height - paddingY + 18}
                  textAnchor="middle"
                  className={`text-[10px] font-semibold transition-colors ${
                    isHovered
                      ? "fill-sky-600 dark:fill-sky-400 font-bold"
                      : "fill-slate-500 dark:fill-slate-400"
                  }`}
                >
                  {d.date}
                </text>
              </g>
            );
          })}

          {/* Metric Curves and Points */}
          {activeMetric === "bp" && (
            <>
              {/* Systolic Line */}
              {systolicPath && (
                <path
                  d={systolicPath}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Diastolic Line */}
              {diastolicPath && (
                <path
                  d={diastolicPath}
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Node Points */}
              {chartData.map((d, i) => {
                if (d.bpSystolic === null) return null;
                const x = getX(i);
                const ySys = getY(d.bpSystolic);
                const yDia = getY(d.bpDiastolic || 80);
                const isHovered = hoveredIndex === i;

                return (
                  <g
                    key={`bp-pt-${i}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onClick={() => setHoveredIndex(i)}
                  >
                    {/* Systolic circle */}
                    <circle
                      cx={x}
                      cy={ySys}
                      r={isHovered ? 7 : 5}
                      fill="#0284c7"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-all"
                    />
                    {/* Diastolic circle */}
                    <circle
                      cx={x}
                      cy={yDia}
                      r={isHovered ? 7 : 5}
                      fill="#8b5cf6"
                      stroke="#ffffff"
                      strokeWidth="2"
                      className="transition-all"
                    />
                  </g>
                );
              })}
            </>
          )}

          {activeMetric === "pulse" && (
            <>
              {pulsePath && (
                <path
                  d={pulsePath}
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {chartData.map((d, i) => {
                if (d.pulse === null) return null;
                const x = getX(i);
                const y = getY(d.pulse);
                const isHovered = hoveredIndex === i;
                return (
                  <g
                    key={`pulse-pt-${i}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onClick={() => setHoveredIndex(i)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 7 : 5}
                      fill="#059669"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </>
          )}

          {activeMetric === "spo2" && (
            <>
              {spo2Path && (
                <path
                  d={spo2Path}
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {chartData.map((d, i) => {
                if (d.spo2 === null) return null;
                const x = getX(i);
                const y = getY(d.spo2);
                const isHovered = hoveredIndex === i;
                return (
                  <g
                    key={`spo2-pt-${i}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onClick={() => setHoveredIndex(i)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 7 : 5}
                      fill="#0d9488"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </>
          )}

          {activeMetric === "weight_bmi" && (
            <>
              {bmiPath && (
                <path
                  d={bmiPath}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {chartData.map((d, i) => {
                if (d.bmi === null) return null;
                const x = getX(i);
                const y = getY(d.bmi);
                const isHovered = hoveredIndex === i;
                return (
                  <g
                    key={`bmi-pt-${i}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onClick={() => setHoveredIndex(i)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 7 : 5}
                      fill="#6366f1"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  </g>
                );
              })}
            </>
          )}
        </svg>
      </div>

      {/* Legend & Active Point Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs">
        {/* Color Legend */}
        <div className="flex flex-wrap items-center gap-4">
          {activeMetric === "bp" && (
            <>
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <span className="w-3 h-3 rounded-full bg-sky-600 inline-block" />
                <span>Systolic (Target &lt;120)</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <span className="w-3 h-3 rounded-full bg-violet-600 inline-block" />
                <span>Diastolic (Target &lt;80)</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span className="w-3 h-1.5 bg-emerald-500/20 border border-emerald-500/50 inline-block rounded-xs" />
                <span>Optimal Band</span>
              </div>
            </>
          )}

          {activeMetric === "pulse" && (
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
              <span>Resting Pulse (bpm)</span>
            </div>
          )}

          {activeMetric === "spo2" && (
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" />
              <span>Oxygen Saturation (% SpO2)</span>
            </div>
          )}

          {activeMetric === "weight_bmi" && (
            <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
              <span>BMI Index (Healthy 18.5 - 24.9)</span>
            </div>
          )}
        </div>

        {/* Selected Data Point Pill */}
        {activePoint && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200">
            <span className="font-semibold text-slate-500 dark:text-slate-400">{activePoint.date}:</span>
            <span className="font-bold text-sky-600 dark:text-sky-400">
              {activeMetric === "bp" && activePoint.rawBp}
              {activeMetric === "pulse" && activePoint.rawPulse}
              {activeMetric === "spo2" && activePoint.rawSpo2}
              {activeMetric === "weight_bmi" && `BMI ${activePoint.rawBmi} (${activePoint.rawWeight})`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
