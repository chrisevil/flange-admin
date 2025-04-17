"use client";
import React from "react";

import { useAtom } from "jotai";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { dimensionFields, dimensionsAtom, comboboxOptionsAtom, comboboxSelectedAtom } from "./atoms";
import { Combobox } from "~/components/ui/combobox";
import { BaseEditor, FieldConfig } from "~/components/base-editor";

export default function PopoverDemo() {
  const [dimensions, setDimensions] = useAtom(dimensionsAtom);
  const [comboboxOptions] = useAtom(comboboxOptionsAtom);
  const [selectedValues, setSelectedValues] = useAtom(comboboxSelectedAtom);

  // BaseEditor测试用例
  const [formData, setFormData] = React.useState({
    username: '',
    age: 0,
    gender: null,
    status: 'active',
    total: 0
  });

  const baseEditorFields: FieldConfig[] = [
    {
      type: 'text',
      name: 'username',
      label: '用户名',
      value: formData.username,
      onChange: (value) => setFormData({ ...formData, username: value })
    },
    {
      type: 'number',
      name: 'age',
      label: '年龄',
      value: formData.age,
      onChange: (value) => setFormData({ ...formData, age: value })
    },
    {
      type: 'select',
      name: 'gender',
      label: '性别',
      value: formData.gender,
      options: {
        options: [
          { value: 'male', label: '男' },
          { value: 'female', label: '女' }
        ]
      },
      onChange: (value) => setFormData({ ...formData, gender: value })
    },
    {
      type: 'readonly',
      name: 'status',
      label: '状态',
      value: formData.status
    },
    {
      type: 'calculation',
      name: 'total',
      label: '总计',
      calculation: (data) => data.age * 10,
      data: formData
    }
  ];

  const handleDimensionChange = (id: string, value: string) => {
    setDimensions(prev => ({ ...prev, [id]: value }));
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
            <div className="grid gap-2">
              {dimensionFields.map((field) => (
                <div key={field.id} className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor={field.id}>{field.label}</Label>
                  <Input
                    id={field.id}
                    value={dimensions[field.id]}
                    onChange={(e) => handleDimensionChange(field.id, e.target.value)}
                    className="col-span-2 h-8"
                  />
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="mt-4">
        <h4 className="font-medium leading-none mb-2">选择维度配置</h4>
        <Combobox
          options={comboboxOptions.map(field => ({
            value: field.id,
            label: field.label
          }))}
          value={selectedValues}
          onChange={(selected) => {
            if (Array.isArray(selected)) {
              setSelectedValues(selected);
              const newDimensions = selected.reduce((acc, item) => {
                const field = dimensionFields.find(f => f.id === item.value);
                if (field) {
                  return { ...acc, [field.id]: field.defaultValue };
                }
                return acc;
              }, {});
              setDimensions(newDimensions);
            } else if (selected) {
              setSelectedValues([selected]);
              const field = dimensionFields.find(f => f.id === selected.value);
              if (field) {
                setDimensions({ [field.id]: field.defaultValue });
              }
            }
          }}
          placeholder="选择维度"
          emptyMessage="未找到维度"
          isMulti
        />
      </div>

      <div className="mt-8 p-4 border rounded-lg bg-gray-50">
        <h4 className="font-medium leading-none mb-2">调试面板</h4>
        <pre className="text-sm bg-white p-2 rounded border overflow-auto">
          {JSON.stringify(dimensions, null, 2)}
        </pre>
      </div>

      <div className="mt-8 p-4 border rounded-lg bg-gray-50">
        <h4 className="font-medium leading-none mb-2">BaseEditor测试</h4>
        <div className="space-y-4">
          {baseEditorFields.map((field: Record<string, string>) => (
            <BaseEditor key={field.name} field={field} data={formData} />
          ))}
        </div>
        <pre className="mt-4 text-sm bg-white p-2 rounded border overflow-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </>
  );
}
