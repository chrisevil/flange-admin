/**
 * 数据获取和处理工具
 * 从外部API获取数据并转换为各组件所需的格式
 */

import { z } from "zod";

// 定义通用变量
export const MONTH_WORK_DAYS = 24;

// 定义API返回的数据结构
const ApiResponseSchema = z.object({
  data: z.array(
    z.object({
      user_id: z.string(),
      name: z.string(),
      overtime_hours: z.number(),
      position_sequence: z
        .string()
        .nullable()
        .transform((val) => val ?? "未知职位"),
      system_category: z
        .string()
        .nullable()
        .transform((val) => val ?? "未知系统"),
      department_name: z
        .string()
        .nullable()
        .transform((val) => val ?? "未知部门"),
      root_department_name: z
        .string()
        .nullable()
        .transform((val) => val ?? "未知公司"),
    }),
  ),
  status: z.string(),
});

type ApiResponse = z.infer<typeof ApiResponseSchema>;
type EmployeeData = ApiResponse["data"][number];

/**
 * 从API获取原始数据
 */
export async function fetchRawData(): Promise<ApiResponse> {
  try {
    const response = await fetch("http://192.168.7.202:13065/api/sql/1");
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    const data = (await response.json()) as unknown;
    const processedData = {
      ...data,
      data: data.data.map((item) => ({
        ...item,
        position_sequence: item.position_sequence ?? "未知职位",
        system_category: item.system_category ?? "未知系统",
        department_name: item.department_name ?? "未知部门",
        root_department_name: item.root_department_name ?? "未知公司",
      })),
    };
    const d = {
      data: [
        {
          user_id: "02496705310829212130",
          name: "王志明",
          overtime_hours: 276.56,
          position_sequence: "行政",
          system_category: "职能系统",
          department_name: "行政部",
          root_department_name: "行政部",
        },
      ],
    };
    console.log("获取数据成功:", processedData, d);
    return ApiResponseSchema.parse(processedData);
  } catch (error) {
    console.error("获取数据失败:", error);
    // 返回空数据，避免前端报错
    return { data: [] };
  }
}

/**
 * 统一处理所有数据
 * 一次性处理所有需要的数据格式，避免多次调用API
 */
export function processAllData(rawData: ApiResponse) {
  const { data } = rawData;

  if (data.length === 0) {
    return {
      stats: {
        totalEmployees: 0,
        totalOvertimeHours: 0,
        avgOvertimeHours: 0,
        maxOvertimeHours: 0,
      },
      company: [],
      department: [],
      leader: [],
      trend: [],
      attendance: [],
      businessTrip: [],
      reason: [],
      systemView: [],
      unitCategories: [], // 添加单位分类数据
    };
  }

  return {
    stats: processStatsData(data),
    company: processCompanyData(data),
    department: processDepartmentData(data),
    leader: processLeaderData(data),
    trend: processTrendData(data, 30),
    attendance: processAttendanceData(data),
    businessTrip: processBusinessTripData(data),
    reason: processReasonData(data),
    systemView: processSystemViewData(data),
    unitCategories: processUnitCategoriesData(data), // 添加单位分类数据
  };
}

/**
 * 生成加班统计概览数据
 */
export async function getOvertimeStats() {
  const rawData = await fetchRawData();
  return processStatsData(rawData.data);
}

/**
 * 处理统计概览数据
 */
function processStatsData(data: EmployeeData[]) {
  if (data.length === 0) {
    return {
      totalEmployees: 0,
      totalOvertimeHours: 0,
      avgOvertimeHours: 0,
      maxOvertimeHours: 0,
    };
  }

  const totalEmployees = data.length;
  const totalOvertimeHours = data.reduce(
    (sum, emp) => sum + emp.overtime_hours,
    0,
  );
  const avgOvertimeHours = totalOvertimeHours / totalEmployees;
  const maxOvertimeHours = Math.max(...data.map((emp) => emp.overtime_hours));

  return {
    totalEmployees,
    totalOvertimeHours: parseFloat(totalOvertimeHours.toFixed(2)),
    avgOvertimeHours: parseFloat(avgOvertimeHours.toFixed(2)),
    maxOvertimeHours: parseFloat(maxOvertimeHours.toFixed(2)),
  };
}

/**
 * 生成按公司分组的加班数据
 */
export async function getCompanyOvertimeData() {
  const rawData = await fetchRawData();
  return processCompanyData(rawData.data);
}

