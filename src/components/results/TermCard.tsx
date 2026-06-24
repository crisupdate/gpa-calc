import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Term } from "@/types/transcript";
import { getGPABadgeVariant } from "@/lib/gpa";

interface Props {
  term: Term;
  index: number;
}

export function TermCard({ term, index }: Props) {
  const gpaCourses    = term.courses.filter((c) => c.includedInGPA);
  const excludedCount = term.courses.length - gpaCourses.length;

  return (
    <Card className="overflow-hidden">
      {/* Term colour strip */}
      <div
        className="h-1 w-full bg-primary opacity-60"
        style={{ opacity: 0.4 + (index % 4) * 0.15 }}
      />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{term.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{term.academicYear}</p>
          </div>
          <Badge variant={getGPABadgeVariant(term.termGPA)}>
            {term.termGPA?.toFixed(2) ?? "N/A"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Course table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="pb-2 font-medium">Code</th>
              <th className="pb-2 font-medium">Course</th>
              <th className="pb-2 text-center font-medium">Cr</th>
              <th className="pb-2 text-center font-medium">Grade</th>
              <th className="pb-2 text-right font-medium">QP</th>
            </tr>
          </thead>
          <tbody>
            {term.courses.map((course, i) => (
              <tr
                key={i}
                className={`border-b border-border/40 last:border-0 ${
                  !course.includedInGPA ? "opacity-50" : ""
                }`}
              >
                <td className="py-1.5 font-mono text-xs text-muted-foreground">
                  {course.code}
                </td>
                <td className="py-1.5 pr-2">
                  <span className="text-foreground">{course.name}</span>
                  {course.isPassFail && (
                    <Badge variant="secondary" className="ml-1.5 text-[10px] px-1 py-0">
                      P/F
                    </Badge>
                  )}
                  {course.isWithdrawn && (
                    <Badge variant="destructive" className="ml-1.5 text-[10px] px-1 py-0">
                      W
                    </Badge>
                  )}
                </td>
                <td className="py-1.5 text-center text-muted-foreground">
                  {course.credits}
                </td>
                <td className="py-1.5 text-center font-semibold text-foreground">
                  {course.grade}
                </td>
                <td className="py-1.5 text-right text-muted-foreground">
                  {course.qualityPoints?.toFixed(1) ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Term summary */}
        <div className="mt-4 flex flex-wrap gap-4 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <span>GPA Credits: <strong className="text-foreground">{term.gpaCredits}</strong></span>
          <span>Quality Points: <strong className="text-foreground">{term.qualityPoints.toFixed(2)}</strong></span>
          <span>Total Credits: <strong className="text-foreground">{term.totalCredits}</strong></span>
          {excludedCount > 0 && (
            <span className="text-yellow-600">
              {excludedCount} course{excludedCount > 1 ? "s" : ""} excluded from GPA
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}