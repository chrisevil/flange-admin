"use client";

import { DrilldownBarChartCard } from "./drilldown-bar-chart-card";

// 示例数据 - 顶级类别
const topLevelData = [
  { category: "产品销售", value: 1200, id: "sales" },
  { category: "技术服务", value: 800, id: "tech" },
  { category: "咨询业务", value: 600, id: "consulting" },
  { category: "培训", value: 400, id: "training" },
  { category: "其他收入", value: 200, id: "other" }
];

// 产品销售的二级数据
const salesData = [
  { product: "产品A", revenue: 500, id: "product-a" },
  { product: "产品B", revenue: 350, id: "product-b" },
  { product: "产品C", revenue: 250, id: "product-c" },
  { product: "产品D", revenue: 100, id: "product-d" }
];

// 产品A的详细数据
const productAData = [
  { region: "华东", sales: 200 },
  { region: "华北", sales: 150 },
  { region: "华南", sales: 100 },
  { region: "西部", sales: 50 }
];

// 模拟获取钻取数据的函数
const getDrilldownData = (item: any) => {
  // 根据不同的ID返回不同的钻取数据
  if (item.id === "sales") {
    return salesData;
  } else if (item.id === "product-a") {
    return productAData;
  }
  // 其他情况返回空数组
  return [];
};

export function DrilldownBarChartExample() {
  return (
    <div className="space-y-8">
      <DrilldownBarChartCard
        title="业务收入分布"
        description="点击柱状图可查看详细数据"
        data={topLevelData}
        valueKey="value"
        labelKey="category"
        drilldownKey="id"
        getDrilldownData={getDrilldownData}
        barColor="#4f46e5"
      />
    </div>
  );
}