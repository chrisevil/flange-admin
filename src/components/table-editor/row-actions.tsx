"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import { Trash2, Edit, Save } from "lucide-react";
import type { RowActionsProps } from "./types";

export function RowActions({
  row,
  onDeleteRow,
  allowDelete = true,
  allowEdit = true,
  onToggleEdit,
  isEditing = false,
}: RowActionsProps) {
  return (
    <div className="flex items-center space-x-1">
      {allowEdit && onToggleEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onToggleEdit(row)}
          title={isEditing ? "保存" : "编辑"}
        >
          {isEditing ? (
            <Save className="h-4 w-4" />
          ) : (
            <Edit className="h-4 w-4" />
          )}
        </Button>
      )}
      
      {allowDelete && onDeleteRow && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDeleteRow(row)}
          title="删除"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}