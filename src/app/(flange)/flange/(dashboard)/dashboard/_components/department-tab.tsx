"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { ArrowUp, ArrowDown, ArrowRight, Users, Clock } from 'lucide-react';
// Remove ChartRender and ChartConfig imports
// import { ChartRender } from "~/components/ui/chart/ChartRender";
// import { type ChartConfig } from "~/components/ui/chart";
import { RankList } from "~/components/dashboard/rank-list";
import { StatCard } from '~/components/dashboard/stat-card';
import { HorizontalBarChartCard } from "~/components/dashboard/horizontal-bar-chart-card"; // Add import

// 模拟员工数据类型
interface EmployeeDetail {
  id: string;
  name: string;
  overtimeHours: number;
  level: 'A' | 'B' | 'C' | 'D';
}

// 模拟部门数据类型 (扩展了原始数据)
interface DepartmentData {
  department: string;
  employeeCount: number;
  avgDailyOvertimeHours: number; // 人均日加班时长
  lastMonthAvgHours?: number; // 上月人均加班时长 (可选，用于对比)
  overtimeLevelDistribution: {
    A: number; // A级人数
    B: number; // B级人数
    C: number; // C级人数
    D: number; // D级人数
  };
  employeesByLevel: {
    A: EmployeeDetail[];
    B: EmployeeDetail[];
    C: EmployeeDetail[];
    D: EmployeeDetail[];
  };
}

interface DepartmentTabProps {
  departmentDataQuery: { data?: DepartmentData[], isLoading: boolean };
}

// 模拟数据生成函数 (实际应从API获取)
const generateMockDepartmentData = (originalData: any[] | undefined): DepartmentData[] => {
  if (!originalData) return [];
  return originalData.map((dept: any) => {
    const employeeCount = dept.employeeCount || Math.floor(Math.random() * 50) + 10; // 模拟员工数
    const avgDailyOvertimeHours = dept.avgHours ? dept.avgHours / 22 : Math.random() * 3; // 模拟人均日加班
    const lastMonthAvgHours = avgDailyOvertimeHours * (Math.random() * 0.4 + 0.8); // 模拟上月数据

    // 模拟ABCD等级分布和员工
    const levels = ['A', 'B', 'C', 'D'] as const;
    const distribution = { A: 0, B: 0, C: 0, D: 0 };
    const employeesByLevel: { A: EmployeeDetail[], B: EmployeeDetail[], C: EmployeeDetail[], D: EmployeeDetail[] } = { A: [], B: [], C: [], D: [] };

    for (let i = 0; i < employeeCount; i++) {
      const level = levels[Math.floor(Math.random() * 4)];
      distribution[level]++;
      employeesByLevel[level].push({
        id: `emp-${dept.department}-${i}`,
        name: `员工${String.fromCharCode(65 + i)}`,
        overtimeHours: Math.random() * 80 + 10, // 模拟月总加班
        level: level,
      });
    }

    return {
      ...dept,
      department: dept.department,
      employeeCount: employeeCount,
      avgDailyOvertimeHours: parseFloat(avgDailyOvertimeHours.toFixed(1)),
      lastMonthAvgHours: parseFloat(lastMonthAvgHours.toFixed(1)),
      overtimeLevelDistribution: distribution,
      employeesByLevel: employeesByLevel,
    };
  });
};

// 加班等级颜色配置
const LEVEL_COLORS: Record<'A' | 'B' | 'C' | 'D', string> = {
  A: '#ef4444', // Red
  B: '#f59e0b', // Orange
  C: '#4f46e5', // Indigo
  D: '#10b981', // Green
};

