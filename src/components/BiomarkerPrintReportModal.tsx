"use client";

import React, { useRef } from "react";
import { BiomarkerResult } from "@/types/visit";
import { Printer, X, FileText, HeartPulse, CheckSquare, Activity, AlertTriangle } from "lucide-react";

interface BiomarkerPrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  biomarkers: BiomarkerResult[];
  patientName: string;
  patientDob?: string;
  providerName?: string;
  facilityName?: string;
}

export function BiomarkerPrintReportModal({
  isOpen,
  onClose,
  biomarkers,
  patientName,
  patientDob,
  providerName = "Primary Care Physician",
  facilityName = "Outpatient Diagnostic Center",
}: BiomarkerPrintReportModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const optimalCount = biomarkers.filter((b) => b.status === "optimal" || b.status === "normal").length;
  const flaggedCount = biomarkers.filter((b) => b.status === "elevated" || b.status === "high" || b.status === "low").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 print:static print:p-0 print:bg-transparent print:backdrop-blur-none">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-w-none print:max-h-none print:w-full print:bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Printable Laboratory Biomarker Report
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Print-optimized clinical overview with reference brackets for patient and clinician review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-xs transition-colors shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Print Lab Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100 dark:bg-slate-950/80 print:p-0 print:bg-white print:overflow-visible">
          <div
            ref={printRef}
            className="bg-white text-slate-950 p-6 sm:p-8 rounded-2xl border-2 border-slate-900 max-w-3xl mx-auto space-y-4 shadow-xl print:shadow-none print:border-2 print:border-black print:p-6 print:max-w-none print:w-full"
          >
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <div className="text-[9px] uppercase font-black tracking-widest text-slate-500">
                    Clinical Laboratory Biomarker Summary
                  </div>
                  <h1 className="text-lg font-black text-slate-950 leading-tight">
                    Diagnostic Blood Chemistry & Reference Standing
                  </h1>
                </div>
              </div>

              <div className="text-right text-[10px] text-slate-500 font-mono">
                <div>Document Ref: #BIO-{Date.now().toString().slice(-6)}</div>
                <div>Date Generated: {new Date().toLocaleDateString()}</div>
              </div>
            </div>

            {/* Patient & Clinic Meta */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Patient Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{patientName}</span>
                {patientDob && <span className="text-[10px] text-slate-500 block">DOB: {patientDob}</span>}
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Ordering Physician & Facility</span>
                <span className="font-bold text-slate-900">{providerName}</span>
                <div className="text-[10px] text-slate-500">{facilityName}</div>
              </div>
            </div>

            {/* Executive Status Banner */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Total Biomarkers</span>
                  <span className="font-black text-slate-900 text-sm">{biomarkers.length} Tests</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-emerald-600 block">Optimal / Normal</span>
                  <span className="font-black text-emerald-700 text-sm">{optimalCount} Tests</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-amber-600 block">Borderline / Attention</span>
                  <span className="font-black text-amber-700 text-sm">{flaggedCount} Tests</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 italic">
                *Evaluated against standard clinical reference brackets
              </div>
            </div>

            {/* Biomarkers Table */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left border-collapse table-fixed">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-3 w-[28%]">Biomarker / Panel</th>
                    <th className="py-2 px-3 w-[18%]">Patient Value</th>
                    <th className="py-2 px-3 w-[20%]">Standard Reference</th>
                    <th className="py-2 px-3 w-[16%]">Clinical Standing</th>
                    <th className="py-2 px-3 w-[18%]">Status Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  {biomarkers.map((b, idx) => {
                    const isGood = b.status === "optimal" || b.status === "normal";
                    return (
                      <tr key={`print-bio-${idx}`} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                        <td className="py-2 px-3 align-top font-bold text-slate-950 break-words">
                          <div>{b.name}</div>
                          <span className="text-[9px] text-slate-400 uppercase font-medium">{b.panel}</span>
                        </td>
                        <td className="py-2 px-3 align-top font-mono font-black text-slate-900">
                          {b.value} <span className="text-[10px] text-slate-500 font-normal">{b.unit}</span>
                        </td>
                        <td className="py-2 px-3 align-top font-mono text-slate-600">
                          {b.minRange} - {b.maxRange} {b.unit}
                        </td>
                        <td className="py-2 px-3 align-top">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              isGood
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {b.flagText || (isGood ? "Normal" : "Borderline")}
                          </span>
                        </td>
                        <td className="py-2 px-3 align-top text-slate-600 text-[10px] leading-tight break-words">
                          {b.lifestyleTips.slice(0, 75)}...
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Phlebotomist & Clinician Signoff */}
            <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 grid grid-cols-2 gap-3 text-[10px] text-slate-600">
              <div>
                <strong>Clinician Review Signature:</strong>
                <div className="border-b border-slate-400 mt-5" />
              </div>
              <div>
                <strong>Date & Review Comments:</strong>
                <div className="border-b border-slate-400 mt-5" />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[9px] text-slate-400">
              <span>ClariVisit Health Companion • Privacy-Preserving Clinical Translation</span>
              <span className="font-mono font-bold text-slate-700">Patient Laboratory Passport</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
