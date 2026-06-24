import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck, Zap, Lock } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16 text-center">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Badge */}
      <Badge variant="secondary" className="my-6 gap-1.5 px-3 py-1 text-xs font-medium">
        <Zap className="h-3 w-3" />
        Developed as a challenge
      </Badge>

      {/* Headline */}
      <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
        Calculate Your GPA{" "}
        <span className="text-primary">Instantly</span>{" "}
        From Your Transcript
      </h1>

      {/* Subheadline */}
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
        Upload your transcript PDF or photo. Our AI reads every course, grade,
        and credit automaticall. No manual entry required.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Button size="lg" className="gap-2 px-8 text-base">
          <Link href="/upload" className="flex gap-2 items-center" >
            Upload Transcript
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="px-8 text-base">
          See Demo
        </Button>
      </div>

      {/* Trust indicators */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-green-500" />
          No account required
        </span>
        <span className="flex items-center gap-1.5">
          <Lock className="h-4 w-4 text-green-500" />
          Files never stored
        </span>
        <span className="flex items-center gap-1.5">
          <Zap className="h-4 w-4 text-green-500" />
          Results in seconds
        </span>
      </div>

      {/* Mock UI preview */}
      <div className="mt-16 w-full max-w-3xl rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <div className="h-3 w-3 rounded-full bg-green-400" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Cumulative GPA", value: "3.72" },
            { label: "Credits Earned", value: "94" },
            { label: "Terms Analyzed", value: "6" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-border bg-background p-4 text-left">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-muted">
          <div className="h-2 w-[72%] rounded-full bg-primary" />
        </div>
        <p className="mt-2 text-left text-xs text-muted-foreground">Extraction complete — 24 courses found across 6 terms</p>
      </div>
    </section>
  );
}