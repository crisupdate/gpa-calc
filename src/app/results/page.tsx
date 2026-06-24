"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TranscriptData } from "@/types/transcript";
import { Loader2, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { computeCumulativeGPA, computeRunningGPA, classifyGPA, getGPAColor } from "@/lib/gpa";

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<TranscriptData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("transcriptData");
      if (!raw) {
        router.replace("/upload");
        return;
      }
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

  // ── Safe to compute now — data is guaranteed non-null ──
  const gpaData        = computeCumulativeGPA(data);
  const runningGPA     = computeRunningGPA(data);
  const classification = classifyGPA(data.cumulativeGPA);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">GPA Analyzer</span>
          <Badge variant="secondary" className="ml-2">Results Preview</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">
            {data.studentName ?? "Your Transcript"}
          </h1>
          {data.institution && (
            <p className="text-muted-foreground">{data.institution}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Cumulative GPA",  value: data.cumulativeGPA?.toFixed(2) ?? "N/A" },
            { label: "GPA Credits",     value: data.totalGPACredits },
            { label: "Quality Points",  value: data.totalQualityPoints.toFixed(1) },
            { label: "Terms Found",     value: data.terms.length },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">GPA Classification</p>
              <p className={`text-lg font-semibold mt-1 ${getGPAColor(data.cumulativeGPA)}`}>
                {classification}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Highest Term GPA</p>
              <p className="text-lg font-semibold text-foreground mt-1">
                {gpaData.highestTermGPA?.toFixed(2) ?? "N/A"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Lowest Term GPA</p>
              <p className="text-lg font-semibold text-foreground mt-1">
                {gpaData.lowestTermGPA?.toFixed(2) ?? "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center gap-3">
            <div className="text-sm text-muted-foreground">Extraction confidence:</div>
            <Badge variant={data.extractionConfidence > 0.8 ? "default" : "secondary"}>
              {Math.round(data.extractionConfidence * 100)}%
            </Badge>
            {data.flaggedSections.length > 0 && (
              <span className="text-xs text-yellow-600">
                ⚠ {data.flaggedSections.length} section(s) flagged
              </span>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Terms</h2>
          {data.terms.map((term) => (
            <Card key={term.name}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{term.name}</CardTitle>
                  <Badge variant="outline">
                    GPA: {term.termGPA?.toFixed(2) ?? "N/A"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground border-b border-border">
                      <th className="pb-2">Code</th>
                      <th className="pb-2">Course</th>
                      <th className="pb-2 text-center">Credits</th>
                      <th className="pb-2 text-center">Grade</th>
                      <th className="pb-2 text-right">Quality Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {term.courses.map((course, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="py-1.5 text-muted-foreground font-mono text-xs">
                          {course.code}
                        </td>
                        <td className="py-1.5 pr-4">
                          {course.name}
                          {course.isPassFail && (
                            <Badge variant="secondary" className="ml-2 text-[10px]">P/F</Badge>
                          )}
                          {course.isWithdrawn && (
                            <Badge variant="destructive" className="ml-2 text-[10px]">W</Badge>
                          )}
                        </td>
                        <td className="py-1.5 text-center">{course.credits}</td>
                        <td className="py-1.5 text-center font-medium">{course.grade}</td>
                        <td className="py-1.5 text-right text-muted-foreground">
                          {course.qualityPoints?.toFixed(1) ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                  <span>GPA Credits: {term.gpaCredits}</span>
                  <span>Quality Points: {term.qualityPoints?.toFixed(1)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <details className="rounded-lg border border-border hidden">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground">
            View raw extracted JSON
          </summary>
          <pre className="overflow-auto p-4 text-xs text-muted-foreground">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </main>
    </div>
  );
}