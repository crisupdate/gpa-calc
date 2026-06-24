import { normalizeGrade, isValidGrade, isGPAGrade, gradeToPoints } from "./gradeMapper";

export interface ParsedCourse {
  code: string;
  name: string;
  credits: number;
  grade: string;
  gradePoints: number | null;
  qualityPoints: number | null;
  isPassFail: boolean;
  isWithdrawn: boolean;
  isIncomplete: boolean;
  isAudit: boolean;
  includedInGPA: boolean;
  parseWarnings: string[];
}

const PASS_FAIL_GRADES = new Set(["Pass", "Fail"]);
const WITHDRAWN_GRADES = new Set(["W"]);
const INCOMPLETE_GRADES = new Set(["I"]);
const AUDIT_GRADES = new Set(["AU"]);
const EXCLUDED_GRADES = new Set(["Pass", "Fail", "W", "I", "AU", "UNKNOWN"]);

export function parseCourse(raw: {
  code?: string | null;
  name?: string | null;
  credits?: number | null;
  grade?: string | null;
  isPassFail?: boolean;
  isWithdrawn?: boolean;
}): ParsedCourse {
  const warnings: string[] = [];

  // ── Code ──
  const code = (raw.code ?? "").trim() || "UNKNOWN";
  if (!raw.code) warnings.push(`Missing course code`);

  // ── Name ──
  const name = (raw.name ?? "").trim() || "Unknown Course";
  if (!raw.name) warnings.push(`Missing course name for ${code}`);

  // ── Credits ──
  let credits = typeof raw.credits === "number" ? raw.credits : parseFloat(String(raw.credits ?? "0"));
  if (isNaN(credits) || credits < 0) {
    warnings.push(`Invalid credits for ${code}, defaulting to 0`);
    credits = 0;
  }

  // ── Grade ──
  const grade = normalizeGrade(raw.grade);
  if (!isValidGrade(grade) && grade !== "UNKNOWN") {
    warnings.push(`Unrecognized grade "${raw.grade}" for ${code}`);
  }

  // ── Classification ──
  const isPassFail   = raw.isPassFail   || PASS_FAIL_GRADES.has(grade);
  const isWithdrawn  = raw.isWithdrawn  || WITHDRAWN_GRADES.has(grade);
  const isIncomplete = INCOMPLETE_GRADES.has(grade);
  const isAudit      = AUDIT_GRADES.has(grade);
  const includedInGPA = !EXCLUDED_GRADES.has(grade) && isGPAGrade(grade) && credits > 0;

  // ── Quality points ──
  const gradePoints = gradeToPoints(grade);
  const qualityPoints =
    includedInGPA && gradePoints !== null
      ? parseFloat((gradePoints * credits).toFixed(4))
      : null;

  return {
    code,
    name,
    credits,
    grade,
    gradePoints,
    qualityPoints,
    isPassFail,
    isWithdrawn,
    isIncomplete,
    isAudit,
    includedInGPA,
    parseWarnings: warnings,
  };
}

export function parseCourses(rawCourses: Parameters<typeof parseCourse>[0][]): {
  courses: ParsedCourse[];
  warnings: string[];
} {
  const warnings: string[] = [];
  const courses = rawCourses.map((raw) => {
    const parsed = parseCourse(raw);
    warnings.push(...parsed.parseWarnings);
    return parsed;
  });
  return { courses, warnings };
}