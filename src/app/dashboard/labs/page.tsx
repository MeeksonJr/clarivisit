"use client";

import React, { useState, useEffect } from "react";
import {
  getStoredVisits,
  getCustomLabOrders,
  saveCustomLabOrder,
  deleteCustomLabOrder,
  getLabStatuses,
  LabStatusInfo,
  getBiomarkerResults,
  saveBiomarkerResult,
  deleteBiomarkerResult,
  saveBulkBiomarkers,
  clearBiomarkerResults,
} from "@/lib/storage";
import { ParsedVisitRecord, LabOrder, BiomarkerResult, BiomarkerPanel } from "@/types/visit";
import { DEFAULT_SAMPLE_BIOMARKERS } from "@/lib/biomarkers";
import { FastingCountdownTimer } from "@/components/FastingCountdownTimer";
import { LabStatusCard } from "@/components/LabStatusCard";
import { AddLabOrderModal } from "@/components/AddLabOrderModal";
import { LabPrepPrintModal } from "@/components/LabPrepPrintModal";
import { BiomarkerGaugeCard } from "@/components/BiomarkerGaugeCard";
import { AddBiomarkerModal } from "@/components/AddBiomarkerModal";
import { ImportLabReportModal } from "@/components/ImportLabReportModal";
import { BiomarkerPrintReportModal } from "@/components/BiomarkerPrintReportModal";
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
  Check,
  Activity,
  ClipboardPaste,
  RotateCcw,
  BarChart3,
  Layers,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";

