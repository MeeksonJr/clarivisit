"use client";

import React, { useRef } from "react";
import { ParsedVisitRecord } from "@/types/visit";
import { HealthPassportDocument } from "@/components/HealthPassportDocument";
import {
  Printer,
  X,
  ExternalLink,
  Download,
  Share2,
  Check,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface HealthPassportModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: ParsedVisitRecord | null;
}

export function HealthPassportModal({
  isOpen,
  onClose,
  visit,
}: HealthPassportModalProps) {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !visit) return null;

  const handlePrint = () => {
    // Open the dedicated clean print route with ?print=true in a new window or navigate
    const url = `/dashboard/visits/${visit.id}/passport?print=true`;
    window.open(url, "_blank");
  };

  const handleOpenFullscreen = () => {
    router.push(`/dashboard/visits/${visit.id}/passport`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                Clinical Health Passport & Print Export
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Print-optimized 8.5" × 11" summary for physicians and medical records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenFullscreen}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center gap-1.5 text-xs font-semibold"
              title="Open full page"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Preview Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100 dark:bg-slate-950/80">
          <div className="max-w-[780px] mx-auto" ref={printRef}>
            <HealthPassportDocument visit={visit} isPrintPreview={true} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs bg-slate-50/70 dark:bg-slate-950/50">
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            💡 <strong>Tip for Mobile Users:</strong> Tap <em>Print / Save as PDF</em>, then in the print preview window pinch-out or select <strong>Save to Files</strong> to save as a PDF.
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors"
            >
              Print Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
