import { NextRequest, NextResponse } from "next/server";
import { askVisitQuestion } from "@/lib/gemini";
import { ParsedVisitRecord } from "@/types/visit";

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visit, question, history } = body as {
      visit: ParsedVisitRecord;
      question: string;
      history?: Array<{ role: "user" | "model"; text: string }>;
    };

    if (!visit || !question) {
      return NextResponse.json(
        { error: "Visit context and question are required." },
        { status: 400 }
      );
    }

    const answer = await askVisitQuestion(visit, question, history || []);

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process question" },
      { status: 500 }
    );
  }
}
