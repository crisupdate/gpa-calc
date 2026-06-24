import { Badge } from "@/components/ui/badge";
import { FileImage, FileScan, FileText, Files } from "lucide-react";

const documents = [
  { icon: FileText, label: "PDF Transcripts" },
  { icon: FileScan, label: "Scanned Transcripts" },
  { icon: FileImage, label: "Phone Photos" },
  { icon: Files, label: "Multi-Page Documents" },
];

const gradingSystems = [
  { label: "US 4.0 GPA", description: "Standard letter grade + quality points" },
  { label: "UK Classification", description: "First, 2:1, 2:2, Third" },
  { label: "ECTS", description: "European Credit Transfer System" },
  { label: "Percentage-Based", description: "Numeric grade systems" },
];

export function Supported() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-2">
          {/* Documents */}
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
              Supported Uploads
            </p>
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
              Any format, any school
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {documents.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <Icon className="h-5 w-5 shrink-0 text-primary" />
                  <span className="text-sm font-medium text-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grading Systems */}
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
              Grading Systems
            </p>
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
              Global transcript support
            </h2>
            <div className="flex flex-col gap-4">
              {gradingSystems.map(({ label, description }) => (
                <div key={label} className="flex items-start gap-4 rounded-lg border border-border bg-card p-4">
                  <Badge variant="secondary" className="mt-0.5 shrink-0">{label}</Badge>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}