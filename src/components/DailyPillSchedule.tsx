"use client";

import React, { useState, useEffect } from "react";
import { StructuredPrescription } from "@/types/visit";
import { getPillLogForDate, togglePillTaken } from "@/lib/storage";
import {
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Zap,
  CheckCircle2,
  Circle,
  Clock,
  Utensils,
  Droplets,
  AlertCircle,
  Plus,
  Sparkles,
  ShieldCheck,
  Calendar
} from "lucide-react";
import confetti from "canvas-confetti";

interface DailyPillScheduleProps {
  medications: StructuredPrescription[];
  onAddClick?: () => void;
}

type SlotKey = "morning" | "afternoon" | "evening" | "bedtime" | "as_needed";

interface SlotConfig {
  key: SlotKey;
  label: string;
  timeWindow: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgLight: string;
  badgeClass: string;
}

const SLOTS: SlotConfig[] = [
  {
    key: "morning",
    label: "Morning",
    timeWindow: "7:00 AM – 11:00 AM",
    icon: Sunrise,
    accentColor: "text-amber-500",
    bgLight: "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/40",
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  },
  {
    key: "afternoon",
    label: "Afternoon",
    timeWindow: "11:00 AM – 4:00 PM",
    icon: Sun,
    accentColor: "text-sky-500",
    bgLight: "bg-sky-50/70 dark:bg-sky-950/30 border-sky-200/80 dark:border-sky-900/40",
    badgeClass: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  },
  {
    key: "evening",
    label: "Evening",
    timeWindow: "4:00 PM – 9:00 PM",
    icon: Sunset,
    accentColor: "text-indigo-500",
    bgLight: "bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200/80 dark:border-indigo-900/40",
    badgeClass: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
  },
  {
    key: "bedtime",
    label: "Bedtime",
    timeWindow: "9:00 PM – 12:00 AM",
    icon: Moon,
    accentColor: "text-purple-500",
    bgLight: "bg-purple-50/70 dark:bg-purple-950/30 border-purple-200/80 dark:border-purple-900/40",
    badgeClass: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  },
  {
    key: "as_needed",
    label: "As Needed (PRN)",
    timeWindow: "When symptoms arise",
    icon: Zap,
    accentColor: "text-emerald-500",
    bgLight: "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/40",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  },
];

