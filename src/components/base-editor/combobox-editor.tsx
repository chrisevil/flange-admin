"use client";

import * as React from "react";
import { Combobox } from "../ui/combobox";
import { FieldConfig, FieldOption } from ".";

interface ComboboxEditorProps {
  field: FieldConfig;
  data?: any;
}

export function ComboboxEditor({ field, data }: ComboboxEditorProps) {
  const { name, label, value, onChange, options, multi } = field;
  
  const [loadedOptions, setLoadedOptions] = React.useState<FieldOption[]>([]);
  
  React.useEffect(() => {
    // 处理不同数据源的下拉选项
    if (options?.options) {
      setLoadedOptions(options.options);
    } else if (options?.optionsFrom && data) {
      // 从根数据加载选项
      const path = options.optionsFrom.split('.');
      let result = data;
      for (const key of path) {
        result = result?.[key];
      }
      setLoadedOptions(Array.isArray(result) ? result : []);
    } else if (options?.optionsFromData && data) {
      // 从当前数据加载选项
      const path = options.optionsFromData.split('.');
      let result = data;
      for (const key of path) {
        result = result?.[key];
      }
      setLoadedOptions(Array.isArray(result) ? result : []);
    }
  }, [options, data]);

  const handleChange = (selected: FieldOption | FieldOption[]) => {
    if (!onChange) return;
    onChange(selected);
  };

  return (
    <div className="flex flex-col space-y-1">
      {label && <label htmlFor={name}>{label}</label>}
      <Combobox
        options={loadedOptions}
        value={value}
        onChange={handleChange}
        placeholder={label || "请选择..."}
        emptyMessage="未找到选项"
        isMulti={multi}
      />
    </div>
  );
}