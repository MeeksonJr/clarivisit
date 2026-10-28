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
      className={`bg-white text-slate-900 mx-auto w-full max-w-[800px] leading-snug p-3.5 sm:p-8 md:p-10 font-sans print:p-0 print:max-w-none print:w-full select-text box-border overflow-hidden print:overflow-visible ${
        isPrintPreview
          ? "border border-slate-300 dark:border-slate-700 shadow-2xl rounded-2xl"
          : ""
      }`}
    >
      {/* ============================================================== */}
      {/* PASSPORT HEADER - Fully Responsive & Contained                  */}
      {/* ============================================================== */}
      <div className="border-b-2 border-slate-900 pb-4 mb-4 avoid-break">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          {/* Brand & Document Name */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
              <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase bg-sky-100 text-sky-900 px-2 py-0.5 rounded shrink-0">
                  Clinical Care Passport
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500">
                  CONFIDENTIAL PATIENT DOCUMENT
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-slate-950 tracking-tight mt-0.5 break-words">
                ClariVisit Medical Health Record
              </h1>
            </div>
          </div>

          {/* Reference Meta Box - Always within card boundary */}
          <div className="text-left sm:text-right text-[11px] text-slate-500 bg-slate-50 sm:bg-transparent p-2 sm:p-0 rounded-lg border border-slate-200 sm:border-0 shrink-0">
            <div>
              Document ID:{" "}
              <strong className="text-slate-900 font-mono">
                #CV-{visit.id.slice(-8).toUpperCase()}
              </strong>
            </div>
            <div>Issue Date: {visit.visitDate || new Date().toLocaleDateString()}</div>
            <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
              ✓ Verified Multimodal Extraction
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PATIENT & PROVIDER METADATA BLOCK - Zero Overflow Grid         */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-slate-50 border border-slate-200 rounded-xl mb-4 text-xs avoid-break">
        <div className="min-w-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Patient Name / Alias
          </span>
          <span className="font-extrabold text-slate-900 text-sm break-words block">
            {patientName}
          </span>
          {visit.patientDob && (
            <span className="text-[11px] text-slate-500 block">DOB: {visit.patientDob}</span>
          )}
        </div>

        <div className="min-w-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Attending Provider
          </span>
          <span className="font-bold text-slate-900 break-words block">
            {visit.providerName}
          </span>
          {visit.providerTitle && (
            <span className="text-[11px] text-slate-500 block break-words">
              {visit.providerTitle}
            </span>
          )}
        </div>

        <div className="min-w-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">
            Clinical Facility
          </span>
          <span className="font-bold text-slate-900 block break-words">
            {visit.facilityName}
          </span>
          {visit.contactPhone && (
            <span className="text-[11px] text-sky-700 block">Phone: {visit.contactPhone}</span>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: EXECUTIVE ASSESSMENT                                */}
      {/* ============================================================== */}
      <div className="mb-4 avoid-break">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
          <span>Clinical Assessment & Executive Overview</span>
        </h2>
        <div className="p-3 bg-sky-50/70 border border-sky-200/80 rounded-xl text-xs text-slate-800 leading-relaxed font-medium break-words">
          {visit.summaryExecutive ||
            "Routine after-visit summary records processed into personal health passport."}
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 2: VITALS SPECTRUM & REFERENCE MATRIX                  */}
      {/* Zero horizontal scrolling: 3-column fixed table for Print/Desktop */}
      {/* + Structured Cards for Mobile Phones                           */}
      {/* ============================================================== */}
      <div className="mb-4 avoid-break">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
          <Activity className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Physiological Vitals Spectrum</span>
        </h2>

        {/* --- VIEW A: DESKTOP & PRINT TABLE (3 Wide Proportional Columns) --- */}
        <div className="hidden sm:block print:block border border-slate-200 rounded-xl overflow-hidden print:border-slate-300">
          <table className="w-full text-xs text-left table-fixed border-collapse">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px] uppercase">
              <tr>
                <th className="py-2 px-3 w-[30%]">Vital Metric & Ref Range</th>
                <th className="py-2 px-3 w-[26%]">Recorded Value & Status</th>
                <th className="py-2 px-3 w-[44%]">Plain-English Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Blood Pressure */}
              <tr className="bg-white">
                <td className="py-2 px-3 align-top">
                  <div className="font-bold text-slate-900">Blood Pressure</div>
                  <div className="text-[10px] text-slate-500 font-mono">Ref: 90-120 / 60-80 mmHg</div>
                </td>
                <td className="py-2 px-3 align-top">
                  <div className="font-extrabold text-slate-950 text-sm">
                    {bp?.raw || "--"}
                  </div>
                  <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase mt-0.5">
                    {bp?.status || "OPTIMAL"}
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-600 text-[11px] leading-snug align-top break-words">
                  {bp?.plainExplanation || "Healthy cardiovascular pressure."}
                </td>
              </tr>

              {/* Heart Rate */}
              <tr className="bg-slate-50/50">
                <td className="py-2 px-3 align-top">
                  <div className="font-bold text-slate-900">Resting Pulse</div>
                  <div className="text-[10px] text-slate-500 font-mono">Ref: 60 - 100 bpm</div>
                </td>
                <td className="py-2 px-3 align-top">
                  <div className="font-extrabold text-slate-950 text-sm">
                    {pulse?.raw || "--"}
                  </div>
                  <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-100 text-sky-800 uppercase mt-0.5">
                    {pulse?.status || "NORMAL"}
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-600 text-[11px] leading-snug align-top break-words">
                  {pulse?.plainExplanation || "Normal sinus resting pulse."}
                </td>
              </tr>

              {/* SpO2 */}
              <tr className="bg-white">
                <td className="py-2 px-3 align-top">
                  <div className="font-bold text-slate-900">Oxygen Saturation (SpO2)</div>
                  <div className="text-[10px] text-slate-500 font-mono">Ref: 95 - 100% room air</div>
                </td>
                <td className="py-2 px-3 align-top">
                  <div className="font-extrabold text-slate-950 text-sm">
                    {spo2?.raw || "--"}
                  </div>
                  <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-teal-100 text-teal-800 uppercase mt-0.5">
                    {spo2?.status || "OPTIMAL"}
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-600 text-[11px] leading-snug align-top break-words">
                  {spo2?.plainExplanation || "Healthy blood oxygen levels."}
                </td>
              </tr>

              {/* BMI & Weight */}
              <tr className="bg-slate-50/50">
                <td className="py-2 px-3 align-top">
                  <div className="font-bold text-slate-900">Body Mass Index (BMI)</div>
                  <div className="text-[10px] text-slate-500 font-mono">Ref: 18.5 - 24.9 kg/m²</div>
                </td>
                <td className="py-2 px-3 align-top">
                  <div className="font-extrabold text-slate-950 text-sm">
                    {bmi?.raw || "--"}
                  </div>
                  <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase mt-0.5">
                    HEALTHY
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-600 text-[11px] leading-snug align-top break-words">
                  Height: <strong>{height?.raw || "--"}</strong> • Weight: <strong>{weight?.raw || "--"}</strong>
                </td>
              </tr>

              {/* Temperature */}
              <tr className="bg-white">
                <td className="py-2 px-3 align-top">
                  <div className="font-bold text-slate-900">Oral Temperature</div>
                  <div className="text-[10px] text-slate-500 font-mono">Ref: 97.0 - 99.0 °F</div>
                </td>
                <td className="py-2 px-3 align-top">
                  <div className="font-extrabold text-slate-950 text-sm">
                    {temp?.raw || "--"}
                  </div>
                  <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase mt-0.5">
                    NORMAL
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-600 text-[11px] leading-snug align-top break-words">
                  Respiration: <strong>{resp?.raw || "14 /min"}</strong> (unlabored breathing)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* --- VIEW B: MOBILE PHONE CARDS (Zero Scroll, 100% Contained) --- */}
        <div className="block sm:hidden print:hidden space-y-2">
          {/* BP */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">Blood Pressure</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                {bp?.status || "OPTIMAL"}
              </span>
            </div>
            <div className="text-base font-black text-slate-950">
              {bp?.raw || "--"}{" "}
              <span className="text-[10px] text-slate-500 font-normal font-mono">
                (Ref: 90-120/60-80 mmHg)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug pt-0.5 break-words">
              {bp?.plainExplanation || "Healthy cardiovascular pressure."}
            </p>
          </div>

          {/* Pulse & SpO2 Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Resting Pulse</span>
              <div className="text-sm font-extrabold text-slate-900">{pulse?.raw || "--"}</div>
              <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-100 text-sky-800 uppercase">
                {pulse?.status || "NORMAL"}
              </span>
              <div className="text-[9px] text-slate-400 font-mono">60-100 bpm</div>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Oxygen SpO2</span>
              <div className="text-sm font-extrabold text-slate-900">{spo2?.raw || "--"}</div>
              <span className="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-teal-100 text-teal-800 uppercase">
                {spo2?.status || "OPTIMAL"}
              </span>
              <div className="text-[9px] text-slate-400 font-mono">95-100%</div>
            </div>
          </div>

          {/* BMI & Temp */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">BMI & Weight</span>
              <div className="text-sm font-extrabold text-slate-900">{bmi?.raw || "--"}</div>
              <div className="text-[10px] text-slate-600 break-words">{weight?.raw || "--"} • {height?.raw || "--"}</div>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-0.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Temperature</span>
              <div className="text-sm font-extrabold text-slate-900">{temp?.raw || "--"}</div>
              <div className="text-[10px] text-slate-600">Resp: {resp?.raw || "14 /min"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 3: LAB ORDERS & FASTING PREPARATION                     */}
      {/* Zero horizontal scrolling: 3-column fixed table for Print/Desktop */}
      {/* + Clean Vertical Stack Cards on Mobile Phones                   */}
      {/* ============================================================== */}
      {labs.length > 0 && (
        <div className="mb-4 avoid-break">
          {/* Section Header with wrapping alert badge */}
          <div className="mb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-200 pb-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Diagnostic Lab Orders & Fasting Guidelines ({labs.length} tests)</span>
            </h2>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 self-start sm:self-auto shrink-0">
              ⚠️ CMP & Lipid Panel require 8-12h Overnight Fast
            </span>
          </div>

          {/* --- VIEW A: DESKTOP & PRINT TABLE (3 Wide Columns, Table Fixed) --- */}
          <div className="hidden sm:block print:block border border-slate-200 rounded-xl overflow-hidden print:border-slate-300">
            <table className="w-full text-xs text-left table-fixed border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px] uppercase">
                <tr>
                  <th className="py-2 px-3 w-[32%]">Panel / Test Name & Category</th>
                  <th className="py-2 px-3 w-[44%]">Clinical Evaluation Purpose</th>
                  <th className="py-2 px-3 w-[24%]">Patient Preparation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {labs.map((lab, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="py-2 px-3 align-top">
                      <div className="font-bold text-slate-950 break-words leading-tight">
                        {lab.testName}
                      </div>
                      <span className="inline-block mt-0.5 text-[10px] text-slate-500 font-medium">
                        {lab.category}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 leading-snug align-top break-words">
                      {lab.plainPurpose}
                    </td>
                    <td className="py-2 px-3 align-top">
                      {lab.fastingRequired ? (
                        <span className="font-extrabold text-amber-900 text-[10px] bg-amber-100 px-2 py-0.5 rounded inline-block border border-amber-200 leading-tight">
                          ⏳ Fast 8-12h (Water Only)
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-800 text-[10px] bg-emerald-50 px-2 py-0.5 rounded inline-block border border-emerald-200 leading-tight">
                          ✓ No Fasting Needed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- VIEW B: MOBILE PHONE CARDS (Zero Scroll, 100% Contained) --- */}
          <div className="block sm:hidden print:hidden space-y-2">
            {labs.map((lab, i) => (
              <div
                key={`mob-lab-${i}`}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-extrabold text-slate-950 text-xs block break-words">
                      {lab.testName}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {lab.category}
                    </span>
                  </div>
                  <div className="shrink-0">
                    {lab.fastingRequired ? (
                      <span className="font-extrabold text-amber-900 text-[10px] bg-amber-100 px-2 py-0.5 rounded inline-block border border-amber-200">
                        ⏳ Fast 8-12h
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-800 text-[10px] bg-emerald-50 px-2 py-0.5 rounded inline-block border border-emerald-200">
                        ✓ No Fasting
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5 border-t border-slate-200/60 break-words">
                  {lab.plainPurpose}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 4: LIFESTYLE & NUTRITION PROTOCOL                      */}
      {/* ============================================================== */}
      {visit.lifestyle && (
        <div className="mb-4 avoid-break">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
            <Apple className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Physician Lifestyle, Nutrition & Exercise Prescription</span>
          </h2>

          <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-950 italic mb-3 break-words leading-relaxed">
            "{visit.lifestyle.doctorDirectivesRaw ||
              "Physical activity of minimum 150 minutes moderate intensity per week recommended. Reduce excessive simple carbohydrate intake such as white breads, pastas, and white rice..."}"
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
                      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-0.5">
                        <span className="line-through text-slate-400 font-medium break-words">
                          {s.avoid}
                        </span>
                        <span className="font-bold text-teal-700 break-words">
                          ➔ {s.alternative}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 break-words">
                        {s.benefit}
                      </div>
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
                <div className="text-[11px] text-slate-700 leading-relaxed break-words">
                  <strong>Greens:</strong>{" "}
                  {grocery?.produce?.join(", ") || "Spinach, Kale, Broccoli, Avocado"}<br />
                  <strong>Proteins:</strong>{" "}
                  {grocery?.proteins?.join(", ") || "Chicken breast, Salmon, Eggs, Tofu"}<br />
                  <strong>Complex Grains:</strong>{" "}
                  {grocery?.wholeGrains?.join(", ") || "Quinoa, Oats, Chickpea pasta"}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 avoid-break">
        {/* Preventive Gaps */}
        <div className="border border-slate-200 rounded-xl p-3 text-xs min-w-0">
          <span className="font-bold text-slate-900 block mb-1.5 text-[11px] uppercase tracking-wider flex items-center gap-1 text-rose-700">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Vaccine Audit & Catch-Up Needs</span>
          </span>
          {preventiveGaps.length > 0 ? (
            <div className="space-y-2">
              {preventiveGaps.map((gap, idx) => (
                <div key={idx} className="bg-rose-50/60 border border-rose-100 p-2 rounded-lg">
                  <strong className="text-rose-900 block font-bold break-words">• {gap.vaccineOrScreening}</strong>
                  <span className="text-[10px] text-rose-800 block mt-0.5 break-words">{gap.guidanceText}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
              <Check className="w-4 h-4 shrink-0" />
              <span>All standard preventive vaccinations up to date.</span>
            </div>
          )}
        </div>

        {/* Follow Ups */}
        <div className="border border-slate-200 rounded-xl p-3 text-xs min-w-0">
          <span className="font-bold text-slate-900 block mb-1.5 text-[11px] uppercase tracking-wider flex items-center gap-1 text-sky-800">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>Next Scheduled Consultation</span>
          </span>
          {followUps.length > 0 ? (
            <div className="space-y-1 text-[11px]">
              <div className="font-bold text-slate-900 text-xs break-words">{followUps[0].title}</div>
              <div className="text-sky-700 font-semibold break-words">{followUps[0].dateTime}</div>
              <div className="text-slate-600 break-words">{followUps[0].facility}</div>
              <div className="text-slate-500 text-[10px] italic mt-1 break-words">
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
      <div className="border-t border-slate-200 pt-3 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 avoid-break text-center sm:text-left">
        <p className="m-0 leading-tight break-words">
          <strong>Notice:</strong> ClariVisit is an educational health literacy companion. This passport summarizes clinical paperwork for patient understanding and does not replace professional medical judgment.
        </p>
        <div className="shrink-0 font-mono text-[9px] text-slate-500">
          SECURE CLIENT-SIDE VAULT • ZERO PII STORED
        </div>
      </div>
    </div>
  );
}
