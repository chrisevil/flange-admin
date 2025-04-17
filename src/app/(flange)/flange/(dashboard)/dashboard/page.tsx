"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/react";
import React from "react";

// 颜色方案
const COLORS = [
  "#4f46e5", // 紫蓝色
  "#10b981", // 绿色
  "#f59e0b", // 橙色
  "#ef4444", // 红色
  "#8b5cf6", // 紫色
  "#06b6d4", // 青色
  "#ec4899"  // 粉色
];

// 导入组件
import { StatsCards } from "./_components/stats-cards";
import { OverallTab } from "./_components/overall-tab";
import { CompanyTab } from "./_components/company-tab";
import { DepartmentTab } from "./_components/department-tab";
import { LeaderTab } from "./_components/leader-tab";
import { SpecificCompanyTab } from "./_components/specific-company-tab";
import { SystemViewTab } from "./_components/system-view-tab"; // 导入新组件

export default function OvertimeDashboardPage() {
  const [activeTab, setActiveTab] = useState("overall");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  // 模拟 d1.json 数据结构
  const mockSystemViewData = {
    system_view: [
      {
        system_name: "研发系统",
        total_employees: 50,
        overtime_distribution: [
          { interval: "小于1小时", count: 10, percentage: 20 },
          { interval: "1-2小时", count: 20, percentage: 40 },
          { interval: "2-3小时", count: 15, percentage: 30 },
          { interval: "大于3小时", count: 5, percentage: 10 },
        ],
        employees: [
          { name: "张三", department: "研发部", overtime_hours: 1.5, overtime_interval: "1-2小时" },
          { name: "李四", department: "研发部", overtime_hours: 3.2, overtime_interval: "大于3小时" },
        ],
      },
      {
        system_name: "运营系统",
        total_employees: 35,
        overtime_distribution: [
          { interval: "小于1小时", count: 15, percentage: 42.86 },
          { interval: "1-2小时", count: 10, percentage: 28.57 },
          { interval: "2-3小时", count: 8, percentage: 22.86 },
          { interval: "大于3小时", count: 2, percentage: 5.71 },
        ],
        employees: [
          { name: "王五", department: "运营部", overtime_hours: 0.5, overtime_interval: "小于1小时" },
          { name: "赵六", department: "运营部", overtime_hours: 2.5, overtime_interval: "2-3小时" },
        ],
      },
    ],
  };
  // 注意：这里暂时使用模拟数据，实际应用中应替换为 API 调用
  const systemViewDataQuery = { data: mockSystemViewData.system_view, isLoading: false }; // 模拟 tRPC 查询对象

  // 获取数据
  const statsQuery = api.dashboard.getOvertimeStats.useQuery();
  const companyDataQuery = api.dashboard.getCompanyOvertimeData.useQuery();
  const departmentDataQuery = api.dashboard.getDepartmentOvertimeData.useQuery();
  const leaderDataQuery = api.dashboard.getLeaderOvertimeData.useQuery();
  const trendDataQuery = api.dashboard.getOvertimeTrendData.useQuery({ days: 30 });
  const attendanceDataQuery = api.dashboard.getAttendanceData.useQuery();
  const businessTripDataQuery = api.dashboard.getBusinessTripData.useQuery();
  const reasonDataQuery = api.dashboard.getOvertimeReasonData.useQuery();

  // 打印数据
  console.log('统计信息:', statsQuery.data);
  console.log('公司数据:', companyDataQuery.data);
  console.log('部门数据:', departmentDataQuery.data);
  console.log('领导数据:', leaderDataQuery.data);
  console.log('趋势数据:', trendDataQuery.data);
  console.log('出勤数据:', attendanceDataQuery.data);
  console.log('出差数据:', businessTripDataQuery.data);
  console.log('加班原因数据:', reasonDataQuery.data);
  console.log('系统视图数据:', systemViewDataQuery.data); // 打印模拟数据

  // 加载状态
  const isLoading = [
    statsQuery,
    companyDataQuery,
    departmentDataQuery,
    leaderDataQuery,
    trendDataQuery,
    attendanceDataQuery,
    businessTripDataQuery,
    reasonDataQuery,
    // systemViewDataQuery // 暂时注释掉，因为我们用的是模拟数据
  ].some(query => query.isLoading);

  return (
    <div className="container p-8">
      <h1 className="mb-8 text-3xl font-bold">员工加班状况BI分析</h1>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg text-muted-foreground">加载中...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 概览统计卡片 */}
          <StatsCards
            statsQuery={statsQuery}
            companyDataQuery={companyDataQuery}
            departmentDataQuery={departmentDataQuery}
            reasonDataQuery={reasonDataQuery}
          />

          {/* 分类标签页 */}
          <Tabs defaultValue="overall" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6 lg:w-5/6">
              <TabsTrigger value="overall">整体概览</TabsTrigger>
              <TabsTrigger value="company">分公司情况</TabsTrigger>
              <TabsTrigger value="department">总部部门情况</TabsTrigger>
              <TabsTrigger value="leader">只看领导</TabsTrigger>
              <TabsTrigger value="specific-company">具体公司</TabsTrigger>
              <TabsTrigger value="system-view">按系统</TabsTrigger>
            </TabsList>

            {/* 整体概览标签内容 */}
            <TabsContent value="overall">
              <OverallTab
                trendDataQuery={trendDataQuery}
                reasonDataQuery={reasonDataQuery}
                attendanceDataQuery={attendanceDataQuery}
                businessTripDataQuery={businessTripDataQuery}
                COLORS={COLORS}
              />
            </TabsContent>

            {/* 按公司标签内容 */}
            <TabsContent value="company">
              <CompanyTab
                companyDataQuery={companyDataQuery}
                setSelectedCompany={setSelectedCompany}
                setActiveTab={setActiveTab}
              />
            </TabsContent>

            {/* 按部门标签内容 */}
            <TabsContent value="department">
              <DepartmentTab
                departmentDataQuery={departmentDataQuery}
              />
            </TabsContent>

            {/* 只看领导标签内容 */}
            <TabsContent value="leader">
              <LeaderTab
                leaderDataQuery={leaderDataQuery}
              />
            </TabsContent>

            {/* 具体公司标签内容 */}
            <TabsContent value="specific-company">
              <SpecificCompanyTab
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany} // 添加此行
                companyDataQuery={companyDataQuery}
              />
            </TabsContent>

            {/* 按系统标签内容 */}
            <TabsContent value="system-view">
              <SystemViewTab
                systemViewData={systemViewDataQuery.data}
                COLORS={COLORS}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}