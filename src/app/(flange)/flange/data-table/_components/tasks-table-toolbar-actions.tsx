"use client";

import type { Task } from "~/db/schema";
import type { Table } from "@tanstack/react-table";
import { Download } from "lucide-react";

import { Button } from "~/components/ui/button";
import { exportTableToCSV } from "~/lib/export";

import { CreateTaskSheet } from "./create-task-sheet";
import { DeleteTasksDialog } from "./delete-tasks-dialog";

interface TasksTableToolbarActionsProps {
  table: Table<Task>;
}

/**
 * TasksTableToolbarActions组件 - 任务表格工具栏操作
 * 
 * 功能：
 * - 提供表格顶部的操作按钮
 * - 包括删除选中任务、创建新任务和导出功能
 * 
 * @param {TasksTableToolbarActionsProps} props - 组件属性
 * @param {Table<Task>} props.table - react-table实例
 * @returns {JSX.Element} 返回工具栏操作组件
 */
export function TasksTableToolbarActions({
  table,
}: TasksTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <DeleteTasksDialog
          tasks={table
            .getFilteredSelectedRowModel()
            .rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}
      <CreateTaskSheet />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: "tasks",
            excludeColumns: ["select", "actions"],
          })
        }
      >
        <Download />
        Export
      </Button>
      {/**
       * Other actions can be added here.
       * For example, import, view, etc.
       */}
    </div>
  );
}
