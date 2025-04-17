"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef as TanstackColumnDef,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { TableToolbar } from "./table-toolbar";
import { CellEditor } from "./cell-editor";
import { RowActions } from "./row-actions";
import type { ColumnDef, TableEditorProps } from "./types";

export * from "./types";

const columnHelper = createColumnHelper<any>();

// 添加useSkipper钩子，避免不必要的页面重置
function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // 包装一个函数，临时跳过分页重置
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

export function TableEditor({
  value = [],
  columns = [],
  onChange,
  data,
  parentData,
  meta,
  debug = false,
  debounceMs = 300, // 保留参数但不再使用全局防抖
  showToolbar = true,
  showPagination = false,
  pageSize = 10,
  allowAdd = true,
  allowDelete = true,
  allowEdit = true,
  className,
}: TableEditorProps) {
  // 内部状态管理 - 移除全局防抖，使用普通状态
  const [tableData, setTableData] = React.useState<any[]>(value);
  // 单元格编辑状态 - 使用行列坐标标识正在编辑的单元格
  const [editingCell, setEditingCell] = React.useState<{ rowIndex: number; columnId: string } | null>(null);
  // 添加自动重置页面索引跳过器
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  // 监听外部数据变化
  React.useEffect(() => {
    setTableData(value);
  }, [value]);

  // 数据变更处理
  const handleDataChange = React.useCallback(
    (newData: any[]) => {
      setTableData(newData);
      onChange?.(newData);
    },
    [onChange]
  );

  // 单元格值变更处理
  const handleCellChange = React.useCallback(
    (rowIndex: number, columnId: string, value: any) => {
      // 跳过页面索引重置，直到下一次重新渲染后
      skipAutoResetPageIndex();
      const newData = [...tableData];
      newData[rowIndex] = {
        ...newData[rowIndex],
        [columnId]: value,
      };
      handleDataChange(newData);
      // 编辑完成后清除编辑状态
      setEditingCell(null);
    },
    [tableData, handleDataChange, skipAutoResetPageIndex]
  );

  // 开始编辑单元格
  const handleStartEdit = React.useCallback(
    (rowIndex: number, columnId: string) => {
      setEditingCell({ rowIndex, columnId });
    },
    []
  );

  // 添加行处理
  const handleAddRow = React.useCallback(() => {
    const newRow = columns.reduce(
      (acc, column) => {
        acc[column.id] = null;
        return acc;
      },
      {} as Record<string, any>
    );
    handleDataChange([...tableData, newRow]);
  }, [columns, tableData, handleDataChange]);

  // 删除行处理
  const handleDeleteRow = React.useCallback(
    (row: any) => {
      const rowIndex = tableData.indexOf(row);
      if (rowIndex !== -1) {
        const newData = [...tableData];
        newData.splice(rowIndex, 1);
        handleDataChange(newData);
      }
    },
    [tableData, handleDataChange]
  );

  // 不再需要切换整行编辑状态的函数

  // 构建表格列配置
  const tableColumns = React.useMemo(() => {
    const visibleColumns = columns.filter((col) => col.visible !== false);

    const tableCols = visibleColumns.map((column) => {
      return columnHelper.accessor(column.id, {
        id: column.id,
        header: column.header,
        cell: ({ row, getValue, column: { id }, table }) => {
          const rowIndex = row.index;
          const value = getValue();
          // 检查当前单元格是否处于编辑状态
          const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === id;

          return (
            <CellEditor
              value={value}
              onChange={(newValue) => handleCellChange(rowIndex, id, newValue)}
              onStartEdit={() => column.editable !== false && handleStartEdit(rowIndex, id)}
              column={column}
              row={row.original}
              data={data}
              isEditing={isEditing}
              // 所有单元格默认可点击进入编辑状态，除非明确设置为不可编辑
              isEditable={column.editable !== false && allowEdit}
            />
          );
        },
        size: column.width,
        minSize: column.minWidth,
        maxSize: column.maxWidth,
      });
    });

    // 添加操作列 - 只保留删除功能，不再需要行级编辑切换
    if (allowDelete) {
      tableCols.push(
        columnHelper.display({
          id: "actions",
          header: "操作",
          cell: ({ row }) => {
            return (
              <RowActions
                row={row.original}
                onDeleteRow={handleDeleteRow}
                allowDelete={allowDelete}
                allowEdit={false} // 不再使用行级编辑
              />
            );
          },
          size: 100,
        })
      );
    }

    return tableCols;
  }, [columns, handleCellChange, handleDeleteRow, handleStartEdit, editingCell, allowDelete, allowEdit, data]);

  // 初始化表格实例
  const table = useReactTable({
    data: tableData,
    columns: tableColumns as TanstackColumnDef<any>[],
    getCoreRowModel: getCoreRowModel(),
    autoResetPageIndex, // 添加自动重置页面索引控制
    // 提供updateData函数到表格元数据
    meta: {
      ...meta,
      parentData,
      updateData: (rowIndex: number, columnId: string, value: any) => {
        // 调用handleCellChange来更新数据
        handleCellChange(rowIndex, columnId, value);
      },
    },
  });

  return (
    <div className={cn("space-y-4", className)}>
      {debug && (
        <div className="p-2 border rounded bg-muted">
          <details>
            <summary className="cursor-pointer">调试信息</summary>
            <pre className="mt-2 text-xs">{JSON.stringify({ tableData }, null, 2)}</pre>
          </details>
        </div>
      )}

      {showToolbar && (
        <TableToolbar onAddRow={allowAdd ? handleAddRow : undefined} allowAdd={allowAdd} />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: `${header.getSize()}px` }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}