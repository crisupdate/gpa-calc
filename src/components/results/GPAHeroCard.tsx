import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { classifyGPA, getGPAColor, getGPABadgeVariant } from "@/lib/gpa";
import { TranscriptData } from "@/types/transcript";
import { GraduationCap, TrendingUp, BookOpen, Award } from "lucide-react";

interface Props {
  data: TranscriptData;
  highestTermGPA: number | null;
  lowestTermGPA:  number | null;
}

export function GPAHeroCard({ data, highestTermGPA, lowestTermGPA }: Props) {
  const classification = classifyGPA(data.cumulativeGPA);
  const gpaColor       = getGPAColor(data.cumulativeGPA);
  const badgeVariant   = getGPABadgeVariant(data.cumulativeGPA);

  const stats = [
    {
      icon:  BookOpen,
      label: "Credits Earned",
      value: data.totalCreditsEarned,
    },
    {
      icon:  TrendingUp,
      label: "Best Term GPA",
      value: highestTermGPA?.toFixed(2) ?? "N/A",
    },
    {
      icon:  Award,
      label: "Terms Completed",
      value: data.terms.length,
    },
  ];

  return (
    <Card className="overflow-hidden border-border">
      {/* Top accent bar */}
      <div className="h-1.5 w-full bg-primary" />
      <CardContent className="p-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* GPA display */}
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Cumulative GPA
            </p>
            <div className="mt-2 flex items-end gap-3">
              <span className={`text-7xl font-bold tracking-tight ${gpaColor}`}>
                {data.cumulativeGPA?.toFixed(2) ?? "N/A"}
              </span>
              <span className="mb-2 text-2xl font-light text-muted-foreground">
                / 4.00
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant={badgeVariant}>{classification}</Badge>
              {data.extractionConfidence < 0.8 && (
                <Badge variant="outline" className="text-yellow-600">
                  {Math.round(data.extractionConfidence * 100)}% confidence
                </Badge>
              )}
            </div>
            {data.studentName && (
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {data.studentName}
                </span>
                {data.institution && ` · ${data.institution}`}
              </p>
            )}
            {data.program && (
              <p className="text-sm text-muted-foreground">{data.program}</p>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 md:grid-cols-1 md:gap-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-semibold text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality points bar */}
        <div className="mt-8">
          <div className="mb-2 flex justify-between text-xs text-muted-foreground">
            <span>Quality Points: {data.totalQualityPoints.toFixed(2)}</span>
            <span>GPA Credits: {data.totalGPACredits}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{
                width: `${Math.min(((data.cumulativeGPA ?? 0) / 4.0) * 100, 100)}%`,
              }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>0.00</span>
            <span>4.00</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}