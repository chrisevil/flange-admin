"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ChartRender } from "~/components/ui/chart/ChartRender";
import { type ChartConfig } from "~/components/ui/chart";
import { HorizontalBarChartCard } from "~/components/dashboard/horizontal-bar-chart-card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

// Define the custom label renderer (can be reused or moved to a shared location)
const renderCustomBarLabel = ({ x, y, width, height, value }: any) => {
  // Position the label slightly above the bar
  const yPos = y - 5; // Adjust for vertical bars
  const xPos = x + width / 2;

  // Basic styling, can be customized further
  return (
    <text
      x={xPos}
      y={yPos}
      fill="#666"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
    >
      {value}
    </text>
  );
};

// 定义 d1.json 中 system_view 数据的类型
interface Employee {
  user_id: string;
  name: string;
  department: string;
  root_department_name: string; // 添加根部门字段
  overtime_hours: number;
  daily_avg_overtime: number;
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
  total_overtime_hours: number;
  avg_overtime_hours_per_day: number;
  overtime_distribution: OvertimeDistribution[];
  employees: Employee[];
}

interface SystemViewTabProps {
  systemViewData: SystemViewData[] | undefined | null;
  COLORS: string[];
}

// 部门分组组件
interface DepartmentGroupProps {
  title: string;
  employees: Employee[];
  isOpen: boolean;
  onToggle: () => void;
}

function DepartmentGroup({ title, employees, isOpen, onToggle }: DepartmentGroupProps) {
  return (
    <>
      <TableRow className="group hover:bg-muted/50 cursor-pointer" onClick={onToggle}>
        <TableCell colSpan={5} className="font-medium">
          <div className="flex items-center">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 mr-2 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
            )}
            {title} ({employees.length}人)
          </div>
        </TableCell>
      </TableRow>
      {isOpen &&
        employees.map((employee) => (
          <TableRow key={employee.user_id} className="bg-muted/20">
            <TableCell className="pl-8">{employee.name}</TableCell>
            <TableCell>{employee.root_department_name}{' > '}{employee.department}</TableCell>
            <TableCell>{employee.overtime_hours.toFixed(1)} 小时</TableCell>
            <TableCell>{employee.daily_avg_overtime.toFixed(1)} 小时</TableCell>
            <TableCell>{employee.overtime_interval}</TableCell>
          </TableRow>
        ))}
    </>
  );
}

