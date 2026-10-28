"use client";

import React, { useState, useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getStoredVisits } from "@/lib/storage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CloudAuthModal } from "@/components/CloudAuthModal";
import {
  HeartPulse,
  LayoutDashboard,
  UploadCloud,
  FileClock,
  Activity,
  Apple,
  FileText,
  Settings,
  Pill,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  Loader2,
  Cloud,
  CloudCheck,
  RefreshCw
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

function DashboardNavContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile, supabaseUser, isCloudAuthenticated, syncStatus } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [cloudModalOpen, setCloudModalOpen] = useState(false);
  const [visitCount, setVisitCount] = useState(0);

  useEffect(() => {
    function refreshVisits() {
      const v = getStoredVisits();
      setVisitCount(v.length);
    }
    refreshVisits();

    window.addEventListener("clarivisit_data_change", refreshVisits);
    return () => window.removeEventListener("clarivisit_data_change", refreshVisits);
  }, []);

  const navItems: NavItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Upload & Scan",
      href: "/dashboard/upload",
      icon: UploadCloud,
    },
    {
      name: "Visit History",
      href: "/dashboard/visits",
      icon: FileClock,
      badgeCount: visitCount,
    },
    {
      name: "Vitals Spectrum",
      href: "/dashboard/vitals",
      icon: Activity,
    },
    {
      name: "Lifestyle & Nutrition",
      href: "/dashboard/lifestyle",
      icon: Apple,
    },
    {
      name: "Medications & Rx",
      href: "/dashboard/medications",
      icon: Pill,
    },
    {
      name: "Labs & Biomarkers",
      href: "/dashboard/labs",
      icon: FileText,
    },
    {
      name: "Privacy & Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-40 sticky top-0 h-screen shrink-0 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <a href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm">
              <HeartPulse className="w-5 h-5" />
            </div>
            {!collapsed && (
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white truncate">
                Clari<span className="text-sky-600 dark:text-sky-400">Visit</span>
              </span>
            )}
          </a>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {!collapsed ? (
          <button
            onClick={() => setCloudModalOpen(true)}
            className="p-3.5 mx-3 my-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-3 text-left transition-all group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center text-xs shrink-0 group-hover:scale-105 transition-transform">
              {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "PT"}
            </div>
            <div className="truncate min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {profile?.name || "Patient"}
              </div>
              <div className="text-[10px] flex items-center gap-1 font-medium truncate mt-0.5">
                {isCloudAuthenticated ? (
                  syncStatus === "syncing" ? (
                    <span className="text-sky-600 dark:text-sky-400 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Syncing Cloud...</span>
                    </span>
                  ) : (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CloudCheck className="w-3 h-3" />
                      <span>Cloud Synced</span>
                    </span>
                  )
                ) : (
                  <span className="text-slate-500 flex items-center gap-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    <Cloud className="w-3 h-3" />
                    <span>Local Vault (Sync)</span>
                  </span>
                )}
              </div>
            </div>
          </button>
        ) : (
          <div className="py-3 flex justify-center">
            <button
              onClick={() => setCloudModalOpen(true)}
              className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center text-xs hover:scale-105 transition-transform cursor-pointer"
              title="Cloud Sync & Profile"
            >
              {profile?.name ? profile.name.slice(0, 1).toUpperCase() : "P"}
            </button>
          </div>
        )}

        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname?.startsWith(item.href);

            const Icon = item.icon;

            return (
              <a
                key={item.href}
                href={item.href}
                title={collapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-sky-600 text-white shadow-xs font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
                } ${collapsed ? "justify-center px-0" : ""}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}
                {!collapsed && typeof item.badgeCount === "number" && item.badgeCount > 0 && (
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {!collapsed ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Theme</span>
              <ThemeToggle />
            </div>
          ) : (
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE TOP NAV */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <a href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
              <HeartPulse className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-white">
              Clari<span className="text-sky-600">Visit</span>
            </span>
          </a>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCloudModalOpen(true)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center gap-1.5 text-xs font-semibold"
            title="Cloud Sync"
          >
            {isCloudAuthenticated ? (
              <CloudCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Cloud className="w-4 h-4 text-slate-500" />
            )}
            <span className="text-[10px]">
              {isCloudAuthenticated ? "Synced" : "Vault"}
            </span>
          </button>
          <ThemeToggle />
        </div>
      </div>

      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="relative w-72 max-w-full bg-white dark:bg-slate-900 h-full p-4 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-base text-slate-900 dark:text-white">
                    ClariVisit
                  </span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setCloudModalOpen(true);
                }}
                className="w-full text-left p-3 my-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-750 transition-colors flex items-center gap-2.5"
              >
                <div className="w-8 h-8 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-xs">
                  {profile?.name ? profile.name.slice(0, 2).toUpperCase() : "PT"}
                </div>
                <div className="truncate flex-1">
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">{profile?.name || "Patient"}</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                    {isCloudAuthenticated ? <CloudCheck className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                    <span>{isCloudAuthenticated ? "Cloud Synced" : "Local Vault (Sync)"}</span>
                  </div>
                </div>
              </button>

              <nav className="space-y-1 pt-2">
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname?.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                        isActive
                          ? "bg-sky-600 text-white font-semibold"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.name}</span>
                      {typeof item.badgeCount === "number" && item.badgeCount > 0 && (
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                          {item.badgeCount}
                        </span>
                      )}
                    </a>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
              ClariVisit • Patient AI Companion
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC RIGHT CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0 overflow-y-auto">
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Cloud Authentication & Multi-Device Sync Modal */}
      <CloudAuthModal
        isOpen={cloudModalOpen}
        onClose={() => setCloudModalOpen(false)}
      />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
        </div>
      }
    >
      <DashboardNavContent>{children}</DashboardNavContent>
    </Suspense>
  );
}
