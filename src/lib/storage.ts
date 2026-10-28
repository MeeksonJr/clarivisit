import { ParsedVisitRecord, UserProfile, StructuredPrescription, LabOrder, BiomarkerResult } from "@/types/visit";

const VISITS_STORAGE_KEY = "clarivisit_patient_records_v1";
const PROFILE_STORAGE_KEY = "clarivisit_user_profile_v1";
const THEME_STORAGE_KEY = "clarivisit_theme_pref_v1";
const CUSTOM_MEDICATIONS_KEY = "clarivisit_custom_medications_v1";
const PILL_TRACKER_KEY = "clarivisit_daily_pill_log_v1";

export function normalizePrescription(p: any): StructuredPrescription {
  if (typeof p === "string") {
    return {
      id: `rx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      medicationName: p,
      dosage: "Standard dose",
      frequency: "As directed",
      timingSlots: ["morning"],
      foodRequirement: "no_restriction",
      clinicalPurpose: "Prescription recorded on after-visit summary.",
      instructions: "Take as directed by your physician.",
      sideEffectsToWatch: ["Consult your healthcare provider if you experience adverse effects."],
      status: "active",
    };
  }

  return {
    id: p?.id || `rx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    medicationName: p?.medicationName || "Prescription Medication",
    dosage: p?.dosage || "As directed",
    frequency: p?.frequency || "Once daily",
    timingSlots: Array.isArray(p?.timingSlots) && p.timingSlots.length > 0 ? p.timingSlots : ["morning"],
    foodRequirement: p?.foodRequirement || "no_restriction",
    clinicalPurpose: p?.clinicalPurpose || "Prescribed by physician.",
    instructions: p?.instructions || "Take as directed by your healthcare provider.",
    sideEffectsToWatch: Array.isArray(p?.sideEffectsToWatch) ? p.sideEffectsToWatch : [],
    pharmacyQuestions: Array.isArray(p?.pharmacyQuestions) ? p.pharmacyQuestions : [],
    refillsRemaining: p?.refillsRemaining,
    prescribingDoctor: p?.prescribingDoctor,
    isCustomSupplement: Boolean(p?.isCustomSupplement),
    status: p?.status || "active",
  };
}

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
    prescriptions: Array.isArray(v.prescriptions) ? v.prescriptions.map(normalizePrescription) : [],
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
  const customMeds = getCustomMedications();
  const payload = {
    exportDate: new Date().toISOString(),
    appName: "ClariVisit",
    profile,
    visits,
    customMedications: customMeds,
  };
  return JSON.stringify(payload, null, 2);
}

// =========================================================================
// CUSTOM MEDICATIONS & SUPPLEMENT STORAGE
// =========================================================================

export function getCustomMedications(): StructuredPrescription[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_MEDICATIONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizePrescription);
  } catch {
    return [];
  }
}

export function saveCustomMedication(rx: StructuredPrescription): void {
  if (typeof window === "undefined") return;
  const existing = getCustomMedications();
  const filtered = existing.filter((item) => item.id !== rx.id);
  const updated = [normalizePrescription(rx), ...filtered];
  localStorage.setItem(CUSTOM_MEDICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("clarivisit_meds_change"));
}

export function deleteCustomMedication(id: string): void {
  if (typeof window === "undefined") return;
  const existing = getCustomMedications();
  const updated = existing.filter((item) => item.id !== id);
  localStorage.setItem(CUSTOM_MEDICATIONS_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("clarivisit_meds_change"));
}

// =========================================================================
// DAILY PILL TAKEN LOG TRACKER
// =========================================================================

export function getPillLogForDate(dateKey: string): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PILL_TRACKER_KEY);
    if (!raw) return {};
    const allLogs = JSON.parse(raw);
    return allLogs[dateKey] || {};
  } catch {
    return {};
  }
}

export function togglePillTaken(dateKey: string, pillSlotKey: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(PILL_TRACKER_KEY);
    const allLogs = raw ? JSON.parse(raw) : {};
    const dateLog = allLogs[dateKey] || {};
    const nextState = !dateLog[pillSlotKey];
    dateLog[pillSlotKey] = nextState;
    allLogs[dateKey] = dateLog;
    localStorage.setItem(PILL_TRACKER_KEY, JSON.stringify(allLogs));
    window.dispatchEvent(new Event("clarivisit_pill_logged"));
    return nextState;
  } catch {
    return false;
  }
}

