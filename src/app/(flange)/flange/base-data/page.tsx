"use client";

import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
  flexRender,
} from "@tanstack/react-table";

import { fetchRawData } from "./_libs/data-fetcher";
import { DataTable } from "~/components/data-table";
import { DataTableToolbar } from "~/components/data-table-toolbar";
import { DataTableColumnHeader } from "~/components/data-table-column-header";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type EmployeeData = {
  user_id: string;
  name: string;
  overtime_hours: number;
  position_sequence: string;
  system_category: string;
  department_name: string;
  root_department_name: string;
};

export default function ListViewPage() {
  const [data, setData] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetchRawData();
        setData(response.data);
      } catch (error) {
        console.error("加载数据失败:", error);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  const columns: ColumnDef<EmployeeData>[] = [
    {
      accessorKey: "user_id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="用户ID" />
      ),
      cell: ({ row }) => <div>{row.getValue("user_id")}</div>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        variant: "text",
        label: "用户ID",
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="姓名" />
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        variant: "text",
        label: "姓名",
      },
    },
    {
      accessorKey: "overtime_hours",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="加班时长" />
      ),
      cell: ({ row }) => (
        <div className="text-right">
          {row.getValue("overtime_hours")} 小时
        </div>
      ),
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        variant: "number",
        label: "加班时长",
        unit: "小时",
      },
    },
    {
      accessorKey: "position_sequence",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="职位" />
      ),
      cell: ({ row }) => <div>{row.getValue("position_sequence")}</div>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        variant: "text",
        label: "职位",
      },
    },
    {
      accessorKey: "system_category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="系统分类" />
      ),
      cell: ({ row }) => <div>{row.getValue("system_category")}</div>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        variant: "text",
        label: "系统分类",
      },
    },
    {
      accessorKey: "department_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="部门" />
      ),
      cell: ({ row }) => <div>{row.getValue("department_name")}</div>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        variant: "text",
        label: "部门",
      },
    },
    {
      accessorKey: "root_department_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="公司" />
      ),
      cell: ({ row }) => <div>{row.getValue("root_department_name")}</div>,
      enableSorting: true,
      enableColumnFilter: true,
      meta: {
        variant: "text",
        label: "公司",
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>员工加班数据列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="全局搜索..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <DataTable
            table={table}
          >
            <DataTableToolbar table={table} />
          </DataTable>
          {loading && <div className="text-center py-4">加载中...</div>}
          {!loading && data.length === 0 && (
            <div className="text-center py-4">暂无数据</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}