export function DailyPillSchedule({ medications, onAddClick }: DailyPillScheduleProps) {
  const todayKey = new Date().toISOString().split("T")[0];
  const [takenLog, setTakenLog] = useState<Record<string, boolean>>({});

  const refreshLog = () => {
    setTakenLog(getPillLogForDate(todayKey));
  };

  useEffect(() => {
    refreshLog();
    window.addEventListener("clarivisit_pill_logged", refreshLog);
    return () => window.removeEventListener("clarivisit_pill_logged", refreshLog);
  }, [todayKey]);

  // Group medications by slot
  const scheduledItemsBySlot: Record<SlotKey, Array<{ rx: StructuredPrescription; slotKey: SlotKey }>> = {
    morning: [],
    afternoon: [],
    evening: [],
    bedtime: [],
    as_needed: [],
  };

  medications.forEach((rx) => {
    const slots = rx.timingSlots && rx.timingSlots.length > 0 ? rx.timingSlots : ["morning"];
    slots.forEach((s) => {
      const validSlot = (s in scheduledItemsBySlot ? s : "morning") as SlotKey;
      scheduledItemsBySlot[validSlot].push({ rx, slotKey: validSlot });
    });
  });

  // Calculate adherence for today (excluding as_needed from denominator if none taken)
  let totalScheduledDoses = 0;
  let takenDoses = 0;

  SLOTS.forEach((slot) => {
    const items = scheduledItemsBySlot[slot.key];
    if (slot.key !== "as_needed") {
      totalScheduledDoses += items.length;
    }
    items.forEach((item) => {
      const trackingKey = `${item.rx.id}_${slot.key}`;
      if (takenLog[trackingKey]) {
        takenDoses++;
      }
    });
  });

  const adherencePct = totalScheduledDoses > 0 ? Math.min(100, Math.round((takenDoses / totalScheduledDoses) * 100)) : 100;

  const handleToggle = (rxId: string, slotKey: SlotKey) => {
    const trackingKey = `${rxId}_${slotKey}`;
    const newState = togglePillTaken(todayKey, trackingKey);
    setTakenLog((prev) => ({ ...prev, [trackingKey]: newState }));

    if (newState) {
      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
        });
      } catch {
        // ignore
      }
    }
  };

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-7 border border-slate-200 dark:border-slate-800 space-y-6">
      {/* Header & Adherence Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Today's Pill Tracker</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              {todayFormatted}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            Daily Administration Routine
          </h2>
        </div>

        {onAddClick && (
          <button
            onClick={onAddClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Supplement / Rx</span>
          </button>
        )}
      </div>

      {/* Compliance Progress Indicator */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Daily Schedule Adherence</span>
          </span>
          <span className="font-extrabold text-sky-600 dark:text-sky-400 font-mono">
            {takenDoses} / {totalScheduledDoses} Doses ({adherencePct}%)
          </span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${adherencePct}%` }}
          />
        </div>
      </div>

      {/* Time Slots Grid */}
      <div className="space-y-4">
        {SLOTS.map((slot) => {
          const items = scheduledItemsBySlot[slot.key];
          if (items.length === 0 && slot.key === "as_needed") return null;

          const SlotIcon = slot.icon;

          return (
            <div
              key={`slot-${slot.key}`}
              className={`rounded-2xl border p-4 transition-colors ${slot.bgLight}`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-white dark:bg-slate-900 shadow-xs ${slot.accentColor}`}>
                    <SlotIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {slot.label}
                    </h3>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {slot.timeWindow}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                  {items.length} {items.length === 1 ? "Item" : "Items"}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="text-xs text-slate-400 italic py-1 text-center sm:text-left">
                  No medications scheduled for {slot.label.toLowerCase()}.
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map(({ rx }, idx) => {
                    const trackingKey = `${rx.id}_${slot.key}`;
                    const isTaken = Boolean(takenLog[trackingKey]);

                    return (
                      <div
                        key={`rx-item-${rx.id}-${idx}`}
                        onClick={() => handleToggle(rx.id, slot.key)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isTaken
                            ? "bg-white/95 dark:bg-slate-900/90 border-emerald-300 dark:border-emerald-800/80 shadow-xs"
                            : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800"
                        }`}
                      >
                        {/* Checkbox & Name */}
                        <div className="flex items-start gap-3 min-w-0">
                          <button
                            type="button"
                            className="mt-0.5 shrink-0 focus:outline-hidden"
                            aria-label={`Mark ${rx.medicationName} as taken`}
                          >
                            {isTaken ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-sky-500 transition-colors" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span
                                className={`text-sm font-extrabold tracking-tight break-words ${
                                  isTaken
                                    ? "text-slate-500 dark:text-slate-400 line-through"
                                    : "text-slate-900 dark:text-white"
                                }`}
                              >
                                {rx.medicationName}
                              </span>
                              <span className="text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 px-2 py-0.2 rounded-md border border-sky-100 dark:border-sky-900/50">
                                {rx.dosage}
                              </span>
                              {rx.isCustomSupplement && (
                                <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                                  Supplement
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 break-words">
                              {rx.instructions || rx.clinicalPurpose}
                            </p>
                          </div>
                        </div>

                        {/* Food & Timing Requirement Badge */}
                        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                          {rx.foodRequirement === "with_food" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                              <Utensils className="w-3 h-3" />
                              <span>Take with Meal</span>
                            </span>
                          )}
                          {rx.foodRequirement === "with_plenty_of_water" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                              <Droplets className="w-3 h-3" />
                              <span>Full Glass Water</span>
                            </span>
                          )}
                          {rx.foodRequirement === "empty_stomach" && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                              <Clock className="w-3 h-3" />
                              <span>Empty Stomach</span>
                            </span>
                          )}

                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                              isTaken
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {isTaken ? "TAKEN" : "DUE"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
