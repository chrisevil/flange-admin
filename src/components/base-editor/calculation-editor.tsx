"use client";

import * as React from "react";
import { FieldConfig } from ".";

interface CalculationEditorProps {
  field: FieldConfig;
  data?: any;
}

export function CalculationEditor({ field, data }: CalculationEditorProps) {
  const { name, label, calculation, suffix } = field;
  
  const calculatedValue = React.useMemo(() => {
    if (!calculation) return "";
    try {
      return calculation(data) ?? "";
    } catch (error) {
      console.error("计算字段错误:", error);
      return "";
    }
  }, [calculation, data]);

  return (
    <div className="flex flex-col space-y-1">
      {label && <label htmlFor={name}>{label}</label>}
      <div className="flex items-center">
        <span id={name} className="flex-1 px-2 py-1">
          {calculatedValue}
        </span>
        {suffix && <span className="ml-2">{suffix}</span>}
      </div>
    </div>
  );
}