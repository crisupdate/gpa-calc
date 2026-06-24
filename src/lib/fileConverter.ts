export type ClaudeMediaType =
  | "application/pdf"
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/gif";

export interface ClaudeDocument {
  type: "document" | "image";
  source: {
    type: "base64";
    media_type: ClaudeMediaType;
    data: string;
  };
}

export async function fileToClaudeDocument(file: File): Promise<ClaudeDocument> {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  if (file.type === "application/pdf") {
    return {
      type: "document",
      source: {
        type: "base64",
        media_type: "application/pdf",
        data: base64,
      },
    };
  }

  // Images
  const mediaType = (
    file.type === "image/jpg" ? "image/jpeg" : file.type
  ) as ClaudeMediaType;

  return {
    type: "image",
    source: {
      type: "base64",
      media_type: mediaType,
      data: base64,
    },
  };
}