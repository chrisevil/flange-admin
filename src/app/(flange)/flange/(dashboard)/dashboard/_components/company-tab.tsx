import { HorizontalBarChartCard } from "~/components/dashboard/horizontal-bar-chart-card";
import { RankList } from "~/components/dashboard/rank-list";
import { Alert, AlertDescription } from "~/components/ui/alert";

interface CompanyTabProps {
  companyDataQuery: any;
  setSelectedCompany: (company: string) => void;
  setActiveTab: (tab: string) => void;
}

export function CompanyTab({
  companyDataQuery,
  setSelectedCompany,
  setActiveTab,
}: CompanyTabProps) {
  // 获取排除工程系统的数据标记
  const excludedInfo = companyDataQuery.excludedInfo;
  const hasExcludedData = excludedInfo?.hasExcludedData;

  return (
    <div className="space-y-6 pt-4">
      {hasExcludedData && (
        <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-800">
          <AlertDescription>
            注意：当前数据已排除 {excludedInfo.excludedCount} 名
            {excludedInfo.excludedType}员工的加班数据 （原始数据共{" "}
            {excludedInfo.totalBeforeExclusion} 人）
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        <HorizontalBarChartCard
          title="公司加班时长排名(分组)"
          description="各公司工作日/周末加班时长对比"
          data={companyDataQuery.data.data ?? []}
          valueKey="overtimeHours"
          labelKey="company"
          segments={[
            {
              valueKey: "weekdayOvertimeHours",
              color: "#4f46e5",
              name: "工作日加班",
            },
            {
              valueKey: "weekendOvertimeHours",
              color: "#f59e0b",
              name: "周末加班",
            },
          ]}
        />

        <HorizontalBarChartCard
          title="公司工时构成分析"
          description="各公司正常工时与加班工时对比"
          data={companyDataQuery.data.data ?? []}
          valueKey="totalHours"
          labelKey="company"
          segments={[
            { valueKey: "normalHours", color: "#10b981", name: "正常工时" },
            { valueKey: "overtimeHours", color: "#ef4444", name: "加班工时" },
          ]}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <RankList
          title="公司加班时长排名详情"
          data={companyDataQuery.data.data ?? []}
          valueKey="overtimeHours"
          labelKey="company"
          highColor="#ef4444"
          lowColor="#10b981"
          drillable={true}
          onItemClick={(item) => {
            // 实现钻取逻辑，跳转到具体公司标签页并选择该公司
            console.log("钻取到公司:", item.company);
            setSelectedCompany(item.company);
            setActiveTab("specific-company");
          }}
          itemRender={(item, idx, isAboveAvg, avg) => (
            <div key={idx} className="flex items-center py-2">
              <span className="w-8 text-center text-muted-foreground">
                {idx + 1}
              </span>
              <span className="flex-1 truncate">{item.company}</span>
              <span
                className="ml-2 font-bold"
                style={{ color: isAboveAvg ? "#ef4444" : "#10b981" }}
              >
                {item.overtimeHours}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                {isAboveAvg ? "高于" : "低于"}平均值
                {Math.abs(item.overtimeHours - avg).toFixed(1)}
              </span>
            </div>
          )}
        />
        <RankList
          title="公司人均加班时长排名详情"
          data={companyDataQuery.data.data ?? []}
          valueKey="avgHours"
          labelKey="company"
          highColor="#ef4444"
          lowColor="#10b981"
          drillable={true}
          onItemClick={(item) => {
            console.log("钻取到公司人均加班:", item.company);
            setSelectedCompany(item.company);
            setActiveTab("specific-company");
          }}
          itemRender={(item, idx, isAboveAvg, avg) => (
            <div key={idx} className="flex items-center py-2">
              <span className="w-8 text-center text-muted-foreground">
                {idx + 1}
              </span>
              <span className="flex-1 truncate">{item.company}</span>
              <span
                className="ml-2 font-bold"
                style={{ color: isAboveAvg ? "#ef4444" : "#10b981" }}
              >
                {item.avgHours.toFixed(1)}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                {isAboveAvg ? "高于" : "低于"}平均值
                {Math.abs(item.avgHours - avg).toFixed(1)}
              </span>
            </div>
          )}
        />
        <RankList
          title="公司加班率排名详情"
          data={companyDataQuery.data.data ?? []}
          valueKey="overtimeRate"
          labelKey="company"
          highColor="#ef4444"
          lowColor="#10b981"
          drillable={true}
          onItemClick={(item) => {
            console.log("钻取到公司加班率:", item.company);
            setSelectedCompany(item.company);
            setActiveTab("specific-company");
          }}
          itemRender={(item, idx, isAboveAvg, avg) => (
            <div key={idx} className="flex items-center py-2">
              <span className="w-8 text-center text-muted-foreground">
                {idx + 1}
              </span>
              <span className="flex-1 truncate">{item.company}</span>
              <span
                className="ml-2 font-bold"
                style={{ color: isAboveAvg ? "#ef4444" : "#10b981" }}
              >
                {/* {item.overtimeRate.toFixed(1)}% */}
                x%
              </span>
              <span className="ml-2 text-xs text-muted-foreground">
                {isAboveAvg ? "高于" : "低于"}平均值
                {Math.abs(item.overtimeRate - avg).toFixed(1)}%
              </span>
            </div>
          )}
        />
      </div>
    </div>
  );
}