/**
 * 处理公司分组数据
 */
function processCompanyData(data: EmployeeData[]) {
  if (data.length === 0) return [];

  // 过滤掉system_category包含'工程'关键字的数据
  const totalEmployees = data.length;
  const filteredData = data.filter(
    (emp) => !emp.system_category.includes("工程"),
  );
  const excludedCount = totalEmployees - filteredData.length;
  const hasExcludedData = excludedCount > 0;

  // 按公司分组
  const companiesMap = new Map<string, EmployeeData[]>();

  filteredData.forEach((emp) => {
    const company = emp.root_department_name;
    if (!companiesMap.has(company)) {
      companiesMap.set(company, []);
    }
    companiesMap.get(company)?.push(emp);
  });

  // 转换为所需格式
  const result = Array.from(companiesMap.entries()).map(
    ([company, employees]) => {
      // 计算公司总加班时长
      const overtimeHours = employees.reduce(
        (sum, emp) => sum + emp.overtime_hours,
        0,
      );
      const employeeCount = employees.length;
      const avgHours = overtimeHours / employeeCount;

      // 计算加班率（加班时长占总工时的百分比）
      const normalHours = employeeCount * 40 * 4; // 假设每人每月160小时正常工时
      const overtimeRate = parseFloat(
        ((overtimeHours / (normalHours + overtimeHours)) * 100).toFixed(2),
      );

      // 按部门分组
      const departmentsMap = new Map<string, EmployeeData[]>();
      employees.forEach((emp) => {
        const dept = emp.department_name;
        if (!departmentsMap.has(dept)) {
          departmentsMap.set(dept, []);
        }
        departmentsMap.get(dept)?.push(emp);
      });

      // 转换部门数据
      const departments = Array.from(departmentsMap.entries()).map(
        ([department, deptEmployees]) => {
          const deptOvertimeHours = deptEmployees.reduce(
            (sum, emp) => sum + emp.overtime_hours,
            0,
          );
          const deptEmployeeCount = deptEmployees.length;

          // 模拟工作日/周末加班时长分布
          const weekdayOvertimeHours = parseFloat(
            (deptOvertimeHours * 0.7).toFixed(2),
          );
          const weekendOvertimeHours = parseFloat(
            (deptOvertimeHours * 0.3).toFixed(2),
          );

          // 模拟正常工时
          const normalHours = parseFloat(
            (deptEmployeeCount * 40 * 4).toFixed(2),
          ); // 假设每人每月160小时正常工时

          return {
            department,
            employeeCount: deptEmployeeCount,
            overtimeHours: parseFloat(deptOvertimeHours.toFixed(2)),
            weekdayOvertimeHours,
            weekendOvertimeHours,
            normalHours,
            totalHours: parseFloat(
              (normalHours + deptOvertimeHours).toFixed(2),
            ),
          };
        },
      );

      return {
        company,
        employeeCount,
        overtimeHours: parseFloat(overtimeHours.toFixed(2)),
        avgHours: parseFloat(avgHours.toFixed(2)),
        overtimeRate: parseFloat(overtimeRate.toFixed(2)),
        departments,
      };
    },
  );

  // 添加排除工程系统的标记
  return {
    data: result,
    excludedInfo: {
      hasExcludedData,
      excludedCount,
      excludedType: "工程系统",
      totalBeforeExclusion: totalEmployees,
    },
  };
}

/**
 * 生成按部门分组的加班数据
 */
export async function getDepartmentOvertimeData() {
  const rawData = await fetchRawData();
  return processDepartmentData(rawData.data);
}

/**
 * 处理部门分组数据
 */