// =========================================================================
// LAB ORDERS STATUS TRACKING & FASTING COUNTDOWN CONFIG
// =========================================================================

const LAB_STATUS_STORAGE_KEY = "clarivisit_lab_status_v1";
const CUSTOM_LABS_STORAGE_KEY = "clarivisit_custom_labs_v1";
const FASTING_TIMER_STORAGE_KEY = "clarivisit_fasting_timer_v1";

export interface LabStatusInfo {
  status: "ordered" | "scheduled" | "drawn" | "completed";
  scheduledDateTime?: string;
  notes?: string;
}

export function getLabStatuses(): Record<string, LabStatusInfo> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LAB_STATUS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function setLabStatus(labId: string, statusInfo: LabStatusInfo): void {
  if (typeof window === "undefined") return;
  const current = getLabStatuses();
  current[labId] = statusInfo;
  localStorage.setItem(LAB_STATUS_STORAGE_KEY, JSON.stringify(current));
  window.dispatchEvent(new Event("clarivisit_lab_status_change"));
}

export function getCustomLabOrders(): LabOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_LABS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomLabOrder(lab: LabOrder): void {
  if (typeof window === "undefined") return;
  const current = getCustomLabOrders();
  const filtered = current.filter((item) => item.id !== lab.id);
  const updated = [lab, ...filtered];
  localStorage.setItem(CUSTOM_LABS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("clarivisit_custom_labs_change"));
}

export function deleteCustomLabOrder(id: string): void {
  if (typeof window === "undefined") return;
  const current = getCustomLabOrders();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(CUSTOM_LABS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("clarivisit_custom_labs_change"));
}

export interface FastingTimerConfig {
  targetDateTime: string; // ISO string for scheduled draw
  fastingHours: number; // e.g. 10 or 12
  isActive: boolean;
  notes?: string;
}

export function getFastingTimerConfig(): FastingTimerConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FASTING_TIMER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveFastingTimerConfig(config: FastingTimerConfig | null): void {
  if (typeof window === "undefined") return;
  if (!config) {
    localStorage.removeItem(FASTING_TIMER_STORAGE_KEY);
  } else {
    localStorage.setItem(FASTING_TIMER_STORAGE_KEY, JSON.stringify(config));
  }
  window.dispatchEvent(new Event("clarivisit_fasting_timer_change"));
}

// =========================================================================
// BIOMARKER RESULTS & REFERENCE SPECTRUM STORAGE
// =========================================================================

const BIOMARKERS_STORAGE_KEY = "clarivisit_biomarkers_v1";

export function getBiomarkerResults(): BiomarkerResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BIOMARKERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveBiomarkerResult(biomarker: BiomarkerResult): void {
  if (typeof window === "undefined") return;
  const current = getBiomarkerResults();
  const filtered = current.filter((item) => item.id !== biomarker.id);
  const updated = [biomarker, ...filtered];
  localStorage.setItem(BIOMARKERS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("clarivisit_biomarkers_change"));
}

export function saveBulkBiomarkers(biomarkers: BiomarkerResult[]): void {
  if (typeof window === "undefined") return;
  const current = getBiomarkerResults();
  // Merge, updating existing ones with matching IDs
  const map = new Map<string, BiomarkerResult>();
  current.forEach((b) => map.set(b.id, b));
  biomarkers.forEach((b) => map.set(b.id, b));
  const merged = Array.from(map.values());
  localStorage.setItem(BIOMARKERS_STORAGE_KEY, JSON.stringify(merged));
  window.dispatchEvent(new Event("clarivisit_biomarkers_change"));
}

export function deleteBiomarkerResult(id: string): void {
  if (typeof window === "undefined") return;
  const current = getBiomarkerResults();
  const updated = current.filter((item) => item.id !== id);
  localStorage.setItem(BIOMARKERS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("clarivisit_biomarkers_change"));
}

export function clearBiomarkerResults(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(BIOMARKERS_STORAGE_KEY);
  window.dispatchEvent(new Event("clarivisit_biomarkers_change"));
}
