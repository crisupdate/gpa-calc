"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Dropzone } from "./Dropzone";
import { FilePreview } from "./FilePreview";
import { UploadStatusDisplay } from "./UploadStatus";
import { UploadedFile, UploadStatus } from "@/lib/upload";

export function UploadSection() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileAccepted = useCallback((file: UploadedFile) => {
    setUploadedFile(file);
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  const handleRemove = useCallback(() => {
    if (uploadedFile?.preview) {
      URL.revokeObjectURL(uploadedFile.preview);
    }
    setUploadedFile(null);
    setStatus("idle");
    setErrorMessage(null);
  }, [uploadedFile]);

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    try {
      setErrorMessage(null);
      setStatus("uploading");

      const formData = new FormData();
      formData.append("file", uploadedFile.file);

      setStatus("extracting");

      // Phase 4: wire up the real API call here
      // const response = await fetch("/api/analyze", { method: "POST", body: formData });
      // const result = await response.json();

      // Placeholder — remove in Phase 4
      await new Promise((r) => setTimeout(r, 3000));
      setStatus("success");

    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
    }
  };

  const isProcessing = status === "uploading" || status === "extracting";

  return (
    <div className="space-y-4">
      {/* Dropzone — hide when file is selected */}
      {!uploadedFile && (
        <Dropzone onFileAccepted={handleFileAccepted} disabled={isProcessing} />
      )}

      {/* File preview */}
      {uploadedFile && (
        <FilePreview
          uploadedFile={uploadedFile}
          onRemove={handleRemove}
          disabled={isProcessing}
        />
      )}

      {/* Status */}
      <UploadStatusDisplay status={status} errorMessage={errorMessage ?? undefined} />

      {/* Actions */}
      {uploadedFile && status !== "success" && (
        <div className="flex gap-3">
          <Button
            className="flex-1 gap-2"
            size="lg"
            onClick={handleAnalyze}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>Analyzing...</>
            ) : (
              <>
                Analyze Transcript
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          {!isProcessing && (
            <Button variant="outline" size="lg" onClick={handleRemove}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Privacy note */}
      {uploadedFile && status === "idle" && (
        <p className="text-center text-xs text-muted-foreground">
          Your file is processed in memory only and never stored.
        </p>
      )}
    </div>
  );
}