function processDepartmentData(data: EmployeeData[]) {
  if (data.length === 0) return [];

  // 过滤只保留深圳公司的数据
  const filteredData = data.filter(
    (emp) => emp.root_department_name === "深圳公司",
  );

  // 如果过滤后没有数据，返回空数组
  if (filteredData.length === 0) return [];

  // 按部门分组
  const departmentsMap = new Map<string, EmployeeData[]>();

  filteredData.forEach((emp) => {
    const department = emp.department_name;
    if (!departmentsMap.has(department)) {
      departmentsMap.set(department, []);
    }
    departmentsMap.get(department)?.push(emp);
  });

  // 定义加班等级的阈值（日平均加班小时数）
  const levelThresholds = {
    A: 3, // 日均3小时以上为A级
    B: 2, // 日均2-3小时为B级
    C: 1, // 日均1-2小时为C级
    D: 0, // 日均1小时以下为D级
  };

  // 转换为所需格式
  return Array.from(departmentsMap.entries()).map(([department, employees]) => {
    const overtimeHours = employees.reduce(
      (sum, emp) => sum + emp.overtime_hours,
      0,
    );
    const employeeCount = employees.length;
    const avgHours = overtimeHours / employeeCount;

    // 计算每个员工的日平均加班时间并分配等级
    const employeesWithDailyAvg = employees.map((emp) => {
      const dailyAvgHours = emp.overtime_hours / MONTH_WORK_DAYS;
      let level: "A" | "B" | "C" | "D" = "D";

      if (dailyAvgHours >= levelThresholds.A) level = "A";
      else if (dailyAvgHours >= levelThresholds.B) level = "B";
      else if (dailyAvgHours >= levelThresholds.C) level = "C";

      return {
        id: emp.user_id,
        name: emp.name,
        overtimeHours: emp.overtime_hours,
        dailyAvgHours: parseFloat(dailyAvgHours.toFixed(2)),
        level,
      };
    });

    // 按等级分组员工
    const employeesByLevel = {
      A: employeesWithDailyAvg.filter((emp) => emp.level === "A"),
      B: employeesWithDailyAvg.filter((emp) => emp.level === "B"),
      C: employeesWithDailyAvg.filter((emp) => emp.level === "C"),
      D: employeesWithDailyAvg.filter((emp) => emp.level === "D"),
    };

    // 计算各等级人数分布
    const overtimeLevelDistribution = {
      A: employeesByLevel.A.length,
      B: employeesByLevel.B.length,
      C: employeesByLevel.C.length,
      D: employeesByLevel.D.length,
    };

    // 计算部门日平均加班时间
    const avgDailyOvertimeHours = avgHours / MONTH_WORK_DAYS;

    return {
      department,
      employeeCount,
      overtimeHours: parseFloat(overtimeHours.toFixed(2)),
      avgHours: parseFloat(avgHours.toFixed(2)),
      avgDailyOvertimeHours: parseFloat(avgDailyOvertimeHours.toFixed(2)),
      overtimeLevelDistribution,
      employeesByLevel,
    };
  });
}

/**
 * 生成领导加班数据
 */
export async function getLeaderOvertimeData() {
  const rawData = await fetchRawData();
  return processLeaderData(rawData.data);
}

/**
 * 处理领导加班数据
 */
function processLeaderData(data: EmployeeData[]) {
  if (data.length === 0) return [];

  // 筛选领导职位的员工
  // 假设position_sequence中包含"主管"、"经理"、"总监"、"总裁"等关键词的为领导
  const leaderKeywords = [
    "主管",
    "经理",
    "总监",
    "总裁",
    "总经理",
    "副总",
    "CEO",
    "CTO",
  ];
  const leaders = data.filter((emp) =>
    leaderKeywords.some((keyword) => emp.position_sequence.includes(keyword)),
  );

  // 按部门分组
  const departmentsMap = new Map<string, EmployeeData[]>();

  leaders.forEach((leader) => {
    const department = leader.department_name;
    if (!departmentsMap.has(department)) {
      departmentsMap.set(department, []);
    }
    departmentsMap.get(department)?.push(leader);
  });

  // 转换为所需格式
  return Array.from(departmentsMap.entries()).map(
    ([department, deptLeaders]) => {
      return {
        department,
        leaders: deptLeaders.map((leader) => ({
          name: leader.name,
          position: leader.position_sequence,
          overtimeHours: leader.overtime_hours,
        })),
      };
    },
  );
}

/**
 * 生成加班趋势数据
 */
export async function getOvertimeTrendData(days = 30) {
  const rawData = await fetchRawData();
  return processTrendData(rawData.data, days);
}

/**
 * 处理加班趋势数据
 */
function processTrendData(data: EmployeeData[], days = 30) {
  if (data.length === 0) return [];

  // 生成过去days天的日期数组
  const dates = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }

  // 模拟每天的加班数据
  return dates.map((date) => {
    // 随机生成当天加班人数和时长
    const employeeCount = Math.floor(data.length * (0.3 + Math.random() * 0.4));
    const totalHours = employeeCount * (0.5 + Math.random() * 2.5);

    return {
      date,
      employeeCount,
      totalHours: parseFloat(totalHours.toFixed(2)),
      avgHours: parseFloat((totalHours / employeeCount).toFixed(2)),
    };
  });
}

