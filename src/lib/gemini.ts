import { GoogleGenAI } from "@google/genai";
import { ParsedVisitRecord } from "@/types/visit";

const CANDIDATE_MODELS = [
  "gemini-flash-latest",
  "gemini-2.5-flash",
  "gemini-3.8-flash",
  "gemini-pro-latest"
];

async function generateWithFallback(options: {
  contents: unknown[];
  config?: unknown;
}) {
  let lastError: Error | null = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      // @ts-expect-error GoogleGenAI SDK dynamic config
      const res = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });
      return res;
    } catch (err: unknown) {
      lastError = err as Error;
      console.warn(`Model ${model} failed, trying next candidate:`, (err as Error)?.message);
      // Wait 400ms before trying the next candidate
      await new Promise((r) => setTimeout(r, 400));
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
   - Blood pressure: evaluate the reading (e.g. 105/63 is "optimal", not dangerously low unless symptomatic).
   - Oxygen saturation: standard is 95-100%. 94% is borderline-normal, often due to cold fingers or shallow breathing.
   - BMI: compute or transcribe accurately and describe the healthy range.
4. ACTIONABLE NUTRITION & EXERCISE:
   - Convert the doctor's dietary advice (e.g. "reduce simple carbohydrates like white rice, white bread, white pasta; eat leafy greens; avoid fried foods") into a concrete Meal Swap Matrix and a healthy grocery list.
   - Break down exercise directives (e.g. 150 minutes moderate intensity) into a weekly 5-day workout plan.
5. PREVENTIVE CARE GAP DETECTION:
   - Check vaccines and screenings. If any vaccine is listed as "Never done" (e.g., Varicella or Meningococcal B), flag it as an actionable gap and generate a pre-drafted message the patient can send through their patient portal.
6. LAB TEST PREPARATION:
   - For all ordered labs (e.g. CBC, CMP, Hemoglobin A1C, Lipid Panel, Urinalysis), explain what they test for in plain English, and explicitly state fasting requirements (e.g. CMP and Lipid Panel usually require 8-12 hours fasting with water only).

Return STRICTLY a JSON object matching this TypeScript structure (no backticks, no markdown prefix, just pure JSON):

{
  "id": "uuid-or-unique-string",
  "createdAt": "ISO date string",
  "patientName": "Full name or Anonymous Patient",
  "patientDob": "DoB if found",
  "visitDate": "Date of visit or today's date",
  "providerName": "Provider name",
  "providerTitle": "e.g., FNP-C, MD, DO",
  "facilityName": "e.g., Amelia Medical Associates, Bon Secours",
  "facilityAddress": "Address if visible",
  "contactPhone": "Phone number if visible",
  "summaryExecutive": "A 2-3 sentence executive overview summarizing the visit in encouraging, plain language.",
  "vitals": {
    "bloodPressure": {
      "raw": "e.g. 105/63",
      "systolic": 105,
      "diastolic": 63,
      "status": "optimal",
      "plainExplanation": "Clear explanation of what this BP reading means."
    },
    "heartRate": {
      "raw": "85 bpm",
      "value": 85,
      "unit": "bpm",
      "status": "normal",
      "label": "Heart Rate",
      "plainExplanation": "Normal resting heart rate range is 60-100 bpm.",
      "normalRangeText": "60 - 100 bpm"
    },
    "oxygenSaturation": {
      "raw": "94%",
      "value": 94,
      "unit": "%",
      "status": "watch",
      "label": "Oxygen Saturation (SpO2)",
      "plainExplanation": "Slightly on the borderline of the standard 95-100% range. Often caused by cold fingers or shallow breathing.",
      "normalRangeText": "95 - 100%"
    },
    "bmi": {
      "raw": "21.06",
      "value": 21.06,
      "unit": "kg/m²",
      "status": "optimal",
      "label": "Body Mass Index",
      "plainExplanation": "Within the healthy normal range (18.5 - 24.9).",
      "normalRangeText": "18.5 - 24.9"
    },
    "weight": {
      "raw": "169 lb 9.6 oz",
      "value": "169.6",
      "unit": "lbs",
      "status": "normal",
      "label": "Weight",
      "plainExplanation": "Weight recorded at appointment.",
      "normalRangeText": "Healthy weight for height"
    },
    "height": {
      "raw": "6' 3.25\"",
      "value": "6' 3.25\"",
      "unit": "ft/in",
      "status": "normal",
      "label": "Height",
      "plainExplanation": "Recorded height.",
      "normalRangeText": "--"
    },
    "temperature": {
      "raw": "97.9 °F",
      "value": 97.9,
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
      "codeOrTitle": "Pre-diabetes",
      "isRoutineScreening": true,
      "plainEnglishSummary": "A standard check for blood sugar and glucose tolerance.",
      "whyItWasDiscussed": "Part of an annual wellness exam and dietary discussion to establish your baseline health.",
      "reassuranceNote": "This is a routine preventive screening code to authorize lab testing, not an active diabetes diagnosis."
    }
  ],
  "prescriptions": [],
  "labOrders": [
    {
      "id": "lab-1",
      "testName": "Comprehensive Metabolic Panel (CMP)",
      "category": "Metabolic",
      "dateDue": "Complete around 10/27/2026",
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
      "dateTime": "Thursday, October 28, 2027 at 2:00 PM",
      "provider": "Priscila Marquez-Bourque, FNP-C",
      "facility": "Amelia Medical Associates",
      "address": "885 Kempsville Road, Suite 320, NORFOLK VA 23502",
      "phone": "757-955-2828",
      "instructions": "Arrive 15 minutes early. Bring photo ID and insurance card."
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
    const cleanedText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed: ParsedVisitRecord = JSON.parse(cleanedText);

    if (!parsed.id) {
      parsed.id = "visit_" + Date.now();
    }
    if (!parsed.createdAt) {
      parsed.createdAt = new Date().toISOString();
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
