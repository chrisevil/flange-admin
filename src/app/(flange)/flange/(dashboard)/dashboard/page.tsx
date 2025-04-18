"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import React from "react";

// 导入数据获取函数
import {
  fetchRawData,
  processAllData
} from "./_libs/data-fetcher";

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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(() => {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth === 1 ? 12 : currentMonth - 1;
  });

  // 状态管理
  const [statsData, setStatsData] = useState<any>(null);
  const [companyData, setCompanyData] = useState<any>(null);
  const [departmentData, setDepartmentData] = useState<any>(null);
  const [leaderData, setLeaderData] = useState<any>(null);
  const [trendData, setTrendData] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [businessTripData, setBusinessTripData] = useState<any>(null);
  const [reasonData, setReasonData] = useState<any>(null);
  const [systemViewData, setSystemViewData] = useState<any>(null);
  const [unitCategoriesData, setUnitCategoriesData] = useState<any>(null);

  // 获取数据
  useEffect(() => {
    async function fetchAllData() {
      setIsLoading(true);
      try {
        // 只调用一次API获取原始数据，然后在前端进行处理
        const rawData = await fetchRawData(selectedYear, selectedMonth);
        const processedData = processAllData(rawData);

        // 设置各个状态
        setStatsData(processedData.stats);
        setCompanyData(processedData.company);
        setDepartmentData(processedData.department);
        setLeaderData(processedData.leader);
        setTrendData(processedData.trend);
        setAttendanceData(processedData.attendance);
        setBusinessTripData(processedData.businessTrip);
        setReasonData(processedData.reason);
        setSystemViewData(processedData.systemView);
        setUnitCategoriesData(processedData.unitCategories);

        // 打印数据
        console.log('原始数据:', rawData);
        console.log('处理后的数据:', processedData);
      } catch (error) {
        console.error('获取数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllData();
  }, []);  // 空依赖数组，仅在组件挂载时执行一次

  // 创建与tRPC查询对象兼容的数据结构
  const statsQuery = { data: statsData, isLoading: false };
  const companyDataQuery = { data: companyData, isLoading: false };
  const departmentDataQuery = { data: departmentData, isLoading: false };
  const leaderDataQuery = { data: leaderData, isLoading: false };
  const trendDataQuery = { data: trendData, isLoading: false };
  const attendanceDataQuery = { data: attendanceData, isLoading: false };
  const businessTripDataQuery = { data: businessTripData, isLoading: false };
  const reasonDataQuery = { data: reasonData, isLoading: false };
  const systemViewDataQuery = { data: systemViewData, isLoading: false };
  const unitCategoriesDataQuery = { data: unitCategoriesData, isLoading: false };

  return (
    <div className="container p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">员工加班状况BI分析</h1>
        <div className="flex space-x-4">
          <select
            className="border rounded px-3 py-1"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}年</option>
            ))}
          </select>
          <select
            className="border rounded px-3 py-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>{month}月</option>
            ))}
          </select>
        </div>
      </div>

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
                unitCategoriesDataQuery={unitCategoriesDataQuery}
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