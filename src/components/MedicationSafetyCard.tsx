"use client";

import React, { useState } from "react";
import { StructuredPrescription } from "@/types/visit";
import {
  Pill,
  AlertTriangle,
  HelpCircle,
  Clock,
  Utensils,
  Droplets,
  ChevronDown,
  ChevronUp,
  User,
  RotateCcw,
  Trash2,
  CheckCircle2,
  ShieldAlert
} from "lucide-react";

interface MedicationSafetyCardProps {
  rx: StructuredPrescription;
  onDeleteCustom?: (id: string) => void;
}

export function MedicationSafetyCard({ rx, onDeleteCustom }: MedicationSafetyCardProps) {
  const [questionsOpen, setQuestionsOpen] = useState(false);

  const getFoodBadge = () => {
    switch (rx.foodRequirement) {
      case "with_food":
        return {
          icon: Utensils,
          label: "Take with Food / Meal",
          classes: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-amber-200 dark:border-amber-900",
        };
      case "with_plenty_of_water":
        return {
          icon: Droplets,
          label: "Take with Full Glass of Water",
          classes: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200 border-sky-200 dark:border-sky-900",
        };
      case "empty_stomach":
        return {
          icon: Clock,
          label: "Take on Empty Stomach (1 hr before / 2 hrs after meal)",
          classes: "bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200 border-purple-200 dark:border-purple-900",
        };
      default:
        return {
          icon: Clock,
          label: "No Strict Food Restriction",
          classes: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
        };
    }
  };

  const foodInfo = getFoodBadge();
  const FoodIcon = foodInfo.icon;

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 border border-sky-100 dark:border-sky-900/60 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
            <Pill className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight break-words">
                {rx.medicationName}
              </h3>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-900/60">
                {rx.dosage}
              </span>
              {rx.isCustomSupplement && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Custom Entry
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Schedule: {rx.frequency}
            </p>
          </div>
        </div>

        {rx.isCustomSupplement && onDeleteCustom && (
          <button
            onClick={() => onDeleteCustom(rx.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
            title="Remove from medicine cabinet"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Administration & Food Badge */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold border ${foodInfo.classes}`}>
          <FoodIcon className="w-3.5 h-3.5" />
          <span>{foodInfo.label}</span>
        </span>

        {rx.refillsRemaining !== undefined && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>{rx.refillsRemaining} {rx.refillsRemaining === 1 ? "refill" : "refills"} remaining</span>
          </span>
        )}
      </div>

      {/* Clinical Purpose Quote */}
      <div className="p-3.5 rounded-2xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 text-xs text-sky-950 dark:text-sky-200 space-y-1">
        <div className="text-[10px] uppercase font-bold text-sky-700 dark:text-sky-400 tracking-wider">
          Why This Was Prescribed / Clinical Target
        </div>
        <p className="leading-relaxed font-medium break-words">
          {rx.clinicalPurpose || rx.instructions}
        </p>
      </div>

      {/* Doctor Instructions */}
      {rx.instructions && (
        <div className="text-xs text-slate-700 dark:text-slate-300">
          <strong className="text-slate-900 dark:text-white">Doctor Directive:</strong>{" "}
          <span className="break-words">{rx.instructions}</span>
        </div>
      )}

      {/* Side Effects to Watch */}
      {rx.sideEffectsToWatch && rx.sideEffectsToWatch.length > 0 && (
        <div className="p-3 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/40 text-xs space-y-1.5">
          <div className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>Notable Symptoms & Side Effects to Monitor</span>
          </div>
          <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
            {rx.sideEffectsToWatch.map((effect, idx) => (
              <li key={idx} className="flex items-start gap-1.5 break-words">
                <span className="text-rose-500 font-bold">•</span>
                <span>{effect}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pharmacy Questions Collapsible Accordion */}
      {rx.pharmacyQuestions && rx.pharmacyQuestions.length > 0 && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
          <button
            onClick={() => setQuestionsOpen(!questionsOpen)}
            className="w-full p-3 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-850 flex items-center justify-between transition-colors font-semibold text-slate-800 dark:text-slate-200"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Questions to Ask the Pharmacist ({rx.pharmacyQuestions.length})</span>
            </span>
            {questionsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {questionsOpen && (
            <div className="p-3.5 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 space-y-2">
              {rx.pharmacyQuestions.map((q, idx) => (
                <div key={idx} className="pt-2 first:pt-0 text-[11px] text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                  <span className="text-teal-600 font-bold">Q:</span>
                  <span className="break-words">{q}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Details */}
      {rx.prescribingDoctor && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>Prescribing Provider: {rx.prescribingDoctor}</span>
          </span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active Record</span>
          </span>
        </div>
      )}
    </div>
  );
}
