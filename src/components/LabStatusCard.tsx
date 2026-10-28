"use client";

import React, { useState } from "react";
import { LabOrder } from "@/types/visit";
import { LabStatusInfo, setLabStatus } from "@/lib/storage";
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Download,
  Trash2,
  ChevronDown,
  ChevronUp,
  Droplets,
  Building,
  Sparkles
} from "lucide-react";
import confetti from "canvas-confetti";

interface LabStatusCardProps {
  lab: LabOrder;
  statusInfo?: LabStatusInfo;
  isCustom?: boolean;
  onDeleteCustom?: (id: string) => void;
  providerName?: string;
}

const STEPS: Array<{ key: LabStatusInfo["status"]; label: string; number: number }> = [
  { key: "ordered", label: "Ordered", number: 1 },
  { key: "scheduled", label: "Scheduled", number: 2 },
  { key: "drawn", label: "Sample Drawn", number: 3 },
  { key: "completed", label: "Results Received", number: 4 },
];

export function LabStatusCard({
  lab,
  statusInfo,
  isCustom = false,
  onDeleteCustom,
  providerName = "Primary Care Physician",
}: LabStatusCardProps) {
  const currentStatus = statusInfo?.status || "ordered";
  const [questionsOpen, setQuestionsOpen] = useState(false);

  const handleSetStatus = (newStatus: LabStatusInfo["status"]) => {
    setLabStatus(lab.id, {
      ...statusInfo,
      status: newStatus,
    });

    if (newStatus === "completed" || newStatus === "drawn") {
      try {
        confetti({
          particleCount: 20,
          spread: 45,
          origin: { y: 0.8 },
        });
      } catch {
        // ignore
      }
    }
  };

  // Generate .ics calendar booking with fasting alarm
  const handleDownloadCalendarIcs = () => {
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    tmrw.setHours(8, 0, 0, 0);

    const pad = (n: number) => n.toString().padStart(2, "0");
    const formatIcsDate = (d: Date) =>
      `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

    const startStr = formatIcsDate(tmrw);
    const end = new Date(tmrw.getTime() + 45 * 60 * 1000);
    const endStr = formatIcsDate(end);

    const fastingNote = lab.fastingRequired
      ? `\\n\\nIMPORTANT FASTING PROTOCOL:\\nThis test requires ${lab.fastingHours || 10} hours of overnight fasting (water only). Stop all food and coffee the evening prior.`
      : "\\n\\nNo fasting required. Stay well hydrated with water.";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//ClariVisit//Health Companion//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:clarivisit_lab_${lab.id}_${Date.now()}@clarivisit.vercel.app`,
      `DTSTAMP:${formatIcsDate(new Date())}Z`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:Diagnostic Lab Draw: ${lab.testName}`,
      `DESCRIPTION:Lab screening for ${lab.testName} ordered by ${providerName}.${fastingNote}`,
      "LOCATION:Outpatient Diagnostic Laboratory (Quest / Labcorp / Clinic)",
      "STATUS:CONFIRMED",
      "BEGIN:VALARM",
      "TRIGGER:-PT12H",
      "ACTION:DISPLAY",
      `DESCRIPTION:Reminder: Fasting for your ${lab.testName} begins now. Water only!`,
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lab-appointment-${lab.testName.toLowerCase().replace(/[^a-z0-9]/g, "-")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStepIndex = (s: LabStatusInfo["status"]) => {
    switch (s) {
      case "ordered": return 0;
      case "scheduled": return 1;
      case "drawn": return 2;
      case "completed": return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight break-words">
                {lab.testName}
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {lab.category}
              </span>
              {isCustom && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Custom
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span>Ordered by: {providerName}</span>
              {lab.dateDue && <span>• Due: {lab.dateDue}</span>}
            </div>
          </div>
        </div>

        {/* Fasting Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {lab.fastingRequired ? (
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/60 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" />
              <span>Fast {lab.fastingHours || 10}h (Water Only)</span>
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60">
              ✓ No Fasting Needed
            </span>
          )}

          {isCustom && onDeleteCustom && (
            <button
              onClick={() => onDeleteCustom(lab.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
              title="Delete custom lab"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Status Stepper Pipeline */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <span>Diagnostic Pipeline</span>
          <span className="text-sky-600 dark:text-sky-400 font-extrabold">
            Status: {STEPS[currentIndex].label}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          {STEPS.map((step, idx) => {
            const isPassed = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={step.key}
                type="button"
                onClick={() => handleSetStatus(step.key)}
                className={`py-2 px-1.5 rounded-xl text-center transition-all cursor-pointer border ${
                  isCurrent
                    ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                    : isPassed
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50"
                    : "bg-white dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="text-[10px] font-black uppercase truncate">
                  {step.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* What it tests / Clinical Purpose */}
      <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 text-xs text-sky-950 dark:text-sky-200 space-y-1">
        <div className="text-[10px] uppercase font-bold text-sky-700 dark:text-sky-400 tracking-wider">
          Clinical Purpose & Underlying Metrics
        </div>
        <p className="leading-relaxed font-medium break-words">
          {lab.plainPurpose}
        </p>
        {lab.whatItDetects && (
          <p className="text-[11px] text-sky-800 dark:text-sky-300 pt-1 border-t border-sky-100 dark:border-sky-900/40">
            <strong>Key Biomarkers Evaluated:</strong> {lab.whatItDetects}
          </p>
        )}
      </div>

      {/* Specific Preparation Instructions */}
      <div className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
        <Droplets className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div className="min-w-0">
          <strong className="text-slate-900 dark:text-white block font-semibold text-[11px]">
            Patient Preparation Instructions:
          </strong>
          <span className="break-words text-[11px] text-slate-600 dark:text-slate-400">
            {lab.prepInstructions}
          </span>
        </div>
      </div>

      {/* Questions for the Phlebotomist / Doctor */}
      {lab.questionsForDoctor && lab.questionsForDoctor.length > 0 && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
          <button
            onClick={() => setQuestionsOpen(!questionsOpen)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center justify-between transition-colors font-semibold text-slate-800 dark:text-slate-200"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Questions for the Phlebotomist / Doctor ({lab.questionsForDoctor.length})</span>
            </span>
            {questionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {questionsOpen && (
            <div className="p-3.5 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 space-y-2">
              {lab.questionsForDoctor.map((q, idx) => (
                <div key={idx} className="pt-2 first:pt-0 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold">Q:</span>
                  <span className="break-words">{q}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Card Actions Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <button
          onClick={handleDownloadCalendarIcs}
          className="inline-flex items-center gap-1.5 text-sky-700 dark:text-sky-300 hover:text-sky-800 dark:hover:text-sky-200 font-bold"
        >
          <Calendar className="w-3.5 h-3.5 text-sky-600" />
          <span>Add Draw to Calendar (.ics)</span>
        </button>

        <span className="text-[11px] text-slate-400 font-mono">
          ID: #{lab.id.slice(-6).toUpperCase()}
        </span>
      </div>
    </div>
  );
}
