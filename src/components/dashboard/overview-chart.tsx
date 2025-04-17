"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ChartRender } from "~/components/ui/chart/ChartRender";
import { cn } from "~/lib/utils";

interface OverviewChartProps {
  title: string;
  description?: string;
  data: Array<Record<string, unknown>>;
  xAxisKey: string;
  chartType?: "bar" | "line";
  className?: string;
  chartConfig?: Record<string, { visible: boolean; color?: string }>;
}

export function OverviewChart({
  title,
  description,
  data,
  xAxisKey,
  chartType = "line",
  className,
  chartConfig,
}: OverviewChartProps) {
  return (
    <Card className={cn("col-span-4", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pl-2">
        <ChartRender
          chartData={data}
          chartType={chartType}
          xAxisKey={xAxisKey}
          chartConfig={chartConfig}
        />
      </CardContent>
    </Card>
  );
}