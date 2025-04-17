"use client";

import { ReactNode, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface EnhancedStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  tooltip?: string; // 悬停提示文本
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  valueClassName?: string;
  // 数据钻取相关属性
  drilldownData?: any[];
  drilldownTitle?: string;
  drilldownDescription?: string;
  drilldownChartType?: "bar" | "pie";
  drilldownValueKey?: string;
  drilldownLabelKey?: string;
}

export function EnhancedStatCard({
  title,
  value,
  description,
  tooltip,
  icon,
  trend,
  className,
  valueClassName,
  drilldownData,
  drilldownTitle,
  drilldownDescription,
  drilldownChartType = "bar",
  drilldownValueKey = "value",
  drilldownLabelKey = "name",
}: EnhancedStatCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  // 卡片点击处理函数
  const handleCardClick = () => {
    if (drilldownData && drilldownData.length > 0) {
      setDialogOpen(true);
    }
  };

  return (
    <>
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-200", 
          drilldownData && drilldownData.length > 0 ? "cursor-pointer hover:shadow-md" : "",
          className
        )}
        onClick={handleCardClick}
        title={tooltip} // 使用HTML原生title属性实现简单的悬停提示
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold", valueClassName)}>
            <span>{value}</span>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div
              className={cn(
                "mt-1 flex items-center text-xs",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              <span>
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 数据钻取弹窗 */}
      {drilldownData && drilldownData.length > 0 && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{drilldownTitle || title + " 详情"}</DialogTitle>
              {drilldownDescription && (
                <DialogDescription>{drilldownDescription}</DialogDescription>
              )}
            </DialogHeader>
            <div className="h-[400px] w-full py-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={drilldownData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={drilldownLabelKey} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey={drilldownValueKey} fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                关闭
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}