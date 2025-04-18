import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  getOvertimeStats,
  getCompanyOvertimeData,
  getDepartmentOvertimeData,
  getLeaderOvertimeData,
  getOvertimeTrendData,
  getAttendanceData,
  getBusinessTripData,
  getOvertimeReasonData,
  getSystemViewData
} from "~/app/(flange)/flange/(dashboard)/dashboard/_libs/data-fetcher";

export const dashboardRouter = createTRPCRouter({
  // 获取加班概览统计数据
  getOvertimeStats: publicProcedure
    .query(async () => {
      return await getOvertimeStats();
    }),

  // 获取按公司的加班数据
  getCompanyOvertimeData: publicProcedure
    .query(async () => {
      return await getCompanyOvertimeData();
    }),

  // 获取按部门的加班数据
  getDepartmentOvertimeData: publicProcedure
    .query(async () => {
      return await getDepartmentOvertimeData();
    }),

  // 获取领导加班数据
  getLeaderOvertimeData: publicProcedure
    .query(async () => {
      return await getLeaderOvertimeData();
    }),

  // 获取加班趋势数据
  getOvertimeTrendData: publicProcedure
    .input(z.object({
      days: z.number().optional().default(30)
    }))
    .query(async ({ input }) => {
      return await getOvertimeTrendData(input.days);
    }),

  // 获取出勤分析数据
  getAttendanceData: publicProcedure
    .query(async () => {
      return await getAttendanceData();
    }),

  // 获取出差分析数据
  getBusinessTripData: publicProcedure
    .query(async () => {
      return await getBusinessTripData();
    }),

  // 获取加班原因分析数据
  getOvertimeReasonData: publicProcedure
    .query(async () => {
      return await getOvertimeReasonData();
    }),
    
  // 获取系统视图数据
  getSystemViewData: publicProcedure
    .query(async () => {
      return await getSystemViewData();
    })
});