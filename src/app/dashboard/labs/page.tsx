"use client";

import React, { useState, useEffect } from "react";
import {
  getStoredVisits,
  getCustomLabOrders,
  saveCustomLabOrder,
  deleteCustomLabOrder,
  getLabStatuses,
  LabStatusInfo,
} from "@/lib/storage";
import { ParsedVisitRecord, LabOrder } from "@/types/visit";
import { FastingCountdownTimer } from "@/components/FastingCountdownTimer";
import { LabStatusCard } from "@/components/LabStatusCard";
import { AddLabOrderModal } from "@/components/AddLabOrderModal";
import { LabPrepPrintModal } from "@/components/LabPrepPrintModal";
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  HelpCircle,
  Plus,
  Printer,
  Search,
  Filter,
  Droplets,
  Sparkles,
  Loader2,
  ShieldCheck,
  Check
} from "lucide-react";
import Link from "next/link";

export default function LabsFastingPage() {
  const [visits, setVisits] = useState<ParsedVisitRecord[]>([]);
  const [customLabs, setCustomLabs] = useState<LabOrder[]>([]);
  const [labStatuses, setLabStatuses] = useState<Record<string, LabStatusInfo>>({});
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);

  const loadData = () => {
    setVisits(getStoredVisits());
    setCustomLabs(getCustomLabOrders());
    setLabStatuses(getLabStatuses());
    setMounted(true);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("clarivisit_data_change", loadData);
    window.addEventListener("clarivisit_lab_status_change", loadData);
    window.addEventListener("clarivisit_custom_labs_change", loadData);

    return () => {
      window.removeEventListener("clarivisit_data_change", loadData);
      window.removeEventListener("clarivisit_lab_status_change", loadData);
      window.removeEventListener("clarivisit_custom_labs_change", loadData);
    };
  }, []);

  const latestVisit = visits.length > 0 ? visits[0] : null;
  const visitLabs = latestVisit?.labOrders || [];

  // Combine visit labs + custom labs without duplicates
  const allLabs: LabOrder[] = [
    ...visitLabs,
    ...customLabs.filter((cl) => !visitLabs.some((vl) => vl.id === cl.id)),
  ];

  // Filtering
  const filteredLabs = allLabs.filter((lab) => {
    const matchesSearch =
      lab.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.plainPurpose.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === "all") return true;
    if (statusFilter === "fasting") return lab.fastingRequired;
    if (statusFilter === "custom") return customLabs.some((cl) => cl.id === lab.id);

    const currentStatus = labStatuses[lab.id]?.status || "ordered";
    return currentStatus === statusFilter;
  });

  const handleSaveCustomLab = (newLab: LabOrder) => {
    saveCustomLabOrder(newLab);
    setCustomLabs(getCustomLabOrders());
  };

  const handleDeleteCustomLab = (id: string) => {
    deleteCustomLabOrder(id);
    setCustomLabs(getCustomLabOrders());
  };

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600 dark:text-sky-400" />
        <p className="text-xs text-slate-500 font-medium">Loading Diagnostic Lab Tracker...</p>
      </div>
    );
  }

  const fastingCount = allLabs.filter((l) => l.fastingRequired).length;

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Diagnostic Orders & Phlebotomy</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              {allLabs.length} {allLabs.length === 1 ? "Test" : "Tests"} Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Lab Orders, Fasting & Status Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Fasting countdown, collection prep protocols, appointment scheduling, and specimen status tracking
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setPrintModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Requisition Sheet</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lab Order</span>
          </button>
        </div>
      </div>

      {/* Live Interactive Fasting Countdown Timer Component */}
      <FastingCountdownTimer defaultHours={10} />

      {/* Clinical Fasting Quick Guidance Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-900/60 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Overnight Fasting Protocol Advisory ({fastingCount} Tests Require Fasting)
            </h2>
          </div>
          <p className="text-[11px] text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
            Metabolic tests such as the <strong>Comprehensive Metabolic Panel (CMP)</strong> and <strong>Lipid Panel with Ratios</strong> require strict water-only overnight fasting for 8 to 12 hours. Drink plenty of cold or room-temperature plain water before leaving for your appointment to ensure optimal vein fullness. Do not drink black coffee, tea, or chew gum, as they trigger digestive enzymes and skew glucose readings.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search panels, categories, or biomarkers..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-hidden focus:border-amber-500 shadow-xs"
          />
        </div>

        {/* Filter Stepper Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
          {[
            { id: "all", label: "All Orders" },
            { id: "fasting", label: "Fasting Only" },
            { id: "scheduled", label: "Scheduled" },
            { id: "drawn", label: "Sample Drawn" },
            { id: "completed", label: "Results Received" },
            { id: "custom", label: "Custom Added" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                statusFilter === tab.id
                  ? "bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lab Order Cards Grid */}
      {filteredLabs.length === 0 ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center text-center p-8 space-y-3 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
          <FileText className="w-10 h-10 text-slate-400" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            No Lab Orders Matched Your Filter
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Try resetting your search query or click below to add a new outpatient test order.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
            }}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredLabs.map((lab) => (
            <LabStatusCard
              key={lab.id}
              lab={lab}
              statusInfo={labStatuses[lab.id]}
              isCustom={customLabs.some((cl) => cl.id === lab.id)}
              onDeleteCustom={handleDeleteCustomLab}
              providerName={latestVisit?.providerName}
            />
          ))}
        </div>
      )}

      {/* Add Custom Lab Modal */}
      <AddLabOrderModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveCustomLab}
      />

      {/* Printable Lab Requisition Sheet Modal */}
      <LabPrepPrintModal
        isOpen={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        labs={allLabs}
        patientName={latestVisit?.patientName || "Alex Morgan"}
        patientDob={latestVisit?.patientDob}
        providerName={latestVisit?.providerName}
        facilityName={latestVisit?.facilityName}
        contactPhone={latestVisit?.contactPhone}
      />
    </div>
  );
}
