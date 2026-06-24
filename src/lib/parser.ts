import { TranscriptData, Term, Course, GradingSystem } from "@/types/transcript";
import { parseCourses } from "./courseParser";
import { sortTerms, inferAcademicYear, detectDuplicateTerms } from "./termParser";

interface RawCourse {
  code?: string | null;
  name?: string | null;
  credits?: number | null;
  grade?: string | null;
  isPassFail?: boolean;
  isWithdrawn?: boolean;
}

interface RawTerm {
  name: string;
  academicYear?: string;
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

function computeTermStats(courses: Course[]): {
  termGPA: number | null;
  totalCredits: number;
  gpaCredits: number;
  qualityPoints: number;
} {
  const gpaCourses = courses.filter((c) => c.includedInGPA);
  const gpaCredits    = gpaCourses.reduce((s, c) => s + c.credits, 0);
  const qualityPoints = gpaCourses.reduce((s, c) => s + (c.qualityPoints ?? 0), 0);
  const totalCredits  = courses
    .filter((c) => !c.isWithdrawn)
    .reduce((s, c) => s + c.credits, 0);

  const termGPA =
    gpaCredits > 0
      ? parseFloat((qualityPoints / gpaCredits).toFixed(2))
      : null;

  return { termGPA, totalCredits, gpaCredits, qualityPoints };
}

export interface ParseResult {
  data: TranscriptData;
  warnings: string[];
}

export function parseTranscript(raw: RawExtraction): ParseResult {
  const allWarnings: string[] = [];

  // ── Detect duplicate terms ──────────────────────────────────────
  const termNames = raw.terms.map((t) => t.name);
  const duplicates = detectDuplicateTerms(termNames);
  if (duplicates.length > 0) {
    allWarnings.push(`Duplicate terms detected: ${duplicates.join(", ")}`);
  }

  // ── Parse and sort terms ────────────────────────────────────────
  const rawTermsSorted = sortTerms(raw.terms);

  const terms: Term[] = rawTermsSorted.map((rawTerm) => {
    const { courses: parsedCourses, warnings } = parseCourses(rawTerm.courses);
    allWarnings.push(...warnings);

    // Map ParsedCourse → Course (our domain type)
    const courses: Course[] = parsedCourses.map((pc) => ({
      code:         pc.code,
      name:         pc.name,
      credits:      pc.credits,
      grade:        pc.grade,
      qualityPoints:pc.qualityPoints,
      includedInGPA:pc.includedInGPA,
      term:         rawTerm.name,
      academicYear: rawTerm.academicYear ?? inferAcademicYear(rawTerm.name),
      isPassFail:   pc.isPassFail,
      isWithdrawn:  pc.isWithdrawn,
    }));

    const stats = computeTermStats(courses);

    return {
      name:         rawTerm.name,
      academicYear: rawTerm.academicYear ?? inferAcademicYear(rawTerm.name),
      courses,
      termGPA:      stats.termGPA,
      totalCredits: stats.totalCredits,
      gpaCredits:   stats.gpaCredits,
      qualityPoints:stats.qualityPoints,
    };
  });

  // ── Cumulative stats ────────────────────────────────────────────
  const totalGPACredits    = terms.reduce((s, t) => s + t.gpaCredits, 0);
  const totalQualityPoints = terms.reduce((s, t) => s + t.qualityPoints, 0);
  const totalCreditsEarned = terms.reduce((s, t) => s + t.totalCredits, 0);

  const cumulativeGPA =
    totalGPACredits > 0
      ? parseFloat((totalQualityPoints / totalGPACredits).toFixed(2))
      : null;

  // ── Sanity checks ───────────────────────────────────────────────
  if (terms.length === 0) {
    allWarnings.push("No terms were found in this transcript.");
  }
  if (totalGPACredits === 0) {
    allWarnings.push("No GPA-bearing courses found. GPA cannot be calculated.");
  }
  if ((raw.extractionConfidence ?? 1) < 0.7) {
    allWarnings.push(
      `Low extraction confidence (${Math.round((raw.extractionConfidence ?? 0) * 100)}%). ` +
      `Some data may be inaccurate.`
    );
  }

  const data: TranscriptData = {
    studentName:          raw.studentName  ?? undefined,
    institution:          raw.institution  ?? undefined,
    program:              raw.program      ?? undefined,
    terms,
    cumulativeGPA,
    totalCreditsEarned,
    totalGPACredits,
    totalQualityPoints:   parseFloat(totalQualityPoints.toFixed(4)),
    gradingSystem:        (raw.gradingSystem as GradingSystem) ?? "US_4_0",
    extractionConfidence: raw.extractionConfidence ?? 0,
    flaggedSections:      raw.flaggedSections ?? [],
  };

  return { data, warnings: allWarnings };
}