export default function LabsFastingPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "biomarkers">("biomarkers");
  const [visits, setVisits] = useState<ParsedVisitRecord[]>([]);
  const [customLabs, setCustomLabs] = useState<LabOrder[]>([]);
  const [labStatuses, setLabStatuses] = useState<Record<string, LabStatusInfo>>({});
  const [biomarkers, setBiomarkers] = useState<BiomarkerResult[]>([]);
  const [mounted, setMounted] = useState(false);

  // Filters for Lab Orders
  const [labSearchQuery, setLabSearchQuery] = useState("");
  const [labStatusFilter, setLabStatusFilter] = useState<string>("all");
  const [addLabModalOpen, setAddLabModalOpen] = useState(false);
  const [printRequisitionModalOpen, setPrintRequisitionModalOpen] = useState(false);

  // Filters for Biomarkers
  const [bioSearchQuery, setBioSearchQuery] = useState("");
  const [bioPanelFilter, setBioPanelFilter] = useState<string>("all");
  const [addBioModalOpen, setAddBioModalOpen] = useState(false);
  const [editingBiomarker, setEditingBiomarker] = useState<BiomarkerResult | null>(null);
  const [importBioModalOpen, setImportBioModalOpen] = useState(false);
  const [printBioModalOpen, setPrintBioModalOpen] = useState(false);

  const loadData = () => {
    setVisits(getStoredVisits());
    setCustomLabs(getCustomLabOrders());
    setLabStatuses(getLabStatuses());

    let storedBio = getBiomarkerResults();
    if (storedBio.length === 0) {
      // Auto-initialize with standard 18 clinical biomarkers from demo visit
      saveBulkBiomarkers(DEFAULT_SAMPLE_BIOMARKERS);
      storedBio = DEFAULT_SAMPLE_BIOMARKERS;
    }
    setBiomarkers(storedBio);
    setMounted(true);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("clarivisit_data_change", loadData);
    window.addEventListener("clarivisit_lab_status_change", loadData);
    window.addEventListener("clarivisit_custom_labs_change", loadData);
    window.addEventListener("clarivisit_biomarkers_change", loadData);

    return () => {
      window.removeEventListener("clarivisit_data_change", loadData);
      window.removeEventListener("clarivisit_lab_status_change", loadData);
      window.removeEventListener("clarivisit_custom_labs_change", loadData);
      window.removeEventListener("clarivisit_biomarkers_change", loadData);
    };
  }, []);

  const latestVisit = visits.length > 0 ? visits[0] : null;
  const visitLabs = latestVisit?.labOrders || [];

  // Combine visit labs + custom labs without duplicates
  const allLabs: LabOrder[] = [
    ...visitLabs,
    ...customLabs.filter((cl) => !visitLabs.some((vl) => vl.id === cl.id)),
  ];

  // Filtering Lab Orders
  const filteredLabs = allLabs.filter((lab) => {
    const matchesSearch =
      lab.testName.toLowerCase().includes(labSearchQuery.toLowerCase()) ||
      lab.category.toLowerCase().includes(labSearchQuery.toLowerCase()) ||
      lab.plainPurpose.toLowerCase().includes(labSearchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (labStatusFilter === "all") return true;
    if (labStatusFilter === "fasting") return lab.fastingRequired;
    if (labStatusFilter === "custom") return customLabs.some((cl) => cl.id === lab.id);

    const currentStatus = labStatuses[lab.id]?.status || "ordered";
    return currentStatus === labStatusFilter;
  });

  // Filtering Biomarkers
  const filteredBiomarkers = biomarkers.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(bioSearchQuery.toLowerCase()) ||
      b.panel.toLowerCase().includes(bioSearchQuery.toLowerCase()) ||
      b.plainMeaning.toLowerCase().includes(bioSearchQuery.toLowerCase()) ||
      b.lifestyleTips.toLowerCase().includes(bioSearchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (bioPanelFilter === "all") return true;
    if (bioPanelFilter === "flagged") {
      return b.status === "elevated" || b.status === "high" || b.status === "low" || b.status === "critical";
    }
    return b.panel.toLowerCase() === bioPanelFilter.toLowerCase();
  });

  const handleSaveCustomLab = (newLab: LabOrder) => {
    saveCustomLabOrder(newLab);
    setCustomLabs(getCustomLabOrders());
  };

  const handleDeleteCustomLab = (id: string) => {
    deleteCustomLabOrder(id);
    setCustomLabs(getCustomLabOrders());
  };

  // Biomarker Actions
  const handleSaveBiomarker = (b: BiomarkerResult) => {
    saveBiomarkerResult(b);
    setBiomarkers(getBiomarkerResults());
    setEditingBiomarker(null);
  };

  const handleDeleteBiomarker = (id: string) => {
    deleteBiomarkerResult(id);
    setBiomarkers(getBiomarkerResults());
  };

  const handleImportBulkBiomarkers = (incoming: BiomarkerResult[]) => {
    saveBulkBiomarkers(incoming);
    setBiomarkers(getBiomarkerResults());
  };

  const handleResetSampleBiomarkers = () => {
    saveBulkBiomarkers(DEFAULT_SAMPLE_BIOMARKERS);
    setBiomarkers(DEFAULT_SAMPLE_BIOMARKERS);
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600 dark:text-sky-400" />
        <p className="text-xs text-slate-500 font-medium">Loading Diagnostic Hub & Biomarkers...</p>
      </div>
    );
  }

  const fastingCount = allLabs.filter((l) => l.fastingRequired).length;

  // Biomarker Summary Metrics
  const optimalCount = biomarkers.filter((b) => b.status === "optimal" || b.status === "normal").length;
  const borderlineCount = biomarkers.filter((b) => b.status === "elevated").length;
  const highOrLowCount = biomarkers.filter((b) => b.status === "high" || b.status === "low" || b.status === "critical").length;

  return (
    <div className="space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Diagnostic Orders & Biomarker Intelligence</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              {allLabs.length} Orders • {biomarkers.length} Biomarkers Logged
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Lab Orders, Fasting & Biomarker Visualizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Fasting countdown, collection prep protocols, appointment scheduling, and continuous biomarker reference spectrums
          </p>
        </div>

        {/* Global Tab Switcher */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs self-start sm:self-auto shadow-xs">
          <button
            onClick={() => setActiveTab("biomarkers")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "biomarkers"
                ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Biomarker Visualizer ({biomarkers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === "orders"
                ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Fasting & Lab Orders ({allLabs.length})</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: BIOMARKER RESULTS & REFERENCE SPECTRUM VISUALIZER        */}
      {/* ============================================================== */}
      {activeTab === "biomarkers" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Executive Scorecard Metric Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="glass-panel rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Total Biomarkers
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {biomarkers.length}
              </div>
              <p className="text-[11px] text-slate-500">Tracked in local vault</p>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                Optimal / In Range
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {optimalCount}
              </div>
              <p className="text-[11px] text-slate-500">Normal clinical brackets</p>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                Borderline / Watch
              </span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {borderlineCount}
              </div>
              <p className="text-[11px] text-slate-500">Responsive to lifestyle</p>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider">
                Attention Required
              </span>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
                {highOrLowCount}
              </div>
              <p className="text-[11px] text-slate-500">Discuss with doctor</p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setEditingBiomarker(null);
                  setAddBioModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Biomarker Result</span>
              </button>

              <button
                onClick={() => setImportBioModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors shadow-xs"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-purple-600" />
                <span>Paste Portal Text (Quest/Labcorp)</span>
              </button>

              <button
                onClick={handleResetSampleBiomarkers}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors shadow-xs"
                title="Reload the 18 sample biomarkers matching your physical exam"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Restore Sample Panel</span>
              </button>
            </div>

            <button
              onClick={() => setPrintBioModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Lab Report</span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={bioSearchQuery}
                onChange={(e) => setBioSearchQuery(e.target.value)}
                placeholder="Search biomarkers (e.g. glucose, LDL, A1C, eGFR)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-hidden focus:border-sky-500 shadow-xs"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
              {[
                { id: "all", label: "All Tests" },
                { id: "metabolic", label: "Metabolic" },
                { id: "lipid", label: "Lipid & Cardio" },
                { id: "renal", label: "Renal / Kidney" },
                { id: "hepatic", label: "Hepatic / Liver" },
                { id: "hematology", label: "Hematology" },
                { id: "flagged", label: "Flagged / Watch" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setBioPanelFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    bioPanelFilter === tab.id
                      ? "bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Biomarkers Grid */}
          {filteredBiomarkers.length === 0 ? (
            <div className="min-h-[30vh] flex flex-col items-center justify-center text-center p-8 space-y-3 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
              <Activity className="w-10 h-10 text-slate-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                No Biomarkers Matched Your Filter
              </h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Try resetting your search query or click below to log a new diagnostic biomarker.
              </p>
              <button
                onClick={() => {
                  setBioSearchQuery("");
                  setBioPanelFilter("all");
                }}
                className="text-xs font-bold text-sky-700 dark:text-sky-400 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredBiomarkers.map((b) => (
                <BiomarkerGaugeCard
                  key={b.id}
                  biomarker={b}
                  onEdit={(biomarker) => {
                    setEditingBiomarker(biomarker);
                    setAddBioModalOpen(true);
                  }}
                  onDelete={handleDeleteBiomarker}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: FASTING COUNTDOWN & OUTPATIENT LAB ORDERS               */}
      {/* ============================================================== */}
      {activeTab === "orders" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Action Buttons for Orders */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {allLabs.length} Orders Active
              </span>
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
                ({fastingCount} require overnight fasting)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPrintRequisitionModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Requisition Sheet</span>
              </button>

              <button
                onClick={() => setAddLabModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 shadow-xs transition-colors"
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
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Overnight Fasting Protocol Advisory ({fastingCount} Tests Require Fasting)
              </h2>
              <p className="text-[11px] text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                Metabolic tests such as the <strong>Comprehensive Metabolic Panel (CMP)</strong> and <strong>Lipid Panel with Ratios</strong> require strict water-only overnight fasting for 8 to 12 hours. Drink plenty of plain water before leaving for your appointment to ensure optimal vein fullness. Do not drink black coffee, tea, or chew gum, as they trigger digestive enzymes and skew glucose readings.
              </p>
            </div>
          </div>

          {/* Search & Filter Toolbar for Orders */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={labSearchQuery}
                onChange={(e) => setLabSearchQuery(e.target.value)}
                placeholder="Search panels, categories, or biomarkers..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-hidden focus:border-amber-500 shadow-xs"
              />
            </div>

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
                  onClick={() => setLabStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    labStatusFilter === tab.id
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
                  setLabSearchQuery("");
                  setLabStatusFilter("all");
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
        </div>
      )}

      {/* ============================================================== */}
      {/* MODALS & POPUPS                                                */}
      {/* ============================================================== */}

      {/* Add / Edit Biomarker Result Modal */}
      <AddBiomarkerModal
        isOpen={addBioModalOpen}
        onClose={() => {
          setAddBioModalOpen(false);
          setEditingBiomarker(null);
        }}
        onSave={handleSaveBiomarker}
        initialData={editingBiomarker}
      />

      {/* Paste / Import Quest or Labcorp Portal Text Modal */}
      <ImportLabReportModal
        isOpen={importBioModalOpen}
        onClose={() => setImportBioModalOpen(false)}
        onImport={handleImportBulkBiomarkers}
      />

      {/* Printable Biomarker Laboratory Passport Report Modal */}
      <BiomarkerPrintReportModal
        isOpen={printBioModalOpen}
        onClose={() => setPrintBioModalOpen(false)}
        biomarkers={biomarkers}
        patientName={latestVisit?.patientName || "Alex Morgan"}
        patientDob={latestVisit?.patientDob}
        providerName={latestVisit?.providerName}
        facilityName={latestVisit?.facilityName}
      />

      {/* Add Custom Lab Order Modal */}
      <AddLabOrderModal
        isOpen={addLabModalOpen}
        onClose={() => setAddLabModalOpen(false)}
        onSave={handleSaveCustomLab}
      />

      {/* Printable Lab Requisition Sheet Modal */}
      <LabPrepPrintModal
        isOpen={printRequisitionModalOpen}
        onClose={() => setPrintRequisitionModalOpen(false)}
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
