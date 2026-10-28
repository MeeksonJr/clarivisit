"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserProfile } from "@/types/visit";
import { getUserProfile, saveUserProfile, deleteUserProfile as wipeUserStorage } from "@/lib/storage";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { performFullSync, SyncStats } from "@/lib/cloudSync";
import { User, Session } from "@supabase/supabase-js";

export type CloudSyncStatus = "synced" | "syncing" | "local_only" | "error";

interface AuthContextType {
  profile: UserProfile | null;
  supabaseUser: User | null;
  session: Session | null;
  isLoading: boolean;
  isOnboarded: boolean;
  isCloudConfigured: boolean;
  isCloudAuthenticated: boolean;
  syncStatus: CloudSyncStatus;
  lastSyncedAt: string | null;
  syncStats: SyncStats | null;
  setProfile: (profile: UserProfile) => void;
  updateName: (name: string) => void;
  signInWithMagicLink: (email: string) => Promise<{ error: string | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithPassword: (email: string, password: string, name?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  triggerManualSync: () => Promise<void>;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  supabaseUser: null,
  session: null,
  isLoading: true,
  isOnboarded: false,
  isCloudConfigured: false,
  isCloudAuthenticated: false,
  syncStatus: "local_only",
  lastSyncedAt: null,
  syncStats: null,
  setProfile: () => {},
  updateName: () => {},
  signInWithMagicLink: async () => ({ error: "Not implemented" }),
  signInWithPassword: async () => ({ error: "Not implemented" }),
  signUpWithPassword: async () => ({ error: "Not implemented" }),
  signOut: async () => {},
  triggerManualSync: async () => {},
  deleteAccount: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>("local_only");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const [configured, setConfigured] = useState(false);

  // Synchronize local with cloud
  const syncWithCloud = useCallback(async (userId: string) => {
    const supabase = getSupabase();
    if (!supabase) return;

    setSyncStatus("syncing");
    try {
      const stats = await performFullSync(supabase, userId);
      setSyncStats(stats);
      setLastSyncedAt(stats.syncedAt);
      setSyncStatus("synced");
    } catch (err) {
      console.error("Cloud sync error:", err);
      setSyncStatus("error");
    }
  }, []);

  const initAuth = useCallback(async () => {
    // 1. Load local profile first
    const stored = getUserProfile();
    setProfileState(stored);

    // 2. Check Supabase
    const isConfig = isSupabaseConfigured();
    setConfigured(isConfig);

    const supabase = getSupabase();
    if (supabase && isConfig) {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setSupabaseUser(currentSession?.user || null);

        if (currentSession?.user) {
          setSyncStatus("syncing");
          // Sync existing data
          await syncWithCloud(currentSession.user.id);
        } else {
          setSyncStatus("local_only");
        }
      } catch (err) {
        console.warn("Supabase auth check notice:", err);
        setSyncStatus("local_only");
      }
    } else {
      setSyncStatus("local_only");
    }

    setIsLoading(false);
  }, [syncWithCloud]);

  useEffect(() => {
    initAuth();

    // Listen for local profile changes
    const profileListener = () => {
      setProfileState(getUserProfile());
    };
    window.addEventListener("clarivisit_profile_change", profileListener);

    // Subscribe to Supabase Auth State Changes
    const supabase = getSupabase();
    let authSub: { unsubscribe: () => void } | null = null;

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          setSession(newSession);
          setSupabaseUser(newSession?.user || null);

          if (event === "SIGNED_IN" && newSession?.user) {
            setSyncStatus("syncing");
            await syncWithCloud(newSession.user.id);

            // Update profile with email if not set
            const currentProf = getUserProfile();
            if (currentProf && !currentProf.email && newSession.user.email) {
              const updatedProf: UserProfile = {
                ...currentProf,
                email: newSession.user.email,
              };
              saveUserProfile(updatedProf);
              setProfileState(updatedProf);
            }
          } else if (event === "SIGNED_OUT") {
            setSyncStatus("local_only");
            setLastSyncedAt(null);
            setSyncStats(null);
          }
        }
      );
      authSub = subscription;
    }

    return () => {
      window.removeEventListener("clarivisit_profile_change", profileListener);
      if (authSub) authSub.unsubscribe();
    };
  }, [initAuth, syncWithCloud]);

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    saveUserProfile(newProfile);
  };

  const updateName = (name: string) => {
    const updated: UserProfile = {
      ...(profile || {
        onboarded: true,
        createdAt: new Date().toISOString(),
        themePreference: "system",
      }),
      name,
    };
    setProfile(updated);
  };

  // Cloud Auth Methods
  const signInWithMagicLink = async (email: string): Promise<{ error: string | null }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: "Cloud sync is temporarily unavailable. Please try again shortly." };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/dashboard` : undefined,
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || "Failed to send magic link." };
    }
  };

  const signInWithPassword = async (email: string, password: string): Promise<{ error: string | null }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: "Cloud sync is temporarily unavailable. Please try again shortly." };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || "Failed to sign in." };
    }
  };

  const signUpWithPassword = async (email: string, password: string, name?: string): Promise<{ error: string | null }> => {
    const supabase = getSupabase();
    if (!supabase) {
      return { error: "Cloud sync is temporarily unavailable. Please try again shortly." };
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name || profile?.name || "Patient" },
        },
      });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err: any) {
      return { error: err?.message || "Failed to sign up." };
    }
  };

  const signOut = async () => {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setSupabaseUser(null);
    setSession(null);
    setSyncStatus("local_only");
    setLastSyncedAt(null);
    setSyncStats(null);
  };

  const triggerManualSync = async () => {
    if (!supabaseUser) return;
    await syncWithCloud(supabaseUser.id);
  };

  const deleteAccount = () => {
    wipeUserStorage();
    setProfileState(null);
    if (supabaseUser) {
      signOut();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        supabaseUser,
        session,
        isLoading,
        isOnboarded: Boolean(profile?.onboarded),
        isCloudConfigured: configured,
        isCloudAuthenticated: Boolean(supabaseUser),
        syncStatus,
        lastSyncedAt,
        syncStats,
        setProfile,
        updateName,
        signInWithMagicLink,
        signInWithPassword,
        signUpWithPassword,
        signOut,
        triggerManualSync,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
