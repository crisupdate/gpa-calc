"use client";

import { useEffect, useState } from "react";
import { useRouter }           from "next/navigation";
import Link                    from "next/link";
import { TranscriptData }      from "@/types/transcript";
import { computeCumulativeGPA, computeRunningGPA } from "@/lib/gpa";
import { Loader2, GraduationCap, Upload, ChevronDown, ChevronUp } from "lucide-react";
import { Button }              from "@/components/ui/button";
import { Separator }           from "@/components/ui/separator";
import { GPAHeroCard }         from "@/components/results/GPAHeroCard";
import { GPATrendChart }       from "@/components/results/GPATrendChart";
import { TermCard }            from "@/components/results/TermCard";
import { WhatIfCalculator }    from "@/components/results/WhatIfCalculator";
import { FlaggedAlert }        from "@/components/results/FlaggedAlert";

export default function ResultsPage() {
  const router  = useRouter();
  const [data,    setData]    = useState<TranscriptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("transcriptData");
      if (!raw) { router.replace("/upload"); return; }
      setData(JSON.parse(raw));
    } catch {
      router.replace("/upload");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const gpaData    = computeCumulativeGPA(data);
  const runningGPA = computeRunningGPA(data);

  // Show first 3 terms collapsed, rest behind "Show all"
  const visibleTerms = showAll ? data.terms : data.terms.slice(0, 3);
  const hiddenCount  = data.terms.length - 3;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <GraduationCap className="h-4 w-4 text-primary" />
            GPA Analyzer
          </Link>
          <Button variant="outline" size="sm">
            <Link href="/upload">
              <Upload className="mr-2 h-3.5 w-3.5" />
              New Transcript
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-6 py-10">

        {/* Warnings */}
        <FlaggedAlert
          flaggedSections={data.flaggedSections}
          confidence={data.extractionConfidence}
        />

        {/* Hero GPA card */}
        <GPAHeroCard
          data={data}
          highestTermGPA={gpaData.highestTermGPA}
          lowestTermGPA={gpaData.lowestTermGPA}
        />

        {/* GPA Trend */}
        <GPATrendChart data={runningGPA} />

        <Separator />

        {/* Term breakdown */}
        <div>
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Term Breakdown
          </h2>
          <div className="space-y-4">
            {visibleTerms.map((term, i) => (
              <TermCard key={term.name} term={term} index={i} />
            ))}
          </div>

          {/* Show more/less */}
          {data.terms.length > 3 && (
            <Button
              variant="outline"
              className="mt-4 w-full gap-2"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Show fewer terms
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show {hiddenCount} more term{hiddenCount !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          )}
        </div>

        <Separator />

        {/* What-If Calculator */}
        <WhatIfCalculator
          currentGPA={data.cumulativeGPA ?? 0}
          currentCredits={data.totalGPACredits}
        />

        {/* Footer note */}
        <p className="pb-4 text-center text-xs text-muted-foreground">
          GPA calculated using the standard 4.0 quality point formula.
          Pass/Fail and Withdrawn courses are excluded.
          Results are for reference only.
        </p>
      </main>
    </div>
  );
}