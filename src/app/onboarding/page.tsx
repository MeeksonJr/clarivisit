"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { saveVisit } from "@/lib/storage";
import { HeartPulse, UploadCloud, ArrowRight, CheckCircle2, FileText, Camera, ShieldCheck, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import confetti from "canvas-confetti";

export default function OnboardingPage() {
  const router = useRouter();
  const { updateName, profile } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [patientName, setPatientName] = useState(profile?.name || "");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setPatientName("Patient");
    }
    updateName(patientName.trim() || "Patient");
    setStep(2);
  };

  const handleSkipToDashboard = () => {
    updateName(patientName.trim() || "Patient");
    router.push("/dashboard");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
      setErrorMsg("");
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (selectedFiles.length === 0) {
      setErrorMsg("Please select or capture at least one image or PDF page.");
      return;
    }

    setIsUploading(true);
    setErrorMsg("");
    setUploadStatus("Reading and preparing document pages...");

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("files", file));

      setUploadStatus("Translating medical terminology with Google Gemini...");
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze document.");
      }

      setUploadStatus("Synthesizing clinical vitals, lab orders, and meal plan...");
      const data = await res.json();

      if (data.visit) {
        saveVisit(data.visit);
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        router.push(`/dashboard/visits/${data.visit.id}`);
      } else {
        throw new Error("No visit record returned.");
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      setErrorMsg(error.message || "Something went wrong while processing. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6 transition-colors selection:bg-sky-500 selection:text-white bg-grid-pattern">
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-900 dark:text-white">
            Clari<span className="text-sky-600 dark:text-sky-400">Visit</span>
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Form Center Box */}
      <main className="max-w-xl w-full mx-auto my-auto py-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
          {/* Progress Indicators */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <span className={step === 1 ? "text-sky-600 dark:text-sky-400 font-bold" : ""}>
              1. Profile Setup
            </span>
            <div className="w-16 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full bg-sky-600 transition-all duration-300 ${
                  step === 1 ? "w-1/2" : "w-full"
                }`}
              />
            </div>
            <span className={step === 2 ? "text-sky-600 dark:text-sky-400 font-bold" : ""}>
              2. Document Sync
            </span>
          </div>

          {step === 1 ? (
            /* STEP 1: Patient Name */
            <form onSubmit={handleStep1Submit} className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Welcome to ClariVisit
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  What should we call you? We use this to personalize your after-visit health plan.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="patientName"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Your Name or Preferred Nickname
                </label>
                <input
                  id="patientName"
                  type="text"
                  required
                  placeholder="e.g., Mohamed"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-base shadow-xs"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Saved locally in your browser. Never shared or sent to advertisers.</span>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 shadow-md shadow-sky-500/20 transition-all hover:scale-[1.01]"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: Document Prompt */
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Do you have your visit summary ready?
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  You can upload photos of your printed paperwork or a PDF right now, or skip to your dashboard and upload whenever you're ready.
                </p>
              </div>

              {/* Upload Box */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center hover:border-sky-500 dark:hover:border-sky-400 transition-colors bg-white/50 dark:bg-slate-900/40 space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <div>
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 cursor-pointer hover:bg-sky-100 dark:hover:bg-sky-900 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Choose Photos or PDF</span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Supports JPG, PNG, multi-page PDFs, or direct mobile camera snaps
                  </p>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="pt-2 text-left space-y-1.5">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Selected ({selectedFiles.length} files):
                    </span>
                    <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1 max-h-28 overflow-y-auto">
                      {selectedFiles.map((file, i) => (
                        <li key={i} className="flex items-center gap-1.5 truncate">
                          <FileText className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                  {errorMsg}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {selectedFiles.length > 0 ? (
                  <button
                    onClick={handleUploadAndAnalyze}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 disabled:opacity-60 shadow-md shadow-sky-500/25 transition-all"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{uploadStatus || "Processing..."}</span>
                      </>
                    ) : (
                      <>
                        <span>Analyze & Translate Summary</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : null}

                <button
                  onClick={handleSkipToDashboard}
                  disabled={isUploading}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-center"
                >
                  I don't have it right now — take me to the dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="max-w-4xl w-full mx-auto text-center text-xs text-slate-400 dark:text-slate-600 pt-6">
        ClariVisit Health Companion • Privacy Guaranteed
      </footer>
    </div>
  );
}