/**
 * 生成出勤分析数据
 */
export async function getAttendanceData() {
  const rawData = await fetchRawData();
  return processAttendanceData(rawData.data);
}

/**
 * 处理出勤分析数据
 */
function processAttendanceData(data: EmployeeData[]) {
  if (data.length === 0) return [];

  // 模拟出勤数据
  const totalEmployees = data.length;
  const normalAttendance = Math.floor(totalEmployees * 0.75);
  const lateAttendance = Math.floor(totalEmployees * 0.15);
  const absentAttendance = totalEmployees - normalAttendance - lateAttendance;

  return [
    {
      type: "正常出勤",
      value: normalAttendance,
      percentage: parseFloat(
        ((normalAttendance / totalEmployees) * 100).toFixed(2),
      ),
    },
    {
      type: "迟到",
      value: lateAttendance,
      percentage: parseFloat(
        ((lateAttendance / totalEmployees) * 100).toFixed(2),
      ),
    },
    {
      type: "缺勤",
      value: absentAttendance,
      percentage: parseFloat(
        ((absentAttendance / totalEmployees) * 100).toFixed(2),
      ),
    },
  ];
}

/**
 * 生成出差分析数据
 */
export async function getBusinessTripData() {
  const rawData = await fetchRawData();
  return processBusinessTripData(rawData.data);
}

/**
 * 处理出差分析数据
 */
function processBusinessTripData(data: EmployeeData[]) {
  if (data.length === 0) return [];

  // 模拟出差数据
  const totalEmployees = data.length;
  const businessTripCount = Math.floor(totalEmployees * 0.2);

  // 按部门分组
  const departmentsMap = new Map<string, number>();

  // 为每个部门分配出差人数
  data.forEach((emp) => {
    const department = emp.department_name;
    if (!departmentsMap.has(department)) {
      departmentsMap.set(department, 0);
    }
    // 随机决定是否出差
    if (
      Math.random() < 0.2 &&
      departmentsMap.get(department)! < businessTripCount
    ) {
      departmentsMap.set(department, departmentsMap.get(department)! + 1);
    }
  });

  // 转换为所需格式
  return Array.from(departmentsMap.entries())
    .filter(([_, count]) => count > 0)
    .map(([department, count]) => ({
      department,
      count,
      percentage: parseFloat(((count / businessTripCount) * 100).toFixed(2)),
    }));
}

/**
 * 生成加班原因分析数据
 */
export async function getOvertimeReasonData() {
  const rawData = await fetchRawData();
  return processReasonData(rawData.data);
}

/**
 * 处理加班原因分析数据
 */
function processReasonData(data: EmployeeData[]) {
  if (data.length === 0) return [];

  // 模拟加班原因数据
  const reasons = [
    "项目交付压力",
    "临时需求变更",
    "系统故障处理",
    "会议准备",
    "客户紧急需求",
  ];

  const totalOvertimeEmployees = data.filter(
    (emp) => emp.overtime_hours > 0,
  ).length;
  let remainingPercentage = 100;

  return reasons.map((reason, index) => {
    // 最后一个原因占剩余百分比
    if (index === reasons.length - 1) {
      return {
        reason,
        count: Math.floor((remainingPercentage / 100) * totalOvertimeEmployees),
        percentage: remainingPercentage,
      };
    }

    // 随机生成百分比
    const percentage =
      index === 0
        ? parseFloat((20 + Math.random() * 20).toFixed(2))
        : parseFloat((5 + Math.random() * 15).toFixed(2));

    remainingPercentage -= percentage;

    return {
      reason,
      count: Math.floor((percentage / 100) * totalOvertimeEmployees),
      percentage,
    };
  });
}

/**
 * 生成系统视图数据
 */
export async function getSystemViewData() {
  const rawData = await fetchRawData();
  return processSystemViewData(rawData.data);
}

/**
 * 处理系统视图数据
 */
