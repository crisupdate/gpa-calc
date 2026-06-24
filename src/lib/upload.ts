export const ACCEPTED_FILE_TYPES = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/heic": [".heic"],
};

export const MAX_FILE_SIZE_MB = 20;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export type UploadStatus =
  | "idle"
  | "uploading"
  | "extracting"
  | "success"
  | "error";

export interface UploadedFile {
  file: File;
  preview: string | null; // object URL for images, null for PDFs
  id: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFile(file: File): ValidationResult {
  const acceptedTypes = Object.keys(ACCEPTED_FILE_TYPES);

  if (!acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type || "unknown"}. Please upload a PDF or image (JPG, PNG, WEBP, HEIC).`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum size is ${MAX_FILE_SIZE_MB} MB.`,
    };
  }

  return { valid: true };
}

export function getFileIcon(file: File): "pdf" | "image" {
  return file.type === "application/pdf" ? "pdf" : "image";
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}