"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { computeWhatIf, computeScenarios } from "@/lib/whatif";
import { WhatIfResult } from "@/types/transcript";
import { Calculator, CheckCircle, XCircle, TrendingUp } from "lucide-react";

interface Props {
  currentGPA:     number;
  currentCredits: number;
}

export function WhatIfCalculator({ currentGPA, currentCredits }: Props) {
  const [targetGPA,      setTargetGPA]      = useState("");
  const [plannedCredits, setPlannedCredits] = useState("");
  const [result,         setResult]         = useState<WhatIfResult | null>(null);

  const handleCalculate = () => {
    const target  = parseFloat(targetGPA);
    const credits = parseFloat(plannedCredits);
    if (isNaN(target) || isNaN(credits)) return;
    if (target < 0 || target > 4.0) return;
    if (credits <= 0) return;
    setResult(computeWhatIf({ currentGPA, currentCredits, targetGPA: target, plannedCredits: credits }));
  };

  const scenarios = targetGPA
    ? computeScenarios(currentGPA, currentCredits, parseFloat(targetGPA))
    : null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Calculator className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">What-If Calculator</CardTitle>
            <p className="text-xs text-muted-foreground">
              Find out what GPA you need to reach your goal
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current stats */}
        <div className="flex gap-4 rounded-lg bg-muted/40 p-3 text-sm">
          <span className="text-muted-foreground">
            Current GPA: <strong className="text-foreground">{currentGPA.toFixed(2)}</strong>
          </span>
          <span className="text-muted-foreground">
            GPA Credits: <strong className="text-foreground">{currentCredits}</strong>
          </span>
        </div>

        {/* Inputs */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="targetGPA" className="text-sm">
              Target Cumulative GPA
            </Label>
            <Input
              id="targetGPA"
              type="number"
              min="0"
              max="4.0"
              step="0.01"
              placeholder="e.g. 3.50"
              value={targetGPA}
              onChange={(e) => {
                setTargetGPA(e.target.value);
                setResult(null);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plannedCredits" className="text-sm">
              Planned Credits Next Term
            </Label>
            <Input
              id="plannedCredits"
              type="number"
              min="1"
              max="30"
              step="1"
              placeholder="e.g. 15"
              value={plannedCredits}
              onChange={(e) => {
                setPlannedCredits(e.target.value);
                setResult(null);
              }}
            />
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          className="w-full"
          disabled={!targetGPA || !plannedCredits}
        >
          Calculate Required GPA
        </Button>

        {/* Result */}
        {result && (
          <div className={`rounded-lg border p-4 ${
            result.isFeasible
              ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
              : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
          }`}>
            <div className="flex items-start gap-3">
              {result.isFeasible
                ? <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                : <XCircle    className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
              }
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    Required GPA:
                  </span>
                  <Badge variant={result.isFeasible ? "default" : "destructive"}>
                    {result.requiredGPA.toFixed(2)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ≈ {result.requiredGrade} average
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{result.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Scenario table */}
        {scenarios && parseFloat(targetGPA) >= 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Scenarios for target GPA {parseFloat(targetGPA).toFixed(2)}
              </p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Planned Credits</th>
                  <th className="pb-2 text-center font-medium">Required GPA</th>
                  <th className="pb-2 text-center font-medium">Avg Grade</th>
                  <th className="pb-2 text-right font-medium">Feasible</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((s) => (
                  <tr
                    key={s.plannedCredits}
                    className="border-b border-border/40 last:border-0"
                  >
                    <td className="py-2 font-medium text-foreground">
                      {s.plannedCredits} credits
                    </td>
                    <td className="py-2 text-center">
                      {s.requiredGPA !== null ? s.requiredGPA.toFixed(2) : "—"}
                    </td>
                    <td className="py-2 text-center font-semibold text-foreground">
                      {s.requiredGrade}
                    </td>
                    <td className="py-2 text-right">
                      {s.isFeasible
                        ? <span className="text-green-600">✓ Yes</span>
                        : <span className="text-red-500">✗ No</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}