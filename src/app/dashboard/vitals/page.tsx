"use client";

import React, { useState, useEffect } from "react";
import { getStoredVisits } from "@/lib/storage";
import { ParsedVisitRecord } from "@/types/visit";
import { Activity, HeartPulse, ShieldCheck, ArrowRight, Info, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function VitalsTrackerPage() {
  const [visits, setVisits] = useState<ParsedVisitRecord[]>([]);

  useEffect(() => {
    setVisits(getStoredVisits());
  }, []);

  if (visits.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-3 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
        <Activity className="w-10 h-10 text-slate-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Vitals Tracked Yet</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Upload an After-Visit Summary to automatically track blood pressure, BMI, resting pulse, and oxygen saturation.
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

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Vitals Spectrum & Longitudinal Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Tracking cardiovascular and metabolic metrics across your recorded appointments
        </p>
      </div>

      {/* Main 4 Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blood Pressure */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Blood Pressure</h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {latest.vitals.bloodPressure.status.toUpperCase()}
            </span>
          </div>

          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {latest.vitals.bloodPressure.raw} <span className="text-xs text-slate-400 font-normal">mmHg</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-sky-400 w-1/4 h-full" />
            <div className="bg-emerald-500 w-1/2 h-full" />
            <div className="bg-amber-400 w-1/6 h-full" />
            <div className="bg-rose-500 w-1/12 h-full" />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl">
            {latest.vitals.bloodPressure.plainExplanation}
          </p>
        </div>

        {/* Oxygen Saturation */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">SpO2 Oxygen</h3>
            </div>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              {latest.vitals.oxygenSaturation?.status?.toUpperCase() || "WATCH"}
            </span>
          </div>

          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {latest.vitals.oxygenSaturation?.raw || "94%"}
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-rose-500 w-1/5 h-full" />
            <div className="bg-amber-400 w-1/5 h-full" />
            <div className="bg-emerald-500 w-3/5 h-full" />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl">
            {latest.vitals.oxygenSaturation?.plainExplanation}
          </p>
        </div>
      </div>

      {/* Historical Vitals Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          Recorded Vitals Across Visits
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Blood Pressure</th>
                <th className="pb-3 font-semibold">Pulse</th>
                <th className="pb-3 font-semibold">SpO2</th>
                <th className="pb-3 font-semibold">BMI</th>
                <th className="pb-3 font-semibold">Weight</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {visits.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-medium text-slate-900 dark:text-white">
                    {v.visitDate}
                  </td>
                  <td className="py-3 font-bold text-emerald-600 dark:text-emerald-400">
                    {v.vitals.bloodPressure.raw}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {v.vitals.heartRate?.raw || "--"}
                  </td>
                  <td className="py-3 text-amber-600 dark:text-amber-400 font-semibold">
                    {v.vitals.oxygenSaturation?.raw || "--"}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {v.vitals.bmi?.raw || "--"}
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">
                    {v.vitals.weight?.raw || "--"}
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/dashboard/visits/${v.id}`}
                      className="text-sky-600 hover:underline font-semibold"
                    >
                      View
                    </Link>
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
