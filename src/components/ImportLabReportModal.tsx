"use client";

import React, { useState } from "react";
import { BiomarkerResult } from "@/types/visit";
import { parseLabReportText } from "@/lib/biomarkers";
import { X, FileText, Sparkles, Check, AlertCircle, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

interface ImportLabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (results: BiomarkerResult[]) => void;
}

const SAMPLE_RAW_PORTAL_TEXT = `GLUCOSE: 92 mg/dL (Reference: 70-99)
HEMOGLOBIN A1C: 5.4 % (Reference: 4.0-5.6)
CHOLESTEROL, TOTAL: 184 mg/dL (Reference: < 200)
TRIGLYCERIDES: 110 mg/dL (Reference: < 150)
HDL CHOLESTEROL: 54 mg/dL (Reference: > 40)
LDL CHOLESTEROL: 108 mg/dL (Reference: < 100) [Flag: High]
eGFR: 108 mL/min/1.73m2 (Reference: > 90)
CREATININE: 0.88 mg/dL (Reference: 0.60-1.20)
BUN: 14 mg/dL (Reference: 7-20)
ALT: 24 U/L (Reference: 7-56)
AST: 22 U/L (Reference: 10-40)
WBC: 6.4 k/uL (Reference: 4.5-11.0)
HEMOGLOBIN: 15.1 g/dL (Reference: 13.5-17.5)`;

export function ImportLabReportModal({
  isOpen,
  onClose,
  onImport,
}: ImportLabReportModalProps) {
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState<BiomarkerResult[]>([]);

  if (!isOpen) return null;

  const handleTextChange = (text: string) => {
    setRawText(text);
    const results = parseLabReportText(text);
    setParsed(results);
  };

  const handlePasteSample = () => {
    handleTextChange(SAMPLE_RAW_PORTAL_TEXT);
  };

  const handleConfirmImport = () => {
    if (parsed.length === 0) return;
    onImport(parsed);
    try {
      confetti({
        particleCount: 30,
        spread: 50,
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
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-700 dark:text-purple-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Paste Lab Report / Portal Text
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Instantly extract test names, values, and reference ranges from Quest, Labcorp, or Epic MyChart
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
              Raw Laboratory Text
            </label>
            <button
              type="button"
              onClick={handlePasteSample}
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Paste Sample Quest Results</span>
            </button>
          </div>

          <textarea
            rows={6}
            value={rawText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Paste text here, for example:&#10;GLUCOSE: 92 mg/dL (Reference: 70-99)&#10;CHOLESTEROL, TOTAL: 184 mg/dL < 200&#10;HEMOGLOBIN A1C: 5.4 %..."
            className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-xs outline-hidden focus:border-purple-500 resize-none leading-relaxed"
          />

          {/* Parsed Preview Table */}
          {parsed.length > 0 ? (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  Detected Biomarkers ({parsed.length})
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                  ✓ Ready to Import
                </span>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 max-h-56 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50">
                {parsed.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between text-xs hover:bg-white dark:hover:bg-slate-900">
                    <div className="min-w-0 pr-2">
                      <span className="font-bold text-slate-900 dark:text-white block truncate">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.panel} • Ref: {item.minRange} - {item.maxRange} {item.unit}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono font-black text-slate-900 dark:text-white">
                        {item.value} {item.unit}
                      </span>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        item.status === "optimal" || item.status === "normal"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}>
                        {item.flagText}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : rawText.trim().length > 0 ? (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>No known biomarkers detected yet. Try pasting clinical lines like &ldquo;Glucose: 94 mg/dL&rdquo; or click &ldquo;Paste Sample Quest Results&rdquo; above.</span>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-slate-50/80 dark:bg-slate-950/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={parsed.length === 0}
            onClick={handleConfirmImport}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            <span>Import {parsed.length > 0 ? `${parsed.length} Biomarkers` : ""} to Vault</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
