import { UploadSection } from "@/components/upload/UploadSection";
import { GraduationCap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function UploadPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <GraduationCap className="h-4 w-4 text-primary" />
            GPA Analyzer
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            Files never stored
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl space-y-8">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Upload Your Transcript
            </h1>
            <p className="mt-2 text-muted-foreground">
              PDF or image. Our AI handles the rest.
            </p>
          </div>

          {/* Upload */}
          <UploadSection />

          {/* Tips */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 text-xs text-muted-foreground space-y-1.5">
            <p className="font-medium text-foreground">Tips for best results</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Use the official PDF from your university student portal</li>
              <li>If using a photo, ensure good lighting and all text is visible</li>
              <li>Multi-page transcripts are fully supported</li>
              <li>Make sure the file isn't password protected</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}