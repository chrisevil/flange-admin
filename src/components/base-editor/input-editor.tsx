"use client";

import * as React from "react";
import { type FieldConfig } from ".";
import { Input } from "../ui/input";

interface InputEditorProps {
  field: FieldConfig;
}

export function InputEditor({ field }: InputEditorProps) {
  const { type, name, label, value, onChange, suffix } = field;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    const val = type === "number"
      ? e.target.valueAsNumber || 0
      : e.target.value;

    onChange(val);
  };

  return (
    <div className="flex flex-col space-y-1">
      {label && <label htmlFor={name}>{label}</label>}
      <div className="flex items-center">
        <Input
          id={name}
          type={type}
          value={value ?? ""}
          onChange={handleChange}
        />
        {suffix && <span className="ml-2">{suffix}</span>}
      </div>
    </div>
  );
}