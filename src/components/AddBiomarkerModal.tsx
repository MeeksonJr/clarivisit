"use client";

import React, { useState } from "react";
import { BiomarkerResult, BiomarkerPanel, BiomarkerStatus } from "@/types/visit";
import {
  STANDARD_BIOMARKER_TEMPLATES,
  computeBiomarkerStatus,
} from "@/lib/biomarkers";
import { X, Plus, Activity, Sparkles, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface AddBiomarkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (biomarker: BiomarkerResult) => void;
  initialData?: BiomarkerResult | null;
}

export function AddBiomarkerModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddBiomarkerModalProps) {
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>("custom");
  const [name, setName] = useState(initialData?.name || "");
  const [panel, setPanel] = useState<BiomarkerPanel>(initialData?.panel || "Metabolic");
  const [valueInput, setValueInput] = useState<string>(initialData ? String(initialData.value) : "");
  const [unit, setUnit] = useState(initialData?.unit || "mg/dL");
  const [minRange, setMinRange] = useState<number>(initialData?.minRange || 70);
  const [maxRange, setMaxRange] = useState<number>(initialData?.maxRange || 99);
  const [plainMeaning, setPlainMeaning] = useState(initialData?.plainMeaning || "");
  const [whyItMatters, setWhyItMatters] = useState(initialData?.whyItMatters || "");
  const [lifestyleTips, setLifestyleTips] = useState(initialData?.lifestyleTips || "");
  const [doctorDiscussPoint, setDoctorDiscussPoint] = useState(initialData?.doctorDiscussPoint || "");
  const [labSource, setLabSource] = useState(initialData?.labSource || "Quest Diagnostics Outpatient Phlebotomy");
  const [dateRecorded, setDateRecorded] = useState(
    initialData?.dateRecorded || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  );

  if (!isOpen) return null;

  const handleSelectTemplate = (key: string) => {
    setSelectedTemplateKey(key);
    if (key === "custom") return;

    const t = STANDARD_BIOMARKER_TEMPLATES[key];
    if (t) {
      setName(t.name);
      setPanel(t.panel);
      setUnit(t.unit);
      setMinRange(t.minRange);
      setMaxRange(t.maxRange);
      setPlainMeaning(t.plainMeaning);
      setWhyItMatters(t.whyItMatters);
      setLifestyleTips(t.lifestyleTips);
      setDoctorDiscussPoint(t.doctorDiscussPoint || "");
    }
  };

  const parsedVal = parseFloat(valueInput);
  const statusInfo = isNaN(parsedVal)
    ? { status: "normal" as BiomarkerStatus, flagText: "Normal" }
    : computeBiomarkerStatus(parsedVal, minRange, maxRange);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isNaN(parsedVal)) return;

    const newResult: BiomarkerResult = {
      id: initialData?.id || `bio_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      panel,
      value: parsedVal,
      unit: unit.trim() || "--",
      minRange,
      maxRange,
      status: statusInfo.status,
      flagText: statusInfo.flagText,
      plainMeaning: plainMeaning.trim() || `Diagnostic measurement of ${name.trim()}.`,
      whyItMatters: whyItMatters.trim() || "Evaluates physiological baseline standing.",
      lifestyleTips: lifestyleTips.trim() || "Follow a balanced diet and regular aerobic exercise as directed.",
      doctorDiscussPoint: doctorDiscussPoint.trim() || "Review test baseline at upcoming consultation.",
      dateRecorded: dateRecorded.trim() || "Recent",
      labSource: labSource.trim() || "Outpatient Clinical Lab",
    };

    onSave(newResult);
    try {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                {initialData ? "Edit Biomarker Value" : "Log Laboratory Result"}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Record diagnostic blood draw numbers to track visual reference spectrums
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {/* Preset Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Select Common Biomarker Preset (Auto-Fills Reference Ranges)
            </label>
            <select
              value={selectedTemplateKey}
              onChange={(e) => handleSelectTemplate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-sky-500 font-medium cursor-pointer"
            >
              <option value="custom">✏️ Custom / Other Biomarker</option>
              <optgroup label="Metabolic & Glucose">
                <option value="glucose">Fasting Blood Glucose (70 - 99 mg/dL)</option>
                <option value="a1c">Hemoglobin A1c (4.0 - 5.6 %)</option>
                <option value="sodium">Sodium (135 - 145 mmol/L)</option>
                <option value="potassium">Potassium (3.5 - 5.0 mmol/L)</option>
                <option value="calcium">Calcium (8.5 - 10.2 mg/dL)</option>
              </optgroup>
              <optgroup label="Lipid & Cardiovascular">
                <option value="total_cholesterol">Total Cholesterol (&lt; 200 mg/dL)</option>
                <option value="ldl">LDL Cholesterol (Direct) (&lt; 100 mg/dL)</option>
                <option value="hdl">HDL Cholesterol (&gt; 40 mg/dL)</option>
                <option value="triglycerides">Triglycerides (&lt; 150 mg/dL)</option>
                <option value="cholesterol_ratio">Total / HDL Ratio (&lt; 4.5)</option>
              </optgroup>
              <optgroup label="Kidney & Liver">
                <option value="egfr">eGFR Kidney Filtration (&gt; 90 mL/min)</option>
                <option value="creatinine">Serum Creatinine (0.60 - 1.20 mg/dL)</option>
                <option value="bun">Blood Urea Nitrogen (BUN) (7 - 20 mg/dL)</option>
                <option value="alt">ALT Liver Enzyme (7 - 56 U/L)</option>
                <option value="ast">AST Liver Enzyme (10 - 40 U/L)</option>
                <option value="bilirubin">Total Bilirubin (0.2 - 1.2 mg/dL)</option>
              </optgroup>
              <optgroup label="Hematology & Endocrine">
                <option value="wbc">WBC White Blood Cells (4.5 - 11.0 k/uL)</option>
                <option value="hemoglobin">Hemoglobin (13.5 - 17.5 g/dL)</option>
                <option value="tsh">TSH Thyroid (0.45 - 4.50 uIU/mL)</option>
                <option value="vitamin_d">Vitamin D 25-OH (30 - 100 ng/mL)</option>
              </optgroup>
            </select>
          </div>

          {/* Test Name & Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Biomarker Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fasting Blood Glucose"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Clinical Panel Category
              </label>
              <select
                value={panel}
                onChange={(e) => setPanel(e.target.value as BiomarkerPanel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-sky-500 font-medium cursor-pointer"
              >
                <option value="Metabolic">Metabolic (CMP, Glucose, A1C)</option>
                <option value="Lipid">Lipid (Cholesterol, LDL, HDL, Triglycerides)</option>
                <option value="Renal">Renal (Kidney, eGFR, Creatinine, BUN)</option>
                <option value="Hepatic">Hepatic (Liver, ALT, AST, Bilirubin)</option>
                <option value="Hematology">Hematology (CBC, WBC, Hemoglobin)</option>
                <option value="Endocrine">Endocrine (Thyroid, TSH, Hormones)</option>
                <option value="General">General Wellness & Vitamins</option>
              </select>
            </div>
          </div>

          {/* Value, Unit, Min, Max */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Your Value *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  placeholder="92"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-sm outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="mg/dL"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Min Normal
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={minRange}
                  onChange={(e) => setMinRange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Max Normal
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={maxRange}
                  onChange={(e) => setMaxRange(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs outline-hidden focus:border-sky-500"
                />
              </div>
            </div>

            {/* Live Status Calculation Preview */}
            {!isNaN(parsedVal) && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Computed Status Preview:</span>
                <span className="font-extrabold font-mono text-sky-600 dark:text-sky-400">
                  {statusInfo.flagText} ({statusInfo.status.toUpperCase()})
                </span>
              </div>
            )}
          </div>

          {/* Plain Meaning */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Plain-English Meaning
            </label>
            <textarea
              rows={2}
              value={plainMeaning}
              onChange={(e) => setPlainMeaning(e.target.value)}
              placeholder="What this biomarker measures in simple terms..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-sky-500 font-medium resize-none"
            />
          </div>

          {/* Lifestyle tips */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Practical Lifestyle & Nutrition Habits
            </label>
            <textarea
              rows={2}
              value={lifestyleTips}
              onChange={(e) => setLifestyleTips(e.target.value)}
              placeholder="Foods, exercise, or habits that help optimize this biomarker..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-sky-500 font-medium resize-none"
            />
          </div>

          {/* Lab Source & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Lab Source / Facility
              </label>
              <input
                type="text"
                value={labSource}
                onChange={(e) => setLabSource(e.target.value)}
                placeholder="Quest Diagnostics, Labcorp, Hospital"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Date Drawn / Logged
              </label>
              <input
                type="text"
                value={dateRecorded}
                onChange={(e) => setDateRecorded(e.target.value)}
                placeholder="October 27, 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-hidden focus:border-sky-500 font-medium"
              />
            </div>
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
              Save Biomarker Result
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
