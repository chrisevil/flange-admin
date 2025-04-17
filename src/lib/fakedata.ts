import { groupBy, map } from "lodash";
import { faker } from "@faker-js/faker";

// 仓库数据
const warehouses = Array.from(
  { length: Math.floor(Math.random() * 19) + 2 },
  (_, i) => ({
    id: `w${i + 1}`,
    name: faker.location.streetAddress() + "仓库",
  }),
);

// 商品数据
const products = Array.from(
  {
    length: Math.max(warehouses.length * 2, Math.floor(Math.random() * 19) + 2),
  },
  (_, i) => ({
    id: `p${i + 1}`,
    name: faker.commerce.productName(),
    warehouseId: `w${(i % warehouses.length) + 1}`, // 确保每个仓库至少有一个商品
  }),
);

// 种类数据
const categories = Array.from({ length: products.length * 2 }, (_, i) => ({
  id: `c${i + 1}`,
  name: faker.commerce.department(),
  productId: `p${Math.floor(i / 2) + 1}`, // 每个商品分配2个种类
}));

// 使用lodash合并成三级嵌套结构
const nestedData = map(groupBy(warehouses, "id"), (warehouse) => ({
  ...warehouse[0],
  children: map(
    groupBy(
      products.filter((p) => p.warehouseId === warehouse[0].id),
      "id",
    ),
    (product) => ({
      ...product[0],
      children: categories.filter((c) => c.productId === product[0].id),
    }),
  ),
}));

export { warehouses, products, categories, nestedData };
