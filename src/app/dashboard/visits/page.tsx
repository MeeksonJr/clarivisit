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
  Activity
} from "lucide-react";

export default function AllVisitsHistoryPage() {
  const router = useRouter();
  const [visits, setVisits] = useState<ParsedVisitRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const refresh = () => {
    setVisits(getStoredVisits());
  };

  useEffect(() => {
    refresh();
    window.addEventListener("clarivisit_data_change", refresh);
    return () => window.removeEventListener("clarivisit_data_change", refresh);
  }, []);

  const filtered = visits.filter((v) => {
    const q = searchTerm.toLowerCase();
    return (
      v.facilityName?.toLowerCase().includes(q) ||
      v.providerName?.toLowerCase().includes(q) ||
      v.visitDate?.toLowerCase().includes(q) ||
      v.summaryExecutive?.toLowerCase().includes(q)
    );
  });

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

        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Another Visit</span>
        </button>
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
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500"
            >
              <Plus className="w-4 h-4" />
              <span>Upload First Summary</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((v) => (
            <div
              key={v.id}
              className="glass-panel rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                    {v.visitDate}
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">
                    {v.providerName} {v.providerTitle ? `(${v.providerTitle})` : ""}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {v.facilityName || "Clinic Visit"}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-2xl">
                  {v.summaryExecutive}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    BP: {v.vitals.bloodPressure.raw}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    Labs Ordered: {v.labOrders?.length || 0}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                    BMI: {v.vitals.bmi?.raw || "--"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => router.push(`/dashboard/visits/${v.id}`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    if (confirm("Delete this visit record?")) {
                      deleteVisit(v.id);
                    }
                  }}
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
    </div>
  );
}
