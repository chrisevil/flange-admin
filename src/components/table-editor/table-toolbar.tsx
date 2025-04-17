"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import type { TableToolbarProps } from "./types";

export function TableToolbar({ onAddRow, allowAdd = true }: TableToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {/* 可以添加其他工具栏功能，如搜索、筛选等 */}
      </div>
      <div className="flex items-center space-x-2">
        {allowAdd && onAddRow && (
          <Button size="sm" onClick={onAddRow}>
            <Plus className="h-4 w-4 mr-2" />
            添加行
          </Button>
        )}
      </div>
    </div>
  );
}