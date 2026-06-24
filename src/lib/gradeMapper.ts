import { GRADE_POINTS, NON_GPA_GRADES } from "@/constants/grades";

// Normalizes messy grade strings from Claude into clean canonical grades
const GRADE_ALIASES: Record<string, string> = {
  // Letter variants
  "A+": "A",    // Many schools don't give A+ extra points
  "a":  "A",   "a-": "A-",
  "b+": "B+",  "b":  "B",   "b-": "B-",
  "c+": "C+",  "c":  "C",   "c-": "C-",
  "d+": "D+",  "d":  "D",
  "f":  "F",

  // Pass/Fail variants
  "P":    "Pass", "p":    "Pass",
  "PASS": "Pass", "pass": "Pass",
  "FAIL": "Fail", "fail": "Fail",
  "F/P":  "Pass",

  // Withdrawn variants
  "w":    "W", "WD":   "W", "Wd":   "W",
  "WIDR": "W", "WITH": "W",

  // Incomplete
  "INC": "I", "Inc": "I", "i": "I",

  // Audit
  "AU": "AU", "AUD": "AU", "Audit": "AU",

  // Numeric shorthands some schools use
  "4.0": "A",  "3.7": "A-",
  "3.3": "B+", "3.0": "B",  "2.7": "B-",
  "2.3": "C+", "2.0": "C",  "1.7": "C-",
  "1.3": "D+", "1.0": "D",  "0.0": "F",
};

export function normalizeGrade(raw: string | null | undefined): string {
  if (!raw) return "UNKNOWN";
  const trimmed = raw.trim();
  return GRADE_ALIASES[trimmed] ?? trimmed;
}

export function isValidGrade(grade: string): boolean {
  return (
    grade in GRADE_POINTS ||
    NON_GPA_GRADES.has(grade) ||
    grade === "I" ||
    grade === "AU"
  );
}

export function isGPAGrade(grade: string): boolean {
  return grade in GRADE_POINTS;
}

export function gradeToPoints(grade: string): number | null {
  return GRADE_POINTS[grade] ?? null;
}