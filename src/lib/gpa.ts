import { Course, Term, TranscriptData } from "@/types/transcript";
import { GRADE_POINTS } from "@/constants/grades";

// ── Types ────────────────────────────────────────────────────────────────────

export interface CourseGPA {
  code:          string;
  name:          string;
  credits:       number;
  grade:         string;
  gradePoints:   number | null;
  qualityPoints: number | null;
  includedInGPA: boolean;
}

export interface TermGPA {
  termName:      string;
  academicYear:  string;
  courses:       CourseGPA[];
  gpaCredits:    number;
  qualityPoints: number;
  termGPA:       number | null;
  totalCredits:  number;
}

export interface CumulativeGPA {
  terms:               TermGPA[];
  totalGPACredits:     number;
  totalQualityPoints:  number;
  totalCreditsEarned:  number;
  cumulativeGPA:       number | null;
  highestTermGPA:      number | null;
  lowestTermGPA:       number | null;
  gpaByYear:           Record<string, number | null>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function roundGPA(value: number, decimals = 2): number {
  return parseFloat(value.toFixed(decimals));
}

export function gradeToPoints(grade: string): number | null {
  return GRADE_POINTS[grade] ?? null;
}

export function computeQualityPoints(grade: string, credits: number): number | null {
  const points = gradeToPoints(grade);
  if (points === null || credits <= 0) return null;
  return roundGPA(points * credits, 4);
}

// ── Course-level ─────────────────────────────────────────────────────────────

export function computeCourseGPA(course: Course): CourseGPA {
  const gradePoints   = gradeToPoints(course.grade);
  const qualityPoints = course.includedInGPA
    ? computeQualityPoints(course.grade, course.credits)
    : null;

  return {
    code:          course.code,
    name:          course.name,
    credits:       course.credits,
    grade:         course.grade,
    gradePoints,
    qualityPoints,
    includedInGPA: course.includedInGPA,
  };
}

// ── Term-level ───────────────────────────────────────────────────────────────

export function computeTermGPA(term: Term): TermGPA {
  const courses      = term.courses.map(computeCourseGPA);
  const gpaCourses   = courses.filter((c) => c.includedInGPA);
  const gpaCredits   = gpaCourses.reduce((s, c) => s + c.credits, 0);
  const qualityPoints = gpaCourses.reduce((s, c) => s + (c.qualityPoints ?? 0), 0);
  const totalCredits  = courses
    .filter((c) => {
      const original = term.courses.find((tc) => tc.code === c.code);
      return !original?.isWithdrawn;
    })
    .reduce((s, c) => s + c.credits, 0);

  const termGPA =
    gpaCredits > 0 ? roundGPA(qualityPoints / gpaCredits) : null;

  return {
    termName:      term.name,
    academicYear:  term.academicYear,
    courses,
    gpaCredits,
    qualityPoints: roundGPA(qualityPoints, 4),
    termGPA,
    totalCredits,
  };
}

// ── Cumulative ───────────────────────────────────────────────────────────────

export function computeCumulativeGPA(transcriptData: TranscriptData): CumulativeGPA {
  const terms = transcriptData.terms.map(computeTermGPA);

  const totalGPACredits    = terms.reduce((s, t) => s + t.gpaCredits, 0);
  const totalQualityPoints = terms.reduce((s, t) => s + t.qualityPoints, 0);
  const totalCreditsEarned = terms.reduce((s, t) => s + t.totalCredits, 0);

  const cumulativeGPA =
    totalGPACredits > 0
      ? roundGPA(totalQualityPoints / totalGPACredits)
      : null;

  // Highest / lowest term GPA
  const termGPAs = terms.map((t) => t.termGPA).filter((g): g is number => g !== null);
  const highestTermGPA = termGPAs.length > 0 ? Math.max(...termGPAs) : null;
  const lowestTermGPA  = termGPAs.length > 0 ? Math.min(...termGPAs) : null;

  // GPA grouped by academic year
  const gpaByYear: Record<string, number | null> = {};
  const yearGroups: Record<string, TermGPA[]> = {};

  for (const term of terms) {
    const yr = term.academicYear || "Unknown";
    if (!yearGroups[yr]) yearGroups[yr] = [];
    yearGroups[yr].push(term);
  }

  for (const [year, yearTerms] of Object.entries(yearGroups)) {
    const yCredits = yearTerms.reduce((s, t) => s + t.gpaCredits, 0);
    const yPoints  = yearTerms.reduce((s, t) => s + t.qualityPoints, 0);
    gpaByYear[year] = yCredits > 0 ? roundGPA(yPoints / yCredits) : null;
  }

  return {
    terms,
    totalGPACredits,
    totalQualityPoints: roundGPA(totalQualityPoints, 4),
    totalCreditsEarned,
    cumulativeGPA,
    highestTermGPA,
    lowestTermGPA,
    gpaByYear,
  };
}

// ── Running cumulative (for trend charts) ────────────────────────────────────

export interface RunningGPAPoint {
  termName:       string;
  termGPA:        number | null;
  cumulativeGPA:  number | null;
  creditsToDate:  number;
}

export function computeRunningGPA(transcriptData: TranscriptData): RunningGPAPoint[] {
  const points: RunningGPAPoint[] = [];
  let runningCredits = 0;
  let runningPoints  = 0;

  for (const term of transcriptData.terms) {
    const computed = computeTermGPA(term);
    runningCredits += computed.gpaCredits;
    runningPoints  += computed.qualityPoints;

    points.push({
      termName:      term.name,
      termGPA:       computed.termGPA,
      cumulativeGPA: runningCredits > 0
        ? roundGPA(runningPoints / runningCredits)
        : null,
      creditsToDate: runningCredits,
    });
  }

  return points;
}


export type GPAClassification =
  | "Summa Cum Laude"
  | "Magna Cum Laude"
  | "Cum Laude"
  | "Good Standing"
  | "Satisfactory"
  | "Academic Probation";

export function classifyGPA(gpa: number | null): GPAClassification {
  if (gpa === null) return "Satisfactory";
  if (gpa >= 3.9)  return "Summa Cum Laude";
  if (gpa >= 3.7)  return "Magna Cum Laude";
  if (gpa >= 3.5)  return "Cum Laude";
  if (gpa >= 3.0)  return "Good Standing";
  if (gpa >= 2.0)  return "Satisfactory";
  return "Academic Probation";
}

export function getGPAColor(gpa: number | null): string {
  if (gpa === null) return "text-muted-foreground";
  if (gpa >= 3.7)  return "text-green-600";
  if (gpa >= 3.3)  return "text-blue-600";
  if (gpa >= 3.0)  return "text-primary";
  if (gpa >= 2.0)  return "text-yellow-600";
  return "text-red-600"
}

export function getGPABadgeVariant(
  gpa: number | null
): "default" | "secondary" | "destructive" | "outline" {
  if (gpa === null) return "outline";
  if (gpa >= 3.3)  return "default";
  if (gpa >= 2.0)  return "secondary";
  return "destructive";
}