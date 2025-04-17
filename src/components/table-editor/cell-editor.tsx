"use client";

import * as React from "react";
import { Input } from "~/components/ui/input";
import { Combobox } from "~/components/ui/combobox";
import type { CellEditorProps, CellOption } from "./types";

export function CellEditor({
  value,
  onChange,
  onStartEdit,
  column,
  row,
  data,
  isEditing = false,
  isEditable = false,
}: CellEditorProps) {
  const { type, options, multi, suffix, calculation } = column;

  // 处理计算字段
  const calculatedValue = React.useMemo(() => {
    if (type === "calculation" && calculation) {
      try {
        return calculation(row, data) ?? "";
      } catch (error) {
        console.error("计算字段错误:", error);
        return "";
      }
    }
    return undefined;
  }, [type, calculation, row, data]);

  // 当处于编辑模式时，使用内部状态管理值
  // 这样可以在用户输入时不立即触发数据更新
  const initialValue = value;
  const [internalValue, setInternalValue] = React.useState(initialValue);

  // 加载下拉选项
  const [loadedOptions, setLoadedOptions] = React.useState<CellOption[]>([]);

  React.useEffect(() => {
    if (type === "select" && options) {
      // 处理不同数据源的下拉选项
      if (options.options) {
        setLoadedOptions(options.options);
      } else if (options.optionsFrom && data) {
        // 从根数据加载选项
        const path = options.optionsFrom.split('.');
        let result = data;
        for (const key of path) {
          result = result?.[key];
        }
        setLoadedOptions(Array.isArray(result) ? result : []);
      } else if (options.optionsFromData && row) {
        // 从当前行数据加载选项
        const path = options.optionsFromData.split('.');
        let result = row;
        for (const key of path) {
          result = result?.[key];
        }
        setLoadedOptions(Array.isArray(result) ? result : []);
      }
    }
  }, [type, options, data, row]);

  // 渲染只读模式
  if (!isEditing || type === "readonly" || type === "calculation") {
    const displayValue = type === "calculation" ? calculatedValue : value;

    // 处理下拉选择的显示
    if (type === "select" && value) {
      if (multi && Array.isArray(value)) {
        return (
          <div className="py-1" onClick={() => isEditable && onStartEdit?.()}>
            {value.map((v: CellOption) => (
              <span key={v.value} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-1">
                {v.label}
              </span>
            ))}
          </div>
        );
      } else if (!multi && typeof value === "object") {
        return <div className="py-2" onClick={() => isEditable && onStartEdit?.()}>{(value as CellOption)?.label}</div>;
      }
    }

    return (
      <div
        className={`py-2 flex items-center ${isEditable ? 'cursor-pointer hover:bg-gray-50' : ''}`}
        onClick={() => isEditable && onStartEdit?.()}
      >
        <span>{displayValue}</span>
        {suffix && <span className="ml-2">{suffix}</span>}
      </div>
    );
  }

  // 渲染编辑模式
  // 使用ref自动聚焦输入框
  const inputRef = React.useRef<HTMLInputElement>(null);

  // 自动聚焦
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // 处理失焦事件
  const handleBlur = () => {
    // 当输入框失焦时，通知父组件完成编辑
    // 这里不需要额外的防抖，因为只在失焦时触发一次更新
    // 这样可以避免频繁更新导致的卡顿问题
    if (type !== "select") {
      onChange(internalValue);
    }
  };

  // 如果外部值发生变化，同步到内部状态
  React.useEffect(() => {
    setInternalValue(initialValue);
  }, [initialValue]);

  switch (type) {
    case "text":
      return (
        <Input
          ref={inputRef}
          value={internalValue ?? ""}
          onChange={(e) => setInternalValue(e.target.value)}
          onBlur={handleBlur}
          className="h-8"
          autoFocus
        />
      );

    case "number":
      return (
        <div className="flex items-center">
          <Input
            ref={inputRef}
            type="number"
            value={internalValue ?? ""}
            onChange={(e) => setInternalValue(e.target.valueAsNumber || 0)}
            onBlur={handleBlur}
            className="h-8"
            autoFocus
          />
          {suffix && <span className="ml-2">{suffix}</span>}
        </div>
      );

    case "select":
      return (
        <Combobox
          options={loadedOptions}
          value={internalValue}
          onChange={(newValue) => {
            setInternalValue(newValue);
            // 直接调用onChange传递新值，而不是等待失焦
            onChange(newValue);
            // 选择后自动关闭编辑状态
            setTimeout(handleBlur, 0);
          }}
          placeholder={column.header || "请选择..."}
          emptyMessage="未找到选项"
          isMulti={multi}
          autoFocus
        />
      );

    default:
      return null;
  }
}