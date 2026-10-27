"use client";

import React, { useState, useEffect } from "react";
import { getStoredVisits } from "@/lib/storage";
import { ParsedVisitRecord } from "@/types/visit";
import { FileText, AlertTriangle, CheckCircle2, Calendar, Clock, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function LabsFastingPage() {
  const [visits, setVisits] = useState<ParsedVisitRecord[]>([]);

  useEffect(() => {
    setVisits(getStoredVisits());
  }, []);

  if (visits.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-3 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
        <FileText className="w-10 h-10 text-slate-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Lab Orders Recorded</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Upload an After-Visit Summary to extract ordered diagnostic panels, fasting guidelines, and questions to ask.
        </p>
        <Link
          href="/dashboard"
          className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500"
        >
          Upload Visit Summary
        </Link>
      </div>
    );
  }

  const latest = visits[0];
  const labs = latest.labOrders || [];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Lab Orders & Fasting Preparation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Preparation protocols and clinical purposes for diagnostic panels ordered by {latest.providerName}
        </p>
      </div>

      {/* Fasting Quick Warning */}
      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-sm">Fasting Rule of Thumb</div>
          <p className="leading-relaxed">
            If your orders include a Comprehensive Metabolic Panel (CMP) or Lipid Panel, schedule your blood draw for early morning and fast overnight (water only) for 8 to 12 hours. Do not drink coffee, juice, or chew gum as this alters glucose and triglyceride results.
          </p>
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {labs.map((lab) => (
          <div
            key={lab.id}
            className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400">
                  {lab.category}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {lab.testName}
                </h3>
              </div>
              {lab.fastingRequired ? (
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 shrink-0">
                  Fast 8-12h
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                  No Fasting
                </span>
              )}
            </div>

            <div className="text-xs space-y-1">
              <span className="text-slate-500 font-semibold">What it checks:</span>
              <p className="text-slate-700 dark:text-slate-300">{lab.plainPurpose}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Patient Instructions:</span>
              <p className="text-slate-600 dark:text-slate-400">{lab.prepInstructions}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
