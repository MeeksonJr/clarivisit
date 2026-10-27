"use client";

import React, { useState, useEffect } from "react";
import { getStoredVisits } from "@/lib/storage";
import { ParsedVisitRecord } from "@/types/visit";
import { Apple, Activity, CheckCircle2, ArrowRight, ShoppingCart, Dumbbell, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LifestyleNutritionPage() {
  const [visits, setVisits] = useState<ParsedVisitRecord[]>([]);

  useEffect(() => {
    setVisits(getStoredVisits());
  }, []);

  if (visits.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-6 space-y-3 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
        <Apple className="w-10 h-10 text-slate-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Lifestyle Prescriptions Yet</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Upload an After-Visit Summary to turn doctor instructions into grocery shopping lists, healthy carb swaps, and weekly exercise schedules.
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
  const lifestyle = latest.lifestyle;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Lifestyle, Nutrition & Exercise Protocol
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Personalized daily habits derived from {latest.providerName}'s visit directives
        </p>
      </div>

      {/* Target Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <Dumbbell className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {lifestyle?.weeklyExerciseTargetMinutes || 150} min
            </div>
            <span className="text-xs text-slate-500 font-medium">Weekly Cardio Target</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <Apple className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              Low Glycemic
            </div>
            <span className="text-xs text-slate-500 font-medium">Carb Strategy</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              Whole Foods
            </div>
            <span className="text-xs text-slate-500 font-medium">Dietary Standard</span>
          </div>
        </div>
      </div>

      {/* Doctor Directives Raw Quote */}
      <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/60 dark:border-teal-900/40 space-y-2">
        <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300 tracking-wider">
          Clinician Instructions
        </span>
        <p className="text-xs sm:text-sm text-teal-950 dark:text-teal-200 font-medium leading-relaxed italic">
          "{lifestyle?.doctorDirectivesRaw || "Physical activity of minimum 150 minutes moderate intensity per week is recommended, drink plenty of water. Reduce excessive simple carbohydrate intake..."}"
        </p>
      </div>

      {/* Carb Swap & Grocery Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Carbohydrate & Food Swaps
          </h3>
          <div className="space-y-3">
            {lifestyle?.mealSwaps?.map((swap, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="line-through text-slate-400 font-medium">{swap.avoid}</span>
                  <span className="font-bold text-teal-700 dark:text-teal-300">
                    {swap.alternative}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{swap.benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Recommended Grocery List
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Produce:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {lifestyle?.groceryList?.produce?.map((p, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Proteins:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {lifestyle?.groceryList?.proteins?.map((pr, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-medium">
                    {pr}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">Whole Grains:</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {lifestyle?.groceryList?.wholeGrains?.map((wg, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-medium">
                    {wg}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
