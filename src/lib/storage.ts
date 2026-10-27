import { ParsedVisitRecord, UserProfile } from "@/types/visit";

const VISITS_STORAGE_KEY = "clarivisit_patient_records_v1";
const PROFILE_STORAGE_KEY = "clarivisit_user_profile_v1";
const THEME_STORAGE_KEY = "clarivisit_theme_pref_v1";

export function getStoredVisits(): ParsedVisitRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VISITS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to read visits from local storage:", e);
    return [];
  }
}

export function getVisitById(id: string): ParsedVisitRecord | null {
  const visits = getStoredVisits();
  return visits.find((v) => v.id === id) || null;
}

export function saveVisit(visit: ParsedVisitRecord): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredVisits();
    const index = existing.findIndex((v) => v.id === visit.id);
    if (index >= 0) {
      existing[index] = visit;
    } else {
      existing.unshift(visit);
    }
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event("clarivisit_data_change"));
  } catch (e) {
    console.error("Failed to save visit to local storage:", e);
  }
}

export function deleteVisit(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getStoredVisits();
    const filtered = existing.filter((v) => v.id !== id);
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event("clarivisit_data_change"));
  } catch (e) {
    console.error("Failed to delete visit:", e);
  }
}

export function clearAllVisits(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(VISITS_STORAGE_KEY);
  window.dispatchEvent(new Event("clarivisit_data_change"));
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event("clarivisit_profile_change"));
}

export function deleteUserProfile(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_STORAGE_KEY);
  localStorage.removeItem(VISITS_STORAGE_KEY);
  localStorage.removeItem(THEME_STORAGE_KEY);
  window.dispatchEvent(new Event("clarivisit_data_change"));
  window.dispatchEvent(new Event("clarivisit_profile_change"));
}

export function exportHealthDataJson(): string {
  const visits = getStoredVisits();
  const profile = getUserProfile();
  const payload = {
    exportDate: new Date().toISOString(),
    appName: "ClariVisit",
    profile,
    visits,
  };
  return JSON.stringify(payload, null, 2);
}
