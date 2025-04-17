"use client";

import { atom } from "jotai";

// 维度配置的数据结构
export interface DimensionField {
  id: string;
  label: string;
  defaultValue: string;
}

// 维度配置数据
export const dimensionFields: DimensionField[] = [
  { id: "width", label: "Width", defaultValue: "100%" },
  { id: "maxWidth", label: "Max. width", defaultValue: "300px" },
  { id: "height", label: "Height", defaultValue: "25px" },
  { id: "maxHeight", label: "Max. height", defaultValue: "none" },
  { id: "backgroundColor", label: "Background color", defaultValue: "#ffffff" },
  { id: "color", label: "Text color", defaultValue: "#000000" },
  { id: "fontSize", label: "Font size", defaultValue: "14px" },
  { id: "fontWeight", label: "Font weight", defaultValue: "normal" },
];

// Combobox专用选项数据
export const comboboxOptionsAtom = atom<DimensionField[]>(
  dimensionFields
);

// Combobox选中值状态管理
export const comboboxSelectedAtom = atom<ComboboxOption[]>(
  []
);

// 维度值的状态管理
export const dimensionsAtom = atom<Record<string, string>>(
  Object.fromEntries(dimensionFields.map(field => [field.id, field.defaultValue]))
);