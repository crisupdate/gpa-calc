import { Course, Term, TranscriptData, GradingSystem } from "@/types/transcript";
import { GRADE_POINTS, NON_GPA_GRADES } from "@/constants/grades";

interface RawCourse {
  code: string | null;
  name: string | null;
  credits: number | null;
  grade: string | null;
  isPassFail: boolean;
  isWithdrawn: boolean;
}

interface RawTerm {
  name: string;
  academicYear: string;
  courses: RawCourse[];
}

interface RawExtraction {
  studentName?: string | null;
  institution?: string | null;
  program?: string | null;
  gradingSystem?: string;
  extractionConfidence?: number;
  flaggedSections?: string[];
  terms: RawTerm[];
}

function computeQualityPoints(grade: string, credits: number): number | null {
  const points = GRADE_POINTS[grade];
  if (points === undefined) return null;
  return parseFloat((points * credits).toFixed(4));
}

function isIncludedInGPA(grade: string, isPassFail: boolean, isWithdrawn: boolean): boolean {
  if (isPassFail || isWithdrawn) return false;
  if (NON_GPA_GRADES.has(grade)) return false;
  if (GRADE_POINTS[grade] === undefined) return false;
  return true;
}

function normalizeCourse(raw: RawCourse, term: string, academicYear: string): Course {
  const grade = (raw.grade ?? "").trim();
  const credits = raw.credits ?? 0;
  const isPassFail = raw.isPassFail || grade === "Pass" || grade === "Fail";
  const isWithdrawn = raw.isWithdrawn || grade === "W";
  const included = isIncludedInGPA(grade, isPassFail, isWithdrawn);

  return {
    code: raw.code ?? "UNKNOWN",
    name: raw.name ?? "Unknown Course",
    credits,
    grade,
    qualityPoints: included ? computeQualityPoints(grade, credits) : null,
    includedInGPA: included,
    term,
    academicYear,
    isPassFail,
    isWithdrawn,
  };
}

function computeTermGPA(courses: Course[]): {
  termGPA: number | null;
  totalCredits: number;
  gpaCredits: number;
  qualityPoints: number;
} {
  const gpaCourses = courses.filter((c) => c.includedInGPA);
  const gpaCredits = gpaCourses.reduce((s, c) => s + c.credits, 0);
  const qualityPoints = gpaCourses.reduce((s, c) => s + (c.qualityPoints ?? 0), 0);
  const totalCredits = courses
    .filter((c) => !c.isWithdrawn)
    .reduce((s, c) => s + c.credits, 0);

  const termGPA =
    gpaCredits > 0
      ? parseFloat((qualityPoints / gpaCredits).toFixed(2))
      : null;

  return { termGPA, totalCredits, gpaCredits, qualityPoints };
}

export function normalizeExtraction(raw: RawExtraction): TranscriptData {
  const terms = raw.terms.map((rawTerm) => {
    const courses = rawTerm.courses.map((c) =>
      normalizeCourse(c, rawTerm.name, rawTerm.academicYear)
    );
    const { termGPA, totalCredits, gpaCredits, qualityPoints } =
      computeTermGPA(courses);

    return {
      name: rawTerm.name,
      academicYear: rawTerm.academicYear,
      courses,
      termGPA,
      totalCredits,
      gpaCredits,
      qualityPoints,
    };
  });

  const totalGPACredits = terms.reduce((s, t) => s + t.gpaCredits, 0);
  const totalQualityPoints = terms.reduce((s, t) => s + (t.qualityPoints ?? 0), 0);
  const totalCreditsEarned = terms.reduce((s, t) => s + t.totalCredits, 0);

  const cumulativeGPA =
    totalGPACredits > 0
      ? parseFloat((totalQualityPoints / totalGPACredits).toFixed(2))
      : null;

  return {
    studentName: raw.studentName ?? undefined,
    institution: raw.institution ?? undefined,
    program: raw.program ?? undefined,
    terms,
    cumulativeGPA,
    totalCreditsEarned,
    totalGPACredits,
    totalQualityPoints: parseFloat(totalQualityPoints.toFixed(4)),
    gradingSystem: (raw.gradingSystem as GradingSystem) ?? "US_4_0",
    extractionConfidence: raw.extractionConfidence ?? 0,
    flaggedSections: raw.flaggedSections ?? [],
  };
}