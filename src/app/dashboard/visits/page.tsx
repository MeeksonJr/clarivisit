"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredVisits, deleteVisit } from "@/lib/storage";
import { ParsedVisitRecord } from "@/types/visit";
import {
  FileClock,
  ArrowRight,
  Trash2,
  Calendar,
  MapPin,
  Search,
  Plus,
  HeartPulse,
  Activity,
  Loader2,
  AlertCircle,
  Printer,
} from "lucide-react";
import Link from "next/link";

export default function AllVisitsHistoryPage() {
  const router = useRouter();
  const [visits, setVisits] = useState<ParsedVisitRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const refresh = () => {
    try {
      const stored = getStoredVisits();
      setVisits(stored || []);
    } catch (e) {
      console.error("Error reading stored visits:", e);
      setVisits([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    refresh();
    window.addEventListener("clarivisit_data_change", refresh);
    return () => window.removeEventListener("clarivisit_data_change", refresh);
  }, []);

  const filtered = visits.filter((v) => {
    if (!v) return false;
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return true;
    return (
      (v.facilityName || "").toLowerCase().includes(q) ||
      (v.providerName || "").toLowerCase().includes(q) ||
      (v.visitDate || "").toLowerCase().includes(q) ||
      (v.summaryExecutive || "").toLowerCase().includes(q)
    );
  });

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600 dark:text-sky-400" />
        <p className="text-xs text-slate-500 font-medium">Loading visit history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Visit History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Chronological archive of all decoded after-visit summaries ({visits.length} total)
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Another Visit</span>
        </Link>
      </div>

      {visits.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by clinic, provider, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 space-y-3 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <FileClock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            {visits.length === 0 ? "No visits recorded yet" : "No matches found"}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs">
            {visits.length === 0
              ? "Upload photos of your After-Visit Summary to begin building your health history."
              : "Try adjusting your search keywords."}
          </p>
          {visits.length === 0 && (
            <Link
              href="/dashboard"
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Upload First Summary</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((v, idx) => (
            <div
              key={v.id || `visit-${idx}`}
              className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                    {v.visitDate || "Recent Visit"}
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
                    {v.providerName || "Physician"} {v.providerTitle ? `(${v.providerTitle})` : ""}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {v.facilityName || "Clinic Visit"}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-2xl">
                  {v.summaryExecutive || "Visit records indexed into local health vault."}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    BP: {v.vitals?.bloodPressure?.raw || "--"}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    Labs Ordered: {v.labOrders?.length || 0}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    BMI: {v.vitals?.bmi?.raw || "--"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/dashboard/visits/${v.id}/passport`}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  title="Printable Health Passport"
                >
                  <Printer className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span className="hidden sm:inline">Passport</span>
                </Link>

                <Link
                  href={`/dashboard/visits/${v.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={() => setDeleteTargetId(v.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal (no blocking native alert) */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Delete Visit Record?
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Are you sure you want to delete this after-visit summary from your browser vault? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteVisit(deleteTargetId);
                  setDeleteTargetId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
