"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getStoredVisits } from "@/lib/storage";
import confetti from "canvas-confetti";
import {
  HeartPulse,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  Cloud
} from "lucide-react";

function AuthFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "signin" ? "signin" : "signup";

  const {
    signInWithPassword,
    signUpWithPassword,
    signInWithMagicLink,
    supabaseUser,
    isCloudAuthenticated,
    updateName,
    profile
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup" | "magic_link">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(profile?.name || "");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isCloudAuthenticated) {
      const visits = getStoredVisits();
      if (visits.length > 0) {
        router.push("/dashboard");
      } else {
        router.push("/onboarding");
      }
    }
  }, [isCloudAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      if (mode === "magic_link") {
        const res = await signInWithMagicLink(email.trim());
        setLoading(false);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg("Magic sign-in link sent! Please check your email inbox to log in.");
        }
        return;
      }

      if (!password) {
        setErrorMsg("Please enter your password.");
        setLoading(false);
        return;
      }

      if (mode === "signup") {
        const nameToUse = fullName.trim() || "Patient";
        const res = await signUpWithPassword(email.trim(), password, nameToUse);
        setLoading(false);

        if (res.error) {
          setErrorMsg(res.error);
        } else {
          updateName(nameToUse);
          setSuccessMsg("Account created successfully! Preparing your onboarding...");
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          } catch {}
          setTimeout(() => {
            router.push("/onboarding");
          }, 1200);
        }
      } else {
        // Sign In
        const res = await signInWithPassword(email.trim(), password);
        setLoading(false);

        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg("Welcome back! Loading your health records...");
          try {
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
          } catch {}
          setTimeout(() => {
            const visits = getStoredVisits();
            if (visits.length > 0) {
              router.push("/dashboard");
            } else {
              router.push("/onboarding");
            }
          }, 1000);
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      setLoading(false);
      setErrorMsg(error.message || "An unexpected authentication error occurred.");
    }
  };

  const handleContinueAsGuest = () => {
    if (fullName.trim()) {
      updateName(fullName.trim());
    }
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between p-4 sm:p-6 transition-colors selection:bg-sky-500 selection:text-white bg-grid-pattern">
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            Clari<span className="text-sky-600 dark:text-sky-400">Visit</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Auth Card Container */}
      <main className="max-w-md w-full mx-auto my-auto py-8">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          {/* Header & Badges */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 text-xs font-bold border border-sky-200 dark:border-sky-800">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Multi-Device Health Cloud</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {mode === "signup"
                ? "Create Your Account"
                : mode === "signin"
                ? "Sign In to ClariVisit"
                : "Passwordless Magic Link"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              {mode === "signup"
                ? "Securely backup your visit summaries, lab biomarkers, and prescriptions across all your devices."
                : "Enter your credentials to access your clinical dashboard and health records."}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === "signup"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === "signin" || mode === "magic_link"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
          </div>

          {/* Alert Banners */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-snug">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <div className="leading-snug">{successMsg}</div>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name for Sign Up */}
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Patient or Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Password (if not magic link) */}
            {mode !== "magic_link" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setMode("magic_link")}
                      className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      Use Magic Link instead?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === "signup" && (
                  <p className="text-[10px] text-slate-400">Minimum 6 characters</p>
                )}
              </div>
            )}

            {mode === "magic_link" && (
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline block"
              >
                ← Back to Password Sign In
              </button>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-sky-600 hover:bg-sky-500 shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === "signup"
                      ? "Create Account & Proceed"
                      : mode === "signin"
                      ? "Sign In to Vault"
                      : "Send Login Link"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] uppercase font-bold text-slate-400 absolute">
              Or
            </span>
          </div>

          {/* Guest Mode Action */}
          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={handleContinueAsGuest}
              className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue as Guest (Local Device Only)</span>
              <span>→</span>
            </button>
            <p className="text-[10px] text-slate-400 leading-snug">
              Guest records are stored securely in your browser's private sandbox and will not sync across other devices.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Guarantees */}
      <footer className="max-w-md mx-auto w-full text-center py-4 space-y-1 text-slate-400 text-xs">
        <div className="flex items-center justify-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>256-Bit RLS Encryption</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero Data Selling</span>
          </span>
        </div>
        <p className="text-[10px]">
          Protected by PostgreSQL Row Level Security. Only your authenticated user ID can decrypt your records.
        </p>
      </footer>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
        </div>
      }
    >
      <AuthFormContent />
    </Suspense>
  );
}
