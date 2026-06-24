import { NextRequest, NextResponse } from "next/server";
import { anthropic } from "@/lib/claude";
import { TRANSCRIPT_EXTRACTION_PROMPT, CONFIDENCE_THRESHOLD } from "@/lib/prompt";
// import { normalizeExtraction } from "@/lib/normalizer";
import { parseTranscript } from "@/lib/parser";
import { fileToClaudeDocument } from "@/lib/fileConverter";
import { validateFile } from "@/lib/upload";

export const maxDuration = 60; // seconds

export async function POST(req: NextRequest) {
  try {
    // ── 1. Parse the form data ──────────────────────────────────────
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No file provided." },
        { status: 400 }
      );
    }

    // ── 2. Validate the file ────────────────────────────────────────
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // ── 3. Convert to Claude format ─────────────────────────────────
    const document = await fileToClaudeDocument(file);

    // ── 4. Call Claude ──────────────────────────────────────────────
    const contentBlock = document.type === "document"
      ? {
          type: "document" as const,
          source: {
            type: "base64" as const,
            media_type: "application/pdf" as const,
            data: (document.source as { data: string }).data,
          },
        }
      : {
          type: "image" as const,
          source: {
            type: "base64" as const,
            media_type: document.source.media_type as
              | "image/jpeg"
              | "image/png"
              | "image/webp"
              | "image/gif",
            data: document.source.data,
          },
        };

    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: [
            contentBlock,
            {
              type: "text",
              text: TRANSCRIPT_EXTRACTION_PROMPT,
            },
          ],
        },
      ],
    });

    // ── 5. Parse Claude's response ──────────────────────────────────
    const rawText = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    // Strip markdown code fences if present
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let rawExtraction: unknown;
    try {
      rawExtraction = JSON.parse(cleaned) as unknown;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error:
            "Could not parse the transcript. Please ensure the document is a clear, readable university transcript.",
        },
        { status: 422 }
      );
    }

    // ── 6. Confidence check ─────────────────────────────────────────
    const confidence = ((rawExtraction as { extractionConfidence?: number }).extractionConfidence as number) ?? 0;
    if (confidence < CONFIDENCE_THRESHOLD) {
      return NextResponse.json(
        {
          success: false,
          error: `The document could not be read with sufficient confidence (${Math.round(
            confidence * 100
          )}%). Please upload a clearer image or the original PDF from your university portal.`,
          confidence,
        },
        { status: 422 }
      );
    }

    // ── 7. Normalize and return ─────────────────────────────────────
    // const transcriptData = normalizeExtraction(
    //   rawExtraction as unknown as Parameters<typeof normalizeExtraction>[0]
    // );

    // return NextResponse.json({
    //   success: true,
    //   data: transcriptData,
    // });

    const { data: transcriptData, warnings } = parseTranscript(
        rawExtraction as Parameters<typeof parseTranscript>[0]
    );

    return NextResponse.json({
        success: true,
        data: transcriptData,
        warnings,   
    });

  } catch (error) {
    console.error("[/api/analyze] Error:", error);

    // Anthropic API errors
    if (error instanceof Error && error.message.includes("Could not process image")) {
      return NextResponse.json(
        {
          success: false,
          error: "The image could not be processed. Please try a clearer photo or upload as PDF.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}