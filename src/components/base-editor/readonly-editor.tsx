"use client";

import * as React from "react";
import { FieldConfig } from ".";

interface ReadonlyEditorProps {
  field: FieldConfig;
}

export function ReadonlyEditor({ field }: ReadonlyEditorProps) {
  const { name, label, value, suffix } = field;

  return (
    <div className="flex flex-col space-y-1">
      {label && <label htmlFor={name}>{label}</label>}
      <div className="flex items-center">
        <span id={name} className="flex-1 px-2 py-1">
          {value ?? ""}
        </span>
        {suffix && <span className="ml-2">{suffix}</span>}
      </div>
    </div>
  );
}