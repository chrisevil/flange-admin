import { faker } from "@faker-js/faker";
import { MathUtils } from "./math-utils";

// 生成过去30天的日期数组
export function generateDateRange(days = 30) {
  const dates = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
}

// 生成销售数据
export function generateSalesData(days = 30) {
  const dates = generateDateRange(days);

  return dates.map((date) => {
    const desktop = faker.number.int({ min: 1000, max: 5000 });
    const mobile = faker.number.int({ min: 800, max: 3000 });
    const total = Number(MathUtils.add(desktop, mobile));

    return {
      date,
      desktop,
      mobile,
      total,
    };
  });
}

// 生成访问量数据
export function generateVisitsData(days = 30) {
  const dates = generateDateRange(days);

  return dates.map((date) => {
    const visitors = faker.number.int({ min: 500, max: 10000 });
    const pageViews = faker.number.int({ min: visitors, max: visitors * 5 });
    const bounceRate = faker.number.float({ min: 20, max: 65, precision: 0.1 });

    return {
      date,
      visitors,
      pageViews,
      bounceRate,
    };
  });
}

// 生成产品数据
export function generateProductsData(count = 10) {
  return Array.from({ length: count }, (_, i) => ({
    id: `prod-${i + 1}`,
    name: faker.commerce.productName(),
    category: faker.commerce.department(),
    price: Number(faker.commerce.price()),
    stock: faker.number.int({ min: 0, max: 500 }),
    sales: faker.number.int({ min: 0, max: 1000 }),
  }));
}

// 生成概览统计数据
export function generateOverviewStats() {
  const totalSales = faker.number.int({ min: 10000, max: 100000 });
  const lastMonthSales = faker.number.int({ min: 8000, max: 90000 });
  const salesChange = Number(
    MathUtils.percentage(
      MathUtils.subtract(totalSales, lastMonthSales),
      lastMonthSales,
      1,
    ),
  );

  const totalOrders = faker.number.int({ min: 500, max: 5000 });
  const lastMonthOrders = faker.number.int({ min: 400, max: 4500 });
  const ordersChange = Number(
    MathUtils.percentage(
      MathUtils.subtract(totalOrders, lastMonthOrders),
      lastMonthOrders,
      1,
    ),
  );

  const totalCustomers = faker.number.int({ min: 1000, max: 10000 });
  const lastMonthCustomers = faker.number.int({ min: 900, max: 9000 });
  const customersChange = Number(
    MathUtils.percentage(
      MathUtils.subtract(totalCustomers, lastMonthCustomers),
      lastMonthCustomers,
      1,
    ),
  );

  const totalRevenue = faker.number.int({ min: 50000, max: 500000 });
  const lastMonthRevenue = faker.number.int({ min: 45000, max: 450000 });
  const revenueChange = Number(
    MathUtils.percentage(
      MathUtils.subtract(totalRevenue, lastMonthRevenue),
      lastMonthRevenue,
      1,
    ),
  );

  return {
    sales: {
      value: totalSales,
      change: salesChange,
    },
    orders: {
      value: totalOrders,
      change: ordersChange,
    },
    customers: {
      value: totalCustomers,
      change: customersChange,
    },
    revenue: {
      value: totalRevenue,
      change: revenueChange,
    },
  };
}

// 生成目标完成数据
export function generateTargetData() {
  return [
    {
      name: "销售目标",
      current: faker.number.int({ min: 70, max: 95 }),
      target: 100,
      description: "月度销售目标完成情况",
    },
    {
      name: "新客户获取",
      current: faker.number.int({ min: 40, max: 120 }),
      target: 100,
      description: "新客户获取目标完成率",
    },
    {
      name: "客户满意度",
      current: faker.number.int({ min: 85, max: 98 }),
      target: 100,
      description: "客户满意度评分",
    },
  ];
}

// ==================== 员工加班BI数据 ====================

// 公司列表
const companies = [
  "总公司",
  "北京分公司",
  "上海分公司",
  "广州分公司",
  "深圳分公司",
  "成都分公司",
];

// 部门列表
const departments = [
  "研发部",
  "产品部",
  "市场部",
  "销售部",
  "人力资源部",
  "财务部",
  "行政部",
];

