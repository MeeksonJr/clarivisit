"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getStoredVisits, saveVisit } from "@/lib/storage";
import { ParsedVisitRecord } from "@/types/visit";
import { useAuth } from "@/context/AuthContext";
import { compressImageFile } from "@/lib/imageCompressor";
import { SAMPLE_VISIT_RECORD } from "@/lib/sampleVisit";
import {
  UploadCloud,
  Camera,
  FileText,
  Loader2,
  HeartPulse,
  Activity,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Plus,
  AlertCircle,
  FileClock,
  Sparkles
} from "lucide-react";
import confetti from "canvas-confetti";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [visits, setVisits] = useState<ParsedVisitRecord[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStepMessage, setUploadStepMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const refreshVisits = () => {
    const data = getStoredVisits();
    setVisits(data);
    setLoadingInitial(false);
  };

  useEffect(() => {
    refreshVisits();
    window.addEventListener("clarivisit_data_change", refreshVisits);
    return () => window.removeEventListener("clarivisit_data_change", refreshVisits);
  }, []);

  const handleSelectFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setErrorMessage("");
    setUploadStepMessage("Optimizing photo resolution for clinical OCR...");

    try {
      const rawFiles = Array.from(files);
      const compressedFiles = await Promise.all(
        rawFiles.map((file) => compressImageFile(file))
      );

      const formData = new FormData();
      compressedFiles.forEach((file) => formData.append("files", file));

      setUploadStepMessage("Scanning with Gemini Multimodal Vision...");
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to process summary.");
      }

      setUploadStepMessage("Demystifying terminology & synthesizing lifestyle plan...");
      const data = await res.json();

      if (data.visit) {
        saveVisit(data.visit);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
        // Route directly to the new visit's dedicated slug
        router.push(`/dashboard/visits/${data.visit.id}`);
      } else {
        throw new Error("No visit record returned.");
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      setErrorMessage(error.message || "Failed to analyze After-Visit Summary. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleLoadSample = () => {
    saveVisit(SAMPLE_VISIT_RECORD);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    router.push(`/dashboard/visits/${SAMPLE_VISIT_RECORD.id}`);
  };

  if (loadingInitial) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600 dark:text-sky-400" />
        <p className="text-xs text-slate-500 font-medium">Loading your health vault...</p>
      </div>
    );
  }

  // =========================================================================
  // SCENARIO A: BRAND NEW USER WITH NO VISITS (COMPLETELY CLEAN DASHBOARD)
  // Centered circular action button as requested by user
  // =========================================================================
  if (visits.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-4">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleSelectFiles}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="max-w-md w-full mx-auto space-y-8">
          {/* Greeting text */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome, {profile?.name || "Patient"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Your Health Vault Is Ready
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              No after-visit records yet. Upload photos of your printed paperwork or your portal PDF to decode your visit in seconds.
            </p>
          </div>

          {/* Centered Circular Action Button with Pulsing Glow Rings */}
          <div className="relative flex flex-col items-center justify-center">
            {/* Ambient Pulsing Aura */}
            <div className="absolute w-44 h-44 rounded-full bg-sky-500/10 dark:bg-sky-400/15 animate-ping pointer-events-none" />
            <div className="absolute w-52 h-52 rounded-full bg-teal-500/10 dark:bg-teal-400/10 pointer-events-none" />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-sky-600 via-sky-500 to-teal-500 hover:from-sky-500 hover:to-teal-400 text-white shadow-2xl shadow-sky-500/35 flex flex-col items-center justify-center p-4 transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none focus:ring-4 focus:ring-sky-300"
              aria-label="Click to upload after-visit summary or take a picture"
            >
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-10 h-10 animate-spin" />
                  <span className="text-[11px] font-semibold text-center leading-tight">
                    Analyzing...
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-center leading-snug px-2">
                    Click to Upload Summary
                  </span>
                  <span className="text-[10px] text-sky-100/90 font-medium mt-0.5">
                    or Snap Photo
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Instant Demo Option */}
          <div className="flex justify-center">
            <button
              onClick={handleLoadSample}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Load Sample Visit (Explore All Pages)</span>
            </button>
          </div>

          {/* Live Step Progress / Error Message */}
          {isProcessing && (
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs text-sky-800 dark:text-sky-300 space-y-1.5 animate-pulse">
              <div className="font-semibold flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{uploadStepMessage}</span>
              </div>
              <p className="text-[11px] text-sky-600 dark:text-sky-400">
                Decoding clinical codes, vitals, lab orders, and dietary prescriptions...
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Privacy Footnote */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted local-first. Zero server storage of your health records.</span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCENARIO B: USER HAS SAVED VISITS
  // Dashboard shows latest summary, vitals quick glance, and action bar
  // =========================================================================
  const latestVisit = visits[0];

  return (
    <div className="space-y-8">
      {/* Hidden File Input for New Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={handleSelectFiles}
        className="hidden"
        disabled={isProcessing}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Health Vault Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {profile?.name ? `${profile.name}'s recorded visits` : "Your visit history and health records"} ({visits.length} {visits.length === 1 ? "record" : "records"} stored locally)
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 shadow-sm shadow-sky-500/25 transition-all hover:scale-[1.02]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{uploadStepMessage || "Processing..."}</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span>Upload New Visit</span>
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Latest Visit Showcase Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Most Recent Visit
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                {latestVisit.visitDate || "Recent"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {latestVisit.facilityName || "Clinic Visit"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Provider: {latestVisit.providerName} {latestVisit.providerTitle ? `(${latestVisit.providerTitle})` : ""}
            </p>
          </div>

          <button
            onClick={() => router.push(`/dashboard/visits/${latestVisit.id}`)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors shrink-0"
          >
            <span>View Full Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Executive summary quote */}
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          "{latestVisit.summaryExecutive || "Visit successfully decoded and indexed into your personal health vault."}"
        </p>

        {/* Quick Vitals Snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* BP */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Blood Pressure
            </span>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {latestVisit.vitals.bloodPressure.raw || "N/A"}
            </div>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {latestVisit.vitals.bloodPressure.status.toUpperCase()}
            </span>
          </div>

          {/* Pulse */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Heart Rate
            </span>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {latestVisit.vitals.heartRate?.raw || "N/A"}
            </div>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
              {latestVisit.vitals.heartRate?.status?.toUpperCase() || "NORMAL"}
            </span>
          </div>

          {/* O2 Saturation */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              SpO2 Oxygen
            </span>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {latestVisit.vitals.oxygenSaturation?.raw || "N/A"}
            </div>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              {latestVisit.vitals.oxygenSaturation?.status?.toUpperCase() || "WATCH"}
            </span>
          </div>

          {/* BMI */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              BMI Index
            </span>
            <div className="text-lg font-extrabold text-slate-900 dark:text-white">
              {latestVisit.vitals.bmi?.raw || "N/A"}
            </div>
            <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              HEALTHY
            </span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/dashboard/visits"
          className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform">
            <FileClock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            All Visit Summaries ({visits.length})
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Browse previous appointments, doctor instructions, and chronological visit summaries.
          </p>
        </a>

        <a
          href="/dashboard/lifestyle"
          className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-600 transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Nutrition & Exercise Protocol
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Review your personalized carb swaps, grocery shopping list, and 150-min activity target.
          </p>
        </a>

        <a
          href="/dashboard/labs"
          className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all group space-y-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Lab Fasting Prep & Gaps
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Check fasting windows for ordered blood panels and review overdue vaccine notices.
          </p>
        </a>
      </div>
    </div>
  );
}
