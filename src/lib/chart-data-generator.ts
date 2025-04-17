import { faker } from "@faker-js/faker";

// 定义颜色方案 - 每个层级使用固定的颜色
export const chartColors = {
  // 第一层颜色
  level1: [
    "#4f46e5", // 紫蓝色
    "#10b981", // 绿色
    "#f59e0b", // 橙色
    "#ef4444", // 红色
    "#8b5cf6"  // 紫色
  ],
  // 第二层颜色
  level2: [
    "#818cf8", // 浅紫蓝
    "#34d399", // 浅绿
    "#fbbf24", // 浅橙
    "#f87171", // 浅红
    "#a78bfa"  // 浅紫
  ],
  // 第三层颜色
  level3: [
    "#c7d2fe", // 最浅紫蓝
    "#6ee7b7", // 最浅绿
    "#fcd34d", // 最浅橙
    "#fca5a5", // 最浅红
    "#c4b5fd"  // 最浅紫
  ]
};

// 业务类别
const businessCategories = [
  "产品销售",
  "技术服务",
  "咨询业务",
  "培训",
  "其他收入"
];

// 产品类别
const productCategories = [
  "产品A",
  "产品B",
  "产品C",
  "产品D",
  "产品E"
];

// 区域类别
const regions = [
  "华东",
  "华北",
  "华南",
  "西部",
  "东北"
];

// 生成第一层数据 - 业务类别
export function generateTopLevelData() {
  return businessCategories.map((category, index) => {
    const value = faker.number.int({ min: 200, max: 1500 });
    return {
      category,
      value,
      id: `business-${index}`,
      color: chartColors.level1[index % chartColors.level1.length]
    };
  }).sort((a, b) => b.value - a.value); // 按值从大到小排序
}

// 生成第二层数据 - 产品类别
export function generateSecondLevelData(businessId: string) {
  // 从业务ID中提取索引
  const businessIndex = parseInt(businessId.split('-')[1]);
  
  return productCategories.map((product, index) => {
    const revenue = faker.number.int({ min: 50, max: 600 });
    return {
      product,
      revenue,
      id: `product-${businessIndex}-${index}`,
      color: chartColors.level2[index % chartColors.level2.length]
    };
  }).sort((a, b) => b.revenue - a.revenue); // 按收入从大到小排序
}

// 生成第三层数据 - 区域分布
export function generateThirdLevelData(productId: string) {
  // 从产品ID中提取索引
  const indices = productId.split('-');
  const businessIndex = parseInt(indices[1]);
  const productIndex = parseInt(indices[2]);
  
  return regions.map((region, index) => {
    const sales = faker.number.int({ min: 10, max: 200 });
    return {
      region,
      sales,
      id: `region-${businessIndex}-${productIndex}-${index}`,
      color: chartColors.level3[index % chartColors.level3.length]
    };
  }).sort((a, b) => b.sales - a.sales); // 按销售额从大到小排序
}

// 获取钻取数据的函数
export function getDrilldownData(item: any) {
  // 检查ID格式以确定当前层级
  if (item.id && typeof item.id === 'string') {
    if (item.id.startsWith('business-')) {
      return generateSecondLevelData(item.id);
    } else if (item.id.startsWith('product-')) {
      return generateThirdLevelData(item.id);
    }
  }
  
  // 如果没有匹配的ID或格式不正确，返回空数组
  return [];
}