import { GoogleGenAI } from "@google/genai";
import { ParsedVisitRecord } from "@/types/visit";
import { DEFAULT_CLINICAL_RECIPES } from "@/lib/recipes";

const CANDIDATE_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-flash-latest",
  "gemini-3.8-flash",
  "gemini-pro-latest"
];

function getGenAIClient(): GoogleGenAI {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not defined. Please verify the environment variable is configured."
    );
  }
  return new GoogleGenAI({ apiKey });
}

function extractJsonBlock(text: string): string {
  const trimmed = text.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed;
  }
  const markdownMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch && markdownMatch[1]) {
    return markdownMatch[1].trim();
  }
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.substring(firstBrace, lastBrace + 1);
  }
  return trimmed;
}

async function generateWithFallback(options: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contents: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any;
}) {
  const ai = getGenAIClient();
  let lastError: Error | null = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });
      return res;
    } catch (err: unknown) {
      lastError = err as Error;
      console.warn(`Model ${model} failed, trying next candidate:`, (err as Error)?.message);
      // Wait 300ms before trying the next candidate
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  throw lastError || new Error("All Gemini model candidates exhausted");
}

export async function parseVisitSummaryDocuments(
  files: Array<{ base64Data: string; mimeType: string }>
): Promise<ParsedVisitRecord> {
  const prompt = `You are ClariVisit's Senior Clinical Intelligence and Patient Communication specialist.
Your role is to examine the provided After-Visit Summary (AVS) / discharge / clinic documents (photos or PDF pages) and extract structured medical data into an empowering, 100% patient-friendly JSON document.

CRITICAL INSTRUCTIONS:
1. Transcribe actual patient, clinic, vitals, issues, lab orders, instructions, and preventive care data accurately.
2. NO PLACEHOLDER OR FAKE VALUES. If a vital is not present, mark it as null.
3. REASSURANCE & HEALTH LITERACY:
   - For any routine screening codes (like "Encounter for screening involving social determinants of health", "Screening for endocrine, nutritional, metabolic and immunity disorder", or "Pre-diabetes" listed under routine annual check), clearly explain that this is routine preventive screening for insurance/ordering purposes, NOT an alarmist diagnosis.
   - Blood pressure: evaluate the reading (e.g. 118/76 is "optimal", not dangerously low unless symptomatic).
   - Oxygen saturation: standard is 95-100%. 94% is borderline-normal, often due to cold fingers or shallow breathing.
   - BMI: compute or transcribe accurately and describe the healthy range.
4. ACTIONABLE NUTRITION & EXERCISE:
   - Convert the doctor's dietary advice (e.g. "reduce simple carbohydrates like white rice, white bread, white pasta; eat leafy greens; avoid fried foods") into a concrete Meal Swap Matrix and a healthy grocery list.
   - Break down exercise directives (e.g. 150 minutes moderate intensity) into a weekly 5-day workout plan.
5. PREVENTIVE CARE GAP DETECTION:
   - Check vaccines and screenings. If any vaccine is listed as "Never done" (e.g., Varicella or Meningococcal B), flag it as an actionable gap and generate a pre-drafted message the patient can send through their patient portal.
6. LAB TEST PREPARATION:
   - For all ordered labs (e.g. CBC, CMP, Hemoglobin A1C, Lipid Panel, Urinalysis), explain what they test for in plain English, and explicitly state fasting requirements (e.g. CMP and Lipid Panel usually require 8-12 hours fasting with water only).
7. COMPREHENSIVE LABORATORY RESULTS & BIOMARKER EXTRACTION:
   - If the uploaded document is or contains laboratory test results (e.g., CBC with Auto Differential, Comprehensive Metabolic Panel, Lipid Panel, etc.):
     - Set "isLabReport": true.
     - Populate "labReportMetadata": { "panelTitle": "e.g. CBC WITH AUTO DIFFERENTIAL", "collectionDateTime": "date/time collected", "resultDateTime": "date/time resulted", "reviewedByCareTeam": boolean (false if 'Not yet reviewed by care team'), "specimenType": "e.g. Blood (WHOLE BLOOD)", "resultStatus": "e.g. Final", "labFacility": "Lab name", "orderingProvider": "Provider name" }.
     - Extract EVERY single test row / biomarker into the "biomarkerResults" array:
       - name (e.g., WBC, RBC, Hemoglobin, Hematocrit, MCV, MCH, MCHC, RDW, Platelets, MPV, Nucleated RBCs, Neutrophils %, Lymphocytes %, Monocytes %, Eosinophils %, Basophils %, Immature Granulocytes %, Neutrophils Absolute, Lymphocytes Absolute, Monocytes Absolute, Eosinophils Absolute, Basophils Absolute, Immature Granulocytes Absolute).
       - panel (e.g., "Hematology", "Metabolic", "Lipid", "Renal", "Hepatic", "Endocrine").
       - value (numeric).
       - unit (e.g., K/uL, M/uL, g/dL, %, FL, PG).
       - minRange & maxRange (numeric lower and upper reference bounds).
       - status ("optimal", "normal", "low", "elevated", "high", "critical").
       - flagText (e.g., "Normal", "Low", "High", "Critical").
       - plainMeaning: Clear 1-2 sentence patient-friendly explanation of what this specific cell line or biomarker does in the body.
       - whyItMatters: Why this biomarker is clinically relevant and reassuring context.
       - lifestyleTips: Practical, evidence-based lifestyle or nutritional habits that support this metric.
       - doctorDiscussPoint: Reassuring question the patient can ask their care team at their next consultation.
     - CLINICAL REASSURANCE ON OUT-OF-RANGE OR FLAGGED LAB VALUES:
       - If a value is flagged "Low" or "High" (such as a mildly low WBC or mild neutropenia or 0.6% immature granulocytes), provide calm, non-alarmist perspective: explain that mild variations often reflect normal biological fluctuations, mild transient viral recovery, athletic conditioning, or benign constitutional baselines, and advise discussing with their provider rather than panicking.

Return STRICTLY a JSON object matching this TypeScript structure (no backticks, no markdown prefix, just pure JSON):

{
  "id": "uuid-or-unique-string",
  "createdAt": "ISO date string",
  "patientName": "Full name or Anonymous Patient",
  "patientDob": "DoB if found",
  "visitDate": "Date of visit or today's date",
  "providerName": "Provider name",
  "providerTitle": "e.g., FNP-C, MD, DO",
  "facilityName": "e.g., Evergreen Health Family Clinic",
  "facilityAddress": "Address if visible",
  "contactPhone": "Phone number if visible",
  "summaryExecutive": "A 2-3 sentence executive overview summarizing the visit in encouraging, plain language.",
  "vitals": {
    "bloodPressure": {
      "raw": "e.g. 118/76",
      "systolic": 118,
      "diastolic": 76,
      "status": "optimal",
      "plainExplanation": "Clear explanation of what this BP reading means."
    },
    "heartRate": {
      "raw": "72 bpm",
      "value": 72,
      "unit": "bpm",
      "status": "normal",
      "label": "Heart Rate",
      "plainExplanation": "Normal resting heart rate range is 60-100 bpm.",
      "normalRangeText": "60 - 100 bpm"
    },
    "oxygenSaturation": {
      "raw": "98%",
      "value": 98,
      "unit": "%",
      "status": "normal",
      "label": "Oxygen Saturation (SpO2)",
      "plainExplanation": "Healthy blood oxygen levels within the standard 95-100% range.",
      "normalRangeText": "95 - 100%"
    },
    "bmi": {
      "raw": "22.4",
      "value": 22.4,
      "unit": "kg/m²",
      "status": "optimal",
      "label": "Body Mass Index",
      "plainExplanation": "Within the healthy normal range (18.5 - 24.9).",
      "normalRangeText": "18.5 - 24.9"
    },
    "weight": {
      "raw": "160 lbs",
      "value": "160",
      "unit": "lbs",
      "status": "normal",
      "label": "Weight",
      "plainExplanation": "Weight recorded at appointment.",
      "normalRangeText": "Healthy weight for height"
    },
    "height": {
      "raw": "5' 10\"",
      "value": "5' 10\"",
      "unit": "ft/in",
      "status": "normal",
      "label": "Height",
      "plainExplanation": "Recorded height.",
      "normalRangeText": "--"
    },
    "temperature": {
      "raw": "98.6 °F",
      "value": 98.6,
      "unit": "°F",
      "status": "normal",
      "label": "Temperature (Oral)",
      "plainExplanation": "Normal body temperature (97.0 - 99.0 °F).",
      "normalRangeText": "97.0 - 99.0 °F"
    },
    "respirationRate": {
      "raw": "14",
      "value": 14,
      "unit": "breaths/min",
      "status": "normal",
      "label": "Respiration Rate",
      "plainExplanation": "Normal breathing rate at rest (12 - 20 breaths/min).",
      "normalRangeText": "12 - 20 breaths/min"
    }
  },
  "clinicalIssues": [
    {
      "id": "iss-1",
      "codeOrTitle": "Preventive Health Screening",
      "isRoutineScreening": true,
      "plainEnglishSummary": "A standard wellness evaluation for metabolic and cardiovascular health.",
      "whyItWasDiscussed": "Part of an annual wellness exam to establish your baseline health.",
      "reassuranceNote": "This is a routine preventive screening code to authorize lab testing, not an active disease diagnosis."
    }
  ],
  "prescriptions": [
    {
      "id": "rx-1",
      "medicationName": "Medication or Supplement Name",
      "dosage": "e.g. 10 mg or 2,000 IU",
      "frequency": "e.g. Once daily",
      "timingSlots": ["morning"],
      "foodRequirement": "with_food",
      "clinicalPurpose": "Plain-English clinical purpose for this medication.",
      "instructions": "Specific administration instructions from the doctor or paperwork.",
      "sideEffectsToWatch": ["Mild side effect 1", "Symptom to report 2"],
      "pharmacyQuestions": ["Key question to confirm with the pharmacist"],
      "refillsRemaining": 2,
      "prescribingDoctor": "Provider Name",
      "status": "active"
    }
  ],
  "labOrders": [
    {
      "id": "lab-1",
      "testName": "Comprehensive Metabolic Panel (CMP)",
      "category": "Metabolic",
      "dateDue": "Complete within 14 days",
      "fastingRequired": true,
      "fastingHours": 10,
      "plainPurpose": "Assesses liver function, kidney function, fluid/electrolyte balance, and blood glucose.",
      "whatItDetects": "Early signs of kidney/liver stress or metabolic imbalances.",
      "prepInstructions": "Fast for 8 to 12 hours prior to your blood draw. You may drink plain water.",
      "questionsForDoctor": ["Are my liver enzymes and electrolyte levels in healthy balance?"]
    }
  ],
  "lifestyle": {
    "doctorDirectivesRaw": "Physical activity of minimum 150 minutes moderate intensity per week...",
    "weeklyExerciseTargetMinutes": 150,
    "hydrationTargetOz": 80,
    "carbStrategy": "Reduce excessive simple carbs and swap for complex whole grains and fiber.",
    "leafyGreensAdvice": "Integrate spinach, kale, and dark greens into daily lunch or dinner.",
    "mealSwaps": [
      {
        "avoid": "White pasta & white rice",
        "alternative": "Quinoa, brown rice, or chickpea pasta",
        "benefit": "Prevents rapid glucose spikes and provides sustained energy with fiber."
      }
    ],
    "weeklyWorkoutPlan": [
      {
        "dayTitle": "Monday - Brisk Cardio",
        "durationMinutes": 30,
        "activityType": "Cardiovascular",
        "description": "30-minute brisk walk, light jog, or cycling at moderate intensity."
      }
    ],
    "groceryList": {
      "produce": ["Baby spinach", "Broccoli", "Avocado", "Berries"],
      "proteins": ["Skinless chicken breast", "Wild salmon", "Eggs", "Tofu"],
      "wholeGrains": ["Quinoa", "Rolled oats", "Brown jasmine rice"],
      "beverages": ["Filtered water", "Unsweetened green tea"]
    }
  },
  "preventiveCare": [
    {
      "id": "prev-1",
      "vaccineOrScreening": "Varicella (Chicken Pox) vaccine",
      "status": "never_done",
      "dateDueOrGiven": null,
      "isActionableGap": true,
      "guidanceText": "Recorded as 'Never done' in clinic records. If you had chickenpox as a child or received it elsewhere, your clinic records may need updating.",
      "portalMessageDraft": "Hi Care Team, I noticed my after-visit summary shows Varicella vaccine as 'Never done'. Could you let me know if I should schedule this or if we should check my immunity titers?"
    }
  ],
  "followUps": [
    {
      "id": "fu-1",
      "title": "Annual Physical Exam",
      "dateTime": "Wednesday, November 10, 2027 at 10:00 AM",
      "provider": "Dr. Sarah Jenkins, MD",
      "facility": "Evergreen Community Health",
      "address": "100 Health Sciences Blvd, Suite 300, Seattle WA 98101",
      "phone": "555-019-2834",
      "instructions": "Arrive 15 minutes early. Bring photo ID and insurance card."
    }
  ],
  "isLabReport": false,
  "labReportMetadata": {
    "panelTitle": "e.g. CBC WITH AUTO DIFFERENTIAL",
    "collectionDateTime": "Oct 27, 2026 1:14 PM",
    "resultDateTime": "Oct 27, 2026 7:03 PM",
    "reviewedByCareTeam": false,
    "specimenType": "Blood (WHOLE BLOOD)",
    "resultStatus": "Final",
    "labFacility": "Outpatient Laboratory",
    "orderingProvider": "Provider Name"
  },
  "biomarkerResults": [
    {
      "id": "bio-1",
      "name": "WBC",
      "panel": "Hematology",
      "value": 3.6,
      "unit": "K/uL",
      "minRange": 4.6,
      "maxRange": 13.2,
      "status": "low",
      "flagText": "Low",
      "plainMeaning": "White blood cells are the frontline defense cells of the immune system.",
      "whyItMatters": "A mild low reading is common and often benign (transient viral recovery, athletic training, or constitutional baseline).",
      "lifestyleTips": "Ensure restorative 7-9 hours of sleep and regular nutrition.",
      "doctorDiscussPoint": "Is my WBC reading a normal personal baseline for me given I am feeling well?"
    }
  ]
}`;

  const imageParts = files.map((f) => ({
    inlineData: {
      mimeType: f.mimeType,
      data: f.base64Data,
    },
  }));

  try {
    const response = await generateWithFallback({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }, ...imageParts],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const cleanedText = extractJsonBlock(responseText);
    const parsed: ParsedVisitRecord = JSON.parse(cleanedText);

    if (!parsed.id) {
      parsed.id = "visit_" + Date.now();
    }
    if (!parsed.createdAt) {
      parsed.createdAt = new Date().toISOString();
    }
    if (parsed.lifestyle && (!parsed.lifestyle.recipes || parsed.lifestyle.recipes.length === 0)) {
      parsed.lifestyle.recipes = DEFAULT_CLINICAL_RECIPES;
    }

    if (Array.isArray(parsed.biomarkerResults) && parsed.biomarkerResults.length > 0) {
      parsed.isLabReport = true;
      parsed.biomarkerResults = parsed.biomarkerResults.map((b, idx) => ({
        ...b,
        id: b.id || `bio_${Date.now()}_${idx}`,
        dateRecorded: b.dateRecorded || parsed.visitDate || "Recent",
        labSource: b.labSource || parsed.labReportMetadata?.labFacility || parsed.facilityName || "Outpatient Clinical Lab",
      }));
    }

    return parsed;
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Gemini visit parsing error:", error);
    throw new Error(`Failed to analyze medical summary: ${error.message || "Unknown error"}`);
  }
}

