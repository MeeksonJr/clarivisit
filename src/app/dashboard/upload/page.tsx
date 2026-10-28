"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveVisit, saveBulkBiomarkers } from "@/lib/storage";
import { compressImageFile } from "@/lib/imageCompressor";
import { SAMPLE_VISIT_RECORD } from "@/lib/sampleVisit";
import { ImportLabReportModal } from "@/components/ImportLabReportModal";
import { BiomarkerResult } from "@/types/visit";
import {
  UploadCloud,
  Camera,
  FileText,
  Loader2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight,
  ClipboardPaste,
  HelpCircle,
  FlaskConical,
  Activity,
  FileCode,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";

export default function UploadDocumentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepMessage, setStepMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [importBioModalOpen, setImportBioModalOpen] = useState(false);
  const [docCategory, setDocCategory] = useState<"avs" | "labs">("avs");

  const progressSteps = [
    "Optimizing document contrast & resolution for clinical OCR...",
    "Scanning with Google Gemini Multimodal Vision...",
    "Extracting biomarkers, clinical directives & prescriptions...",
    "Synthesizing plain-English explanations & lifestyle plan...",
  ];

  const handleFilesAdded = (files: FileList | File[]) => {
    const validFiles: File[] = [];
    const list = Array.from(files);

    for (const f of list) {
      if (
        f.type.startsWith("image/") ||
        f.type === "application/pdf" ||
        f.name.endsWith(".pdf") ||
        f.name.endsWith(".png") ||
        f.name.endsWith(".jpg") ||
        f.name.endsWith(".jpeg") ||
        f.name.endsWith(".webp")
      ) {
        validFiles.push(f);
      }
    }

    if (validFiles.length === 0) {
      setErrorMessage("Please upload an image (PNG, JPG, WEBP) or PDF document.");
      return;
    }

    setErrorMessage("");
    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesAdded(e.dataTransfer.files);
    }
  };

  const handleStartAnalysis = async () => {
    if (selectedFiles.length === 0) {
      setErrorMessage("Please select at least one document or photo to analyze.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");
    setCurrentStep(0);
    setStepMessage(progressSteps[0]);

    try {
      // Step 1: Compress images to fit within serverless payload limits
      const compressedFiles = await Promise.all(
        selectedFiles.map((file) => compressImageFile(file))
      );

      const formData = new FormData();
      compressedFiles.forEach((file) => formData.append("files", file));

      // Step 2: Upload to Gemini multimodal vision route
      setCurrentStep(1);
      setStepMessage(progressSteps[1]);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze document. Please check the image clarity.");
      }

      // Step 3: Parse response
      setCurrentStep(2);
      setStepMessage(progressSteps[2]);
      const data = await res.json();

      if (!data.visit) {
        throw new Error("Could not parse clinical records from the uploaded document.");
      }

      setCurrentStep(3);
      setStepMessage(progressSteps[3]);

      // Save visit and biomarker data to local vault
      saveVisit(data.visit);

      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      // Route directly to visit detail page
      setTimeout(() => {
        router.push(`/dashboard/visits/${data.visit.id}`);
      }, 600);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Document analysis error:", error);
      setErrorMessage(error.message || "Failed to analyze document. Please ensure good lighting and legible text.");
      setIsProcessing(false);
    }
  };

  const handleLoadSampleVisit = () => {
    saveVisit(SAMPLE_VISIT_RECORD);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
    router.push(`/dashboard/visits/${SAMPLE_VISIT_RECORD.id}`);
  };

  const handleImportBulkBiomarkers = (incoming: BiomarkerResult[]) => {
    saveBulkBiomarkers(incoming);
    router.push("/dashboard/labs");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
        className="hidden"
        disabled={isProcessing}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => e.target.files && handleFilesAdded(e.target.files)}
        className="hidden"
        disabled={isProcessing}
      />

      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Document Ingestion & OCR Hub</span>
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Upload Visit Summary or Lab Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
          Take a photo of your printed paperwork or upload a PDF from your patient portal (MyChart, Quest Diagnostics, Labcorp, Kaiser). Google Gemini AI will transcribe your vitals, extract biomarker reference brackets, decode prescriptions, and construct your care plan.
        </p>
      </div>

      {/* Document Type Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setDocCategory("avs")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            docCategory === "avs"
              ? "bg-sky-50/80 dark:bg-sky-950/40 border-sky-300 dark:border-sky-700 shadow-xs"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                docCategory === "avs"
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                After-Visit Summary (AVS)
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Clinic visit paperwork, vitals, prescriptions, doctor instructions
              </div>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setDocCategory("labs")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            docCategory === "labs"
              ? "bg-purple-50/80 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700 shadow-xs"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                docCategory === "labs"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">
                Laboratory Diagnostic Report
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Quest, Labcorp, CMP, CBC blood panels, urinalysis & fasting tests
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Main Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-200 glass-panel ${
          isDragging
            ? "border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 scale-[1.01]"
            : "border-slate-300 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-600"
        }`}
      >
        <div className="max-w-md mx-auto space-y-5">
          {/* Main Action Icon */}
          <div className="mx-auto w-16 h-16 rounded-2xl bg-sky-100 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-xs">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Drag & Drop your document here
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Supports multi-page PDFs, high-res photos, or scanned paper documents (PNG, JPG, WEBP)
            </p>
          </div>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Browse Computer Files</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-4 h-4 text-slate-500" />
              <span>Snap with Camera</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Private & confidential • 100% encrypted in your local browser vault</span>
          </div>
        </div>
      </div>

      {/* Selected Files Staging Area */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4 glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Staged Files ({selectedFiles.length})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFiles([])}
              disabled={isProcessing}
              className="text-xs text-rose-600 hover:underline cursor-pointer disabled:opacity-50"
            >
              Remove all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950 flex items-center justify-center text-sky-600 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || "Document"}
                    </p>
                  </div>
                </div>

                {!isProcessing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Start Scan Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleStartAnalysis}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Clinical Document...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Start Multimodal Clinical Analysis</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Live Processing Stepper Status */}
      {isProcessing && (
        <div className="glass-panel rounded-2xl p-6 border border-sky-200 dark:border-sky-800/80 bg-sky-50/50 dark:bg-sky-950/30 space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center shrink-0">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {stepMessage}
              </h3>
              <p className="text-xs text-sky-700 dark:text-sky-300">
                Please wait while Google Gemini parses medical terminology, vitals, and reference brackets...
              </p>
            </div>
          </div>

          {/* Stepper Dots */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {progressSteps.map((stepText, idx) => (
              <div key={idx} className="space-y-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx < currentStep
                      ? "bg-emerald-500"
                      : idx === currentStep
                      ? "bg-sky-500 animate-pulse"
                      : "bg-slate-200 dark:bg-slate-800"
                  }`}
                />
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  Step {idx + 1}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Analysis Could Not Complete</p>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Alternative Input Options Bar */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Alternative Ways to Ingest Data
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option A: Paste Portal Text */}
          <button
            type="button"
            onClick={() => setImportBioModalOpen(true)}
            className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all text-left shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                <ClipboardPaste className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Paste Patient Portal Text
                </p>
                <p className="text-[11px] text-slate-400">
                  Copy lines directly from Quest or Labcorp portal
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Option B: Load Demo Sample Visit */}
          <button
            type="button"
            onClick={handleLoadSampleVisit}
            className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 transition-all text-left shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Load Clinical Demo Record
                </p>
                <p className="text-[11px] text-slate-400">
                  Instant preview of vitals, lab orders & meal plans
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Paste / Import Quest or Labcorp Portal Text Modal */}
      <ImportLabReportModal
        isOpen={importBioModalOpen}
        onClose={() => setImportBioModalOpen(false)}
        onImport={handleImportBulkBiomarkers}
      />
    </div>
  );
}
