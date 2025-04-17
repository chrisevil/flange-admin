"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartRender } from "~/components/ui/chart/ChartRender"; // Import ChartRender
import { type ChartConfig } from "~/components/ui/chart";

// Define the custom label renderer (can be reused or moved to a shared location)
const renderCustomBarLabel = ({ x, y, width, height, value }: any) => {
  // Position the label slightly above the bar
  const yPos = y - 5; // Adjust for vertical bars
  const xPos = x + width / 2;

  // Basic styling, can be customized further
  return (
    <text x={xPos} y={yPos} fill="#666" textAnchor="middle" dominantBaseline="central" fontSize={12}>
      {value}
    </text>
  );
};

// 定义 d1.json 中 system_view 数据的类型
interface Employee {
  name: string;
  department: string;
  overtime_hours: number;
  overtime_interval: string;
}

interface OvertimeDistribution {
  interval: string;
  count: number;
  percentage: number;
}

interface SystemViewData {
  system_name: string;
  total_employees: number;
  overtime_distribution: OvertimeDistribution[];
  employees: Employee[];
}

interface SystemViewTabProps {
  systemViewData: SystemViewData[] | undefined | null;
  COLORS: string[];
}

export function SystemViewTab({ systemViewData, COLORS }: SystemViewTabProps) {
  if (!systemViewData || systemViewData.length === 0) {
    return <p>暂无系统视图数据。</p>;
  }

  return (
    <div className="space-y-6">
      {systemViewData.map((system, index) => {
        // Prepare chart config for ChartRender
        const chartConfig: ChartConfig & Record<string, { visible: boolean }> = {
          count: {
            label: "人数",
            color: COLORS[index % COLORS.length],
            visible: true,
          },
        };

        return (
          <Card key={system.system_name}>
            <CardHeader>
              <CardTitle>{system.system_name} (总人数: {system.total_employees})</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              {/* 加班分布图表 */}
              <div>
                <h3 className="mb-2 text-lg font-semibold">加班时长分布</h3>
                {/* Replace ResponsiveContainer and BarChart with ChartRender */}
                <ChartRender
                  chartData={system.overtime_distribution}
                  chartConfig={chartConfig}
                  chartType="bar"
                  xAxisKey="interval" // Use interval for X-axis categories
                  renderCustomBarLabel={renderCustomBarLabel} // Add custom label renderer
                />
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold">员工加班详情</h3>
                <div className="max-h-80 overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>姓名</TableHead>
                        <TableHead>部门</TableHead>
                        <TableHead>加班时长</TableHead>
                        <TableHead>时长区间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {system.employees.length > 0 ? (
                        system.employees.map((employee) => (
                          <TableRow key={employee.name}>
                            <TableCell>{employee.name}</TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>{employee.overtime_hours.toFixed(1)} 小时</TableCell>
                            <TableCell>{employee.overtime_interval}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">暂无员工加班数据</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  );
}