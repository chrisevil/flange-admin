"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { ChevronRight } from "lucide-react";

interface RankListProps<T> {
  data: T[];
  valueKey: keyof T;
  labelKey: keyof T;
  title?: string;
  highColor?: string;
  lowColor?: string;
  avgColor?: string;
  className?: string;
  itemRender?: (item: T, index: number, isAboveAvg: boolean, avg: number) => React.ReactNode;
  showAvgLine?: boolean;
  // 钻取相关属性
  drillable?: boolean;
  onItemClick?: (item: T) => void;
}

export function RankList<T extends Record<string, any>>({
  data,
  valueKey,
  labelKey,
  title = "排行榜",
  highColor = "#4f46e5",
  lowColor = "#f59e0b",
  avgColor = "#10b981",
  className,
  itemRender,
  showAvgLine = true,
  drillable = false,
  onItemClick
}: RankListProps<T>) {
  if (!data || data.length === 0) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">暂无数据</div>
        </CardContent>
      </Card>
    );
  }

  const values = data.map(item => Number(item[valueKey]) || 0);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;

  // 排序，默认降序
  const sorted = [...data].sort((a, b) => Number(b[valueKey]) - Number(a[valueKey]));
  
  // 找到第一个低于平均值的项的索引
  const avgBreakIndex = sorted.findIndex(item => Number(item[valueKey]) <= avg);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {sorted.map((item, idx) => {
            const value = Number(item[valueKey]) || 0;
            const isAboveAvg = value > avg;
            const color = isAboveAvg ? highColor : lowColor;
            
            // 在第一个低于平均值的项之前插入平均值行
            return (
              <React.Fragment key={idx}>
                {showAvgLine && idx === avgBreakIndex && (
                  <div className="flex items-center py-2 bg-muted/80 border-y">
                    <span className="w-8 text-center text-muted-foreground">--</span>
                    <span className="flex-1 truncate font-medium">平均值</span>
                    <span className="ml-2 font-bold" style={{ color: avgColor }}>{avg.toFixed(1)}</span>
                  </div>
                )}
                {itemRender ? (
                  itemRender(item, idx, isAboveAvg, avg)
                ) : (
                  <div 
                    className={cn(
                      "flex items-center py-2", 
                      drillable && onItemClick ? "cursor-pointer hover:bg-muted/30" : ""
                    )}
                    onClick={() => drillable && onItemClick && onItemClick(item)}
                  >
                    <span className="w-8 text-center text-muted-foreground">{idx + 1}</span>
                    <span className="flex-1 truncate">{item[labelKey]}</span>
                    <span className="ml-2 font-bold" style={{ color }}>{value}</span>
                    {drillable && onItemClick && (
                      <span className="ml-1 text-muted-foreground">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}

        </div>
      </CardContent>
    </Card>
  );
}