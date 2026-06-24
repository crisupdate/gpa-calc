import { Card, CardContent } from "@/components/ui/card";
import {
  FileText, Layers, TrendingUp, Calculator,
  RefreshCw, Globe, CheckCircle, AlertCircle,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Automatic Transcript Reading",
    description: "AI reads your transcript directly — no typing, no copy-pasting.",
  },
  {
    icon: Layers,
    title: "Multi-Page Support",
    description: "Handles full academic histories across multiple years and pages.",
  },
  {
    icon: TrendingUp,
    title: "Term-by-Term GPA",
    description: "See your GPA broken down by each individual semester or term.",
  },
  {
    icon: Calculator,
    title: "Cumulative GPA",
    description: "Accurate cumulative GPA using the standard 4.0 quality point formula.",
  },
  {
    icon: CheckCircle,
    title: "Pass/Fail Handling",
    description: "Pass/Fail courses are shown but correctly excluded from GPA calculations.",
  },
  {
    icon: AlertCircle,
    title: "Withdrawn Course Handling",
    description: "Withdrawn courses are flagged and excluded from your GPA automatically.",
  },
  {
    icon: RefreshCw,
    title: "What-If Calculator",
    description: "Plan future terms and see exactly what GPA you need to hit your target.",
  },
  {
    icon: Globe,
    title: "Multiple Grading Systems",
    description: "Supports US 4.0, UK Classifications, ECTS, and percentage-based systems.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-muted/30 py-24 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            Everything you need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built for students, graduate applicants, and academic advisors.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="border-border/60 bg-background transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}