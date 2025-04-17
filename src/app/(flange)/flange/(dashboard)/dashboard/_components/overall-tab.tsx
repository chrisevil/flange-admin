import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ChartRender } from "~/components/ui/chart/ChartRender";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface OverallTabProps {
  trendDataQuery: any;
  reasonDataQuery: any;
  attendanceDataQuery: any;
  businessTripDataQuery: any;
  COLORS: string[];
}

export function OverallTab({
  trendDataQuery,
  reasonDataQuery,
  attendanceDataQuery,
  businessTripDataQuery,
  COLORS,
}: OverallTabProps) {
  return (
    <div className="space-y-6 pt-4">
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
    </div>
  );
}