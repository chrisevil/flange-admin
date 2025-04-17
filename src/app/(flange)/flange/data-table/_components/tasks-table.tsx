"use client";

import type { Task } from "@/db/schema";
import type { DataTableRowAction } from "@/types/data-table";
import * as React from "react";

import { DataTable } from "@/components/data-table";
import { useDataTable } from "@/hooks/use-data-table";

import { DataTableAdvancedToolbar } from "@/components/data-table-advanced-toolbar";
import { DataTableFilterList } from "@/components/data-table-filter-list";
import { DataTableFilterMenu } from "@/components/data-table-filter-menu";
import { DataTableSortList } from "@/components/data-table-sort-list";
import { DataTableToolbar } from "@/components/data-table-toolbar";
import type {
  getEstimatedHoursRange,
  getTaskPriorityCounts,
  getTaskStatusCounts,
  getTasks,
} from "../_lib/queries";
import { DeleteTasksDialog } from "./delete-tasks-dialog";
import { useFeatureFlags } from "./feature-flags-provider";
import { TasksTableActionBar } from "./tasks-table-action-bar";
import { getTasksTableColumns } from "./tasks-table-columns";
import { UpdateTaskSheet } from "./update-task-sheet";

interface TasksTableProps {
  promises: Promise<
    [
      Awaited<ReturnType<typeof getTasks>>,
      Awaited<ReturnType<typeof getTaskStatusCounts>>,
      Awaited<ReturnType<typeof getTaskPriorityCounts>>,
      Awaited<ReturnType<typeof getEstimatedHoursRange>>,
    ]
  >;
}

/**
 * TasksTable组件 - 主任务数据表格组件
 * 
 * 功能：
 * - 显示任务数据表格
 * - 集成高级筛选和排序功能
 * - 处理行操作和状态管理
 * 
 * @param {TasksTableProps} props - 组件属性
 * @param {Promise} props.promises - 异步数据加载的Promise数组
 * @returns {JSX.Element} 返回数据表格组件
 */
export function TasksTable({ promises }: TasksTableProps) {
  // 使用useFeatureFlags获取特性开关状态
  // enableAdvancedFilter: 是否启用高级筛选功能
  // filterFlag: 当前使用的筛选模式('advancedFilters'或默认模式)
  const { enableAdvancedFilter, filterFlag } = useFeatureFlags();

  // 使用React.use解构异步获取的数据
  // data: 任务数据数组
  // pageCount: 总页数
  // statusCounts: 各状态的任务计数
  // priorityCounts: 各优先级的任务计数
  // estimatedHoursRange: 预计小时数范围
  const [
    { data, pageCount },
    statusCounts,
    priorityCounts,
    estimatedHoursRange,
  ] = React.use(promises);

  // 使用useState管理行操作状态
  // rowAction: 当前行操作对象(包含操作类型和行数据)
  // setRowAction: 更新行操作的函数
  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Task> | null>(null);

  // 使用useMemo优化列定义的计算
  // 依赖项: statusCounts, priorityCounts, estimatedHoursRange
  // 当这些依赖项变化时重新计算列定义
  const columns = React.useMemo(
    () =>
      getTasksTableColumns({
        statusCounts,
        priorityCounts,
        estimatedHoursRange,
        setRowAction,
      }),
    [statusCounts, priorityCounts, estimatedHoursRange],
  );

  // 使用自定义hook useDataTable初始化表格实例
  // 参数说明:
  // data: 表格数据
  // columns: 列定义
  // pageCount: 总页数
  // enableAdvancedFilter: 是否启用高级筛选
  // initialState: 初始状态配置
  //   - sorting: 默认按createdAt降序排序
  //   - columnPinning: 固定actions列在右侧
  // getRowId: 获取行ID的函数
  // shallow: 是否使用浅比较
  // clearOnDefault: 是否在重置时清除所有筛选
  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data,
    columns,
    pageCount,
    enableAdvancedFilter,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  });

  return (
    <>
      <DataTable
        table={table}
        actionBar={<TasksTableActionBar table={table} />}
      >
        {enableAdvancedFilter ? (
          <DataTableAdvancedToolbar table={table}>
            <DataTableSortList table={table} align="start" />
            {filterFlag === "advancedFilters" ? (
              <DataTableFilterList
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
                align="start"
              />
            ) : (
              <DataTableFilterMenu
                table={table}
                shallow={shallow}
                debounceMs={debounceMs}
                throttleMs={throttleMs}
              />
            )}
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table}>
            <DataTableSortList table={table} align="end" />
          </DataTableToolbar>
        )}
      </DataTable>
      <UpdateTaskSheet
        open={rowAction?.variant === "update"}
        onOpenChange={() => setRowAction(null)}
        task={rowAction?.row.original ?? null}
      />
      <DeleteTasksDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        tasks={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
}
