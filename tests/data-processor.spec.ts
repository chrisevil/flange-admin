import { test, expect } from "@playwright/test";
import DataProcessor from "../src/lib/data-processor";

const createMockApi = (baseUrl: string) => {
  let mockData: any = [];
  let statusCode = 200;

  return {
    setMockData(data: any) {
      mockData = data;
    },
    setStatusCode(code: number) {
      statusCode = code;
    },
    async setupRoute(page: any) {
      await page.route(baseUrl, (route) => {
        route.fulfill({
          status: statusCode,
          contentType: "application/json",
          body: JSON.stringify(mockData),
        });
      });
    },
  };
};

test.describe("DataProcessor 测试", () => {
  let mockApiUrl: string;
  let mockApi: ReturnType<typeof createMockApi>;
  let mockData: any;

  test.beforeEach(async ({ page }) => {
    mockApiUrl = "https://api.example.com/data";
    mockData = [{ id: 1, name: "测试数据" }];
    mockApi = createMockApi(mockApiUrl);
    mockApi.setMockData(mockData);
    await mockApi.setupRoute(page);
  });

  test("测试基本数据处理流程", async ({ page }) => {
    // 模拟API响应
    const processor = new DataProcessor(async () => {
      const response = await page.request.get(mockApiUrl);
      return response.json();
    });

    // 添加验证器和转换器
    processor
      .addValidator((data) => Array.isArray(data))
      .addTransformer((data) =>
        data.map((item) => ({
          ...item,
          processed: true,
        })),
      );

    const result = await processor.process();
    expect(result).toEqual([{ id: 1, name: "测试数据", processed: true }]);
  });

  test("测试缓存功能", async ({ page }) => {
    const cacheKey = "test_cache";
    const processor = new DataProcessor(async () => {
      const response = await page.request.get(mockApiUrl);
      return response.json();
    });

    // 设置缓存处理器
    const cacheStore: Record<string, any> = {};
    processor.setCacheHandlers(
      (key, data) => {
        cacheStore[key] = data;
      },
      (key) => cacheStore[key],
      cacheKey,
    );

    // 第一次处理 - 从API获取
    await page.route(mockApiUrl, (route) => {
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockData),
      });
    });

    const firstResult = await processor.process();
    expect(firstResult).toEqual(mockData);
    expect(cacheStore[cacheKey]).toEqual(mockData);

    // 第二次处理 - 应该从缓存获取
    const secondResult = await processor.process();
    expect(secondResult).toEqual(mockData);
  });

  test("测试数据验证失败", async ({ page }) => {
    const processor = new DataProcessor(async () => {
      const response = await page.request.get(mockApiUrl);
      return response.json();
    });
    processor.addValidator((data) => false); // 总是验证失败

    await page.route(mockApiUrl, (route) => {
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockData),
      });
    });

    const result = await processor.process();
    expect(result).toBeNull();
  });

  test("测试自定义数据源函数", async () => {
    const customDataSource = async () => mockData;
    const processor = new DataProcessor(customDataSource);

    const result = await processor.process();
    expect(result).toEqual(mockData);
  });
});