// 生成员工加班概览统计数据
export function generateOvertimeStats() {
  const totalEmployees = faker.number.int({ min: 500, max: 2000 });
  const totalCompanies = companies.length;
  const totalDepartments = departments.length;

  const totalOvertimeHours = faker.number.int({ min: 2000, max: 10000 });
  const lastMonthOvertimeHours = faker.number.int({ min: 1800, max: 9000 });
  const overtimeChange = Number(
    MathUtils.percentage(
      MathUtils.subtract(totalOvertimeHours, lastMonthOvertimeHours),
      lastMonthOvertimeHours,
      1,
    ),
  );

  const avgOvertimeHours = Number(
    MathUtils.divide(totalOvertimeHours, totalEmployees),
  );
  const lastMonthAvgHours = Number(
    MathUtils.divide(lastMonthOvertimeHours, totalEmployees),
  );
  const avgChange = Number(
    MathUtils.percentage(
      MathUtils.subtract(avgOvertimeHours, lastMonthAvgHours),
      lastMonthAvgHours,
      1,
    ),
  );

  const overtimeEmployees = faker.number.int({
    min: Math.floor(totalEmployees * 0.3),
    max: Math.floor(totalEmployees * 0.7),
  });
  const lastMonthOvertimeEmployees = faker.number.int({
    min: Math.floor(totalEmployees * 0.25),
    max: Math.floor(totalEmployees * 0.65),
  });
  const employeeChange = Number(
    MathUtils.percentage(
      MathUtils.subtract(overtimeEmployees, lastMonthOvertimeEmployees),
      lastMonthOvertimeEmployees,
      1,
    ),
  );

  return {
    employees: {
      value: totalEmployees,
      change: 0,
    },
    companies: {
      value: totalCompanies,
      change: 0,
    },
    departments: {
      value: totalDepartments,
      change: 0,
    },
    overtimeHours: {
      value: totalOvertimeHours,
      change: overtimeChange,
    },
    avgOvertimeHours: {
      value: avgOvertimeHours,
      change: avgChange,
    },
    overtimeEmployees: {
      value: overtimeEmployees,
      change: employeeChange,
    },
  };
}

// 生成员工数据
function generateEmployeeData(companyName, departmentName, count = 10) {
  return Array.from({ length: count }, (_, i) => {
    const name = faker.person.fullName();
    const id = `EMP-${faker.string.alphanumeric(6).toUpperCase()}`;
    const position = faker.person.jobTitle();
    const age = faker.number.int({ min: 22, max: 60 });
    const gender = faker.helpers.arrayElement(["男", "女"]);
    const salary = faker.number.int({ min: 5000, max: 30000 });

    // 加班数据
    const weekdayOvertimeHours = faker.number.int({ min: 2, max: 40 });
    const weekendOvertimeHours = faker.number.int({ min: 0, max: 16 });
    const overtimeHours = weekdayOvertimeHours + weekendOvertimeHours;

    // 正常工时
    const normalHours = faker.number.int({ min: 160, max: 180 });
    const totalHours = normalHours + overtimeHours;

    // 加班率
    const overtimeRate = faker.number.float({
      min: 5,
      max: 40,
      precision: 0.1,
    });

    return {
      id,
      name,
      company: companyName,
      department: departmentName,
      position,
      age,
      gender,
      salary,
      overtimeHours,
      weekdayOvertimeHours,
      weekendOvertimeHours,
      normalHours,
      totalHours,
      overtimeRate,
    };
  });
}

// 生成按公司的加班数据
export function generateCompanyOvertimeData() {
  // 为每个公司生成部门关联
  const companyDepartments = {};
  companies.forEach((company) => {
    // 每个公司随机分配4-7个部门
    const deptCount = faker.number.int({ min: 4, max: 7 });
    const companyDepts = faker.helpers.arrayElements(departments, deptCount);
    companyDepartments[company] = companyDepts;
  });

  return companies
    .map((company) => {
      // 该公司的部门列表
      const companyDepts = companyDepartments[company];

      // 为每个部门生成员工数据
      const departmentsData = companyDepts.map((dept) => {
        const employeeCount = faker.number.int({ min: 5, max: 30 });
        const employees = generateEmployeeData(company, dept, employeeCount);

        // 计算部门汇总数据
        const weekdayOvertimeHours = employees.reduce(
          (sum, emp) => sum + emp.weekdayOvertimeHours,
          0,
        );
        const weekendOvertimeHours = employees.reduce(
          (sum, emp) => sum + emp.weekendOvertimeHours,
          0,
        );
        const overtimeHours = weekdayOvertimeHours + weekendOvertimeHours;
        const normalHours = employees.reduce(
          (sum, emp) => sum + emp.normalHours,
          0,
        );
        const totalHours = normalHours + overtimeHours;
        const avgHours = Number(MathUtils.divide(overtimeHours, employeeCount));
        const overtimeRate = faker.number.float({
          min: 20,
          max: 80,
          precision: 0.1,
        });

        return {
          department: dept,
          employeeCount,
          overtimeHours,
          weekdayOvertimeHours,
          weekendOvertimeHours,
          normalHours,
          totalHours,
          avgHours,
          overtimeRate,
          employees,
        };
      });

      // 计算公司汇总数据
      const employeeCount = departmentsData.reduce(
        (sum, dept) => sum + dept.employeeCount,
        0,
      );
      const weekdayOvertimeHours = departmentsData.reduce(
        (sum, dept) => sum + dept.weekdayOvertimeHours,
        0,
      );
      const weekendOvertimeHours = departmentsData.reduce(
        (sum, dept) => sum + dept.weekendOvertimeHours,
        0,
      );
      const overtimeHours = weekdayOvertimeHours + weekendOvertimeHours;
      const normalHours = departmentsData.reduce(
        (sum, dept) => sum + dept.normalHours,
        0,
      );
      const totalHours = normalHours + overtimeHours;
      const avgHours = Number(MathUtils.divide(overtimeHours, employeeCount));
      const overtimeRate = faker.number.float({
        min: 20,
        max: 80,
        precision: 0.1,
      });

      return {
        company,
        employeeCount,
        overtimeHours,
        weekdayOvertimeHours,
        weekendOvertimeHours,
        normalHours,
        totalHours,
        avgHours,
        overtimeRate,
        departments: departmentsData,
      };
    })
    .sort((a, b) => b.overtimeHours - a.overtimeHours);
}

