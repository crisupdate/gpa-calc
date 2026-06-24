import { roundGPA, gradeToPoints } from "./gpa";
import { GRADE_POINTS } from "@/constants/grades";
import { WhatIfInput, WhatIfResult } from "@/types/transcript";

// Grade thresholds in descending order for "required grade" lookup
const GRADE_THRESHOLDS = [
  { grade: "A",  points: 4.0 },
  { grade: "A-", points: 3.7 },
  { grade: "B+", points: 3.3 },
  { grade: "B",  points: 3.0 },
  { grade: "B-", points: 2.7 },
  { grade: "C+", points: 2.3 },
  { grade: "C",  points: 2.0 },
  { grade: "C-", points: 1.7 },
  { grade: "D+", points: 1.3 },
  { grade: "D",  points: 1.0 },
  { grade: "F",  points: 0.0 },
];

export function computeWhatIf(input: WhatIfInput): WhatIfResult {
  const { currentGPA, currentCredits, targetGPA, plannedCredits } = input;

  // Guard: no future credits planned
  if (plannedCredits <= 0) {
    return {
      requiredGPA:   currentGPA,
      requiredGrade: "N/A",
      isFeasible:    currentGPA >= targetGPA,
      message:       "Enter planned credits to see what GPA you need next term.",
    };
  }

  // Guard: target already achieved
  if (currentGPA >= targetGPA && currentCredits > 0) {
    return {
      requiredGPA:   targetGPA,
      requiredGrade: "Any passing grade",
      isFeasible:    true,
      message:       `You've already achieved a ${currentGPA.toFixed(2)} GPA — you're above your target!`,
    };
  }

  // Formula: requiredGPA = (target * totalCredits - currentQP) / plannedCredits
  const currentQualityPoints = currentGPA * currentCredits;
  const totalCreditsAfter    = currentCredits + plannedCredits;
  const targetQualityPoints  = targetGPA * totalCreditsAfter;
  const requiredQualityPoints = targetQualityPoints - currentQualityPoints;
  const requiredGPA = roundGPA(requiredQualityPoints / plannedCredits);

  // Above 4.0 — mathematically impossible
  if (requiredGPA > 4.0) {
    return {
      requiredGPA,
      requiredGrade: "Impossible",
      isFeasible:    false,
      message:
        `You would need a ${requiredGPA.toFixed(2)} GPA next term — this exceeds the 4.0 maximum. ` +
        `Consider extending your timeline or adjusting your target.`,
    };
  }

  // Below 0.0 — already achieved even with no effort
  if (requiredGPA <= 0) {
    return {
      requiredGPA:   0,
      requiredGrade: "Any passing grade",
      isFeasible:    true,
      message:       `Your current GPA already puts you on track. Any passing grade will reach your target.`,
    };
  }

  // Find the closest letter grade
  const requiredGrade =
    GRADE_THRESHOLDS.find((g) => g.points <= requiredGPA)?.grade ?? "F";

  // Feasibility message
  const isFeasible = requiredGPA <= 4.0;
  const gradePoints = gradeToPoints(requiredGrade) ?? 0;
  const projectedGPA = roundGPA(
    (currentQualityPoints + gradePoints * plannedCredits) / totalCreditsAfter
  );

  const message =
    `To reach a ${targetGPA.toFixed(2)} cumulative GPA, you need a ` +
    `${requiredGPA.toFixed(2)} GPA (roughly ${requiredGrade}) ` +
    `across your next ${plannedCredits} credits. ` +
    `That would put your cumulative GPA at approximately ${projectedGPA.toFixed(2)}.`;

  return { requiredGPA, requiredGrade, isFeasible, message };
}

// ── Scenario testing — run multiple planned credit amounts ────────────────────

export interface WhatIfScenario {
  plannedCredits: number;
  requiredGPA:    number | null;
  requiredGrade:  string;
  isFeasible:     boolean;
}

export function computeScenarios(
  currentGPA: number,
  currentCredits: number,
  targetGPA: number,
  creditOptions: number[] = [12, 15, 18, 21, 30]
): WhatIfScenario[] {
  return creditOptions.map((credits) => {
    const result = computeWhatIf({
      currentGPA,
      currentCredits,
      targetGPA,
      plannedCredits: credits,
    });
    return {
      plannedCredits: credits,
      requiredGPA:    result.requiredGPA,
      requiredGrade:  result.requiredGrade,
      isFeasible:     result.isFeasible,
    };
  });
}

// ── GPA needed per remaining term ─────────────────────────────────────────────

export interface TermProjection {
  termsRemaining: number;
  creditsPerTerm: number;
  requiredGPAPerTerm: number | null;
  isFeasible: boolean;
}

export function computeTermProjections(
  currentGPA: number,
  currentCredits: number,
  targetGPA: number,
  creditsPerTerm = 15,
  maxTerms = 6
): TermProjection[] {
  const projections: TermProjection[] = [];

  for (let terms = 1; terms <= maxTerms; terms++) {
    const plannedCredits = terms * creditsPerTerm;
    const result = computeWhatIf({
      currentGPA,
      currentCredits,
      targetGPA,
      plannedCredits,
    });
    projections.push({
      termsRemaining:     terms,
      creditsPerTerm,
      requiredGPAPerTerm: result.requiredGPA,
      isFeasible:         result.isFeasible,
    });
  }

  return projections;
}