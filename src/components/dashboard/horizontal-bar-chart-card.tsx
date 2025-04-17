"use client";

import { useState, useCallback, type ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface SegmentConfig {
  valueKey: string;
  color: string;
  name?: string;
}

interface HorizontalBarChartCardProps<T> {
  title: string;
  description?: string;
  data: T[];
  valueKey: keyof T; // 数值字段，用于显示柱状图的值
  labelKey: keyof T; // 标签字段，用于显示柱状图的标签
  drilldownKey?: keyof T; // 钻取字段，用于获取下一级数据
  getDrilldownData?: (item: T) => Promise<T[]> | T[]; // 获取钻取数据的函数
  className?: string;
  maxItems?: number;
  barColor?: string;
  segments?: SegmentConfig[];
  getBarColor?: (item: T) => string; // 获取每个数据项的颜色
  onItemClick?: (item: T) => void;
}

interface DrilldownState<T> {
  level: number;
  data: T[];
  parentItems: T[];
  currentTitle: string;
}

export function HorizontalBarChartCard<T extends Record<string, any>>({
  title,
  description,
  data,
  valueKey,
  labelKey,
  drilldownKey,
  getDrilldownData,
  className,
  maxItems = 10,
  barColor = "#8884d8",
  segments,
  onItemClick,
  getBarColor,
}: HorizontalBarChartCardProps<T>) {
  // 钻取状态管理
  const [drilldownState, setDrilldownState] = useState<DrilldownState<T>>({
    level: 0,
    data: data,
    parentItems: [],
    currentTitle: title
  });

  // 处理柱状图点击事件，实现钻取功能
  const handleBarClick = useCallback(async (item: T) => {
    if (onItemClick) {
      onItemClick(item);
      return;
    }

    if (!drilldownKey || !getDrilldownData) return;

    try {
      const drilldownData = await getDrilldownData(item);

      if (drilldownData && drilldownData.length > 0) {
        setDrilldownState(prev => ({
          level: prev.level + 1,
          data: drilldownData,
          parentItems: [...prev.parentItems, item],
          currentTitle: `${String(item[labelKey])} 详情`
        }));
      }
    } catch (error) {
      console.error("Failed to get drilldown data:", error);
    }
  }, [drilldownKey, getDrilldownData, labelKey, onItemClick]);

  // 返回上一级
  const handleBack = useCallback(() => {
    setDrilldownState(prev => {
      const newParentItems = [...prev.parentItems];
      newParentItems.pop();

      return {
        level: prev.level - 1,
        data: prev.level === 1 ? data : [], // 如果返回到顶层，使用原始数据
        parentItems: newParentItems,
        currentTitle: prev.level === 1 ? title : `${String(newParentItems[newParentItems.length - 1][labelKey])} 详情`
      };
    });
  }, [data, title, labelKey]);

  // 准备图表数据
  const displayData = maxItems ? drilldownState.data.slice(0, maxItems) : drilldownState.data;

  // 格式化图表数据，确保横向柱状图正确显示
  const formattedData = displayData.map(item => ({
    name: String(item[labelKey]),
    // 生成分段数据
    ...(segments?.reduce((acc, seg) => {
      acc[seg.valueKey] = Number(item[seg.valueKey]) || 0;
      return acc;
    }, {} as Record<string, number>) ?? {
      value: Number(item[valueKey]) || 0
    }),
    originalItem: item
  }));


  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          {drilldownState.level > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="mr-2 h-8 w-8 p-0"
              onClick={handleBack}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <CardTitle>{drilldownState.currentTitle}</CardTitle>
            {description && drilldownState.level === 0 && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          {formattedData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={formattedData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [`${value}`, '数值']}
                  labelFormatter={(name) => `${name}`}
                />
                <Legend />

                {segments ? (
                  segments.map((seg, index) => (
                    <Bar
                      key={seg.valueKey.toString()}
                      dataKey={seg.valueKey}
                      stackId="stack" // 堆叠模式，去掉即为分组模式
                      fill={seg.color}
                      name={seg.name ?? seg.valueKey.toString()}
                      onClick={(data) => handleBarClick(data.originalItem)}
                      cursor={drilldownKey && getDrilldownData ? "pointer" : undefined}
                    />
                  ))
                ) : (
                  <Bar
                    dataKey="value"
                    fill={barColor}
                    onClick={(data) => handleBarClick(data.originalItem)}
                    cursor={drilldownKey && getDrilldownData ? "pointer" : undefined}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-muted-foreground">暂无数据</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}