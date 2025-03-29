import { describe, expect, it } from "vitest";
import { MathUtils } from "./math-utils";

describe("MathUtils", () => {
  describe("add", () => {
    it("应该正确处理整数加法", () => {
      expect(MathUtils.add(1, 2)).toBe("3");
    });

    it("应该正确处理小数加法", () => {
      expect(MathUtils.add(0.1, 0.2)).toBe("0.3");
    });

    it("应该正确处理大数加法", () => {
      expect(MathUtils.add("9999999999999999", 1)).toBe("10000000000000000");
    });
  });

  describe("subtract", () => {
    it("应该正确处理整数减法", () => {
      expect(MathUtils.subtract(5, 3)).toBe("2");
    });

    it("应该正确处理小数减法", () => {
      expect(MathUtils.subtract(0.3, 0.1)).toBe("0.2");
    });
  });

  describe("multiply", () => {
    it("应该正确处理整数乘法", () => {
      expect(MathUtils.multiply(3, 4)).toBe("12");
    });

    it("应该正确处理小数乘法", () => {
      expect(MathUtils.multiply(0.1, 0.1)).toBe("0.01");
    });
  });

  describe("divide", () => {
    it("应该正确处理整数除法", () => {
      expect(MathUtils.divide(6, 2)).toBe("3");
    });

    it("应该正确处理小数除法", () => {
      expect(MathUtils.divide(0.3, 0.1)).toBe("3");
    });
  });

  describe("round", () => {
    it("应该正确四舍五入到指定小数位", () => {
      expect(MathUtils.round(3.14159, 2)).toBe("3.14");
      expect(MathUtils.round(3.14559, 2)).toBe("3.15");
    });
  });

  describe("percentage", () => {
    it("应该正确计算百分比", () => {
      expect(MathUtils.percentage(25, 100)).toBe("25");
      expect(MathUtils.percentage(1, 3, 2)).toBe("33.33");
    });
  });

  describe("sum", () => {
    it("应该正确计算数组总和", () => {
      expect(MathUtils.sum([1, 2, 3, 4, 5])).toBe("15");
      expect(MathUtils.sum([0.1, 0.2, 0.3])).toBe("0.6");
    });

    it("应该处理空数组", () => {
      expect(MathUtils.sum([])).toBe("0");
    });
  });

  describe("mean", () => {
    it("应该正确计算平均值", () => {
      expect(MathUtils.mean([2, 4, 6, 8, 10])).toBe("6");
      expect(MathUtils.mean([0.1, 0.2, 0.3])).toBe("0.2");
    });

    it("应该处理空数组", () => {
      expect(MathUtils.mean([])).toBe("0");
    });
  });
});