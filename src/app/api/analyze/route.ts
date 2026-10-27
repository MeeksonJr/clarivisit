import { NextRequest, NextResponse } from "next/server";
import { parseVisitSummaryDocuments } from "@/lib/gemini";

// Next.js Route segment configuration
export const maxDuration = 60; // Allow sufficient time for multimodal AI processing

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "Please provide at least one document image or PDF." },
        { status: 400 }
      );
    }

    const processedFiles: Array<{ base64Data: string; mimeType: string }> = [];

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = buffer.toString("base64");
      const mimeType = file.type || "image/jpeg";

      processedFiles.push({
        base64Data,
        mimeType,
      });
    }

    const visitRecord = await parseVisitSummaryDocuments(processedFiles);

    return NextResponse.json({
      success: true,
      visit: visitRecord,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Analysis API error:", err);
    return NextResponse.json(
      {
        error: err.message || "Failed to analyze document",
        details: process.env.NODE_ENV === "development" ? String(err) : undefined,
      },
      { status: 500 }
    );
  }
}
