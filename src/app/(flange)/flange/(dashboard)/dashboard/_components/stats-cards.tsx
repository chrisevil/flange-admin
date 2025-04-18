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
  // 计算公司数量和部门数量
  const companyCount = companyDataQuery.data.data?.length ?? 0;
  const departmentCount = departmentDataQuery.data?.length ?? 0;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <EnhancedStatCard
        title="员工总数"
        value={statsQuery.data?.totalEmployees ?? 0}
        icon={<Users className="h-4 w-4" />}
        tooltip="公司所有在职员工总数"
        drilldownData={companyDataQuery.data.data?.map(item => ({
          name: item.company,
          value: item.employeeCount
        }))}
        drilldownTitle="各公司员工分布"
        drilldownDescription="按公司划分的员工数量分布情况"
      />
      <EnhancedStatCard
        title="公司数量"
        value={companyCount}
        icon={<Building className="h-4 w-4" />}
        tooltip="系统中注册的公司总数"
      />
      <EnhancedStatCard
        title="部门数量"
        value={departmentCount}
        icon={<Users className="h-4 w-4" />}
        tooltip="系统中所有部门的总数"
        drilldownData={departmentDataQuery.data.data?.map(item => ({
          name: item.department,
          value: item.employeeCount
        }))}
        drilldownTitle="各部门员工分布"
        drilldownDescription="按部门划分的员工数量分布情况"
      />
      <EnhancedStatCard
        title="总加班时长(小时)"
        value={statsQuery.data?.totalOvertimeHours ?? 0}
        icon={<Clock className="h-4 w-4" />}
        tooltip="所有员工加班时长总和，单位为小时"
        drilldownData={companyDataQuery.data.data?.map(item => ({
          name: item.company,
          value: item.overtimeHours
        }))}
        drilldownTitle="各公司加班时长分布"
        drilldownDescription="按公司划分的加班时长分布情况"
      />
      <EnhancedStatCard
        title="人均加班时长(小时)"
        value={(statsQuery.data?.avgOvertimeHours ?? 0).toFixed(1)}
        icon={<Clock className="h-4 w-4" />}
        tooltip="总加班时长除以员工总数，反映平均每位员工的加班情况"
        drilldownData={companyDataQuery.data.data?.map(item => ({
          name: item.company,
          value: item.avgHours
        }))}
        drilldownTitle="各公司人均加班时长"
        drilldownDescription="按公司划分的人均加班时长情况"
      />
      <EnhancedStatCard
        title="最大加班时长(小时)"
        value={statsQuery.data?.maxOvertimeHours ?? 0}
        icon={<Clock className="h-4 w-4" />}
        tooltip="单个员工最大加班时长"
        drilldownData={reasonDataQuery.data.data?.map(item => ({
          name: item.reason,
          value: item.count
        }))}
        drilldownTitle="加班原因分布"
        drilldownDescription="不同加班原因的占比情况"
      />
    </div>
  );
}