// 生成按部门的加班数据
export function generateDepartmentOvertimeData() {
  // 获取所有公司数据
  const companyData = generateCompanyOvertimeData();

  // 从公司数据中提取所有部门数据并扁平化
  const allDepartmentsData = [];

  companyData.forEach((company) => {
    company.departments.forEach((dept) => {
      // 添加公司信息到部门数据中
      allDepartmentsData.push({
        ...dept,
        companyName: company.company,
      });
    });
  });

  // 按加班时长排序
  return allDepartmentsData.sort((a, b) => b.overtimeHours - a.overtimeHours);
}

// 生成员工加班数据（用于钻取到员工级别）
export function generateEmployeeOvertimeData(
  companyName = null,
  departmentName = null,
) {
  // 获取所有部门数据
  const departmentData = generateDepartmentOvertimeData();

  // 从部门数据中提取所有员工数据并扁平化
  let allEmployeesData = [];

  departmentData.forEach((dept) => {
    if (
      (companyName === null || dept.companyName === companyName) &&
      (departmentName === null || dept.department === departmentName)
    ) {
      // 添加公司和部门信息到员工数据中
      dept.employees.forEach((emp) => {
        allEmployeesData.push({
          ...emp,
          companyName: dept.companyName,
          department: dept.department,
        });
      });
    }
  });

  // 按加班时长排序
  return allEmployeesData.sort((a, b) => b.overtimeHours - a.overtimeHours);
}

// 生成领导加班数据
export function generateLeaderOvertimeData() {
  const leaders = [];

  // 为每个公司和部门生成领导数据
  for (const company of companies) {
    for (const department of departments) {
      // 不是每个公司都有所有部门
      if (Math.random() > 0.3) {
        const name = faker.person.fullName();
        const title = `${department}${Math.random() > 0.5 ? "总监" : "经理"}`;
        const overtimeHours = faker.number.int({ min: 5, max: 60 });
        const subordinatesAvgHours = faker.number.int({ min: 10, max: 80 });

        leaders.push({
          name,
          company,
          department,
          title,
          overtimeHours,
          subordinatesAvgHours,
          difference: overtimeHours - subordinatesAvgHours,
        });
      }
    }
  }

  return leaders.sort((a, b) => a.difference - b.difference);
}

// 生成加班趋势数据（按天）
export function generateOvertimeTrendData(days = 30) {
  const dates = generateDateRange(days);

  return dates.map((date) => {
    const totalHours = faker.number.int({ min: 50, max: 400 });
    const employeeCount = faker.number.int({ min: 20, max: 200 });
    const avgHours = Number(MathUtils.divide(totalHours, employeeCount));

    return {
      date,
      totalHours,
      employeeCount,
      avgHours,
    };
  });
}

// 生成出勤分析数据
export function generateAttendanceData() {
  return [
    { type: "正常出勤", value: faker.number.int({ min: 60, max: 85 }) },
    { type: "加班", value: faker.number.int({ min: 10, max: 30 }) },
    { type: "请假", value: faker.number.int({ min: 3, max: 10 }) },
    { type: "迟到", value: faker.number.int({ min: 2, max: 8 }) },
    { type: "早退", value: faker.number.int({ min: 1, max: 5 }) },
  ];
}

// 生成出差分析数据
export function generateBusinessTripData() {
  return [
    { type: "未出差", value: faker.number.int({ min: 70, max: 90 }) },
    { type: "国内出差", value: faker.number.int({ min: 5, max: 20 }) },
    { type: "国际出差", value: faker.number.int({ min: 1, max: 10 }) },
  ];
}

// 生成加班原因分析
export function generateOvertimeReasonData() {
  return [
    {
      reason: "项目交付压力",
      percentage: faker.number.int({ min: 30, max: 50 }),
    },
    {
      reason: "临时需求变更",
      percentage: faker.number.int({ min: 15, max: 30 }),
    },
    {
      reason: "系统故障处理",
      percentage: faker.number.int({ min: 5, max: 15 }),
    },
    {
      reason: "客户紧急需求",
      percentage: faker.number.int({ min: 10, max: 25 }),
    },
    { reason: "会议与培训", percentage: faker.number.int({ min: 5, max: 10 }) },
    { reason: "其他原因", percentage: faker.number.int({ min: 3, max: 10 }) },
  ].sort((a, b) => b.percentage - a.percentage);
}
