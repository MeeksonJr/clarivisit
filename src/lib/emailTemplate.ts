import { ParsedVisitRecord } from "@/types/visit";

interface EmailDigestOptions {
  recipientName?: string;
  senderName?: string;
  personalNote?: string;
  includeVitals?: boolean;
  includeLabs?: boolean;
  includeLifestyle?: boolean;
  includeRecipes?: boolean;
  includePreventive?: boolean;
}

export function generateHealthDigestHtml(
  visit: ParsedVisitRecord,
  options: EmailDigestOptions = {}
): string {
  const {
    recipientName = "Patient / Caregiver",
    senderName = visit.patientName || "Alex Morgan",
    personalNote = "",
    includeVitals = true,
    includeLabs = true,
    includeLifestyle = true,
    includeRecipes = true,
    includePreventive = true,
  } = options;

  const bp = visit.vitals?.bloodPressure;
  const pulse = visit.vitals?.heartRate;
  const spo2 = visit.vitals?.oxygenSaturation;
  const bmi = visit.vitals?.bmi;
  const labs = visit.labOrders || [];
  const swaps = visit.lifestyle?.mealSwaps || [];
  const grocery = visit.lifestyle?.groceryList;
  const recipes = visit.lifestyle?.recipes || [];
  const preventiveGaps = visit.preventiveCare?.filter((p) => p.isActionableGap) || [];

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ClariVisit Health Roadmap</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container (max 600px) -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background: linear-gradient(135deg, #0284c7 0%, #0d9488 100%); padding: 32px 28px; text-align: left; color: #ffffff;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; background-color: rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 999px; display: inline-block;">
                      After-Visit Care Digest
                    </span>
                    <h1 style="margin: 12px 0 4px 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px;">
                      ClariVisit Health Roadmap
                    </h1>
                    <p style="margin: 0; font-size: 13px; opacity: 0.95;">
                      Summary for ${escapeHtml(senderName)} • Visit from ${escapeHtml(visit.visitDate)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 28px;">

              ${
                personalNote
                  ? `
              <!-- Personal Note Callout -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #166534; margin-bottom: 4px;">
                      Personal Note from ${escapeHtml(senderName)}
                    </div>
                    <div style="font-size: 13px; color: #14532d; font-style: italic;">
                      "${escapeHtml(personalNote)}"
                    </div>
                  </td>
                </tr>
              </table>
              `
                  : ""
              }

              <!-- Clinic & Provider Metadata -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <div style="font-size: 14px; font-weight: bold; color: #0f172a;">
                      ${escapeHtml(visit.facilityName || "Clinic Visit")}
                    </div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
                      Provider: <strong>${escapeHtml(visit.providerName)}</strong> ${visit.providerTitle ? `(${escapeHtml(visit.providerTitle)})` : ""}
                    </div>
                    ${
                      visit.contactPhone
                        ? `<div style="font-size: 12px; color: #0284c7; margin-top: 4px;">Phone: ${escapeHtml(visit.contactPhone)}</div>`
                        : ""
                    }
                  </td>
                </tr>
              </table>

              <!-- Executive Summary -->
              <div style="margin-bottom: 24px;">
                <h2 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                  Executive Summary
                </h2>
                <div style="font-size: 13px; line-height: 1.6; color: #334155; background-color: #f1f5f9; padding: 16px; border-radius: 12px; border-left: 4px solid #0284c7;">
                  ${escapeHtml(visit.summaryExecutive || "Visit notes extracted and processed into your personal health vault.")}
                </div>
              </div>

              ${
                includeVitals && bp
                  ? `
              <!-- Vitals Spectrum -->
              <div style="margin-bottom: 28px;">
                <h2 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                  Recorded Vitals
                </h2>
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <!-- Blood Pressure -->
                    <td width="48%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; vertical-align: top;">
                      <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Blood Pressure</div>
                      <div style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 4px 0;">
                        ${escapeHtml(bp.raw || "--")} <span style="font-size: 11px; font-weight: normal; color: #94a3b8;">mmHg</span>
                      </div>
                      <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase;">
                        Status: ${escapeHtml(bp.status || "OPTIMAL")}
                      </div>
                    </td>
                    <td width="4%">&nbsp;</td>
                    <!-- Resting Pulse -->
                    <td width="48%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; vertical-align: top;">
                      <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Heart Rate</div>
                      <div style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 4px 0;">
                        ${escapeHtml(pulse?.raw || "--")}
                      </div>
                      <div style="font-size: 10px; font-weight: 800; color: #0284c7; text-transform: uppercase;">
                        Status: ${escapeHtml(pulse?.status || "NORMAL")}
                      </div>
                    </td>
                  </tr>
                  <tr><td colspan="3" style="height: 10px;"></td></tr>
                  <tr>
                    <!-- Oxygen SpO2 -->
                    <td width="48%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; vertical-align: top;">
                      <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">SpO2 Oxygen</div>
                      <div style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 4px 0;">
                        ${escapeHtml(spo2?.raw || "--")}
                      </div>
                      <div style="font-size: 10px; font-weight: 800; color: #d97706; text-transform: uppercase;">
                        ${escapeHtml(spo2?.status || "BORDERLINE")}
                      </div>
                    </td>
                    <td width="4%">&nbsp;</td>
                    <!-- BMI -->
                    <td width="48%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; vertical-align: top;">
                      <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">BMI Index</div>
                      <div style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 4px 0;">
                        ${escapeHtml(bmi?.raw || "--")}
                      </div>
                      <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase;">
                        HEALTHY RANGE
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
              `
                  : ""
              }

              ${
                includeLabs && labs.length > 0
                  ? `
              <!-- Lab Fasting & Prep Guidelines -->
              <div style="margin-bottom: 28px;">
                <h2 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                  Ordered Diagnostic Labs & Fasting Prep
                </h2>
                <!-- Fasting Notice Banner -->
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; margin-bottom: 12px;">
                  <tr>
                    <td style="padding: 12px 14px;">
                      <strong style="color: #b45309; font-size: 12px;">⚠️ Fasting Notice:</strong>
                      <span style="color: #92400e; font-size: 12px; margin-left: 4px;">
                        CMP and Lipid tests require 8 to 12 hours of overnight fasting (water only) to prevent artificial glucose & triglyceride spikes.
                      </span>
                    </td>
                  </tr>
                </table>

                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
                  ${labs
                    .map(
                      (lab, idx) => `
                  <tr style="background-color: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0;">
                      <div style="font-size: 13px; font-weight: bold; color: #0f172a;">
                        ${escapeHtml(lab.testName)}
                      </div>
                      <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                        ${escapeHtml(lab.plainPurpose)}
                      </div>
                      <div style="font-size: 11px; color: ${lab.fastingRequired ? "#b45309" : "#059669"}; font-weight: 700; margin-top: 4px;">
                        ${lab.fastingRequired ? "⏳ Overnight Fasting Required (Water Only)" : "✅ No Fasting Needed"}
                      </div>
                    </td>
                  </tr>
                  `
                    )
                    .join("")}
                </table>
              </div>
              `
                  : ""
              }

              ${
                includeLifestyle && visit.lifestyle
                  ? `
              <!-- Lifestyle & Dietary Action Plan -->
              <div style="margin-bottom: 28px;">
                <h2 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                  Physician Dietary & Exercise Regimen
                </h2>
                
                <div style="background-color: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 12px; padding: 14px; margin-bottom: 14px; font-size: 12px; color: #134e4a; font-style: italic;">
                  "${escapeHtml(visit.lifestyle.doctorDirectivesRaw || "Physical activity of minimum 150 minutes moderate intensity per week recommended. Reduce excessive simple carbohydrate intake...")}"
                </div>

                ${
                  swaps.length > 0
                    ? `
                <div style="font-size: 12px; font-weight: bold; color: #0f172a; margin-bottom: 6px;">
                  Doctor-Prescribed Food Swaps:
                </div>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 14px;">
                  ${swaps
                    .map(
                      (s) => `
                  <tr>
                    <td style="padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 12px;">
                      <span style="text-decoration: line-through; color: #94a3b8;">${escapeHtml(s.avoid)}</span>
                      <strong style="color: #0d9488; margin-left: 8px;">➔ ${escapeHtml(s.alternative)}</strong>
                      <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${escapeHtml(s.benefit)}</div>
                    </td>
                  </tr>
                  `
                    )
                    .join("")}
                </table>
                `
                    : ""
                }

                ${
                  grocery && (grocery.produce?.length || grocery.proteins?.length || grocery.wholeGrains?.length)
                    ? `
                <div style="font-size: 12px; font-weight: bold; color: #0f172a; margin-bottom: 6px;">
                  Recommended Grocery Items:
                </div>
                <div style="font-size: 12px; color: #475569; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px;">
                  <strong>Produce:</strong> ${escapeHtml(grocery.produce?.join(", ") || "Spinach, Kale, Broccoli, Avocado")}<br>
                  <strong>Proteins:</strong> ${escapeHtml(grocery.proteins?.join(", ") || "Chicken breast, Salmon, Eggs, Tofu")}<br>
                  <strong>Grains:</strong> ${escapeHtml(grocery.wholeGrains?.join(", ") || "Quinoa, Rolled oats, Chickpea pasta")}
                </div>
                `
                    : ""
                }
              </div>
              `
                  : ""
              }

              ${
                includeRecipes && recipes.length > 0
                  ? `
              <!-- Chef-Crafted Recipes -->
              <div style="margin-bottom: 28px;">
                <h2 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                  Chef-Crafted Doctor Compliant Meals
                </h2>
                ${recipes
                  .slice(0, 2)
                  .map(
                    (rec) => `
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; margin-bottom: 12px;">
                  <tr>
                    <td>
                      <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0d9488; letter-spacing: 0.5px;">
                        ${escapeHtml(rec.mealType)} • ${rec.prepTimeMinutes + rec.cookTimeMinutes} Mins • ${rec.calories} kcal
                      </div>
                      <div style="font-size: 14px; font-weight: bold; color: #0f172a; margin: 4px 0;">
                        ${escapeHtml(rec.title)}
                      </div>
                      <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
                        ${escapeHtml(rec.description)}
                      </div>
                      <div style="font-size: 11px; color: #0f766e; background-color: #f0fdfa; padding: 8px; border-radius: 8px;">
                        <strong>Clinician Match:</strong> ${escapeHtml(rec.clinicianRationale)}
                      </div>
                    </td>
                  </tr>
                </table>
                `
                  )
                  .join("")}
              </div>
              `
                  : ""
              }

              ${
                includePreventive && preventiveGaps.length > 0
                  ? `
              <!-- Preventive Care & Vaccine Action -->
              <div style="margin-bottom: 24px;">
                <h2 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                  Missing Vaccination Audit
                </h2>
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; margin-bottom: 12px;">
                  <tr>
                    <td style="padding: 14px;">
                      ${preventiveGaps
                        .map(
                          (gap) => `
                      <div style="margin-bottom: 10px;">
                        <strong style="color: #991b1b; font-size: 13px;">• ${escapeHtml(gap.vaccineOrScreening)}</strong>
                        <div style="font-size: 11px; color: #7f1d1d; margin-top: 2px;">${escapeHtml(gap.guidanceText)}</div>
                        ${
                          gap.portalMessageDraft
                            ? `<div style="font-size: 11px; background-color: #ffffff; border: 1px solid #fecaca; border-radius: 6px; padding: 6px 10px; margin-top: 4px; color: #374151;">
                                <strong>Message to Doctor:</strong> "${escapeHtml(gap.portalMessageDraft)}"
                              </div>`
                            : ""
                        }
                      </div>
                      `
                        )
                        .join("")}
                    </td>
                  </tr>
                </table>
              </div>
              `
                  : ""
              }

              <!-- View in App Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 28px; margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a href="https://clarivisit.vercel.app/dashboard/visits/${escapeHtml(visit.id)}" style="display: inline-block; background-color: #0284c7; color: #ffffff; font-size: 13px; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 12px;">
                      Open Interactive Visit in ClariVisit →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px 28px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b; line-height: 1.5;">
                <strong>Medical Notice:</strong> ClariVisit is an educational health literacy companion. It provides clinical document translation and lifestyle support based on your provider's discharge summary. It does not replace medical advice or diagnosis. For urgent health symptoms, contact your clinic or call 911.
              </p>
              <p style="margin: 0; font-size: 10px; color: #94a3b8;">
                Sent via ClariVisit • Zero-PII Encrypted Health Vault
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function generateHealthDigestPlainText(
  visit: ParsedVisitRecord,
  options: EmailDigestOptions = {}
): string {
  const { senderName = "Alex Morgan", personalNote = "" } = options;
  const bp = visit.vitals?.bloodPressure;
  const pulse = visit.vitals?.heartRate;

  let body = `CLARIVISIT HEALTH ROADMAP\n`;
  body += `Visit Summary for ${senderName} • Date: ${visit.visitDate}\n`;
  body += `Facility: ${visit.facilityName} (Provider: ${visit.providerName})\n\n`;

  if (personalNote) {
    body += `NOTE FROM ${senderName.toUpperCase()}:\n"${personalNote}"\n\n`;
  }

  body += `EXECUTIVE SUMMARY:\n${visit.summaryExecutive}\n\n`;

  if (bp) {
    body += `RECORDED VITALS:\n`;
    body += `• Blood Pressure: ${bp.raw} (${bp.status})\n`;
    body += `• Heart Rate: ${pulse?.raw || "--"}\n`;
    body += `• BMI: ${visit.vitals?.bmi?.raw || "--"}\n\n`;
  }

  if (visit.labOrders && visit.labOrders.length > 0) {
    body += `ORDERED LABS & FASTING PREPARATION:\n`;
    visit.labOrders.forEach((l) => {
      body += `• ${l.testName}: ${l.fastingRequired ? "FASTING REQUIRED (8-12h water only)" : "No fasting needed"}\n`;
    });
    body += `\n`;
  }

  if (visit.lifestyle) {
    body += `DIETARY & EXERCISE INSTRUCTIONS:\n`;
    body += `"${visit.lifestyle.doctorDirectivesRaw}"\n`;
  }

  body += `\nOpen interactive record: https://clarivisit.vercel.app/dashboard/visits/${visit.id}\n`;
  body += `\n---\nClariVisit • Patient AI Companion`;

  return body;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
