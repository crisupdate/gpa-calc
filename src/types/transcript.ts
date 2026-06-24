export type Grade =
  | "A" | "A-"
  | "B+" | "B" | "B-"
  | "C+" | "C" | "C-"
  | "D+" | "D"
  | "F"
  | "Pass" | "Fail"
  | "W";   // Withdrawn

export type GradingSystem = "US_4_0" | "UK" | "ECTS" | "PERCENTAGE";

export interface Course {
  code: string;
  name: string;
  credits: number;
  grade: Grade | string;
  qualityPoints: number | null;
  includedInGPA: boolean;
  term: string;
  academicYear: string;
  isPassFail: boolean;
  isWithdrawn: boolean;
}

export interface Term {
  name: string;
  academicYear: string;
  courses: Course[];
  termGPA: number | null;
  totalCredits: number;
  gpaCredits: number;
  qualityPoints: number;   // ← add this line
}

export interface TranscriptData {
  studentName?: string;
  institution?: string;
  program?: string;
  terms: Term[];
  cumulativeGPA: number | null;
  totalCreditsEarned: number;
  totalGPACredits: number;
  totalQualityPoints: number;
  gradingSystem: GradingSystem;
  extractionConfidence: number;   // 0–1
  flaggedSections: string[];      // Sections Claude couldn't read
}

export interface ExtractionResult {
  success: boolean;
  data: TranscriptData | null;
  error?: string;
}

export interface WhatIfInput {
  currentGPA: number;
  currentCredits: number;
  targetGPA: number;
  plannedCredits: number;
}

export interface WhatIfResult {
  requiredGPA: number;
  requiredGrade: string;
  isFeasible: boolean;
  message: string;
}