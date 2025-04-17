"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, Brush, YAxis } from "recharts";
import { type ChartConfig } from "~/components/ui/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

type ChartRendererProps = {
  chartConfig?: ChartConfig & Record<string, { visible: boolean }>;
  chartData: Array<Record<string, unknown>>;
  chartType?: "bar" | "line";
  xAxisKey: string;
  renderCustomBarLabel?: (props: {
    x: number;
    y: number;
    width: number;
    height: number;
    payload: Record<string, unknown>;
    value: string;
  }) => JSX.Element;
};

const defaultChartConfig: ChartConfig & Record<string, { visible: boolean }> = {
  desktop: {
    visible: true,
    color: "var(--color-desktop)",
  },
  mobile: {
    visible: true,
    color: "var(--color-mobile)",
  },
};

function sanitizeChartData(
  data: Array<Record<string, unknown>>,
): Array<Record<string, unknown>> {
  return data.map((item) => {
    const sanitized: Record<string, unknown> = {};
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const value = item[key];
        sanitized[key] =
          typeof value === "string" ? value.replace(/<[^>]*>?/gm, "") : value;
      }
    }
    return sanitized;
  });
}

export function ChartRender({
  chartConfig = defaultChartConfig,
  chartData,
  chartType = "bar",
  xAxisKey,
  renderCustomBarLabel,
}: ChartRendererProps) {
  const sanitizedData = sanitizeChartData(chartData);
  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      {chartType === "bar" ? (
        <BarChart accessibilityLayer data={sanitizedData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            // tickFormatter={(value: string) => value.slice(0, 3)}
            padding={{ left: 30 }}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Brush 
            dataKey={xAxisKey} 
            height={30}
            stroke="#8884d8"
            startIndex={0}
            endIndex={sanitizedData.length > 40 ? Math.floor(sanitizedData.length * 0.3) : sanitizedData.length - 1}
          />
          {Object.keys(chartConfig).map(
            (key) =>
              (chartConfig[key]?.visible ?? true) && (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={chartConfig[key]?.color}
                  radius={4}
                  label={renderCustomBarLabel}
                />
              ),
          )}
        </BarChart>
      ) : (
        <LineChart accessibilityLayer data={sanitizedData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey={xAxisKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            // tickFormatter={(value: string) => value.slice(0, 3)}
            padding={{ left: 30 }}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Brush 
            dataKey={xAxisKey} 
            height={30} 
            stroke="#8884d8"
            startIndex={0}
            endIndex={sanitizedData.length > 40 ? Math.floor(sanitizedData.length * 0.3) : sanitizedData.length - 1}
          />
          {Object.keys(chartConfig).map(
            (key) =>
              (chartConfig[key]?.visible ?? true) && (
                <Line
                  key={key}
                  dataKey={key}
                  stroke={chartConfig[key]?.color}
                  type="monotone"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              ),
          )}
        </LineChart>
      )}
    </ChartContainer>
  );
}
