import { Upload, Cpu, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Transcript",
    description:
      "Upload a PDF, scanned transcript, or even a phone photo. We support multi-page documents from any university.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "AI Extracts Courses",
    description:
      "Claude reads every course, grade, credit, and term from your transcript automatically. No manual entry needed.",
  },
  {
    icon: BarChart3,
    step: "03",
    title: "View GPA Results",
    description:
      "Get your term GPA, cumulative GPA, course breakdown, and future GPA projections — all in seconds.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            Three steps to your GPA
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From upload to results in under 30 seconds.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connector line */}
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-border md:block" />

          {steps.map(({ icon: Icon, step, title, description }) => (
            <div key={step} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-md">
                <Icon className="h-8 w-8 text-primary" />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {step}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}