"use client";

import React, { useRef } from "react";
import { StructuredPrescription } from "@/types/visit";
import { Printer, X, ShieldCheck, HeartPulse, Pill, Phone, User } from "lucide-react";

interface MedicationWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  medications: StructuredPrescription[];
  patientName: string;
  patientDob?: string;
  attendingDoctor?: string;
  contactPhone?: string;
}

export function MedicationWalletModal({
  isOpen,
  onClose,
  medications,
  patientName,
  patientDob,
  attendingDoctor,
  contactPhone,
}: MedicationWalletModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (Hidden on Print) */}
        <div className="no-print p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                Printable Medication Wallet Card
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Compact wallet-sized clinical record for emergencies, specialists, and travel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-xs transition-colors shrink-0"
            >
              <Printer className="w-4 h-4" />
              <span>Print Card</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Sheet */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100 dark:bg-slate-950/80">
          <div
            ref={cardRef}
            className="bg-white text-slate-950 p-6 sm:p-8 rounded-2xl border-2 border-slate-900 max-w-xl mx-auto space-y-4 shadow-xl print:shadow-none print:border-2 print:border-black print:p-6"
          >
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <HeartPulse className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <div className="text-[9px] uppercase font-black tracking-widest text-slate-500">
                    Emergency Clinical Record
                  </div>
                  <h1 className="text-base sm:text-lg font-black text-slate-950 leading-tight">
                    Active Medication Wallet Card
                  </h1>
                </div>
              </div>
              <div className="text-right text-[10px] text-slate-500 font-mono">
                Updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Patient & Clinic Meta */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Patient Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{patientName}</span>
                {patientDob && <span className="text-[10px] text-slate-500 block">DOB: {patientDob}</span>}
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Primary Provider</span>
                <span className="font-bold text-slate-900">{attendingDoctor || "Primary Care Physician"}</span>
                {contactPhone && <span className="text-[10px] text-sky-700 block">Tel: {contactPhone}</span>}
              </div>
            </div>

            {/* Prescriptions Table */}
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left border-collapse table-fixed">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-2.5 w-[36%]">Medication & Strength</th>
                    <th className="py-2 px-2.5 w-[30%]">Schedule & Directions</th>
                    <th className="py-2 px-2.5 w-[34%]">Indication / Food Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  {medications.map((rx, idx) => (
                    <tr key={`wallet-rx-${idx}`} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      <td className="py-2 px-2.5 align-top">
                        <strong className="text-slate-950 font-bold block">{rx.medicationName}</strong>
                        <span className="text-slate-600 font-semibold">{rx.dosage}</span>
                      </td>
                      <td className="py-2 px-2.5 align-top">
                        <div className="font-semibold text-slate-800">{rx.frequency}</div>
                        <div className="text-[10px] text-slate-500 capitalize">
                          {rx.timingSlots.join(", ")}
                        </div>
                      </td>
                      <td className="py-2 px-2.5 align-top">
                        <div className="text-slate-700 line-clamp-2 leading-tight">
                          {rx.clinicalPurpose}
                        </div>
                        <div className="text-[9px] font-bold text-sky-800 mt-0.5">
                          {rx.foodRequirement === "with_food" && "• With meal"}
                          {rx.foodRequirement === "with_plenty_of_water" && "• Full glass water"}
                          {rx.foodRequirement === "empty_stomach" && "• Empty stomach"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Emergency & Allergy Footer */}
            <div className="border-t border-slate-200 pt-2.5 flex items-center justify-between text-[9px] text-slate-500">
              <span>Carry in wallet for emergency responders and clinical visits.</span>
              <span className="font-mono font-bold text-slate-900">ClariVisit Health Companion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
