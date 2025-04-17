"use client";

import * as React from "react";
import { InputEditor } from "./input-editor";
import { ComboboxEditor } from "./combobox-editor";
import { ReadonlyEditor } from "./readonly-editor";
import { CalculationEditor } from "./calculation-editor";
import { TextareaEditor } from "./textarea-editor";

export type FieldType = "text" | "number" | "select" | "readonly" | "calculation" | "textarea";

export type FieldOption = {
  value: string;
  label: string;
};

export type FieldOptionsSource = {
  /** 静态选项 */
  options?: FieldOption[];
  /** 从根数据加载选项的路径 */
  optionsFrom?: string;
  /** 从当前数据加载选项的路径 */
  optionsFromData?: string;
};

export interface FieldConfig {
  /** 字段类型 */
  type: FieldType;
  /** 字段名称 */
  name: string;
  /** 字段标签 */
  label?: string;
  /** 字段值 */
  value?: any;
  /** 值变更回调 */
  onChange?: (value: any) => void;
  /** 下拉选项配置 */
  options?: FieldOptionsSource;
  /** 是否多选 */
  multi?: boolean;
  /** 自定义后缀 */
  suffix?: React.ReactNode;
  /** 计算字段的表达式 */
  calculation?: (data: any) => any;
  /** 其他自定义属性 */
  [key: string]: any;
}

export interface BaseEditorProps {
  /** 字段配置 */
  field: FieldConfig;
  /** 表单数据 */
  data?: any;
}

export function BaseEditor({ field, data }: BaseEditorProps) {
  switch (field.type) {
    case "text":
    case "number":
      return <InputEditor field={field} />;
    case "textarea":
      return <TextareaEditor field={field} />;
    case "select":
      return <ComboboxEditor field={field} data={data} />;
    case "readonly":
      return <ReadonlyEditor field={field} />;
    case "calculation":
      return <CalculationEditor field={field} data={data} />;
    default:
      return null;
  }
}