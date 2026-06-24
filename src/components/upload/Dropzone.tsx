"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileImage, FileText, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  UploadedFile,
  validateFile,
  formatFileSize,
  getFileIcon,
} from "@/lib/upload";

interface DropzoneProps {
  onFileAccepted: (uploadedFile: UploadedFile) => void;
  disabled?: boolean;
}

export function Dropzone({ onFileAccepted, disabled }: DropzoneProps) {
  const [validationError, setValidationError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setValidationError(null);
      const file = acceptedFiles[0];
      if (!file) return;

      const result = validateFile(file);
      if (!result.valid) {
        setValidationError(result.error ?? "Invalid file.");
        return;
      }

      const preview = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;

      onFileAccepted({
        file,
        preview,
        id: crypto.randomUUID(),
      });
    },
    [onFileAccepted]
  );

  const onDropRejected = useCallback(() => {
    setValidationError(
      `Please upload a PDF or image file under ${MAX_FILE_SIZE_MB} MB.`
    );
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      onDropRejected,
      accept: ACCEPTED_FILE_TYPES,
      maxSize: MAX_FILE_SIZE_BYTES,
      multiple: false,
      disabled,
    });

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-all duration-200",
          isDragActive && !isDragReject
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50",
          isDragReject && "border-destructive bg-destructive/5",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />

        {/* Icon */}
        <div
          className={cn(
            "mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background shadow-sm transition-colors",
            isDragActive && !isDragReject && "border-primary bg-primary/10"
          )}
        >
          <Upload
            className={cn(
              "h-7 w-7 transition-colors",
              isDragActive && !isDragReject
                ? "text-primary"
                : "text-muted-foreground"
            )}
          />
        </div>

        {/* Text */}
        {isDragActive && !isDragReject ? (
          <p className="text-base font-medium text-primary">
            Drop your transcript here
          </p>
        ) : isDragReject ? (
          <p className="text-base font-medium text-destructive">
            This file type is not supported
          </p>
        ) : (
          <>
            <p className="text-base font-medium text-foreground">
              Drag & drop your transcript here
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              or{" "}
              <span className="text-primary underline underline-offset-2">
                click to browse
              </span>
            </p>
          </>
        )}

        {/* Supported formats */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {["PDF", "JPG", "PNG", "WEBP", "HEIC"].map((fmt) => (
            <span
              key={fmt}
              className="rounded-md border border-border bg-background px-2 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {fmt}
            </span>
          ))}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Max {MAX_FILE_SIZE_MB} MB · Multi-page PDFs supported
        </p>
      </div>

      {/* Validation error */}
      {validationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}