"use client";

import React, { useState, useEffect } from "react";
import { getStoredVisits, getCustomMedications, saveCustomMedication, deleteCustomMedication } from "@/lib/storage";
import { ParsedVisitRecord, StructuredPrescription } from "@/types/visit";
import { DailyPillSchedule } from "@/components/DailyPillSchedule";
import { MedicationSafetyCard } from "@/components/MedicationSafetyCard";
import { AddMedicationModal } from "@/components/AddMedicationModal";
import { MedicationWalletModal } from "@/components/MedicationWalletModal";
import {
  Pill,
  Plus,
  Printer,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Info,
  Calendar,
  Loader2,
  HeartPulse
} from "lucide-react";
import Link from "next/link";

export default function MedicationsPage() {
  const [visits, setVisits] = useState<ParsedVisitRecord[]>([]);
  const [customMeds, setCustomMeds] = useState<StructuredPrescription[]>([]);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSlotFilter, setActiveSlotFilter] = useState<string>("all");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const loadData = () => {
    const stored = getStoredVisits();
    setVisits(stored);
    setCustomMeds(getCustomMedications());
    setMounted(true);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("clarivisit_data_change", loadData);
    window.addEventListener("clarivisit_meds_change", loadData);
    return () => {
      window.removeEventListener("clarivisit_data_change", loadData);
      window.removeEventListener("clarivisit_meds_change", loadData);
    };
  }, []);

  // Collect all medications from the latest visit plus custom supplements
  const latestVisit = visits.length > 0 ? visits[0] : null;
  const visitMeds = (latestVisit?.prescriptions || []) as StructuredPrescription[];
  
  // Combine visit meds + custom meds without duplicate IDs
  const allMedications: StructuredPrescription[] = [
    ...visitMeds,
    ...customMeds.filter((cm) => !visitMeds.some((vm) => vm.id === cm.id)),
  ];

  // Filter medications
  const filteredMeds = allMedications.filter((rx) => {
    const matchesSearch =
      rx.medicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.clinicalPurpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.dosage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeSlotFilter === "all") return true;
    if (activeSlotFilter === "custom") return Boolean(rx.isCustomSupplement);
    return rx.timingSlots.includes(activeSlotFilter as any);
  });

  const handleSaveCustomMed = (newMed: StructuredPrescription) => {
    saveCustomMedication(newMed);
    setCustomMeds(getCustomMedications());
  };

  const handleDeleteCustomMed = (id: string) => {
    deleteCustomMedication(id);
    setCustomMeds(getCustomMedications());
  };

  if (!mounted) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600 dark:text-sky-400" />
        <p className="text-xs text-slate-500 font-medium">Loading Medicine Cabinet...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5" />
              <span>Medicine Cabinet & Rx Safety</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              {allMedications.length} {allMedications.length === 1 ? "Item" : "Items"} Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Prescriptions, Supplements & Daily Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Dosage timing, food instructions, side-effect alerts, and adherence tracking
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setWalletModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Wallet Card</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medication / OTC</span>
          </button>
        </div>
      </div>

      {/* Clinical Pharmacist Advisory Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-50 to-teal-50 dark:from-sky-950/40 dark:to-teal-950/40 border border-sky-100 dark:border-sky-900/60 text-xs text-sky-950 dark:text-sky-200 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Clinical Administration Advisory
          </h2>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Lipid-soluble supplements (such as CoQ10 and Vitamin D3) absorb up to 300% more effectively when taken with a meal containing dietary fats (e.g. eggs, avocados, or yogurt). Avoid taking minerals within 2 hours of high-tannin beverages like black tea or coffee.
          </p>
        </div>
      </div>

      {/* Daily Pill Schedule Tracker */}
      <DailyPillSchedule
        medications={allMedications}
        onAddClick={() => setAddModalOpen(true)}
      />

      {/* Search & Timing Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medications, dosages, or indications..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-hidden focus:border-sky-500 shadow-xs"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
          {[
            { id: "all", label: "All Items" },
            { id: "morning", label: "Morning" },
            { id: "afternoon", label: "Afternoon" },
            { id: "evening", label: "Evening" },
            { id: "bedtime", label: "Bedtime" },
            { id: "custom", label: "Supplements" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSlotFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                activeSlotFilter === tab.id
                  ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medications Safety Cards Grid */}
      {filteredMeds.length === 0 ? (
        <div className="min-h-[30vh] flex flex-col items-center justify-center text-center p-8 space-y-3 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
          <Pill className="w-10 h-10 text-slate-400" />
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            No Medications Matched Your Filter
          </h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Try adjusting your search query or click below to add a new medication or supplement.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveSlotFilter("all");
            }}
            className="text-xs font-bold text-sky-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredMeds.map((rx) => (
            <MedicationSafetyCard
              key={rx.id}
              rx={rx}
              onDeleteCustom={handleDeleteCustomMed}
            />
          ))}
        </div>
      )}

      {/* Add Medication Modal */}
      <AddMedicationModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveCustomMed}
      />

      {/* Printable Wallet Card Modal */}
      <MedicationWalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        medications={allMedications}
        patientName={latestVisit?.patientName || "Alex Morgan"}
        patientDob={latestVisit?.patientDob}
        attendingDoctor={latestVisit?.providerName}
        contactPhone={latestVisit?.contactPhone}
      />
    </div>
  );
}
