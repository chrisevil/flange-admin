"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { StatCard } from "~/components/dashboard/stat-card";
import { EnhancedStatCard } from "~/components/dashboard/enhanced-stat-card";
import { ProgressCard } from "~/components/dashboard/progress-card";
import { HorizontalBarChartCard } from "~/components/dashboard/horizontal-bar-chart-card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { api } from "~/trpc/react";
import { Clock, Building, Users, UserCog, TrendingUp, Calendar, Briefcase, AlertCircle } from "lucide-react";
import { ChartRender } from "~/components/ui/chart/ChartRender";
import { RankList } from "~/components/dashboard/rank-list";

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

export default function OvertimeDashboardPage() {
  const [activeTab, setActiveTab] = useState("overall");

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

  // 加载状态
  const isLoading = [
    statsQuery,
    companyDataQuery,
    departmentDataQuery,
    leaderDataQuery,
    trendDataQuery,
    attendanceDataQuery,
    businessTripDataQuery,
    reasonDataQuery
  ].some(query => query.isLoading);

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">员工加班状况BI分析</h1>

      {isLoading ? (
        <div className="flex h-96 items-center justify-center">
          <p className="text-lg text-muted-foreground">加载中...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 概览统计卡片 */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <EnhancedStatCard
              title="员工总数"
              value={statsQuery.data?.employees.value ?? 0}
              icon={<Users className="h-4 w-4" />}
              tooltip="公司所有在职员工总数"
              drilldownData={companyDataQuery.data?.map(item => ({
                name: item.company,
                value: item.employeeCount
              }))}
              drilldownTitle="各公司员工分布"
              drilldownDescription="按公司划分的员工数量分布情况"
            />
            <EnhancedStatCard
              title="公司数量"
              value={statsQuery.data?.companies.value ?? 0}
              icon={<Building className="h-4 w-4" />}
              tooltip="系统中注册的公司总数"
            />
            <EnhancedStatCard
              title="部门数量"
              value={statsQuery.data?.departments.value ?? 0}
              icon={<Users className="h-4 w-4" />}
              tooltip="系统中所有部门的总数"
              drilldownData={departmentDataQuery.data?.map(item => ({
                name: item.department,
                value: item.employeeCount
              }))}
              drilldownTitle="各部门员工分布"
              drilldownDescription="按部门划分的员工数量分布情况"
            />
            <EnhancedStatCard
              title="总加班时长(小时)"
              value={statsQuery.data?.overtimeHours.value ?? 0}
              trend={statsQuery.data?.overtimeHours.change ? {
                value: statsQuery.data.overtimeHours.change,
                isPositive: statsQuery.data.overtimeHours.change > 0
              } : undefined}
              icon={<Clock className="h-4 w-4" />}
              tooltip="所有员工加班时长总和，单位为小时"
              drilldownData={companyDataQuery.data?.map(item => ({
                name: item.company,
                value: item.overtimeHours
              }))}
              drilldownTitle="各公司加班时长分布"
              drilldownDescription="按公司划分的加班时长分布情况"
            />
            <EnhancedStatCard
              title="人均加班时长(小时)"
              value={(statsQuery.data?.avgOvertimeHours.value ?? 0).toFixed(1)}
              trend={statsQuery.data?.avgOvertimeHours.change ? {
                value: statsQuery.data.avgOvertimeHours.change,
                isPositive: statsQuery.data.avgOvertimeHours.change > 0
              } : undefined}
              icon={<Clock className="h-4 w-4" />}
              tooltip="总加班时长除以员工总数，反映平均每位员工的加班情况"
              drilldownData={companyDataQuery.data?.map(item => ({
                name: item.company,
                value: item.avgHours
              }))}
              drilldownTitle="各公司人均加班时长"
              drilldownDescription="按公司划分的人均加班时长情况"
            />
            <EnhancedStatCard
              title="加班员工数"
              value={statsQuery.data?.overtimeEmployees.value ?? 0}
              trend={statsQuery.data?.overtimeEmployees.change ? {
                value: statsQuery.data.overtimeEmployees.change,
                isPositive: statsQuery.data.overtimeEmployees.change > 0
              } : undefined}
              icon={<Users className="h-4 w-4" />}
              tooltip="有加班记录的员工数量"
              drilldownData={reasonDataQuery.data?.map(item => ({
                name: item.reason,
                value: item.percentage
              }))}
              drilldownTitle="加班原因分布"
              drilldownDescription="不同加班原因的占比情况"
            />
          </div>

          {/* 分类标签页 */}
          <Tabs defaultValue="overall" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 lg:w-1/2">
              <TabsTrigger value="overall">整体概览</TabsTrigger>
              <TabsTrigger value="company">按公司</TabsTrigger>
              <TabsTrigger value="department">按部门</TabsTrigger>
              <TabsTrigger value="leader">只看领导</TabsTrigger>
            </TabsList>

            {/* 整体概览标签内容 */}
            <TabsContent value="overall" className="space-y-6 pt-4">
              <div className="grid gap-6 md:grid-cols-2">
                {/* 加班趋势图 */}
                <Card>
                  <CardHeader>
                    <CardTitle>加班趋势分析</CardTitle>
                    <CardDescription>近30天加班时长与人数趋势</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px] w-full">
                      <ChartRender
                        chartData={trendDataQuery.data ?? []}
                        chartType="bar"
                        xAxisKey="date"
                        chartConfig={{
                          totalHours: {
                            visible: true,
                            color: "#8884d8",
                            name: "总加班时长(小时)"
                          },
                          employeeCount: {
                            visible: true,
                            color: "#82ca9d",
                            name: "加班人数"
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* 加班原因分析 */}
                <Card>
                  <CardHeader>
                    <CardTitle>加班原因分析</CardTitle>
                    <CardDescription>各类加班原因占比</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px] w-full">
                      <ChartRender
                        chartData={reasonDataQuery.data?.map((item, index) => ({
                          ...item,
                          color: COLORS[index % COLORS.length]
                        })) ?? []}
                        chartType="pie"
                        xAxisKey="reason"
                        chartConfig={{
                          percentage: {
                            visible: true,
                            name: "占比"
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* 出勤分析 */}
                <Card>
                  <CardHeader>
                    <CardTitle>出勤分析</CardTitle>
                    <CardDescription>员工出勤情况分布</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={attendanceDataQuery.data ?? []}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="type"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {(attendanceDataQuery.data ?? []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* 出差分析 */}
                <Card>
                  <CardHeader>
                    <CardTitle>出差分析</CardTitle>
                    <CardDescription>员工出差情况分布</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={businessTripDataQuery.data ?? []}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="type"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {(businessTripDataQuery.data ?? []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* 按公司标签内容 */}
            <TabsContent value="company" className="space-y-6 pt-4">
              <div className="grid gap-6 md:grid-cols-2">
                <HorizontalBarChartCard
                  title="公司加班时长排名(分组)"
                  description="各公司工作日/周末加班时长对比"
                  data={companyDataQuery.data ?? []}
                  valueKey="overtimeHours"
                  labelKey="company"
                  segments={[
                    { valueKey: "weekdayOvertimeHours", color: "#4f46e5", name: "工作日加班" },
                    { valueKey: "weekendOvertimeHours", color: "#f59e0b", name: "周末加班" }
                  ]}
                />

                <HorizontalBarChartCard
                  title="公司工时构成分析"
                  description="各公司正常工时与加班工时对比"
                  data={companyDataQuery.data ?? []}
                  valueKey="totalHours"
                  labelKey="company"
                  segments={[
                    { valueKey: "normalHours", color: "#10b981", name: "正常工时" },
                    { valueKey: "overtimeHours", color: "#ef4444", name: "加班工时" }
                  ]}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <RankList
                  title="公司加班时长排名详情"
                  data={companyDataQuery.data ?? []}
                  valueKey="overtimeHours"
                  labelKey="company"
                  highColor="#ef4444"
                  lowColor="#10b981"
                  drillable={true}
                  onItemClick={(item) => {
                    // 这里可以实现钻取逻辑，例如查询该公司的部门数据
                    console.log('钻取到公司:', item.company);
                    // 可以在这里实现跳转到公司详情页或者显示该公司的详细数据
                    // 例如：setActiveTab("department");
                  }}
                  itemRender={(item, idx, isAboveAvg, avg) => (
                    <div key={idx} className="flex items-center py-2">
                      <span className="w-8 text-center text-muted-foreground">{idx + 1}</span>
                      <span className="flex-1 truncate">{item.company}</span>
                      <span className="ml-2 font-bold" style={{ color: isAboveAvg ? "#ef4444" : "#10b981" }}>
                        {item.overtimeHours}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {isAboveAvg ? "高于" : "低于"}平均值{Math.abs(item.overtimeHours - avg).toFixed(1)}
                      </span>
                    </div>
                  )}
                />
                <RankList
                  title="公司人均加班时长排名详情"
                  data={companyDataQuery.data ?? []}
                  valueKey="avgHours"
                  labelKey="company"
                  highColor="#ef4444"
                  lowColor="#10b981"
                  drillable={true}
                  onItemClick={(item) => {
                    console.log('钻取到公司人均加班:', item.company);
                    // 可以实现跳转或显示该公司的详细数据
                  }}
                  itemRender={(item, idx, isAboveAvg, avg) => (
                    <div key={idx} className="flex items-center py-2">
                      <span className="w-8 text-center text-muted-foreground">{idx + 1}</span>
                      <span className="flex-1 truncate">{item.company}</span>
                      <span className="ml-2 font-bold" style={{ color: isAboveAvg ? "#ef4444" : "#10b981" }}>
                        {item.avgHours.toFixed(1)}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {isAboveAvg ? "高于" : "低于"}平均值{Math.abs(item.avgHours - avg).toFixed(1)}
                      </span>
                    </div>
                  )}
                />
                <RankList
                  title="公司加班率排名详情"
                  data={companyDataQuery.data ?? []}
                  valueKey="overtimeRate"
                  labelKey="company"
                  highColor="#ef4444"
                  lowColor="#10b981"
                  drillable={true}
                  onItemClick={(item) => {
                    console.log('钻取到公司加班率:', item.company);
                    // 可以实现跳转或显示该公司的详细数据
                  }}
                  itemRender={(item, idx, isAboveAvg, avg) => (
                    <div key={idx} className="flex items-center py-2">
                      <span className="w-8 text-center text-muted-foreground">{idx + 1}</span>
                      <span className="flex-1 truncate">{item.company}</span>
                      <span className="ml-2 font-bold" style={{ color: isAboveAvg ? "#ef4444" : "#10b981" }}>
                        {item.overtimeRate.toFixed(1)}%
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {isAboveAvg ? "高于" : "低于"}平均值{Math.abs(item.overtimeRate - avg).toFixed(1)}%
                      </span>
                    </div>
                  )}
                />
              </div>
            </TabsContent>

            {/* 按部门标签内容 */}
            <TabsContent value="department" className="space-y-6 pt-4">
              <div className="grid gap-6 md:grid-cols-2">
                <HorizontalBarChartCard
                  title="部门加班时长排名(分组)"
                  description="各部门工作日/周末加班时长对比"
                  data={departmentDataQuery.data ?? []}
                  valueKey="overtimeHours"
                  labelKey="department"
                  segments={[
                    { valueKey: "weekdayOvertimeHours", color: "#4f46e5", name: "工作日加班" },
                    { valueKey: "weekendOvertimeHours", color: "#f59e0b", name: "周末加班" }
                  ]}
                />

                <HorizontalBarChartCard
                  title="部门工时构成分析"
                  description="各部门正常工时与加班工时对比"
                  data={departmentDataQuery.data ?? []}
                  valueKey="totalHours"
                  labelKey="department"
                  segments={[
                    { valueKey: "normalHours", color: "#10b981", name: "正常工时" },
                    { valueKey: "overtimeHours", color: "#ef4444", name: "加班工时" }
                  ]}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <RankList
                  title="部门加班时长排名详情"
                  data={departmentDataQuery.data ?? []}
                  valueKey="overtimeHours"
                  labelKey="department"
                  highColor="#ef4444"
                  lowColor="#10b981"
                  drillable={true}
                  onItemClick={(item) => {
                    console.log('钻取到部门:', item.department);
                    // 可以实现跳转或显示该部门的详细数据
                  }}
                  itemRender={(item, idx, isAboveAvg, avg) => (
                    <div key={idx} className="flex items-center py-2">
                      <span className="w-8 text-center text-muted-foreground">{idx + 1}</span>
                      <span className="flex-1 truncate">{item.department}</span>
                      <span className="ml-2 font-bold" style={{ color: isAboveAvg ? "#ef4444" : "#10b981" }}>
                        {item.overtimeHours}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {isAboveAvg ? "高于" : "低于"}平均值{Math.abs(item.overtimeHours - avg).toFixed(1)}
                      </span>
                    </div>
                  )}
                />
                <RankList
                  title="部门人均加班时长排名详情"
                  data={departmentDataQuery.data ?? []}
                  valueKey="avgHours"
                  labelKey="department"
                  highColor="#ef4444"
                  lowColor="#10b981"
                  drillable={true}
                  onItemClick={(item) => {
                    console.log('钻取到部门人均加班:', item.department);
                    // 可以实现跳转或显示该部门的详细数据
                  }}
                  itemRender={(item, idx, isAboveAvg, avg) => (
                    <div key={idx} className="flex items-center py-2">
                      <span className="w-8 text-center text-muted-foreground">{idx + 1}</span>
                      <span className="flex-1 truncate">{item.department}</span>
                      <span className="ml-2 font-bold" style={{ color: isAboveAvg ? "#ef4444" : "#10b981" }}>
                        {item.avgHours.toFixed(1)}
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {isAboveAvg ? "高于" : "低于"}平均值{Math.abs(item.avgHours - avg).toFixed(1)}
                      </span>
                    </div>
                  )}
                />
                <RankList
                  title="部门加班率排名详情"
                  data={departmentDataQuery.data ?? []}
                  valueKey="overtimeRate"
                  labelKey="department"
                  highColor="#ef4444"
                  lowColor="#10b981"
                  itemRender={(item, idx, isAboveAvg, avg) => (
                    <div key={idx} className="flex items-center py-2">
                      <span className="w-8 text-center text-muted-foreground">{idx + 1}</span>
                      <span className="flex-1 truncate">{item.department}</span>
                      <span className="ml-2 font-bold" style={{ color: isAboveAvg ? "#ef4444" : "#10b981" }}>
                        {item.overtimeRate.toFixed(1)}%
                      </span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {isAboveAvg ? "高于" : "低于"}平均值{Math.abs(item.overtimeRate - avg).toFixed(1)}%
                      </span>
                    </div>
                  )}
                />
              </div>
            </TabsContent>

            {/* 只看领导标签内容 */}
            <TabsContent value="leader" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>领导与团队加班对比</CardTitle>
                  <CardDescription>领导加班时长与团队平均加班时长对比</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={(leaderDataQuery.data ?? []).slice(0, 10)}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={120}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="overtimeHours" name="领导加班时长" fill="#8884d8" />
                        <Bar dataKey="subordinatesAvgHours" name="团队平均加班时长" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>领导加班详细数据</CardTitle>
                  <CardDescription>领导与团队加班情况对比详细数据</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-2 text-left">姓名</th>
                          <th className="px-4 py-2 text-left">公司</th>
                          <th className="px-4 py-2 text-left">部门</th>
                          <th className="px-4 py-2 text-left">职位</th>
                          <th className="px-4 py-2 text-left">领导加班时长(小时)</th>
                          <th className="px-4 py-2 text-left">团队平均加班时长(小时)</th>
                          <th className="px-4 py-2 text-left">差值(小时)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(leaderDataQuery.data ?? []).map((item, index) => (
                          <tr key={index} className="border-b">
                            <td className="px-4 py-2">{item.name}</td>
                            <td className="px-4 py-2">{item.company}</td>
                            <td className="px-4 py-2">{item.department}</td>
                            <td className="px-4 py-2">{item.title}</td>
                            <td className="px-4 py-2">{item.overtimeHours}</td>
                            <td className="px-4 py-2">{item.subordinatesAvgHours}</td>
                            <td className={`px-4 py-2 ${item.difference < 0 ? 'text-red-500' : 'text-green-500'}`}>
                              {item.difference > 0 ? `+${item.difference}` : item.difference}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}