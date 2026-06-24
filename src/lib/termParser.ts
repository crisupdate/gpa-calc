// Canonical term ordering so terms always appear chronologically

const SEASON_ORDER: Record<string, number> = {
  winter:   0,
  spring:   1,
  summer:   2,
  fall:     3,
  autumn:   3,
  semester: 1, // fallback
  trimester:1,
  quarter:  1,
  term:     1,
};

interface ParsedTerm {
  season: string;
  year: number;
  sortKey: number;
}

export function parseTermName(termName: string): ParsedTerm {
  const lower = termName.toLowerCase();

  // Extract 4-digit year
  const yearMatch = lower.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? parseInt(yearMatch[0]) : 0;

  // Match season keyword
  const season = Object.keys(SEASON_ORDER).find((s) => lower.includes(s)) ?? "term";
  const seasonIndex = SEASON_ORDER[season] ?? 1;

  // sortKey: year * 10 + seasonIndex  (e.g. Fall 2023 → 20233)
  const sortKey = year * 10 + seasonIndex;

  return { season, year, sortKey };
}

export function sortTerms<T extends { name: string }>(terms: T[]): T[] {
  return [...terms].sort((a, b) => {
    const pa = parseTermName(a.name);
    const pb = parseTermName(b.name);
    return pa.sortKey - pb.sortKey;
  });
}

export function inferAcademicYear(termName: string): string {
  const { season, year } = parseTermName(termName);
  if (!year) return "Unknown";

  // Fall/Winter terms start the academic year (e.g. Fall 2023 → 2023-2024)
  if (season === "fall" || season === "autumn" || season === "winter") {
    return `${year}-${year + 1}`;
  }
  // Spring/Summer terms end the academic year (e.g. Spring 2024 → 2023-2024)
  return `${year - 1}-${year}`;
}

export function detectDuplicateTerms(termNames: string[]): string[] {
  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const name of termNames) {
    const key = name.trim().toLowerCase();
    if (seen.has(key)) duplicates.push(name);
    else seen.add(key);
  }
  return duplicates;
}