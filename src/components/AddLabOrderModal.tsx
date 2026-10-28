"use client";

import React, { useState } from "react";
import { LabOrder } from "@/types/visit";
import { X, Plus, FileText, Clock, AlertCircle } from "lucide-react";

interface AddLabOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lab: LabOrder) => void;
}

export function AddLabOrderModal({ isOpen, onClose, onSave }: AddLabOrderModalProps) {
  const [testName, setTestName] = useState("");
  const [category, setCategory] = useState<LabOrder["category"]>("Metabolic");
  const [fastingRequired, setFastingRequired] = useState(false);
  const [fastingHours, setFastingHours] = useState(10);
  const [dateDue, setDateDue] = useState("Complete within 14 days");
  const [plainPurpose, setPlainPurpose] = useState("");
  const [prepInstructions, setPrepInstructions] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim()) return;

    const newLab: LabOrder = {
      id: `custom_lab_${Date.now()}`,
      testName: testName.trim(),
      category,
      dateDue: dateDue.trim() || "Complete as directed",
      fastingRequired,
      fastingHours: fastingRequired ? fastingHours : undefined,
      plainPurpose: plainPurpose.trim() || "Diagnostic screening requested by care provider.",
      whatItDetects: "Specific clinical biomarkers related to " + category.toLowerCase() + " health.",
      prepInstructions:
        prepInstructions.trim() ||
        (fastingRequired
          ? `Fast overnight for ${fastingHours} hours with water only.`
          : "No fasting required. Stay well-hydrated with plain water."),
      questionsForDoctor: ["When will these results be finalized in my patient portal?"],
    };

    onSave(newLab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Add Diagnostic Lab Order
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Track external outpatient panels, blood draws, and fasting rules
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Panel / Test Name *
            </label>
            <input
              type="text"
              required
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="e.g. Thyroid Panel (TSH / Free T4) or Vitamin B12"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-amber-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Diagnostic Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-amber-500 font-medium cursor-pointer"
              >
                <option value="Metabolic">Metabolic (CMP, Glucose, A1C)</option>
                <option value="Cardiovascular">Cardiovascular (Lipid, ApoB)</option>
                <option value="Hematology">Hematology (CBC, Iron, Ferritin)</option>
                <option value="Infectious Disease">Infectious Disease</option>
                <option value="Urinary">Urinary / Kidney</option>
                <option value="General">General Wellness</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Timeline / Due Window
              </label>
              <input
                type="text"
                value={dateDue}
                onChange={(e) => setDateDue(e.target.value)}
                placeholder="e.g. Complete within 14 days"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-amber-500 font-medium"
              />
            </div>
          </div>

          {/* Fasting Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-xs">
                  Overnight Fasting Required?
                </span>
                <span className="text-[11px] text-slate-500">
                  Does this panel require water-only fasting prior to blood draw?
                </span>
              </div>
              <input
                type="checkbox"
                checked={fastingRequired}
                onChange={(e) => setFastingRequired(e.target.checked)}
                className="w-5 h-5 rounded-md text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            {fastingRequired && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Fasting Duration:
                </span>
                <select
                  value={fastingHours}
                  onChange={(e) => setFastingHours(parseInt(e.target.value))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value={8}>8 Hours</option>
                  <option value={10}>10 Hours (Recommended)</option>
                  <option value={12}>12 Hours (Strict)</option>
                </select>
              </div>
            )}
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Plain-English Purpose
            </label>
            <input
              type="text"
              value={plainPurpose}
              onChange={(e) => setPlainPurpose(e.target.value)}
              placeholder="e.g. Checks thyroid hormone regulation and metabolic baseline"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-amber-500 font-medium"
            />
          </div>

          {/* Prep instructions */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Preparation Instructions
            </label>
            <input
              type="text"
              value={prepInstructions}
              onChange={(e) => setPrepInstructions(e.target.value)}
              placeholder="e.g. Drink plenty of water morning of draw. Take thyroid meds after blood draw."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-amber-500 font-medium"
            />
          </div>

          {/* Footer */}
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
              className="px-5 py-2 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-xs"
            >
              Save Lab Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
