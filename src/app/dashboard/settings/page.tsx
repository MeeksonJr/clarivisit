"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { clearAllVisits, exportHealthDataJson, getStoredVisits } from "@/lib/storage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CloudAuthModal } from "@/components/CloudAuthModal";
import {
  ShieldCheck,
  Trash2,
  Download,
  AlertTriangle,
  Lock,
  UserCheck,
  CheckCircle2,
  HardDrive,
  Cloud,
  CloudCheck,
  RefreshCw,
  Server,
  ArrowRight
} from "lucide-react";

export default function SettingsPrivacyPage() {
  const router = useRouter();
  const {
    profile,
    updateName,
    deleteAccount,
    supabaseUser,
    isCloudAuthenticated,
    syncStatus,
    lastSyncedAt,
    triggerManualSync,
  } = useAuth();

  const [nameInput, setNameInput] = useState(profile?.name || "");
  const [nameSaved, setNameSaved] = useState(false);
  const [cloudModalOpen, setCloudModalOpen] = useState(false);
  const [purgeConfirmOpen, setPurgeConfirmOpen] = useState(false);
  const [clearVisitsConfirmOpen, setClearVisitsConfirmOpen] = useState(false);
  const [visitCount, setVisitCount] = useState(0);

  React.useEffect(() => {
    setVisitCount(getStoredVisits().length);
  }, []);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      updateName(nameInput.trim());
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 2000);
    }
  };

  const handleExportJson = () => {
    const jsonStr = exportHealthDataJson();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clarivisit-health-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearVisitsOnly = () => {
    clearAllVisits();
    setClearVisitsConfirmOpen(false);
    alert("All visit summaries have been cleared from your local device.");
  };

  const handlePurgeAllAccountData = () => {
    deleteAccount();
    setPurgeConfirmOpen(false);
    alert("Your account and all associated visit records have been permanently erased from this device.");
    router.push("/");
  };

  return (
    <div className="space-y-8 max-w-4xl pb-20">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage your patient profile, export clinical data, and purge device storage
        </p>
      </div>

      {/* Profile Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Patient Profile
          </h2>
        </div>

        <form onSubmit={handleSaveName} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Preferred Name / Alias
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 transition-colors"
              >
                {nameSaved ? "Saved!" : "Update"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Theme Preference */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Visual Accessibility & Theme
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
          Choose high-contrast dark mode for reduced eye strain or standard light mode.
        </p>
        <ThemeToggle showLabel />
      </div>

      {/* Cloud Vault & Multi-Device Sync Section */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Cloud Vault & Multi-Device Sync (Supabase)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCloudModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-xs"
            >
              <Server className="w-3.5 h-3.5" />
              <span>{isCloudAuthenticated ? "Manage Cloud Vault" : "Connect Multi-Device Sync"}</span>
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Cloud Sync Status
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                {isCloudAuthenticated ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    <CloudCheck className="w-4 h-4" />
                    <span>Synchronized ({supabaseUser?.email})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500 text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Local Device Sandbox Only (Not Synced)</span>
                  </span>
                )}
              </div>
            </div>

            {isCloudAuthenticated && (
              <button
                onClick={() => triggerManualSync()}
                disabled={syncStatus === "syncing"}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
                <span>{syncStatus === "syncing" ? "Syncing..." : "Sync Now"}</span>
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            When multi-device sync is enabled, your after-visit summaries, biomarker laboratory tracking, and medications automatically replicate across your mobile phones, tablets, and desktop computers via Supabase PostgreSQL protected by Row-Level Security (RLS).
          </p>

          {lastSyncedAt && (
            <div className="text-[11px] text-slate-400 font-mono">
              Last synced: {lastSyncedAt}
            </div>
          )}
        </div>
      </div>

      {/* Data Export & Local Vault Status */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-emerald-500" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Local Health Vault & Portability
          </h2>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
          <Lock className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Zero Data Selling Guarantee:</strong> Your visit documents are processed ephemerally using Google Gemini's HIPAA-aligned enterprise API. Your decoded visits are cached inside this browser's local sandbox storage ({visitCount} visit {visitCount === 1 ? "record" : "records"}). We have no server database storing your medical records.
          </p>
        </div>

        <div>
          <button
            onClick={handleExportJson}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-sky-500" />
            <span>Export All Health Data as JSON</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Data Wipe & Account Deletion */}
      <div className="rounded-3xl p-6 sm:p-8 border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-6">
        <div>
          <h2 className="text-base font-bold text-rose-700 dark:text-rose-400">
            Irreversible Data Erasure
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Permanently remove your health visits or delete your entire profile with zero recovery possible.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setClearVisitsConfirmOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-950 transition-colors"
          >
            Clear All Stored Visits ({visitCount})
          </button>

          <button
            onClick={() => setPurgeConfirmOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account & Purge Everything</span>
          </button>
        </div>

        {/* Clear Visits Confirmation Modal */}
        {clearVisitsConfirmOpen && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-xs space-y-3">
            <div className="font-bold text-rose-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Confirm Clearing Visits</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Are you sure you want to delete all {visitCount} decoded visit summaries? This action is permanent and cannot be undone.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearVisitsOnly}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs"
              >
                Yes, Clear All Visits
              </button>
              <button
                onClick={() => setClearVisitsConfirmOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Full Purge Confirmation Modal */}
        {purgeConfirmOpen && (
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 text-xs space-y-3">
            <div className="font-bold text-rose-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Permanent Account Purge</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              This will completely wipe your user name, theme preferences, and all clinical visit history. Because we do not keep server backups, there is no way to recover this data.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePurgeAllAccountData}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs"
              >
                Yes, Erase Everything Permanently
              </button>
              <button
                onClick={() => setPurgeConfirmOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cloud Authentication Modal */}
      <CloudAuthModal
        isOpen={cloudModalOpen}
        onClose={() => setCloudModalOpen(false)}
      />
    </div>
  );
}
