"use client";

import React, { useState } from "react";
import { ParsedVisitRecord } from "@/types/visit";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  X,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  User,
  Heart,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

interface EmailDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit: ParsedVisitRecord | null;
}

export function EmailDigestModal({ isOpen, onClose, visit }: EmailDigestModalProps) {
  const { profile } = useAuth();

  const [toEmail, setToEmail] = useState(profile?.email || "");
  const [recipientRole, setRecipientRole] = useState<"self" | "family" | "caregiver">("self");
  const [senderName, setSenderName] = useState(profile?.name || visit?.patientName || "Alex Morgan");
  const [personalNote, setPersonalNote] = useState("");
  
  // Sections toggle
  const [sections, setSections] = useState({
    vitals: true,
    labs: true,
    lifestyle: true,
    recipes: true,
    preventive: true,
  });

  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedFallback, setCopiedFallback] = useState(false);

  if (!isOpen || !visit) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail.trim()) {
      setErrorMessage("Please enter a destination email address.");
      return;
    }

    setIsSending(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: toEmail.trim(),
          visit,
          senderName: senderName.trim(),
          personalNote: personalNote.trim(),
          sections,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to dispatch email.");
      }

      setSendSuccess(true);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Email send error:", error);
      setErrorMessage(
        error.message ||
          "Could not send email. Resend free tier may require sending to the account owner or verified domain."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyDigestToClipboard = () => {
    const text = [
      `CLARIVISIT HEALTH ROADMAP • ${visit.facilityName || "Clinic Visit"} (${visit.visitDate})`,
      `Provider: ${visit.providerName}`,
      "",
      personalNote ? `Note: "${personalNote}"\n` : "",
      `EXECUTIVE SUMMARY:\n${visit.summaryExecutive}`,
      "",
      `BP: ${visit.vitals?.bloodPressure?.raw || "--"} (${visit.vitals?.bloodPressure?.status || "Normal"})`,
      `Pulse: ${visit.vitals?.heartRate?.raw || "--"} • BMI: ${visit.vitals?.bmi?.raw || "--"}`,
      "",
      `ORDERED LABS:`,
      ...(visit.labOrders?.map(
        (l) => `• ${l.testName}: ${l.fastingRequired ? "FASTING REQUIRED (8-12h)" : "No fasting"}`
      ) || []),
      "",
      `DOCTOR'S DIET DIRECTIVE:`,
      `"${visit.lifestyle?.doctorDirectivesRaw || "Reduce simple carbs, eat leafy greens"}"`,
      "",
      `Interactive Record: https://clarivisit.vercel.app/dashboard/visits/${visit.id}`,
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopiedFallback(true);
    setTimeout(() => setCopiedFallback(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/60 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                Email Health Roadmap & Digest
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Send a formatted clinical care plan to yourself or a caregiver
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          {sendSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Health Roadmap Dispatched!
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  A comprehensive care digest was delivered to <strong>{toEmail}</strong> via Resend.
                </p>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-500 transition-colors shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              {/* Recipient Role Chips */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Sending To
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "self", label: "Self (Patient)" },
                    { id: "family", label: "Family / Spouse" },
                    { id: "caregiver", label: "Caregiver" },
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setRecipientRole(role.id as any)}
                      className={`p-2 rounded-xl border font-bold text-center transition-all ${
                        recipientRole === role.id
                          ? "bg-sky-50 dark:bg-sky-950/80 border-sky-400 text-sky-700 dark:text-sky-300"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination Email */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Destination Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. yourname@example.com or caregiver@family.org"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              {/* Sender Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Sender / Patient Name
                </label>
                <input
                  type="text"
                  placeholder="Your Name / Alias"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden font-medium"
                />
              </div>

              {/* Personal Note */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Personal Note (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Here is my after-visit summary from Dr. Vance today. Vitals look good, just need to fast for labs next week!"
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden font-medium"
                />
              </div>

              {/* Sections to Include Checkboxes */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Sections to Include in Email
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { key: "vitals", label: "Recorded Vitals Spectrum" },
                    { key: "labs", label: "Lab Orders & Fasting Checklist" },
                    { key: "lifestyle", label: "Doctor's Diet & Grocery Swaps" },
                    { key: "recipes", label: "Doctor-Compliant Recipes" },
                    { key: "preventive", label: "Missing Vaccine Alerts" },
                  ].map((s) => (
                    <label
                      key={s.key}
                      className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 cursor-pointer select-none"
                    >
                      <input
                        type="checkbox"
                        checked={(sections as any)[s.key]}
                        onChange={(e) =>
                          setSections((prev) => ({
                            ...prev,
                            [s.key]: e.target.checked,
                          }))
                        }
                        className="rounded text-sky-600 focus:ring-sky-500"
                      />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {s.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error Callout */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{errorMessage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyDigestToClipboard}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-rose-700 hover:bg-rose-600 transition-colors"
                  >
                    {copiedFallback ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Summary Text Instead</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCopyDigestToClipboard}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {copiedFallback ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending || !toEmail.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 disabled:opacity-50 transition-all shadow-xs"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending via Resend...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Health Roadmap</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