export function SystemViewTab({ systemViewData, COLORS }: SystemViewTabProps) {
  if (!systemViewData || systemViewData.length === 0) {
    return <p>暂无系统视图数据。</p>;
  }

  // 状态管理：跟踪每个系统中每个根部门的展开/折叠状态
  const [openGroups, setOpenGroups] = useState<Record<string, Record<string, boolean>>>({});

  // 切换部门组的展开/折叠状态
  const toggleGroup = (systemName: string, groupName: string) => {
    setOpenGroups((prev) => {
      const systemGroups = prev[systemName] || {};
      return {
        ...prev,
        [systemName]: {
          ...systemGroups,
          [groupName]: !systemGroups[groupName],
        },
      };
    });
  };

  return (
    <div className="space-y-6">
      {systemViewData.map((system, index) => {
        // 为加班时长分布图表准备配置
        const chartConfig: ChartConfig & Record<string, { visible: boolean }> = {
          count: {
            label: "人数",
            color: COLORS[index % COLORS.length],
            visible: true,
          },
        };

        // 按根部门分组员工数据
        const employeesByRootDept = useMemo(() => {
          const grouped: Record<string, Employee[]> = {};
          
          system.employees.forEach((employee) => {
            const rootDept = employee.root_department_name || "其他";
            if (!grouped[rootDept]) {
              grouped[rootDept] = [];
            }
            grouped[rootDept].push(employee);
          });
          
          return grouped;
        }, [system.employees]);

        // 为横向柱状图准备数据 - 按加班时长区间分段统计
        const rootDeptChartData = useMemo(() => {
          // 定义加班时长区间及对应的颜色
          const overtimeIntervals = [
            { key: "小于1小时", color: "#4CAF50" }, // 绿色
            { key: "1-2小时", color: "#2196F3" },  // 蓝色
            { key: "2-3小时", color: "#FFC107" },  // 黄色
            { key: "大于3小时", color: "#F44336" }  // 红色
          ];

          return Object.entries(employeesByRootDept).map(([deptName, employees]) => {
            // 计算该部门的总加班时长和平均加班时长
            const totalHours = employees.reduce((sum, emp) => sum + emp.overtime_hours, 0);
            const avgHours = totalHours / employees.length;
            
            // 按加班时长区间统计人数
            const intervalCounts = overtimeIntervals.reduce((acc, interval) => {
              // 计算该区间的员工数量
              const count = employees.filter(emp => emp.overtime_interval === interval.key).length;
              // 使用区间名作为键
              acc[interval.key.replace(/-/g, "_")] = count;
              return acc;
            }, {} as Record<string, number>);
            
            return {
              name: deptName,
              ...intervalCounts,
              employeeCount: employees.length,
              totalHours: totalHours,
              avgHours: avgHours,
            };
          }).sort((a, b) => b.avgHours - a.avgHours); // 按平均加班时长降序排序
        }, [employeesByRootDept]);

        // 按部门进一步分组
        const employeesByDept = useMemo(() => {
          const result: Record<string, Record<string, Employee[]>> = {};
          
          Object.entries(employeesByRootDept).forEach(([rootDept, employees]) => {
            if (!result[rootDept]) {
              result[rootDept] = {};
            }
            
            employees.forEach((employee) => {
              const dept = employee.department;
              if (!result[rootDept][dept]) {
                result[rootDept][dept] = [];
              }
              result[rootDept][dept].push(employee);
            });
          });
          
          return result;
        }, [employeesByRootDept]);

        return (
          <Card key={system.system_name}>
            <CardHeader>
              <CardTitle>
                {system.system_name} (总人数: {system.total_employees},
                人均每工作日加班: {system.avg_overtime_hours_per_day} 小时)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 左侧：图表区域 */}
                <div>
                  <Tabs defaultValue="department" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="department">部门加班情况</TabsTrigger>
                      <TabsTrigger value="distribution">加班时长分布</TabsTrigger>
                    </TabsList>
                    <TabsContent value="department">
                      <HorizontalBarChartCard
                        title="部门加班时长分布"
                        description="按加班时长区间统计各部门人数分布"
                        data={rootDeptChartData}
                        valueKey="avgHours"
                        labelKey="name"
                        maxItems={10}
                        segments={[
                          { valueKey: "小于1小时", color: "#4CAF50", name: "小于1小时" },
                          { valueKey: "1_2小时", color: "#2196F3", name: "1-2小时" },
                          { valueKey: "2_3小时", color: "#FFC107", name: "2-3小时" },
                          { valueKey: "大于3小时", color: "#F44336", name: "大于3小时" }
                        ]}
                      />
                    </TabsContent>
                    <TabsContent value="distribution">
                      <h3 className="mb-2 text-lg font-semibold">加班时长分布</h3>
                      <ChartRender
                        chartData={system.overtime_distribution}
                        chartConfig={chartConfig}
                        chartType="bar"
                        xAxisKey="interval"
                        renderCustomBarLabel={renderCustomBarLabel}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* 右侧：员工加班详情 */}
                <div>
                <h3 className="mb-2 text-lg font-semibold">员工加班详情</h3>
                <div className="max-h-[600px] overflow-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>姓名</TableHead>
                        <TableHead>部门</TableHead>
                        <TableHead>月加班总时长</TableHead>
                        <TableHead>平均加班时长</TableHead>
                        <TableHead>时长区间</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {system.employees.length > 0 ? (
                        Object.entries(employeesByRootDept).map(([rootDept, deptEmployees]) => {
                          // 获取该根部门的展开/折叠状态
                          const isRootOpen = openGroups[system.system_name]?.[rootDept] || false;
                          
                          return (
                            <React.Fragment key={rootDept}>
                              {/* 根部门行（可点击展开/折叠） */}
                              <TableRow 
                                className={cn(
                                  "group hover:bg-muted/50 cursor-pointer font-semibold",
                                  isRootOpen ? "bg-muted/30" : ""
                                )}
                                onClick={() => toggleGroup(system.system_name, rootDept)}
                              >
                                <TableCell colSpan={5}>
                                  <div className="flex items-center">
                                    {isRootOpen ? (
                                      <ChevronDown className="h-5 w-5 mr-2" />
                                    ) : (
                                      <ChevronRight className="h-5 w-5 mr-2" />
                                    )}
                                    {rootDept} ({deptEmployees.length}人)
                                  </div>
                                </TableCell>
                              </TableRow>
                              
                              {/* 如果根部门展开，显示下属各部门 */}
                              {isRootOpen && Object.entries(employeesByDept[rootDept] || {}).map(([dept, employees]) => {
                                // 获取该部门的展开/折叠状态
                                const isDeptOpen = openGroups[system.system_name]?.[`${rootDept}-${dept}`] || false;
                                
                                return (
                                  <DepartmentGroup
                                    key={`${rootDept}-${dept}`}
                                    title={dept}
                                    employees={employees}
                                    isOpen={isDeptOpen}
                                    onToggle={() => toggleGroup(system.system_name, `${rootDept}-${dept}`)}
                                  />
                                );
                              })}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            暂无员工加班数据
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
