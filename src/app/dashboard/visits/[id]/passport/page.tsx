"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { getVisitById } from "@/lib/storage";
import { ParsedVisitRecord } from "@/types/visit";
import { HealthPassportDocument } from "@/components/HealthPassportDocument";
import {
  Printer,
  ArrowLeft,
  Share2,
  Check,
  Download,
  Loader2,
  FileText,
} from "lucide-react";
import Link from "next/link";

function PassportContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const visitId = params?.id as string;
  const [visit, setVisit] = useState<ParsedVisitRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (visitId) {
      const found = getVisitById(visitId);
      setVisit(found);
      setLoading(false);
    }
  }, [visitId]);

  useEffect(() => {
    // If opened with ?print=true, automatically open the print dialog
    if (!loading && visit && searchParams.get("print") === "true") {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, visit, searchParams]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-3 bg-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
        <p className="text-xs text-slate-500 font-medium">Generating Health Passport...</p>
      </div>
    );
  }

  if (!visit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100">
        <div className="bg-white p-6 rounded-2xl shadow-md text-center space-y-3 max-w-sm">
          <FileText className="w-10 h-10 text-slate-400 mx-auto" />
          <h2 className="text-base font-bold text-slate-900">Visit Record Not Found</h2>
          <p className="text-xs text-slate-500">
            This after-visit summary may have been cleared from your local browser storage.
          </p>
          <Link
            href="/dashboard/visits"
            className="inline-block px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-semibold"
          >
            Return to Visits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-3 sm:py-8 px-1.5 sm:px-4 print:bg-white print:p-0">
      {/* Top Floating Action Bar (Hidden on Print) */}
      <div className="no-print max-w-[800px] mx-auto mb-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => router.push(`/dashboard/visits/${visit.id}`)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Back to Visit Details"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight truncate">
              Clinical Health Passport
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Printable 8.5" × 11" format for doctor consultations
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={handleShareLink}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Copy document link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-sm transition-colors print-include"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Print / Save as PDF</span>
            <span className="sm:hidden">Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <HealthPassportDocument visit={visit} isPrintPreview={true} />
    </div>
  );
}

export default function PassportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center space-y-3 bg-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
          <p className="text-xs text-slate-500 font-medium">Loading passport...</p>
        </div>
      }
    >
      <PassportContent />
    </Suspense>
  );
}
