"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RunningGPAPoint } from "@/lib/gpa";

interface Props {
  data: RunningGPAPoint[];
}

export function GPATrendChart({ data }: Props) {
  if (data.length < 2) return null;

  const chartData = data.map((point) => ({
    term:       point.termName.replace(/(\w+)\s(\d{4})/, "$1 '$2").replace("'20", "'20"),
    termGPA:    point.termGPA,
    cumGPA:     point.cumulativeGPA,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">GPA Trend</CardTitle>
        <p className="text-xs text-muted-foreground">
          Term GPA vs cumulative GPA over time
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="term"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 4]}
              ticks={[0, 1, 2, 3, 3.5, 4]}
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
            contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border:          "1px solid hsl(var(--border))",
                borderRadius:    "8px",
                fontSize:        "12px",
            }}
            formatter={((value: number, name: string) => [
                typeof value === "number" ? value.toFixed(2) : value,
                name === "termGPA" ? "Term GPA" : "Cumulative GPA",
            ]) as any}
            />
            <Legend
              formatter={(value) =>
                value === "termGPA" ? "Term GPA" : "Cumulative GPA"
              }
              wrapperStyle={{ fontSize: 11 }}
            />
            <ReferenceLine
              y={3.5}
              stroke="hsl(var(--primary))"
              strokeDasharray="4 4"
              strokeOpacity={0.4}
              label={{ value: "Dean's List", fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            />
            <Line
              type="monotone"
              dataKey="termGPA"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4, fill: "hsl(var(--primary))" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="cumGPA"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}