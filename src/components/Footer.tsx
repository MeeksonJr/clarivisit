import React from "react";
import Link from "next/link";
import { HeartPulse, ShieldAlert, Lock, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                Clari<span className="text-sky-600 dark:text-sky-400">Visit</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Empowering patients with immediate clarity. We decode complex hospital and clinic After-Visit Summaries into reassuring explanations, actionable nutrition, and preventive schedules.
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900/60 max-w-md">
              <Lock className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>100% Local-First Storage. Your health records never train third-party models and are never sold.</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Features
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Vitals Spectrum Analysis</li>
              <li>Clinical Jargon Demystifier</li>
              <li>Lab Order Fasting Prep</li>
              <li>Carb Swap Meal Matrix</li>
              <li>Preventive Care Gap Alerts</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Patient Control
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/dashboard/settings" className="hover:text-sky-600 dark:hover:text-sky-400">
                  Instant Data Purge
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="hover:text-sky-600 dark:hover:text-sky-400">
                  Export Health JSON
                </Link>
              </li>
              <li>
                <a href="#privacy-first" className="hover:text-sky-600 dark:hover:text-sky-400">
                  Privacy Pledge
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Medical disclaimer alert banner */}
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3 leading-relaxed">
          <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <p>
            <strong>Medical Notice & Safe Care:</strong> ClariVisit is an artificial intelligence health-literacy tool designed to help you understand and organize your personal clinic discharge papers and provider instructions. ClariVisit does not provide medical diagnoses, treatment prescriptions, or formal medical advice. Always consult your qualified healthcare provider for any clinical decisions. In an emergency, call 911 immediately.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-2">
          <p>© 2026 ClariVisit Health. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
            <span>Built with Google Gemini Multimodal Intelligence</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
