"use client";

import React, { useRef } from "react";
import { LabOrder } from "@/types/visit";
import { Printer, X, FileText, HeartPulse, CheckSquare, Clock } from "lucide-react";

interface LabPrepPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  labs: LabOrder[];
  patientName: string;
  patientDob?: string;
  providerName?: string;
  facilityName?: string;
  contactPhone?: string;
}

export function LabPrepPrintModal({
  isOpen,
  onClose,
  labs,
  patientName,
  patientDob,
  providerName = "Primary Care Physician",
  facilityName = "Outpatient Diagnostic Center",
  contactPhone,
}: LabPrepPrintModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const hasFasting = labs.some((l) => l.fastingRequired);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 print:static print:p-0 print:bg-transparent print:backdrop-blur-none">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-w-none print:max-h-none print:w-full print:bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden on Print) */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Printable Outpatient Lab Requisition & Prep Sheet
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Print-optimized clinical instructions for Quest Diagnostics, Labcorp, or outpatient hospital labs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-xs transition-colors shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Print Lab Sheet</span>
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
            className="bg-white text-slate-950 p-6 sm:p-8 rounded-2xl border-2 border-slate-900 max-w-2xl mx-auto space-y-4 shadow-xl print:shadow-none print:border-2 print:border-black print:p-6 print:max-w-none print:w-full"
          >
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-3 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <HeartPulse className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-[9px] uppercase font-black tracking-widest text-slate-500">
                    Clinical Laboratory Preparation Order
                  </div>
                  <h1 className="text-lg font-black text-slate-950 leading-tight">
                    Diagnostic Blood Panels & Requisition Checklist
                  </h1>
                </div>
              </div>

              <div className="text-right text-[10px] text-slate-500 font-mono">
                <div>Document Ref: #LAB-{Date.now().toString().slice(-6)}</div>
                <div>Date: {new Date().toLocaleDateString()}</div>
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
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Ordering Provider & Facility</span>
                <span className="font-bold text-slate-900">{providerName}</span>
                <div className="text-[10px] text-slate-500">{facilityName}</div>
                {contactPhone && <div className="text-[10px] text-sky-700">Tel: {contactPhone}</div>}
              </div>
            </div>

            {/* Fasting Verification Box */}
            <div className={`p-3.5 rounded-xl border text-xs space-y-2 ${
              hasFasting
                ? "bg-amber-50/80 border-amber-300 text-amber-950"
                : "bg-emerald-50/80 border-emerald-300 text-emerald-950"
            }`}>
              <div className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Patient Fasting & Preparation Verification</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-slate-900 inline-block rounded-xs bg-white" />
                  <span>Overnight Fast Met (Water Only)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-slate-900 inline-block rounded-xs bg-white" />
                  <span>Copious Water Ingested</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 border-2 border-slate-900 inline-block rounded-xs bg-white" />
                  <span>Routine Morning Meds Taken</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Panels Table */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left border-collapse table-fixed">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-3 w-[34%]">Panel / Test Name</th>
                    <th className="py-2 px-3 w-[22%]">Category & Fasting</th>
                    <th className="py-2 px-3 w-[44%]">Clinical Evaluation Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  {labs.map((lab, idx) => (
                    <tr key={`print-lab-${idx}`} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      <td className="py-2 px-3 align-top font-bold text-slate-950 break-words">
                        {lab.testName}
                      </td>
                      <td className="py-2 px-3 align-top">
                        <div className="text-slate-600 font-medium">{lab.category}</div>
                        <div className="text-[10px] font-bold mt-0.5">
                          {lab.fastingRequired ? (
                            <span className="text-amber-800">⏳ Fast 8-12h</span>
                          ) : (
                            <span className="text-emerald-700">✓ No Fasting</span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3 align-top text-slate-600 leading-snug break-words">
                        {lab.plainPurpose}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phlebotomy Sign-Off Block */}
            <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 grid grid-cols-3 gap-2 text-[10px] text-slate-600">
              <div>
                <strong>Drawn By (Phlebotomist):</strong>
                <div className="border-b border-slate-400 mt-4" />
              </div>
              <div>
                <strong>Collection Date & Time:</strong>
                <div className="border-b border-slate-400 mt-4" />
              </div>
              <div>
                <strong>Lab Accession / Order #:</strong>
                <div className="border-b border-slate-400 mt-4" />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[9px] text-slate-400">
              <span>Present this form upon checking in at your outpatient diagnostic phlebotomy site.</span>
              <span className="font-mono font-bold text-slate-700">ClariVisit Diagnostic Companion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
