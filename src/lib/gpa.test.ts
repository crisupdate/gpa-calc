import { computeQualityPoints, roundGPA } from "./gpa";
import { computeWhatIf } from "./whatif";

// Worked example from spec:
// CS101:   3cr × A(4.0)  = 12.0
// MATH201: 4cr × B+(3.3) = 13.2
// ENG100:  3cr × B-(2.7) = 8.1
// HIST110: 3cr × C(2.0)  = 6.0
// PE100:   1cr × Pass    = excluded

const courses = [
  { credits: 3, grade: "A"  },
  { credits: 4, grade: "B+" },
  { credits: 3, grade: "B-" },
  { credits: 3, grade: "C"  },
];

const totalQP = courses.reduce((s, c) => s + (computeQualityPoints(c.grade, c.credits) ?? 0), 0);
const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
const gpa = roundGPA(totalQP / totalCredits);

console.log("Quality Points:", totalQP);  // Expected: 39.3
console.log("Credits:", totalCredits);    // Expected: 13
console.log("GPA:", gpa);                 // Expected: 3.02

// What-if test
const result = computeWhatIf({
  currentGPA: 3.02,
  currentCredits: 13,
  targetGPA: 3.5,
  plannedCredits: 15,
});

console.log("What-if result:", result);