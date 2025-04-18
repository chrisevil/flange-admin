"use client";

import { type Task, tasks } from "~/db/schema";
import { SelectTrigger } from "@radix-ui/react-select";
import type { Table } from "@tanstack/react-table";
import { ArrowUp, CheckCircle2, Download, Trash2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "~/components/data-table-action-bar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { exportTableToCSV } from "~/lib/export";
import { deleteTasks, updateTasks } from "../_lib/actions";

const actions = [
  "update-status",
  "update-priority",
  "export",
  "delete",
] as const;

type Action = (typeof actions)[number];

interface TasksTableActionBarProps {
  table: Table<Task>;
}

/**
 * TasksTableActionBar组件 - 任务表格操作栏
 * 
 * 功能：
 * - 提供批量操作选中行的功能
 * - 包括更新状态、优先级、导出和删除操作
 * - 显示操作加载状态
 * 
 * @param {TasksTableActionBarProps} props - 组件属性
 * @param {Table<Task>} props.table - react-table实例
 * @returns {JSX.Element} 返回表格操作栏组件
 */
export function TasksTableActionBar({ table }: TasksTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  /**
   * 处理任务更新操作
   * 
   * @param {object} params - 更新参数
   * @param {"status" | "priority"} params.field - 要更新的字段
   * @param {Task["status"] | Task["priority"]} params.value - 更新的值
   * @returns {Promise<void>} 无返回值
   */
  const onTaskUpdate = React.useCallback(
    ({
      field,
      value,
    }: {
      field: "status" | "priority";
      value: Task["status"] | Task["priority"];
    }) => {
      setCurrentAction(
        field === "status" ? "update-status" : "update-priority",
      );
      startTransition(async () => {
        const { error } = await updateTasks({
          ids: rows.map((row) => row.original.id),
          [field]: value,
        });

        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Tasks updated");
      });
    },
    [rows],
  );

  /**
   * 处理任务导出操作
   * 
   * @returns {void} 无返回值
   */
  const onTaskExport = React.useCallback(() => {
    setCurrentAction("export");
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ["select", "actions"],
        onlySelected: true,
      });
    });
  }, [table]);

  /**
   * 处理任务删除操作
   * 
   * @returns {Promise<void>} 无返回值
   */
  const onTaskDelete = React.useCallback(() => {
    setCurrentAction("delete");
    startTransition(async () => {
      const { error } = await deleteTasks({
        ids: rows.map((row) => row.original.id),
      });

      if (error) {
        toast.error(error);
        return;
      }
      table.toggleAllRowsSelected(false);
    });
  }, [rows, table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <Select
          onValueChange={(value: Task["status"]) =>
            onTaskUpdate({ field: "status", value })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update status"
              isPending={getIsActionPending("update-status")}
            >
              <CheckCircle2 />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {tasks.status.enumValues.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value: Task["priority"]) =>
            onTaskUpdate({ field: "priority", value })
          }
        >
          <SelectTrigger asChild>
            <DataTableActionBarAction
              size="icon"
              tooltip="Update priority"
              isPending={getIsActionPending("update-priority")}
            >
              <ArrowUp />
            </DataTableActionBarAction>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              {tasks.priority.enumValues.map((priority) => (
                <SelectItem
                  key={priority}
                  value={priority}
                  className="capitalize"
                >
                  {priority}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <DataTableActionBarAction
          size="icon"
          tooltip="Export tasks"
          isPending={getIsActionPending("export")}
          onClick={onTaskExport}
        >
          <Download />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete tasks"
          isPending={getIsActionPending("delete")}
          onClick={onTaskDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}
