"use client";

import { X, FileText, FileImage, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadedFile, formatFileSize, getFileIcon } from "@/lib/upload";
import { cn } from "@/lib/utils";

interface FilePreviewProps {
  uploadedFile: UploadedFile;
  onRemove: () => void;
  disabled?: boolean;
}

export function FilePreview({ uploadedFile, onRemove, disabled }: FilePreviewProps) {
  const { file, preview } = uploadedFile;
  const type = getFileIcon(file);

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
      {/* Thumbnail or Icon */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Transcript preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* File info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatFileSize(file.size)}</span>
          <span>·</span>
          <span className="uppercase">{type === "pdf" ? "PDF" : file.type.split("/")[1]}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-1 text-xs text-green-600">
          <CheckCircle className="h-3 w-3" />
          <span>Ready to analyze</span>
        </div>
      </div>

      {/* Remove */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
        onClick={onRemove}
        disabled={disabled}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}