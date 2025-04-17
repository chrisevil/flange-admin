"use client";

import * as React from "react";
import { type FieldConfig } from ".";

interface TextareaEditorProps {
  field: FieldConfig;
}

export function TextareaEditor({ field }: TextareaEditorProps) {
  const { name, label, value, onChange, suffix } = field;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!onChange) return;
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col space-y-1">
      {label && <label htmlFor={name}>{label}</label>}
      <div className="flex items-center">
        <textarea
          id={name}
          value={value ?? ""}
          onChange={handleChange}
          className="flex-1 border rounded px-2 py-1 min-h-[80px]"
        />
        {suffix && <span className="ml-2">{suffix}</span>}
      </div>
    </div>
  );
}