export function DepartmentTab({ departmentDataQuery }: DepartmentTabProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 使用模拟数据处理函数
  const processedData = React.useMemo(() =>
    generateMockDepartmentData(departmentDataQuery.data)
      .sort((a, b) => b.avgDailyOvertimeHours - a.avgDailyOvertimeHours), // 按人均日加班降序
    [departmentDataQuery.data]
  );

  const handleRankItemClick = (item: DepartmentData) => {
    setSelectedDepartment(item);
    setIsModalOpen(true);
  };

  // Removed: No longer needed
  // const getChartConfig = (deptData: DepartmentData): ChartConfig => ({
  //   A: { label: 'A级', color: LEVEL_COLORS.A },
  //   B: { label: 'B级', color: LEVEL_COLORS.B },
  //   C: { label: 'C级', color: LEVEL_COLORS.C },
  //   D: { label: 'D级', color: LEVEL_COLORS.D },
  // });

  // // Removed: No longer needed as separate charts
  // const getChartData = (deptData: DepartmentData) => [
  //   {
  //     level: '等级分布',
  //     A: deptData.overtimeLevelDistribution.A,
  //     B: deptData.overtimeLevelDistribution.B,
  //     C: deptData.overtimeLevelDistribution.C,
  //     D: deptData.overtimeLevelDistribution.D,
  //   },
  // ];

  if (departmentDataQuery.isLoading) {
    return <p>加载中...</p>;
  }

  if (!processedData || processedData.length === 0) {
    return <p>暂无部门数据。</p>;
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 部门人均日加班排名 - Spanning 1 column on large screens */}
        <div className="lg:col-span-1">
          <RankList
            title="部门人均日加班时长排名"
            data={processedData}
            valueKey="avgDailyOvertimeHours"
            labelKey="department"
            highColor="#ef4444"
            lowColor="#10b981"
            drillable={true}
            onItemClick={handleRankItemClick}
            itemRender={(item, idx, isAboveAvg, avg) => {
              const change = item.lastMonthAvgHours ? item.avgDailyOvertimeHours - item.lastMonthAvgHours : 0;
              const ChangeIcon = change > 0 ? ArrowUp : change < 0 ? ArrowDown : ArrowRight;
              const iconColor = change > 0 ? 'text-red-500' : change < 0 ? 'text-green-500' : 'text-gray-500';

              return (
                <div key={idx} className="flex cursor-pointer items-center py-2 hover:bg-muted/50" onClick={() => handleRankItemClick(item)}>
                  <span className="w-8 text-center text-muted-foreground">{idx + 1}</span>
                  <span className="flex-1 truncate font-medium">{item.department}</span>
                  {item.lastMonthAvgHours !== undefined && (
                    <span className={`ml-2 flex items-center text-xs ${iconColor}`}>
                      <ChangeIcon className="mr-1 h-3 w-3" />
                      {Math.abs(change).toFixed(1)}
                    </span>
                  )}
                  <span className="ml-auto font-bold" style={{ color: isAboveAvg ? '#ef4444' : '#10b981' }}>
                    {item.avgDailyOvertimeHours.toFixed(1)} 小时/日
                  </span>
                </div>
              );
            }}
          />
        </div>

        {/* 部门基础信息卡片 & 分布图 - Spanning 2 columns on large screens */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
          {processedData.map((dept, idx) => { // Add idx here
            // Prepare segments for HorizontalBarChartCard
            const segments = (['A', 'B', 'C', 'D'] as const).map(level => ({
              valueKey: level,
              color: LEVEL_COLORS[level],
              name: `${level}级 (${dept.overtimeLevelDistribution[level]})` // Add count to name
            }));

            // 准备员工等级分布数据 - 每个等级一条记录，用于排行榜显示
            const levelEmployeeData = (['A', 'B', 'C', 'D'] as const).map(level => ({
              level: level,
              count: dept.overtimeLevelDistribution[level],
              color: LEVEL_COLORS[level],
              employees: dept.employeesByLevel[level]
            })).sort((a, b) => b.count - a.count); // 按人数降序排序

            // 准备柱状图数据 - 单条记录包含所有等级
            const chartData = [{
              distributionLabel: '人数分布', // 修改为有意义的标签
              A: dept.overtimeLevelDistribution.A,
              B: dept.overtimeLevelDistribution.B,
              C: dept.overtimeLevelDistribution.C,
              D: dept.overtimeLevelDistribution.D
            }];

            return (
              <Card key={`${dept.department}-${idx}-info`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{dept.department}</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dept.employeeCount} 人</div>
                  <p className="text-xs text-muted-foreground">
                    人均日加班: {dept.avgDailyOvertimeHours.toFixed(1)} 小时
                  </p>

                  {/* 横向堆叠柱状图 */}
                  <div className="mt-2 h-[60px] w-full">
                    <HorizontalBarChartCard
                      title="等级分布"
                      data={chartData}
                      labelKey="distributionLabel"
                      segments={segments}
                      className="h-full border-none p-0 shadow-none"
                    />
                  </div>

                  {/* 等级员工排行榜 */}
                  <div className="mt-2 text-xs">
                    {levelEmployeeData.map(levelData => (
                      levelData.count > 0 && (
                        <div key={levelData.level} className="flex items-center justify-between mt-1">
                          <span style={{ color: levelData.color }} className="font-medium">
                            {levelData.level}级: {levelData.count}人
                          </span>
                          {levelData.employees.length > 0 && (
                            <span className="text-muted-foreground truncate ml-2 flex-1">
                              {levelData.employees.slice(0, 3).map(emp => emp.name).join(', ')}
                              {levelData.employees.length > 3 ? ` 等${levelData.employees.length}人` : ''}
                            </span>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Removed: Separate chart rendering loop */}
        {/* {processedData.slice(0, 2).map((dept) => ( ... ))} */}
      </div>

      {/* 钻取弹窗 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedDepartment?.department} - 加班等级详情</DialogTitle>
            <DialogDescription>
              各加班等级下的员工列表。
            </DialogDescription>
          </DialogHeader>
          {selectedDepartment && (
            <div className="mt-4 grid max-h-[60vh] grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2">
              {(['A', 'B', 'C', 'D'] as const).map((level) => (
                <div key={level}>
                  <h3 className="mb-2 font-semibold" style={{ color: LEVEL_COLORS[level] }}>
                    {level}级 ({selectedDepartment.employeesByLevel[level].length}人)
                  </h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>姓名</TableHead>
                          <TableHead className="text-right">月加班时长</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedDepartment.employeesByLevel[level].length > 0 ? (
                          selectedDepartment.employeesByLevel[level].map((emp) => (
                            <TableRow key={emp.id}>
                              <TableCell>{emp.name}</TableCell>
                              <TableCell className="text-right">{emp.overtimeHours.toFixed(1)}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center text-muted-foreground">
                              无
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}