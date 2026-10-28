"use client";

import React, { useState } from "react";
import { StructuredPrescription } from "@/types/visit";
import {
  X,
  Plus,
  Pill,
  Clock,
  Utensils,
  Droplets,
  AlertCircle,
  Sparkles
} from "lucide-react";

interface AddMedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rx: StructuredPrescription) => void;
}

export function AddMedicationModal({ isOpen, onClose, onSave }: AddMedicationModalProps) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Once daily");
  const [timingSlots, setTimingSlots] = useState<Array<"morning" | "afternoon" | "evening" | "bedtime" | "as_needed">>(["morning"]);
  const [foodRequirement, setFoodRequirement] = useState<"with_food" | "empty_stomach" | "with_plenty_of_water" | "no_restriction">("with_food");
  const [purpose, setPurpose] = useState("");
  const [instructions, setInstructions] = useState("");
  const [doctor, setDoctor] = useState("");

  if (!isOpen) return null;

  const toggleSlot = (slot: "morning" | "afternoon" | "evening" | "bedtime" | "as_needed") => {
    if (timingSlots.includes(slot)) {
      if (timingSlots.length > 1) {
        setTimingSlots(timingSlots.filter((s) => s !== slot));
      }
    } else {
      setTimingSlots([...timingSlots, slot]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newMed: StructuredPrescription = {
      id: `custom_rx_${Date.now()}`,
      medicationName: name.trim(),
      dosage: dosage.trim() || "Standard dose",
      frequency: frequency.trim() || "Once daily",
      timingSlots,
      foodRequirement,
      clinicalPurpose: purpose.trim() || "Personal health maintenance / supplement.",
      instructions: instructions.trim() || "Take as directed.",
      sideEffectsToWatch: ["Monitor for unexpected allergic reactions or GI sensitivity."],
      pharmacyQuestions: ["Can I take this alongside my existing prescription routine?"],
      prescribingDoctor: doctor.trim() || "Self / Primary Care Recommendation",
      isCustomSupplement: true,
      status: "active",
    };

    onSave(newMed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Add Medication or Supplement
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Track prescriptions and OTC vitamins in your daily routine
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Name & Dosage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Medication / Supplement *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Magnesium Glycinate"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Dosage / Strength
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 200 mg or 1 capsule"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-sky-500 font-medium"
              />
            </div>
          </div>

          {/* Timing Slots */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Daily Administration Window (Select All That Apply)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { slot: "morning" as const, label: "🌅 Morning" },
                { slot: "afternoon" as const, label: "☀️ Afternoon" },
                { slot: "evening" as const, label: "🌙 Evening" },
                { slot: "bedtime" as const, label: "🛏️ Bedtime" },
                { slot: "as_needed" as const, label: "⚡ As Needed" },
              ].map(({ slot, label }) => {
                const isSelected = timingSlots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleSlot(slot)}
                    className={`px-3 py-2 rounded-xl font-bold text-xs border transition-all text-center ${
                      isSelected
                        ? "bg-sky-50 dark:bg-sky-950 border-sky-400 text-sky-700 dark:text-sky-300 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Food Requirement */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Food & Liquid Instructions
            </label>
            <select
              value={foodRequirement}
              onChange={(e) => setFoodRequirement(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-sky-500 font-medium cursor-pointer"
            >
              <option value="with_food">🍽️ Take with Food / Meal (maximizes absorption)</option>
              <option value="with_plenty_of_water">💧 Take with Full Glass of Water</option>
              <option value="empty_stomach">⏰ Take on Empty Stomach (1h before / 2h after)</option>
              <option value="no_restriction">⚪ No Food Restrictions</option>
            </select>
          </div>

          {/* Purpose / Why Taking */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Health Purpose / Target Benefit
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Muscle relaxation and sleep support"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-sky-500 font-medium"
            />
          </div>

          {/* Specific Directions */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Administration Directive
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Take 1 capsule 30 minutes before sleep with water"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-sky-500 font-medium"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-xs"
            >
              Save to Medicine Cabinet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
