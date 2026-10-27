import { ParsedVisitRecord, UserProfile } from "@/types/visit";

const VISITS_STORAGE_KEY = "clarivisit_patient_records_v1";
const PROFILE_STORAGE_KEY = "clarivisit_user_profile_v1";
const THEME_STORAGE_KEY = "clarivisit_theme_pref_v1";

export function normalizeVisitRecord(v: Partial<ParsedVisitRecord>): ParsedVisitRecord {
  return {
    id: v.id || `visit_${Date.now()}`,
    createdAt: v.createdAt || new Date().toISOString(),
    patientName: v.patientName || "Anonymous Patient",
    patientDob: v.patientDob,
    visitDate: v.visitDate || "Recent Visit",
    providerName: v.providerName || "Physician",
    providerTitle: v.providerTitle,
    facilityName: v.facilityName || "Clinic Visit",
    facilityAddress: v.facilityAddress,
    contactPhone: v.contactPhone,
    summaryExecutive: v.summaryExecutive || "Visit records indexed into local health vault.",
    vitals: {
      bloodPressure: {
        raw: v.vitals?.bloodPressure?.raw || "--",
        systolic: v.vitals?.bloodPressure?.systolic ?? null,
        diastolic: v.vitals?.bloodPressure?.diastolic ?? null,
        status: v.vitals?.bloodPressure?.status || "normal",
        plainExplanation:
          v.vitals?.bloodPressure?.plainExplanation ||
          "Blood pressure recorded at visit within standard parameters.",
      },
      heartRate: v.vitals?.heartRate || {
        raw: "--",
        value: null,
        unit: "bpm",
        status: "normal",
        label: "Heart Rate",
        plainExplanation: "Resting heart rate.",
        normalRangeText: "60 - 100 bpm",
      },
      oxygenSaturation: v.vitals?.oxygenSaturation || {
        raw: "--",
        value: null,
        unit: "%",
        status: "normal",
        label: "Oxygen Saturation (SpO2)",
        plainExplanation: "Blood oxygen level.",
        normalRangeText: "95 - 100%",
      },
      bmi: v.vitals?.bmi || {
        raw: "--",
        value: null,
        unit: "kg/m²",
        status: "optimal",
        label: "Body Mass Index",
        plainExplanation: "Body mass index calculation.",
        normalRangeText: "18.5 - 24.9",
      },
      weight: v.vitals?.weight || {
        raw: "--",
        value: null,
        unit: "lbs",
        status: "normal",
        label: "Weight",
        plainExplanation: "Recorded weight.",
        normalRangeText: "--",
      },
      height: v.vitals?.height || {
        raw: "--",
        value: null,
        unit: "ft/in",
        status: "normal",
        label: "Height",
        plainExplanation: "Recorded height.",
        normalRangeText: "--",
      },
      temperature: v.vitals?.temperature || {
        raw: "--",
        value: null,
        unit: "°F",
        status: "normal",
        label: "Temperature",
        plainExplanation: "Oral temperature.",
        normalRangeText: "97.0 - 99.0 °F",
      },
      respirationRate: v.vitals?.respirationRate || {
        raw: "--",
        value: null,
        unit: "breaths/min",
        status: "normal",
        label: "Respiration Rate",
        plainExplanation: "Breathing rate at rest.",
        normalRangeText: "12 - 20 breaths/min",
      },
    },
    clinicalIssues: Array.isArray(v.clinicalIssues) ? v.clinicalIssues : [],
    prescriptions: Array.isArray(v.prescriptions) ? v.prescriptions : [],
    labOrders: Array.isArray(v.labOrders) ? v.labOrders : [],
    lifestyle: v.lifestyle || {
      doctorDirectivesRaw: "",
      weeklyExerciseTargetMinutes: 150,
      hydrationTargetOz: 80,
      carbStrategy: "",
      leafyGreensAdvice: "",
      mealSwaps: [],
      weeklyWorkoutPlan: [],
      groceryList: {
        produce: [],
        proteins: [],
        wholeGrains: [],
        beverages: [],
      },
      recipes: [],
    },
    preventiveCare: Array.isArray(v.preventiveCare) ? v.preventiveCare : [],
    followUps: Array.isArray(v.followUps) ? v.followUps : [],
    rawTranscribedNotes: v.rawTranscribedNotes,
  };
}

export function getStoredVisits(): ParsedVisitRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VISITS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is Partial<ParsedVisitRecord> => Boolean(item && typeof item === "object" && item.id))
      .map(normalizeVisitRecord);
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
    const normalized = normalizeVisitRecord(visit);
    const existing = getStoredVisits();
    const index = existing.findIndex((v) => v.id === normalized.id);
    if (index >= 0) {
      existing[index] = normalized;
    } else {
      existing.unshift(normalized);
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
