import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "~/components/ui/command";
import { StatCard } from "~/components/dashboard/stat-card";
import { RankList } from "~/components/dashboard/rank-list";
import { Users, Clock, ChevronsUpDown, Check } from "lucide-react";
// Remove recharts BarChart import, keep others if needed elsewhere
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { ChartRender } from "~/components/ui/chart/ChartRender"; // Import ChartRender
import { type ChartConfig } from "~/components/ui/chart";

// Define the custom label renderer
const renderCustomBarLabel = ({ x, y, width, height, value }: any) => {
  // Position the label slightly above the bar
  // Adjust positioning based on chart layout (horizontal/vertical)
  // This example assumes horizontal bars, adjust if needed
  const yPos = y + height / 2;
  const xPos = x + width + 5; // Position to the right for horizontal

  // Basic styling, can be customized further
  return (
    <text x={xPos} y={yPos} fill="#666" textAnchor="start" dominantBaseline="middle" fontSize={12}>
      {value}
    </text>
  );
};

interface SpecificCompanyTabProps {
  selectedCompany: string | null;
  setSelectedCompany: (company: string | null) => void; // 添加回调函数类型
  companyDataQuery: any;
}

export function SpecificCompanyTab({
  selectedCompany,
  setSelectedCompany, // 接收回调函数
  companyDataQuery,
}: SpecificCompanyTabProps) {
  const [open, setOpen] = useState(false);

  // Prepare data and config for the first chart (Department Overtime)
  const departmentOvertimeData = companyDataQuery.data
    ?.find((company: any) => company.company === selectedCompany)?.departments
    .sort((a: any, b: any) => b.overtimeHours - a.overtimeHours)
    .slice(0, 10) || [];

  const departmentOvertimeConfig: ChartConfig & Record<string, { visible: boolean }> = {
    weekdayOvertimeHours: {
      label: "工作日加班",
      color: "#4f46e5",
      visible: true,
    },
    weekendOvertimeHours: {
      label: "周末加班",
      color: "#f59e0b",
      visible: true,
    },
  };

  // Prepare data and config for the second chart (Department Hours Composition)
  const departmentHoursData = companyDataQuery.data
    ?.find((company: any) => company.company === selectedCompany)?.departments
    .sort((a: any, b: any) => b.totalHours - a.totalHours)
    .slice(0, 10) || [];

  const departmentHoursConfig: ChartConfig & Record<string, { visible: boolean }> = {
    normalHours: {
      label: "正常工时",
      color: "#10b981",
      visible: true,
    },
    overtimeHours: {
      label: "加班工时",
      color: "#ef4444",
      visible: true,
    },
  };


  return (
    <div className="space-y-6 pt-4">
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>选择公司</CardTitle>
            <CardDescription>选择要查看详细数据的公司</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedCompany
                      ? companyDataQuery.data?.find((company: any) => company.company === selectedCompany)?.company
                      : "请选择公司..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                  <Command>
                    <CommandInput placeholder="搜索公司..." />
                    <CommandList>
                      <CommandEmpty>未找到公司</CommandEmpty>
                      <CommandGroup>
                        {companyDataQuery.data?.map((company: any) => (
                          <CommandItem
                            key={company.company}
                            value={company.company}
                            onSelect={(currentValue) => {
                              setSelectedCompany(currentValue === selectedCompany ? null : currentValue);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${selectedCompany === company.company ? "opacity-100" : "opacity-0"}`}
                            />
                            {company.company}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedCompany ? (
        <div className="space-y-6">
          {/* 选中公司的详细信息 */}
          <div className="grid gap-4 md:grid-cols-3">
            {companyDataQuery.data
              ?.filter((company: any) => company.company === selectedCompany)
              .map((company: any) => (
                <React.Fragment key={company.company}>
                  <StatCard
                    title="员工总数"
                    value={company.employeeCount}
                    icon={<Users className="h-4 w-4" />}
                  />
                  <StatCard
                    title="总加班时长(小时)"
                    value={company.overtimeHours}
                    icon={<Clock className="h-4 w-4" />}
                  />
                  <StatCard
                    title="人均加班时长(小时)"
                    value={company.avgHours.toFixed(1)}
                    icon={<Clock className="h-4 w-4" />}
                  />
                </React.Fragment>
              ))
            }
          </div>

          {/* 公司部门加班情况 */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{selectedCompany}部门加班时长排名</CardTitle>
                <CardDescription>各部门工作日/周末加班时长对比</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Replace BarChart with ChartRender */}
                <ChartRender
                  chartData={departmentOvertimeData}
                  chartConfig={departmentOvertimeConfig}
                  chartType="bar"
                  xAxisKey="department" // Use department for X-axis categories
                  renderCustomBarLabel={renderCustomBarLabel} // Add custom label renderer
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{selectedCompany}部门工时构成分析</CardTitle>
                <CardDescription>各部门正常工时与加班工时对比</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Replace the second BarChart with ChartRender */}
                <ChartRender
                  chartData={departmentHoursData}
                  chartConfig={departmentHoursConfig}
                  chartType="bar"
                  xAxisKey="department" // Use department for X-axis categories
                  renderCustomBarLabel={renderCustomBarLabel} // Add custom label renderer
                />
              </CardContent>
            </Card>
          </div>

          {/* 部门加班排名详情 */}
          <div className="grid gap-6 md:grid-cols-3">
            <RankList
              title={`${selectedCompany}部门加班时长排名`}
              data={companyDataQuery.data
                ?.find((company: any) => company.company === selectedCompany)?.departments || []}
              valueKey="overtimeHours"
              labelKey="department"
              highColor="#ef4444"
              lowColor="#10b981"
            />
            <RankList
              title={`${selectedCompany}部门人均加班时长排名`}
              data={companyDataQuery.data
                ?.find((company: any) => company.company === selectedCompany)?.departments || []}
              valueKey="avgHours"
              labelKey="department"
              highColor="#ef4444"
              lowColor="#10b981"
            />
            <RankList
              title={`${selectedCompany}部门加班率排名`}
              data={companyDataQuery.data
                ?.find((company: any) => company.company === selectedCompany)?.departments || []}
              valueKey="overtimeRate"
              labelKey="department"
              highColor="#ef4444"
              lowColor="#10b981"
            />
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground">请先选择一个公司以查看详细数据。</div>
      )}
    </div>
  );
}