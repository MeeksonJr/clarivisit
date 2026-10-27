"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { getVisitById, deleteVisit } from "@/lib/storage";
import { ParsedVisitRecord, RecipeItem } from "@/types/visit";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeModal } from "@/components/RecipeModal";
import { DEFAULT_CLINICAL_RECIPES } from "@/lib/recipes";
import {
  HeartPulse,
  Activity,
  Apple,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Trash2,
  Download,
  Share2,
  Copy,
  Check,
  Send,
  Loader2,
  MessageSquare,
  Sparkles,
  Info,
  Phone,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  ChefHat,
} from "lucide-react";

function VisitDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const visitId = params?.id as string;

  const [visit, setVisit] = useState<ParsedVisitRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"vitals" | "jargon" | "labs" | "lifestyle" | "preventive">("vitals");
  
  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "model"; text: string }>>([
    {
      role: "model",
      text: "Hello! I have reviewed your After-Visit Summary. Ask me anything about your blood pressure, your lab test preparation, or how to turn your doctor's dietary advice into dinner tonight.",
    },
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem | null>(null);

  useEffect(() => {
    if (visitId) {
      const found = getVisitById(visitId);
      setVisit(found);
      setLoading(false);
    }
  }, [visitId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600 dark:text-sky-400" />
        <p className="text-xs text-slate-500 font-medium">Loading visit records...</p>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Visit Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          This visit record may have been deleted or purged from your local device.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to permanently delete this visit record? This cannot be undone.")) {
      deleteVisit(visit.id);
      router.push("/dashboard");
    }
  };

  const handleCopyDraft = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleDownloadCalendarIcs = () => {
    if (!visit.followUps || visit.followUps.length === 0) return;
    const fu = visit.followUps[0];
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ClariVisit//Health Companion//EN
BEGIN:VEVENT
SUMMARY:${fu.title} - ${fu.provider}
DESCRIPTION:Doctor Follow-up: ${fu.instructions}
LOCATION:${fu.facility}, ${fu.address}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointment-${visit.visitDate.replace(/[^a-zA-Z0-9]/g, "-")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatHistory((prev) => [...prev, { role: "user", text: userMessage }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visit,
          question: userMessage,
          history: chatHistory,
        }),
      });

      const data = await res.json();
      if (data.answer) {
        setChatHistory((prev) => [...prev, { role: "model", text: data.answer }]);
      } else {
        throw new Error(data.error || "No answer returned");
      }
    } catch {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "model",
          text: "I encountered a network issue answering your question. Please ensure your internet connection is active and try again.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                After-Visit Summary
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                {visit.visitDate}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {visit.facilityName || "Clinic Visit Report"}
            </h1>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-sky-600" />
            <span>Chat With Visit</span>
          </button>

          {visit.followUps && visit.followUps.length > 0 && (
            <button
              onClick={handleDownloadCalendarIcs}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Add follow up to calendar"
            >
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">Add to Calendar</span>
            </button>
          )}

          <button
            onClick={handleDelete}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/40 transition-colors"
            title="Delete this visit record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Provider & Facility Metadata Bar */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 font-bold text-sm">
            {visit.providerName ? visit.providerName.slice(0, 2).toUpperCase() : "DR"}
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-sm">
              {visit.providerName} {visit.providerTitle && `(${visit.providerTitle})`}
            </div>
            <div className="text-slate-500 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{visit.facilityAddress || visit.facilityName}</span>
            </div>
          </div>
        </div>

        {visit.contactPhone && (
          <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
            <Phone className="w-3.5 h-3.5 text-sky-500" />
            <span>{visit.contactPhone}</span>
          </div>
        )}
      </div>

      {/* Executive Reassurance Note */}
      <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/50 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-sky-900 dark:text-sky-300">
          <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Executive Visit Summary</span>
        </div>
        <p className="text-xs sm:text-sm text-sky-950 dark:text-sky-200 leading-relaxed">
          {visit.summaryExecutive}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("vitals")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "vitals"
              ? "bg-sky-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Vitals Spectrum</span>
        </button>

        <button
          onClick={() => setActiveTab("jargon")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "jargon"
              ? "bg-sky-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Jargon Demystifier ({visit.clinicalIssues?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("labs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "labs"
              ? "bg-sky-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Lab Orders & Fasting ({visit.labOrders?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("lifestyle")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "lifestyle"
              ? "bg-sky-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Apple className="w-4 h-4" />
          <span>Diet & Exercise Protocol</span>
        </button>

        <button
          onClick={() => setActiveTab("preventive")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === "preventive"
              ? "bg-sky-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Vaccine & Preventive Gaps</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: VITALS SPECTRUM                                         */}
      {/* ============================================================== */}
      {activeTab === "vitals" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blood Pressure Spectrum Card */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-rose-500" />
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Blood Pressure
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {visit.vitals?.bloodPressure?.status
                    ? visit.vitals.bloodPressure.status.toUpperCase()
                    : "NORMAL"}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {visit.vitals?.bloodPressure?.raw || "--"}
                </span>
                <span className="text-xs text-slate-400 font-medium">mmHg</span>
              </div>

              {/* Spectrum Gauge */}
              <div className="space-y-1.5">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-sky-400 w-1/4 h-full" title="Low" />
                  <div className="bg-emerald-500 w-1/2 h-full" title="Optimal / Normal" />
                  <div className="bg-amber-400 w-1/6 h-full" title="Elevated" />
                  <div className="bg-rose-500 w-1/12 h-full" title="High" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>&lt;90 Low</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">90-120 Optimal</span>
                  <span>120-130 Elevated</span>
                  <span>&gt;130 High</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {visit.vitals?.bloodPressure?.plainExplanation || "Blood pressure within standard parameters."}
              </p>
            </div>

            {/* Oxygen Saturation Card */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-sky-500" />
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    Oxygen Saturation (SpO2)
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                  {visit.vitals.oxygenSaturation?.status?.toUpperCase() || "WATCH"}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {visit.vitals.oxygenSaturation?.raw || "94%"}
                </span>
              </div>

              {/* Spectrum Gauge */}
              <div className="space-y-1.5">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                  <div className="bg-rose-500 w-1/5 h-full" title="Critical (<90%)" />
                  <div className="bg-amber-400 w-1/5 h-full" title="Borderline (90-94%)" />
                  <div className="bg-emerald-500 w-3/5 h-full" title="Optimal (95-100%)" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>&lt;90% Critical</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">91-94% Borderline</span>
                  <span className="text-emerald-600">95-100% Optimal</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {visit.vitals.oxygenSaturation?.plainExplanation}
              </p>
            </div>
          </div>

          {/* Secondary Vitals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 font-medium">BMI</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {visit.vitals?.bmi?.raw || "21.06"}
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                Healthy weight range (18.5 - 24.9)
              </span>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Pulse (Resting)</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {visit.vitals?.heartRate?.raw || "85 bpm"}
              </div>
              <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400">
                Normal (60 - 100 bpm)
              </span>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Height & Weight</span>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                {visit.vitals?.height?.raw || "--"} • {visit.vitals?.weight?.raw || "--"}
              </div>
              <span className="text-[10px] text-slate-400">Recorded at visit</span>
            </div>

            <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Oral Temperature</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                {visit.vitals?.temperature?.raw || "97.9 °F"}
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                Normal (97.0 - 99.0 °F)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: JARGON DEMYSTIFIER                                      */}
      {/* ============================================================== */}
      {activeTab === "jargon" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/40 text-xs text-sky-800 dark:text-sky-300">
            <strong>Why clinical summaries look alarming:</strong> Clinics use ICD-10 diagnostic billing codes so insurance covers lab tests. Seeing codes like "Pre-diabetes" or "Metabolic screening" under issues addressed does <em>not</em> mean you are diagnosed; it represents routine preventive exploration.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visit.clinicalIssues?.map((issue) => (
              <div
                key={issue.id}
                className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    {issue.codeOrTitle}
                  </h3>
                  {issue.isRoutineScreening && (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Routine Screening
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-500 font-semibold">Plain English Translation:</div>
                  <p className="text-slate-700 dark:text-slate-300">{issue.plainEnglishSummary}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="text-sky-600 dark:text-sky-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Reassurance Note:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{issue.reassuranceNote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: LAB ORDERS & FASTING PREP                               */}
      {/* ============================================================== */}
      {activeTab === "labs" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong>Fasting Notice:</strong> Tests like Comprehensive Metabolic Panel (CMP) and Lipid Panel evaluate baseline blood glucose and triglycerides. Fast for 8 to 12 hours beforehand with plain water only.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visit.labOrders?.map((lab) => (
              <div
                key={lab.id}
                className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sky-600 dark:text-sky-400">
                      {lab.category}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {lab.testName}
                    </h3>
                  </div>
                  {lab.fastingRequired ? (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 shrink-0">
                      Fasting Required
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                      No Fasting
                    </span>
                  )}
                </div>

                <div className="text-xs space-y-1">
                  <div className="text-slate-500 font-semibold">What this test evaluates:</div>
                  <p className="text-slate-700 dark:text-slate-300">{lab.plainPurpose}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <div className="text-slate-700 dark:text-slate-300 font-semibold">Preparation:</div>
                  <p className="text-slate-600 dark:text-slate-400">{lab.prepInstructions}</p>
                </div>

                {lab.questionsForDoctor && lab.questionsForDoctor.length > 0 && (
                  <div className="text-[11px] text-slate-500 pt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Question for follow-up: </span>
                    <span>"{lab.questionsForDoctor[0]}"</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: LIFESTYLE & NUTRITION PROTOCOL                           */}
      {/* ============================================================== */}
      {activeTab === "lifestyle" && (
        <div className="space-y-6">
          {/* Doctor Directives Banner */}
          <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider">
              Exact Provider Instruction
            </span>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic">
              "{visit.lifestyle?.doctorDirectivesRaw || "Physical activity of minimum 150 minutes moderate intensity per week recommended. Reduce excessive simple carbohydrate intake..."}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meal Swap Matrix */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Carb Swap Matrix
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Replace fast-digesting simple starches that cause blood sugar spikes with complex, sustained fiber.
              </p>

              <div className="space-y-2.5">
                {visit.lifestyle?.mealSwaps?.map((swap, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="line-through text-slate-400 font-medium">{swap.avoid}</span>
                      <span className="font-bold text-teal-700 dark:text-teal-300">
                        {swap.alternative}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{swap.benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Grocery Checklist */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Doctor-Prescribed Grocery List
                  </h3>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Take this list to the supermarket for easy, compliant meal preparation.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Produce & Leafy Greens:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {visit.lifestyle?.groceryList?.produce?.map((p, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Lean Proteins:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {visit.lifestyle?.groceryList?.proteins?.map((pr, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-medium">
                        {pr}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-700 dark:text-slate-300">Whole Grains:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {visit.lifestyle?.groceryList?.wholeGrains?.map((wg, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-medium">
                        {wg}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chef-Crafted Doctor Compliant Recipes */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Doctor-Compliant Chef Recipes
                </h3>
              </div>
              <button
                onClick={() => router.push("/dashboard/lifestyle")}
                className="text-xs font-semibold text-teal-600 hover:text-teal-500 hover:underline flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Customize & Open Meal Studio</span>
                <span>→</span>
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Low-glycemic, fiber-rich meals created to fulfill {visit.providerName}'s dietary guidance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(visit.lifestyle?.recipes && visit.lifestyle.recipes.length > 0
                ? visit.lifestyle.recipes
                : DEFAULT_CLINICAL_RECIPES
              ).map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onOpen={(rec) => setSelectedRecipe(rec)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: PREVENTIVE CARE & MISSING VACCINES                      */}
      {/* ============================================================== */}
      {activeTab === "preventive" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200">
            <strong>Preventive Gap Detection:</strong> EHR tables frequently record vaccinations as "Never done" even if received at another clinic or school. Review this list to update your health record.
          </div>

          <div className="space-y-3">
            {visit.preventiveCare?.map((item) => (
              <div
                key={item.id}
                className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.vaccineOrScreening}
                    </h3>
                    {item.status === "never_done" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        Never Done In Record
                      </span>
                    )}
                    {item.status === "completed" && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        Up To Date
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 max-w-xl">{item.guidanceText}</p>
                </div>

                {item.portalMessageDraft && (
                  <button
                    onClick={() => handleCopyDraft(item.portalMessageDraft!)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors shrink-0"
                  >
                    {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDraft ? "Draft Copied!" : "Copy Portal Message"}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* INTERACTIVE CHAT WITH VISIT DRAWER                             */}
      {/* ============================================================== */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] h-[520px] rounded-3xl glass-panel shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-sky-600 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5" />
              <div>
                <div className="text-xs font-bold">Chat With Your Visit</div>
                <div className="text-[10px] text-sky-100">Grounded in your AVS data</div>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="p-1 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-slate-50/50 dark:bg-slate-900/50">
            {chatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    msg.role === "user"
                      ? "bg-sky-600 text-white rounded-br-none"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-xs"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input form */}
          <form onSubmit={handleSendChatMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a question about this visit..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="p-2 rounded-xl bg-sky-600 text-white disabled:opacity-50 hover:bg-sky-500 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Recipe Details Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </div>
  );
}

export default function VisitDetailsSlugPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
          <p className="text-xs text-slate-500 font-medium">Loading visit...</p>
        </div>
      }
    >
      <VisitDetailsContent />
    </Suspense>
  );
}
