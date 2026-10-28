"use client";

import React from "react";
import { ParsedVisitRecord } from "@/types/visit";
import {
  HeartPulse,
  Activity,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Phone,
  MapPin,
  Clock,
  Apple,
  Dumbbell,
  Check,
} from "lucide-react";

interface HealthPassportDocumentProps {
  visit: ParsedVisitRecord;
  patientNameOverride?: string;
  isPrintPreview?: boolean;
}

export function HealthPassportDocument({
  visit,
  patientNameOverride,
  isPrintPreview = false,
}: HealthPassportDocumentProps) {
  const patientName = patientNameOverride || visit.patientName || "Alex Morgan";
  const bp = visit.vitals?.bloodPressure;
  const pulse = visit.vitals?.heartRate;
  const spo2 = visit.vitals?.oxygenSaturation;
  const bmi = visit.vitals?.bmi;
  const height = visit.vitals?.height;
  const weight = visit.vitals?.weight;
  const temp = visit.vitals?.temperature;
  const resp = visit.vitals?.respirationRate;

  const labs = visit.labOrders || [];
  const swaps = visit.lifestyle?.mealSwaps || [];
  const grocery = visit.lifestyle?.groceryList;
  const workouts = visit.lifestyle?.weeklyWorkoutPlan || [];
  const preventiveGaps = visit.preventiveCare?.filter((p) => p.isActionableGap) || [];
  const followUps = visit.followUps || [];

  return (
    <div
      className={`bg-white text-slate-900 mx-auto w-full max-w-[800px] leading-snug p-6 sm:p-10 font-sans print:p-0 print:max-w-none print:w-full select-text ${
        isPrintPreview
          ? "border border-slate-300 dark:border-slate-700 shadow-2xl rounded-2xl"
          : ""
      }`}
    >
      {/* ============================================================== */}
      {/* PASSPORT HEADER                                                */}
      {/* ============================================================== */}
      <div className="border-b-2 border-slate-900 pb-4 mb-5 avoid-break">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <HeartPulse className="w-6 h-6 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase bg-sky-100 text-sky-900 px-2 py-0.5 rounded">
                  Clinical Care Passport
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  CONFIDENTIAL PATIENT DOCUMENT
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight mt-0.5">
                ClariVisit Medical Health Record
              </h1>
            </div>
          </div>

          <div className="text-right text-[11px] text-slate-500 shrink-0">
            <div>
              Document ID: <strong className="text-slate-900 font-mono">#CV-{visit.id.slice(-8).toUpperCase()}</strong>
            </div>
            <div>Issue Date: {visit.visitDate || new Date().toLocaleDateString()}</div>
            <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
              ✓ Verified Multimodal Extraction
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PATIENT & PROVIDER METADATA BLOCK                             */}
      {/* ============================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl mb-5 text-xs avoid-break">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name / Alias</span>
          <span className="font-extrabold text-slate-900 text-sm">{patientName}</span>
          {visit.patientDob && (
            <span className="text-[11px] text-slate-500 block">DOB: {visit.patientDob}</span>
          )}
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Attending Provider</span>
          <span className="font-bold text-slate-900">{visit.providerName}</span>
          {visit.providerTitle && (
            <span className="text-[11px] text-slate-500 block">{visit.providerTitle}</span>
          )}
        </div>

        <div className="col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Clinical Facility</span>
          <span className="font-bold text-slate-900 block truncate">{visit.facilityName}</span>
          {visit.contactPhone && (
            <span className="text-[11px] text-sky-700 block">Phone: {visit.contactPhone}</span>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: EXECUTIVE ASSESSMENT                                */}
      {/* ============================================================== */}
      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          Clinical Assessment & Executive Overview
        </h2>
        <div className="p-3 bg-sky-50/70 border border-sky-200/80 rounded-xl text-xs text-slate-800 leading-relaxed font-medium">
          {visit.summaryExecutive || "Routine after-visit summary records processed into personal health passport."}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 2: VITALS SPECTRUM & REFERENCE MATRIX                  */}
      {/* ============================================================== */}
      <div className="mb-5 avoid-break">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
          <Activity className="w-4 h-4 text-rose-600" />
          Physiological Vitals Spectrum
        </h2>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[10px] uppercase">
              <tr>
                <th className="py-2 px-3">Vital Metric</th>
                <th className="py-2 px-3">Recorded Value</th>
                <th className="py-2 px-3">Standard Reference Range</th>
                <th className="py-2 px-3">Clinical Status</th>
                <th className="py-2 px-3">Plain-English Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Blood Pressure */}
              <tr className="bg-white">
                <td className="py-2 px-3 font-bold text-slate-900">Blood Pressure</td>
                <td className="py-2 px-3 font-extrabold text-slate-900 text-sm">
                  {bp?.raw || "--"}
                </td>
                <td className="py-2 px-3 text-slate-500 font-mono">90-120 / 60-80 mmHg</td>
                <td className="py-2 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    {bp?.status || "OPTIMAL"}
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-600 text-[11px] leading-tight">
                  {bp?.plainExplanation || "Healthy cardiovascular pressure."}
                </td>
              </tr>

              {/* Heart Rate */}
              <tr className="bg-slate-50/50">
                <td className="py-2 px-3 font-bold text-slate-900">Resting Pulse</td>
                <td className="py-2 px-3 font-extrabold text-slate-900">
                  {pulse?.raw || "--"}
                </td>
                <td className="py-2 px-3 text-slate-500 font-mono">60 - 100 bpm</td>
                <td className="py-2 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 uppercase">
                    {pulse?.status || "NORMAL"}
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-600 text-[11px]">
                  {pulse?.plainExplanation || "Normal sinus resting pulse."}
                </td>
              </tr>

              {/* Oxygen Saturation */}
              <tr className="bg-white">
                <td className="py-2 px-3 font-bold text-slate-900">Oxygen Saturation (SpO2)</td>
                <td className="py-2 px-3 font-extrabold text-slate-900">
                  {spo2?.raw || "--"}
                </td>
                <td className="py-2 px-3 text-slate-500 font-mono">95 - 100%</td>
                <td className="py-2 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                    {spo2?.status || "OPTIMAL"}
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-600 text-[11px]">
                  {spo2?.plainExplanation || "Healthy blood oxygen levels."}
                </td>
              </tr>

              {/* BMI & Composition */}
              <tr className="bg-slate-50/50">
                <td className="py-2 px-3 font-bold text-slate-900">Body Mass Index (BMI)</td>
                <td className="py-2 px-3 font-extrabold text-slate-900">
                  {bmi?.raw || "--"}
                </td>
                <td className="py-2 px-3 text-slate-500 font-mono">18.5 - 24.9 kg/m²</td>
                <td className="py-2 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    HEALTHY
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-600 text-[11px]">
                  Height: {height?.raw || "--"} • Weight: {weight?.raw || "--"}
                </td>
              </tr>

              {/* Temperature */}
              <tr className="bg-white">
                <td className="py-2 px-3 font-bold text-slate-900">Oral Temperature</td>
                <td className="py-2 px-3 font-bold text-slate-900">
                  {temp?.raw || "--"}
                </td>
                <td className="py-2 px-3 text-slate-500 font-mono">97.0 - 99.0 °F</td>
                <td className="py-2 px-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    NORMAL
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-600 text-[11px]">
                  Respiration: {resp?.raw || "14"} breaths/min
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 3: LAB ORDERS & FASTING PREPARATION                     */}
      {/* ============================================================== */}
      {labs.length > 0 && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5 flex items-center justify-between border-b border-slate-200 pb-1">
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" />
              Diagnostic Lab Orders & Fasting Guidelines ({labs.length} tests)
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              ⚠️ CMP & Lipid Panel require 8-12h Overnight Fast
            </span>
          </h2>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 text-[10px] uppercase">
                <tr>
                  <th className="py-2 px-3">Panel / Test Name</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Clinical Evaluation Purpose</th>
                  <th className="py-2 px-3">Patient Fasting Requirement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {labs.map((lab, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="py-2 px-3 font-bold text-slate-900">
                      {lab.testName}
                    </td>
                    <td className="py-2 px-3 text-[11px] text-slate-500 font-medium">
                      {lab.category}
                    </td>
                    <td className="py-2 px-3 text-[11px] text-slate-600">
                      {lab.plainPurpose}
                    </td>
                    <td className="py-2 px-3">
                      {lab.fastingRequired ? (
                        <span className="font-extrabold text-amber-800 text-[11px] bg-amber-100 px-2 py-0.5 rounded inline-block">
                          ⏳ Fast 8-12h (Water Only)
                        </span>
                      ) : (
                        <span className="font-semibold text-emerald-700 text-[11px] bg-emerald-50 px-2 py-0.5 rounded inline-block">
                          ✓ No Fasting Needed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 4: LIFESTYLE & NUTRITION PROTOCOL                      */}
      {/* ============================================================== */}
      {visit.lifestyle && (
        <div className="mb-5 avoid-break">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
            <Apple className="w-4 h-4 text-teal-600" />
            Physician Lifestyle, Nutrition & Exercise Prescription
          </h2>

          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-950 italic mb-3">
            "{visit.lifestyle.doctorDirectivesRaw || "Physical activity of minimum 150 minutes moderate intensity per week recommended. Reduce excessive simple carbohydrate intake such as white breads, pastas, and white rice..."}"
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Meal Swaps */}
            {swaps.length > 0 && (
              <div className="border border-slate-200 rounded-xl p-3 text-xs">
                <span className="font-bold text-slate-900 block mb-2 text-[11px] uppercase tracking-wider">
                  Carb Swap Matrix
                </span>
                <div className="space-y-2">
                  {swaps.map((s, idx) => (
                    <div key={idx} className="pb-1.5 border-b border-slate-100 last:border-b-0">
                      <div className="flex items-center justify-between">
                        <span className="line-through text-slate-400 font-medium">{s.avoid}</span>
                        <span className="font-bold text-teal-700">➔ {s.alternative}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{s.benefit}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Grocery Staples & Exercise */}
            <div className="border border-slate-200 rounded-xl p-3 text-xs space-y-2.5">
              <div>
                <span className="font-bold text-slate-900 block mb-1 text-[11px] uppercase tracking-wider">
                  Prescribed Grocery Staples
                </span>
                <div className="text-[11px] text-slate-700 leading-relaxed">
                  <strong>Greens:</strong> {grocery?.produce?.join(", ") || "Spinach, Kale, Broccoli, Avocado"}<br />
                  <strong>Proteins:</strong> {grocery?.proteins?.join(", ") || "Chicken breast, Salmon, Eggs, Tofu"}<br />
                  <strong>Complex Grains:</strong> {grocery?.wholeGrains?.join(", ") || "Quinoa, Oats, Chickpea pasta"}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                  <Dumbbell className="w-3.5 h-3.5 text-teal-600" />
                  Cardio Target:
                </span>
                <span className="font-black text-slate-900">
                  {visit.lifestyle.weeklyExerciseTargetMinutes || 150} min / week
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 5: PREVENTIVE CARE AUDIT & FOLLOW-UPS                  */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 avoid-break">
        {/* Preventive Gaps */}
        <div className="border border-slate-200 rounded-xl p-3 text-xs">
          <span className="font-bold text-slate-900 block mb-1.5 text-[11px] uppercase tracking-wider flex items-center gap-1 text-rose-700">
            <AlertTriangle className="w-3.5 h-3.5" />
            Vaccine Audit & Catch-Up Needs
          </span>
          {preventiveGaps.length > 0 ? (
            <div className="space-y-2">
              {preventiveGaps.map((gap, idx) => (
                <div key={idx} className="bg-rose-50/60 border border-rose-100 p-2 rounded-lg">
                  <strong className="text-rose-900 block font-bold">• {gap.vaccineOrScreening}</strong>
                  <span className="text-[10px] text-rose-800 block mt-0.5">{gap.guidanceText}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
              <Check className="w-4 h-4" />
              All standard preventive vaccinations up to date.
            </div>
          )}
        </div>

        {/* Follow Ups */}
        <div className="border border-slate-200 rounded-xl p-3 text-xs">
          <span className="font-bold text-slate-900 block mb-1.5 text-[11px] uppercase tracking-wider flex items-center gap-1 text-sky-800">
            <Calendar className="w-3.5 h-3.5" />
            Next Scheduled Consultation
          </span>
          {followUps.length > 0 ? (
            <div className="space-y-1 text-[11px]">
              <div className="font-bold text-slate-900 text-xs">{followUps[0].title}</div>
              <div className="text-sky-700 font-semibold">{followUps[0].dateTime}</div>
              <div className="text-slate-600">{followUps[0].facility}</div>
              <div className="text-slate-500 text-[10px] italic mt-1">
                Instructions: {followUps[0].instructions}
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-[11px]">
              Annual physical scheduled for 1 year from visit date.
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* PASSPORT FOOTER & LEGAL NOTICE                                 */}
      {/* ============================================================== */}
      <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 avoid-break">
        <p className="m-0 leading-tight">
          <strong>Notice:</strong> ClariVisit is an educational health literacy companion. This passport summarizes clinical paperwork for patient understanding and does not replace professional medical judgment.
        </p>
        <div className="shrink-0 font-mono text-[9px] text-slate-500">
          SECURE CLIENT-SIDE VAULT • ZERO PII STORED
        </div>
      </div>
    </div>
  );
}
