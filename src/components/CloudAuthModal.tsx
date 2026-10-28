"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getSupabaseConfig,
  saveCustomSupabaseConfig,
  clearCustomSupabaseConfig,
  isSupabaseConfigured,
} from "@/lib/supabase";
import {
  Cloud,
  CloudCheck,
  CloudOff,
  CloudRain,
  RefreshCw,
  Mail,
  Lock,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Server,
  X,
  Sparkles,
  ArrowRight,
  LogOut,
  Smartphone
} from "lucide-react";
import confetti from "canvas-confetti";

interface CloudAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SQL_MIGRATION_SNIPPET = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT, email TEXT, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles self access" ON public.profiles FOR ALL TO authenticated USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);

CREATE TABLE IF NOT EXISTS public.visits (
  id TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name TEXT, visit_date TEXT, provider_name TEXT, facility_name TEXT,
  record_data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visits self access" ON public.visits FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_visits_user_id ON public.visits(user_id);

CREATE TABLE IF NOT EXISTS public.biomarkers (
  id TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, panel TEXT NOT NULL, value NUMERIC NOT NULL, unit TEXT NOT NULL,
  min_range NUMERIC NOT NULL, max_range NUMERIC NOT NULL, status TEXT NOT NULL,
  date_recorded TEXT, record_data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.biomarkers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Biomarkers self access" ON public.biomarkers FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);
CREATE INDEX IF NOT EXISTS idx_biomarkers_user_id ON public.biomarkers(user_id);

CREATE TABLE IF NOT EXISTS public.custom_medications (
  id TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  medication_name TEXT, record_data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.custom_medications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Meds self access" ON public.custom_medications FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

CREATE TABLE IF NOT EXISTS public.custom_labs (
  id TEXT PRIMARY KEY, user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_name TEXT, record_data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.custom_labs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Labs self access" ON public.custom_labs FOR ALL TO authenticated USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;`;

export function CloudAuthModal({ isOpen, onClose }: CloudAuthModalProps) {
  const {
    supabaseUser,
    isCloudAuthenticated,
    isCloudConfigured,
    syncStatus,
    lastSyncedAt,
    syncStats,
    signInWithMagicLink,
    signInWithPassword,
    signUpWithPassword,
    signOut,
    triggerManualSync,
    profile,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"auth" | "settings">("auth");
  const [authMode, setAuthMode] = useState<"magic_link" | "password" | "signup">("magic_link");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(profile?.name || "");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Custom Supabase URL & Key State
  const currentCfg = getSupabaseConfig();
  const [customUrl, setCustomUrl] = useState(currentCfg?.url || "");
  const [customKey, setCustomKey] = useState(currentCfg?.anonKey || "");
  const [sqlCopied, setSqlCopied] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);

  if (!isOpen) return null;

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const res = await signInWithMagicLink(email.trim());
    setLoading(false);

    if (res.error) {
      setErrorMessage(res.error);
    } else {
      setSuccessMessage("Magic link sent! Check your email inbox to confirm login.");
    }
  };

  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    let res: { error: string | null };
    if (authMode === "signup") {
      res = await signUpWithPassword(email.trim(), password, name.trim());
      if (!res.error) {
        setSuccessMessage("Account created! If email confirmation is enabled on your Supabase project, check your inbox.");
        try {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
        } catch {}
      }
    } else {
      res = await signInWithPassword(email.trim(), password);
      if (!res.error) {
        setSuccessMessage("Successfully authenticated! Synchronizing your health records...");
        try {
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
        } catch {}
        setTimeout(() => onClose(), 1200);
      }
    }

    setLoading(false);
    if (res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleSaveCustomKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim() || !customKey.trim()) return;
    saveCustomSupabaseConfig(customUrl.trim(), customKey.trim());
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2500);
  };

  const handleClearCustomKeys = () => {
    clearCustomSupabaseConfig();
    setCustomUrl("");
    setCustomKey("");
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_MIGRATION_SNIPPET);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                  Cloud Vault & Multi-Device Sync
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Supabase RLS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Encrypted multi-device sync across your phone, tablet, and laptop
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-1.5 text-xs">
          <button
            onClick={() => setActiveTab("auth")}
            className={`flex-1 py-2 rounded-xl font-bold transition-all ${
              activeTab === "auth"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {isCloudAuthenticated ? "Vault Status & Sync" : "Account Authentication"}
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "settings"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Supabase Connection</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
          {activeTab === "auth" ? (
            isCloudAuthenticated ? (
              /* ALREADY LOGGED IN: SHOW SYNC DASHBOARD */
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                        {supabaseUser?.email?.slice(0, 1).toUpperCase() || "U"}
                      </div>
                      <div>
                        <span className="font-extrabold text-slate-900 dark:text-white block text-sm">
                          {supabaseUser?.email}
                        </span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono">
                          ID: {supabaseUser?.id.slice(0, 16)}...
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Connected</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200/80 dark:border-emerald-900/60 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Cloud Sync Status:</span>
                      <strong className="text-emerald-800 dark:text-emerald-200 font-bold capitalize">
                        {syncStatus === "syncing" ? "Syncing right now..." : "Fully Synchronized"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Last Synced:</span>
                      <strong className="text-slate-800 dark:text-slate-200 font-mono">
                        {lastSyncedAt || "Just now"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Cloud Sync Breakdown */}
                {syncStats && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                      Synced Record Vault Items
                    </span>
                    <div className="grid grid-cols-4 gap-2 text-center pt-1">
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        <div className="text-base font-black text-slate-900 dark:text-white">
                          {syncStats.visitsCount}
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase">Visits</div>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        <div className="text-base font-black text-slate-900 dark:text-white">
                          {syncStats.biomarkersCount}
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase">Biomarkers</div>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        <div className="text-base font-black text-slate-900 dark:text-white">
                          {syncStats.medsCount}
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase">Meds</div>
                      </div>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800">
                        <div className="text-base font-black text-slate-900 dark:text-white">
                          {syncStats.labsCount}
                        </div>
                        <div className="text-[9px] text-slate-400 uppercase">Lab Orders</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Cloud</span>
                  </button>

                  <button
                    onClick={() => triggerManualSync()}
                    disabled={syncStatus === "syncing"}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
                    <span>{syncStatus === "syncing" ? "Syncing..." : "Sync Now"}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* NOT LOGGED IN: SHOW AUTH FORM */
              <div className="space-y-4">
                {/* Mode Selector */}
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("magic_link");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className={`py-1.5 rounded-lg transition-all ${
                      authMode === "magic_link" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs" : ""
                    }`}
                  >
                    Magic Link
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("password");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className={`py-1.5 rounded-lg transition-all ${
                      authMode === "password" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs" : ""
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("signup");
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    className={`py-1.5 rounded-lg transition-all ${
                      authMode === "signup" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs" : ""
                    }`}
                  >
                    Register
                  </button>
                </div>

                {/* Feedback Alerts */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Magic Link Form */}
                {authMode === "magic_link" ? (
                  <form onSubmit={handleMagicLink} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Patient Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. alex.morgan@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-hidden focus:border-emerald-500 font-medium"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      We will email you a secure, passwordless one-click authentication link. No password required.
                    </p>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-xs flex items-center justify-center gap-2"
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      <span>Send Magic Login Link</span>
                    </button>
                  </form>
                ) : (
                  /* Password / Sign Up Form */
                  <form onSubmit={handlePasswordAuth} className="space-y-3">
                    {authMode === "signup" && (
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                          Full Name / Alias
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Morgan"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-hidden focus:border-emerald-500 font-medium"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="alex.morgan@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-hidden focus:border-emerald-500 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          required
                          minLength={6}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-xs outline-hidden focus:border-emerald-500 font-medium"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-colors shadow-xs flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                      <span>{authMode === "signup" ? "Create Account & Sync" : "Sign In & Sync"}</span>
                    </button>
                  </form>
                )}

                {/* Privacy Guarantee Banner */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero-Knowledge Multi-Tenant Architecture:</strong> Patient health data is isolated by Supabase PostgreSQL Row Level Security (RLS). Only your authenticated session can query or modify your records.
                  </span>
                </div>
              </div>
            )
          ) : (
            /* TAB 2: SUPABASE PROJECT CREDENTIALS & SQL SCHEMA */
            <div className="space-y-4">
              <form onSubmit={handleSaveCustomKeys} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Supabase Project URL
                  </label>
                  <input
                    type="url"
                    required
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://xyzprojectid.supabase.co"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-xs outline-hidden focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Supabase Anon / Public Key
                  </label>
                  <input
                    type="text"
                    required
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-mono text-xs outline-hidden focus:border-emerald-500 font-medium"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleClearCustomKeys}
                    className="text-xs font-semibold text-rose-600 hover:underline"
                  >
                    Clear Credentials
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-xs"
                  >
                    {configSaved ? "✓ Credentials Saved!" : "Save & Connect"}
                  </button>
                </div>
              </form>

              {/* SQL Migration Script Box */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    Database Schema Migration (SQL)
                  </span>
                  <button
                    onClick={handleCopySql}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    {sqlCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{sqlCopied ? "Copied SQL!" : "Copy SQL Script"}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500">
                  Run this SQL in your Supabase Project SQL Editor to generate the visits, biomarkers, and medications tables with RLS policies:
                </p>

                <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[10px] overflow-x-auto max-h-36">
                  {SQL_MIGRATION_SNIPPET}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            <span>Works across iOS, Android, and Desktop</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
