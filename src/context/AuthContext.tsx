"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "@/types/visit";
import { getUserProfile, saveUserProfile, deleteUserProfile as wipeUserStorage } from "@/lib/storage";

interface AuthContextType {
  profile: UserProfile | null;
  isLoading: boolean;
  isOnboarded: boolean;
  setProfile: (profile: UserProfile) => void;
  updateName: (name: string) => void;
  deleteAccount: () => void;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  isLoading: true,
  isOnboarded: false,
  setProfile: () => {},
  updateName: () => {},
  deleteAccount: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function load() {
      const stored = getUserProfile();
      setProfileState(stored);
      setIsLoading(false);
    }
    load();

    const listener = () => load();
    window.addEventListener("clarivisit_profile_change", listener);
    return () => window.removeEventListener("clarivisit_profile_change", listener);
  }, []);

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

  const deleteAccount = () => {
    wipeUserStorage();
    setProfileState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        profile,
        isLoading,
        isOnboarded: Boolean(profile?.onboarded),
        setProfile,
        updateName,
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
