"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2, CheckCircle, XCircle, FileSearch } from "lucide-react";
import { UploadStatus } from "@/lib/upload";
import { cn } from "@/lib/utils";

interface UploadStatusProps {
  status: UploadStatus;
  errorMessage?: string;
}

const STATUS_CONFIG: Record<UploadStatus, { label: string; sublabel: string; icon: ReactNode; color: string }> = {
  idle: {
    label: "",
    sublabel: "",
    icon: null,
    color: "",
  },
  uploading: {
    label: "Uploading transcript...",
    sublabel: "Sending your file securely",
    icon: <Loader2 className="h-5 w-5 animate-spin text-primary" />,
    color: "text-primary",
  },
  extracting: {
    label: "Reading transcript...",
    sublabel: "Claude is extracting courses, grades, and credits",
    icon: <FileSearch className="h-5 w-5 animate-pulse text-primary" />,
    color: "text-primary",
  },
  success: {
    label: "Extraction complete!",
    sublabel: "Redirecting to your results",
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    color: "text-green-600",
  },
  error: {
    label: "Something went wrong",
    sublabel: "",
    icon: <XCircle className="h-5 w-5 text-destructive" />,
    color: "text-destructive",
  },
};

export function UploadStatusDisplay({ status, errorMessage }: UploadStatusProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === "uploading") {
      setProgress(0);
      const t = setInterval(() => {
        setProgress((p) => (p >= 40 ? 40 : p + 5));
      }, 120);
      return () => clearInterval(t);
    }
    if (status === "extracting") {
      setProgress(45);
      const t = setInterval(() => {
        setProgress((p) => (p >= 85 ? 85 : p + 2));
      }, 300);
      return () => clearInterval(t);
    }
    if (status === "success") {
      setProgress(100);
    }
    if (status === "error") {
      setProgress(0);
    }
  }, [status]);

  if (status === "idle") return null;

  const config = STATUS_CONFIG[status];

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-6">
      {/* Icon + labels */}
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{config.icon}</div>
        <div>
          <p className={cn("text-sm font-medium", config.color)}>{config.label}</p>
          <p className="text-xs text-muted-foreground">
            {status === "error" && errorMessage ? errorMessage : config.sublabel}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      {(status === "uploading" || status === "extracting" || status === "success") && (
        <Progress value={progress} className="h-1.5" />
      )}

      {/* Step indicators */}
      {(status === "uploading" || status === "extracting" || status === "success") && (
        <div className="flex gap-6">
          {[
            { label: "Upload", active: true },
            { label: "Extract", active: status === "extracting" || status === "success" },
            { label: "Calculate", active: status === "success" },
          ].map(({ label, active }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors",
                  active ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
              <span
                className={cn(
                  "text-xs transition-colors",
                  active ? "text-foreground" : "text-muted-foreground/50"
                )}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}