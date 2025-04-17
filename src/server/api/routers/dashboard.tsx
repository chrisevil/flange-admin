import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  generateOvertimeStats,
  generateCompanyOvertimeData,
  generateDepartmentOvertimeData,
  generateLeaderOvertimeData,
  generateOvertimeTrendData,
  generateAttendanceData,
  generateBusinessTripData,
  generateOvertimeReasonData
} from "~/lib/dashboard-data";

export const dashboardRouter = createTRPCRouter({
  // 获取加班概览统计数据
  getOvertimeStats: publicProcedure
    .query(() => {
      return generateOvertimeStats();
    }),

  // 获取按公司的加班数据
  getCompanyOvertimeData: publicProcedure
    .query(() => {
      return generateCompanyOvertimeData();
    }),

  // 获取按部门的加班数据
  getDepartmentOvertimeData: publicProcedure
    .query(() => {
      return generateDepartmentOvertimeData();
    }),

  // 获取领导加班数据
  getLeaderOvertimeData: publicProcedure
    .query(() => {
      return generateLeaderOvertimeData();
    }),

  // 获取加班趋势数据
  getOvertimeTrendData: publicProcedure
    .input(z.object({
      days: z.number().optional().default(30)
    }))
    .query(({ input }) => {
      return generateOvertimeTrendData(input.days);
    }),

  // 获取出勤分析数据
  getAttendanceData: publicProcedure
    .query(() => {
      return generateAttendanceData();
    }),

  // 获取出差分析数据
  getBusinessTripData: publicProcedure
    .query(() => {
      return generateBusinessTripData();
    }),

  // 获取加班原因分析数据
  getOvertimeReasonData: publicProcedure
    .query(() => {
      return generateOvertimeReasonData();
    })
});