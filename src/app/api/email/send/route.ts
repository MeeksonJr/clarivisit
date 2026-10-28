import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { generateHealthDigestHtml, generateHealthDigestPlainText } from "@/lib/emailTemplate";
import { ParsedVisitRecord } from "@/types/visit";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const apiKey = (process.env.RESEND_API_KEY || "").trim();
    if (!apiKey) {
      return NextResponse.json(
        { error: "Email delivery service is currently not configured on this environment." },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.to || !body.visit) {
      return NextResponse.json(
        { error: "Recipient email and visit record are required." },
        { status: 400 }
      );
    }

    const to = String(body.to).trim();
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const visit = body.visit as ParsedVisitRecord;
    const senderName = body.senderName || visit.patientName || "Alex Morgan";
    const personalNote = body.personalNote || "";
    const sections = body.sections || {};

    const html = generateHealthDigestHtml(visit, {
      senderName,
      personalNote,
      includeVitals: sections.vitals !== false,
      includeLabs: sections.labs !== false,
      includeLifestyle: sections.lifestyle !== false,
      includeRecipes: sections.recipes !== false,
      includePreventive: sections.preventive !== false,
    });

    const text = generateHealthDigestPlainText(visit, {
      senderName,
      personalNote,
    });

    const resend = new Resend(apiKey);

    const fromAddress =
      process.env.RESEND_FROM_EMAIL || "ClariVisit <onboarding@resend.dev>";

    const subject = `ClariVisit Health Roadmap: ${visit.facilityName || "Clinic Visit"} (${visit.visitDate})`;

    const result = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject,
      html,
      text,
    });

    if (result.error) {
      console.error("Resend API error:", result.error);
      return NextResponse.json(
        {
          error:
            result.error.message ||
            "Failed to send email via Resend. Check domain permissions.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      id: result.data?.id,
      recipient: to,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Email send route exception:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred sending your email." },
      { status: 500 }
    );
  }
}
