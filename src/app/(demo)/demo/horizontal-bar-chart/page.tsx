"use client";

import { HorizontalBarChartCard } from "~/components/dashboard/horizontal-bar-chart-card";
import { 
  generateTopLevelData, 
  generateSecondLevelData,
  getDrilldownData,
  chartColors
} from "~/lib/chart-data-generator";

// 使用faker-js生成的模拟数据
const topLevelData = generateTopLevelData();
console.log('顶级数据初始化:', topLevelData);

// 第二层数据示例 - 第一个业务类别的产品数据
const secondLevelData = generateSecondLevelData(topLevelData[0].id);
console.log('二级数据初始化:', secondLevelData, '基于业务ID:', topLevelData[0].id);

// 包装getDrilldownData函数以添加调试日志
const getDrilldownDataWithLogging = (item: any) => {
  console.log('钻取请求:', item);
  const result = getDrilldownData(item);
  console.log('钻取结果:', result);
  return result;
};

export default function HorizontalBarChartDemo() {
  console.log('渲染HorizontalBarChartDemo组件');
  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">可钻取的横向柱状图示例</h1>
      <p className="mb-4 text-muted-foreground">每层数据使用固定颜色方案，点击柱状图可查看详细数据</p>
      
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
        <HorizontalBarChartCard
          title="业务收入分布"
          description="点击柱状图可查看详细数据"
          data={topLevelData}
          valueKey="value"
          labelKey="category"
          drilldownKey="id"
          getDrilldownData={getDrilldownDataWithLogging}
          // 使用每个数据项自带的颜色
          getBarColor={(item) => {
            console.log('获取颜色:', item);
            return item.color;
          }}
        />
        
        <HorizontalBarChartCard
          title="产品销售明细"
          description="产品销售数据明细"
          data={secondLevelData}
          valueKey="revenue"
          labelKey="product"
          drilldownKey="id"
          getDrilldownData={getDrilldownDataWithLogging}
          // 使用每个数据项自带的颜色
          getBarColor={(item) => {
            console.log('获取颜色(二级图表):', item);
            return item.color;
          }}
        />
      </div>
    </div>
  );
}