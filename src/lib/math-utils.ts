import { create, all } from "mathjs";

// 创建一个mathjs实例，包含所有函数
const math = create(all);

// 配置精度
math.config({
  number: "BigNumber",
  precision: 64, // 设置精度位数
});

/**
 * 数学计算工具函数
 * 所有函数都返回字符串以保持精确度
 */
export const MathUtils = {
  /**
   * 加法
   * @param a 第一个数
   * @param b 第二个数
   * @returns 计算结果
   */
  add(a: number | string, b: number | string): string {
    return math.evaluate(`${a} + ${b}`).toString();
  },

  /**
   * 减法
   * @param a 第一个数
   * @param b 第二个数
   * @returns 计算结果
   */
  subtract(a: number | string, b: number | string): string {
    return math.evaluate(`${a} - ${b}`).toString();
  },

  /**
   * 乘法
   * @param a 第一个数
   * @param b 第二个数
   * @returns 计算结果
   */
  multiply(a: number | string, b: number | string): string {
    return math.evaluate(`${a} * ${b}`).toString();
  },

  /**
   * 除法
   * @param a 第一个数
   * @param b 第二个数
   * @returns 计算结果
   */
  divide(a: number | string, b: number | string): string {
    return math.evaluate(`${a} / ${b}`).toString();
  },

  /**
   * 四舍五入到指定小数位
   * @param value 要处理的数值
   * @param decimals 小数位数
   * @returns 处理后的结果
   */
  round(value: number | string, decimals: number): string {
    return math.round(value, decimals).toString();
  },

  /**
   * 计算百分比
   * @param value 数值
   * @param total 总数
   * @param decimals 小数位数
   * @returns 百分比结果
   */
  percentage(
    value: number | string,
    total: number | string,
    decimals = 2,
  ): string {
    const result = math.evaluate(`(${value} / ${total}) * 100`);
    return math.round(result, decimals).toString();
  },

  /**
   * 求和
   * @param numbers 要求和的数组
   * @returns 求和结果
   */
  sum(numbers: (number | string)[]): string {
    if (numbers.length === 0) return "0";
    return math.sum(numbers.map(String)).toString();
  },

  /**
   * 计算平均值
   * @param numbers 要计算平均值的数组
   * @returns 平均值结果
   */
  mean(numbers: (number | string)[]): string {
    if (numbers.length === 0) return "0";
    return math.mean(numbers.map(String)).toString();
  },

  /**
   * 计算平方根
   * @param value 要计算平方根的数值
   * @returns 平方根结果
   */
  sqrt(value: number | string): string {
    return math.sqrt(value).toString();
  },
  /**
   * 计算立方根
   * @param value 要计算立方根的数值
   * @returns 立方根结果
   */
  cbrt(value: number | string): string {
    return math.cbrt(value).toString();
  },
};
