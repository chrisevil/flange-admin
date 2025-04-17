import { Building, Clock, Users } from "lucide-react";
import { EnhancedStatCard } from "~/components/dashboard/enhanced-stat-card";

interface StatsCardsProps {
  statsQuery: any;
  companyDataQuery: any;
  departmentDataQuery: any;
  reasonDataQuery: any;
}

export function StatsCards({
  statsQuery,
  companyDataQuery,
  departmentDataQuery,
  reasonDataQuery,
}: StatsCardsProps) {
  return (
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
  );
}