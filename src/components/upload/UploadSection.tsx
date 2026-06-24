"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Dropzone } from "./Dropzone";
import { FilePreview } from "./FilePreview";
import { UploadStatusDisplay } from "./UploadStatus";
import { UploadedFile, UploadStatus } from "@/lib/upload";
import { TranscriptData } from "@/types/transcript";

function saveResults(data: TranscriptData) {
  sessionStorage.setItem("transcriptData", JSON.stringify(data));
}

export function UploadSection() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileAccepted = useCallback((file: UploadedFile) => {
    setUploadedFile(file);
    setStatus("idle");
    setErrorMessage(null);
  }, []);

  const handleRemove = useCallback(() => {
    if (uploadedFile?.preview) URL.revokeObjectURL(uploadedFile.preview);
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

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "Extraction failed.");
      }

      setStatus("success");
      saveResults(result.data);

      await new Promise((r) => setTimeout(r, 1200));
      router.push("/results");

    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    }
  };

  const isProcessing = status === "uploading" || status === "extracting";

  return (
    <div className="space-y-4">
      {!uploadedFile && (
        <Dropzone onFileAccepted={handleFileAccepted} disabled={isProcessing} />
      )}

      {uploadedFile && (
        <FilePreview
          uploadedFile={uploadedFile}
          onRemove={handleRemove}
          disabled={isProcessing}
        />
      )}

      <UploadStatusDisplay status={status} errorMessage={errorMessage ?? undefined} />

      {uploadedFile && status !== "success" && (
        <div className="flex gap-3">
          <Button
            className="flex-1 gap-2"
            size="lg"
            onClick={handleAnalyze}
            disabled={isProcessing}
          >
            {isProcessing ? "Analyzing..." : (
              <>Analyze Transcript <ArrowRight className="h-4 w-4" /></>
            )}
          </Button>
          {!isProcessing && (
            <Button variant="outline" size="lg" onClick={handleRemove}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {uploadedFile && status === "idle" && (
        <p className="text-center text-xs text-muted-foreground">
          Your file is processed in memory only and never stored.
        </p>
      )}
    </div>
  );
}