import { SupabaseClient } from "@supabase/supabase-js";
import {
  getStoredVisits,
  saveVisit,
  getBiomarkerResults,
  saveBulkBiomarkers,
  getCustomMedications,
  saveCustomMedication,
  getCustomLabOrders,
  saveCustomLabOrder,
} from "./storage";
import { ParsedVisitRecord, BiomarkerResult, StructuredPrescription, LabOrder } from "@/types/visit";

export interface SyncStats {
  visitsCount: number;
  biomarkersCount: number;
  medsCount: number;
  labsCount: number;
  syncedAt: string;
}

/**
 * Pushes local device data up to Supabase cloud vault
 */
export async function pushLocalToSupabase(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  // 1. Push visits
  const localVisits = getStoredVisits();
  if (localVisits.length > 0) {
    const visitsPayload = localVisits.map((v) => ({
      id: v.id,
      user_id: userId,
      patient_name: v.patientName || "Alex Morgan",
      visit_date: v.visitDate || new Date().toISOString(),
      provider_name: v.providerName || "Physician",
      facility_name: v.facilityName || "Clinic",
      record_data: v,
      updated_at: new Date().toISOString(),
    }));

    const { error: visitErr } = await supabase
      .from("visits")
      .upsert(visitsPayload, { onConflict: "id" });
    if (visitErr) console.warn("Supabase visits sync warning:", visitErr.message);
  }

  // 2. Push biomarkers
  const localBiomarkers = getBiomarkerResults();
  if (localBiomarkers.length > 0) {
    const biomarkersPayload = localBiomarkers.map((b) => ({
      id: b.id,
      user_id: userId,
      name: b.name,
      panel: b.panel,
      value: b.value,
      unit: b.unit,
      min_range: b.minRange,
      max_range: b.maxRange,
      status: b.status,
      date_recorded: b.dateRecorded,
      record_data: b,
      updated_at: new Date().toISOString(),
    }));

    const { error: bioErr } = await supabase
      .from("biomarkers")
      .upsert(biomarkersPayload, { onConflict: "id" });
    if (bioErr) console.warn("Supabase biomarkers sync warning:", bioErr.message);
  }

  // 3. Push custom medications
  const localMeds = getCustomMedications();
  if (localMeds.length > 0) {
    const medsPayload = localMeds.map((m) => ({
      id: m.id,
      user_id: userId,
      medication_name: m.medicationName,
      record_data: m,
    }));

    const { error: medErr } = await supabase
      .from("custom_medications")
      .upsert(medsPayload, { onConflict: "id" });
    if (medErr) console.warn("Supabase meds sync warning:", medErr.message);
  }

  // 4. Push custom labs
  const localLabs = getCustomLabOrders();
  if (localLabs.length > 0) {
    const labsPayload = localLabs.map((l) => ({
      id: l.id,
      user_id: userId,
      test_name: l.testName,
      record_data: l,
    }));

    const { error: labErr } = await supabase
      .from("custom_labs")
      .upsert(labsPayload, { onConflict: "id" });
    if (labErr) console.warn("Supabase custom labs sync warning:", labErr.message);
  }
}

/**
 * Pulls cloud data down into local storage
 */
export async function pullSupabaseToLocal(
  supabase: SupabaseClient,
  userId: string
): Promise<{ visits: number; biomarkers: number; meds: number; labs: number }> {
  let visitsCount = 0;
  let biomarkersCount = 0;
  let medsCount = 0;
  let labsCount = 0;

  // 1. Pull visits
  const { data: cloudVisits, error: vErr } = await supabase
    .from("visits")
    .select("record_data")
    .eq("user_id", userId);

  if (!vErr && cloudVisits) {
    cloudVisits.forEach((row) => {
      if (row.record_data) {
        saveVisit(row.record_data as ParsedVisitRecord);
        visitsCount++;
      }
    });
  }

  // 2. Pull biomarkers
  const { data: cloudBio, error: bErr } = await supabase
    .from("biomarkers")
    .select("record_data")
    .eq("user_id", userId);

  if (!bErr && cloudBio) {
    const bioList: BiomarkerResult[] = [];
    cloudBio.forEach((row) => {
      if (row.record_data) {
        bioList.push(row.record_data as BiomarkerResult);
      }
    });
    if (bioList.length > 0) {
      saveBulkBiomarkers(bioList);
      biomarkersCount = bioList.length;
    }
  }

  // 3. Pull custom medications
  const { data: cloudMeds, error: mErr } = await supabase
    .from("custom_medications")
    .select("record_data")
    .eq("user_id", userId);

  if (!mErr && cloudMeds) {
    cloudMeds.forEach((row) => {
      if (row.record_data) {
        saveCustomMedication(row.record_data as StructuredPrescription);
        medsCount++;
      }
    });
  }

  // 4. Pull custom labs
  const { data: cloudLabs, error: lErr } = await supabase
    .from("custom_labs")
    .select("record_data")
    .eq("user_id", userId);

  if (!lErr && cloudLabs) {
    cloudLabs.forEach((row) => {
      if (row.record_data) {
        saveCustomLabOrder(row.record_data as LabOrder);
        labsCount++;
      }
    });
  }

  return { visits: visitsCount, biomarkers: biomarkersCount, meds: medsCount, labs: labsCount };
}

/**
 * Executes a full two-way merge sync
 */
export async function performFullSync(
  supabase: SupabaseClient,
  userId: string
): Promise<SyncStats> {
  // First push whatever local data exists
  await pushLocalToSupabase(supabase, userId);

  // Then pull the entire merged state from cloud
  const pulled = await pullSupabaseToLocal(supabase, userId);

  const now = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  return {
    visitsCount: pulled.visits,
    biomarkersCount: pulled.biomarkers,
    medsCount: pulled.meds,
    labsCount: pulled.labs,
    syncedAt: now,
  };
}