export async function askVisitQuestion(
  visitContext: ParsedVisitRecord,
  userQuestion: string,
  chatHistory: Array<{ role: "user" | "model"; text: string }> = []
): Promise<string> {
  const systemInstruction = `You are ClariVisit's compassionate, accurate patient health companion.
You are helping a patient understand their specific clinic After-Visit Summary.
Here is the extracted clinical data for this visit:
${JSON.stringify(visitContext, null, 2)}

GUIDELINES:
- Provide clear, reassuring, patient-centric explanations at an 8th-grade reading level.
- Highlight lifestyle tips, food ideas, exercise guidelines, or test preparation directly relevant to their doctor's advice.
- When explaining vitals, put them in healthy perspective.
- Always include a gentle reminder that you are an AI assistant providing health literacy support, not replacing their personal clinician.
- If asked about symptoms or medication changes, advise them to message their care team through their patient portal or call their clinic at ${visitContext.contactPhone || "their doctor's office"}.`;

  const messages = chatHistory.map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));

  messages.push({
    role: "user",
    parts: [{ text: userQuestion }],
  });

  try {
    const response = await generateWithFallback({
      contents: messages,
      config: {
        systemInstruction,
      },
    });

    return response.text || "I apologize, I could not generate an answer at this time.";
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Gemini chat error:", error);
    return `I encountered an error answering your question: ${error.message || "Please try again."}`;
  }
}
