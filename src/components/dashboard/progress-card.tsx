"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface ProgressCardProps {
  title: string;
  value: number; // 0-100
  target?: number;
  icon?: ReactNode;
  description?: string;
  className?: string;
  progressColor?: string;
}

export function ProgressCard({
  title,
  value,
  target = 100,
  icon,
  description,
  className,
  progressColor = "bg-primary",
}: ProgressCardProps) {
  // 确保值在0-100之间
  const normalizedValue = Math.min(100, Math.max(0, value));
  const percentage = target !== 100 ? (normalizedValue / target) * 100 : normalizedValue;
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-2xl font-bold" suppressHydrationWarning>{normalizedValue.toFixed(1)}</span>
          {target !== 100 && (
            <span className="text-sm text-muted-foreground">
              目标: {target}
            </span>
          )}
        </div>
        <div className="h-2 w-full rounded-full bg-secondary">
          <div
            className={cn("h-full rounded-full", progressColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {description && (
          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}