function processSystemViewData(data: EmployeeData[]) {
  if (data.length === 0) return [];

  // 按系统分组
  const systemsMap = new Map<string, EmployeeData[]>();

  data.forEach((emp) => {
    const system = emp.system_category;
    if (!systemsMap.has(system)) {
      systemsMap.set(system, []);
    }
    systemsMap.get(system)?.push(emp);
  });

  // 转换为所需格式
  return Array.from(systemsMap.entries()).map(([system_name, employees]) => {
    const total_employees = employees.length;

    // 计算系统总加班时长和平均加班时长
    const totalOvertimeHours = employees.reduce(
      (sum, emp) => sum + emp.overtime_hours,
      0,
    );

    // 使用MONTH_WORK_DAYS计算平均每人每天加班时间
    const avgOvertimeHoursPerDay = parseFloat(
      (totalOvertimeHours / (total_employees * MONTH_WORK_DAYS)).toFixed(2),
    );

    // 计算加班时长分布
    const overtimeIntervals = [
      { interval: "小于1小时", min: 0, max: 1 },
      { interval: "1-2小时", min: 1, max: 2 },
      { interval: "2-3小时", min: 2, max: 3 },
      { interval: "大于3小时", min: 3, max: Infinity },
    ];

    const overtime_distribution = overtimeIntervals.map((interval) => {
      const count = employees.filter((emp) => {
        const dailyAvg = emp.overtime_hours / MONTH_WORK_DAYS;
        return dailyAvg >= interval.min && dailyAvg < interval.max;
      }).length;

      return {
        interval: interval.interval,
        count,
        percentage: parseFloat(((count / total_employees) * 100).toFixed(2)),
      };
    });

    // 使用所有员工数据
    const sampleEmployees = employees.map((emp) => {
      // 确定加班区间
      const dailyAvg = emp.overtime_hours / MONTH_WORK_DAYS;
      const interval = overtimeIntervals.find(
        (int) => dailyAvg >= int.min && dailyAvg < int.max,
      );

      return {
        user_id: emp.user_id,
        name: emp.name,
        department: emp.department_name,
        root_department_name: emp.root_department_name,
        overtime_hours: emp.overtime_hours,
        daily_avg_overtime: parseFloat(dailyAvg.toFixed(2)),
        overtime_interval: interval?.interval ?? "未知",
      };
    });

    return {
      system_name,
      total_employees,
      total_overtime_hours: parseFloat(totalOvertimeHours.toFixed(2)),
      avg_overtime_hours_per_day: avgOvertimeHoursPerDay,
      overtime_distribution,
      employees: sampleEmployees,
    };
  });
}

/**
 * 生成按单位分类的加班数据
 */
export async function getUnitCategoriesData() {
  const rawData = await fetchRawData();
  return processUnitCategoriesData(rawData.data);
}

/**
 * 处理按单位分类的加班数据
 * 将员工按四种不同的分类方式进行分组，计算每组的月加班总时长和平均加班时长
 */
function processUnitCategoriesData(data: EmployeeData[]) {
  if (data.length === 0) return [];

  // 定义四种分类方式
  const categories = [
    {
      name: "按公司分类",
      key: "root_department_name",
      description: "各公司月加班时长与人均加班时长",
    },
    {
      name: "按部门分类",
      key: "department_name",
      description: "各部门月加班时长与人均加班时长",
    },
    {
      name: "按职位分类",
      key: "position_sequence",
      description: "各职位月加班时长与人均加班时长",
    },
    {
      name: "按系统分类",
      key: "system_category",
      description: "各系统月加班时长与人均加班时长",
    },
  ];

  // 处理每种分类方式的数据
  return categories.map((category) => {
    // 按指定的分类键进行分组
    const groupsMap = new Map<string, EmployeeData[]>();

    data.forEach((emp) => {
      const groupKey = emp[category.key as keyof EmployeeData] as string;
      if (!groupsMap.has(groupKey)) {
        groupsMap.set(groupKey, []);
      }
      groupsMap.get(groupKey)?.push(emp);
    });

    // 计算每个分组的加班数据
    const groups = Array.from(groupsMap.entries())
      .map(([name, employees]) => {
        const totalOvertimeHours = employees.reduce(
          (sum, emp) => sum + emp.overtime_hours,
          0,
        );
        const employeeCount = employees.length;
        const avgOvertimeHours = totalOvertimeHours / employeeCount;

        return {
          name,
          employeeCount,
          totalOvertimeHours: parseFloat(totalOvertimeHours.toFixed(2)),
          avgOvertimeHours: parseFloat(avgOvertimeHours.toFixed(2)),
        };
      })
      .sort((a, b) => b.totalOvertimeHours - a.totalOvertimeHours); // 按总加班时长降序排序

    return {
      categoryName: category.name,
      categoryKey: category.key,
      description: category.description,
      groups,
    };
  });
}
