export type VitalsInterpretation = 
  | "low" 
  | "optimal" 
  | "normal" 
  | "elevated" 
  | "high_stage_1" 
  | "high_stage_2" 
  | "borderline" 
  | "concerning";

export interface VitalMetric {
  raw: string;
  value: number | string | null;
  unit: string;
  status: "optimal" | "normal" | "watch" | "alert";
  label: string;
  plainExplanation: string;
  normalRangeText: string;
}

export interface ExtractedVitals {
  bloodPressure: {
    raw: string;
    systolic: number | null;
    diastolic: number | null;
    status: "optimal" | "normal" | "elevated" | "high";
    plainExplanation: string;
  };
  heartRate: VitalMetric;
  oxygenSaturation: VitalMetric;
  bmi: VitalMetric;
  weight: VitalMetric;
  height: VitalMetric;
  temperature: VitalMetric;
  respirationRate: VitalMetric;
}

export interface LabOrder {
  id: string;
  testName: string;
  category: "Metabolic" | "Cardiovascular" | "Hematology" | "Infectious Disease" | "Urinary" | "General";
  dateDue?: string;
  fastingRequired: boolean;
  fastingHours?: number;
  plainPurpose: string;
  whatItDetects: string;
  prepInstructions: string;
  questionsForDoctor: string[];
}

export type BiomarkerStatus = "optimal" | "normal" | "low" | "elevated" | "high" | "critical";

export type BiomarkerPanel =
  | "Metabolic"
  | "Lipid"
  | "Hematology"
  | "Renal"
  | "Hepatic"
  | "Endocrine"
  | "Urinary"
  | "General";

export interface BiomarkerResult {
  id: string;
  name: string;
  panel: BiomarkerPanel;
  value: number;
  unit: string;
  minRange: number;
  maxRange: number;
  status: BiomarkerStatus;
  flagText?: string;
  plainMeaning: string;
  whyItMatters: string;
  lifestyleTips: string;
  doctorDiscussPoint?: string;
  associatedLabOrderId?: string;
  dateRecorded: string;
  labSource: string;
}

export interface StructuredPrescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  timingSlots: ("morning" | "afternoon" | "evening" | "bedtime" | "as_needed")[];
  foodRequirement: "with_food" | "empty_stomach" | "with_plenty_of_water" | "no_restriction";
  clinicalPurpose: string;
  instructions: string;
  sideEffectsToWatch: string[];
  pharmacyQuestions?: string[];
  refillsRemaining?: number;
  prescribingDoctor?: string;
  isCustomSupplement?: boolean;
  status: "active" | "completed" | "discontinued";
}

export interface ClinicalIssue {
  id: string;
  codeOrTitle: string;
  isRoutineScreening: boolean;
  plainEnglishSummary: string;
  whyItWasDiscussed: string;
  reassuranceNote: string;
}

export interface MealSwap {
  avoid: string;
  alternative: string;
  benefit: string;
}

export interface WorkoutBlock {
  dayTitle: string;
  durationMinutes: number;
  activityType: string;
  description: string;
}

export interface RecipeItem {
  id: string;
  title: string;
  description: string;
  clinicianRationale: string;
  mealType: "dinner" | "lunch" | "breakfast" | "snack";
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  calories: number;
  macros: {
    proteinGrams: number;
    netCarbsGrams: number;
    fiberGrams: number;
    fatGrams: number;
  };
  glycemicIndex: "low" | "medium" | "high";
  tags: string[];
  ingredients: Array<{
    item: string;
    amount: string;
    category: "produce" | "protein" | "grain" | "pantry";
  }>;
  instructions: string[];
}

export interface LifestylePrescription {
  doctorDirectivesRaw: string;
  weeklyExerciseTargetMinutes: number;
  hydrationTargetOz: number;
  carbStrategy: string;
  leafyGreensAdvice: string;
  mealSwaps: MealSwap[];
  weeklyWorkoutPlan: WorkoutBlock[];
  groceryList: {
    produce: string[];
    proteins: string[];
    wholeGrains: string[];
    beverages: string[];
  };
  recipes?: RecipeItem[];
}

export interface PreventiveCareItem {
  id: string;
  vaccineOrScreening: string;
  status: "completed" | "due" | "never_done" | "scheduled";
  dateDueOrGiven: string | null;
  isActionableGap: boolean;
  guidanceText: string;
  portalMessageDraft?: string;
}

export interface FollowUpAppointment {
  id: string;
  title: string;
  dateTime: string;
  provider: string;
  facility: string;
  address: string;
  phone: string;
  instructions: string;
}

export interface ParsedVisitRecord {
  id: string;
  createdAt: string;
  patientName: string;
  patientDob?: string;
  visitDate: string;
  providerName: string;
  providerTitle?: string;
  facilityName: string;
  facilityAddress?: string;
  contactPhone?: string;
  summaryExecutive: string;
  vitals: ExtractedVitals;
  clinicalIssues: ClinicalIssue[];
  prescriptions: StructuredPrescription[];
  labOrders: LabOrder[];
  lifestyle: LifestylePrescription;
  preventiveCare: PreventiveCareItem[];
  followUps: FollowUpAppointment[];
  rawTranscribedNotes?: string;
}

export interface UserProfile {
  name: string;
  email?: string;
  onboarded: boolean;
  createdAt: string;
  themePreference: "light" | "dark" | "system";
  healthGoals?: string[];
}
