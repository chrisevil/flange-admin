"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TableEditor, ColumnDef } from "~/components/table-editor";

// 示例数据
const generateInitialData = () => {
  return Array.from({ length: 100 }, (_, i) => {
    const categories = [
      { value: "electronics", label: "电子产品" },
      { value: "clothing", label: "服装" },
      { value: "food", label: "食品" },
      { value: "books", label: "图书" }
    ];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    return {
      id: String(i + 1),
      name: `产品${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) + 1}`,
      price: Math.floor(Math.random() * 1000) + 50,
      category: randomCategory,
      inStock: Math.random() > 0.3
    };
  });
};

// 示例分类选项
const categoryOptions = [
  { value: "electronics", label: "电子产品" },
  { value: "clothing", label: "服装" },
  { value: "food", label: "食品" },
  { value: "books", label: "图书" },
];

export default function TableEditorDemo() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    setData(generateInitialData());
  }, []);

  // 列配置
  const columns = React.useMemo<ColumnDef[]>(
    () => [
      {
        id: "id",
        header: "ID",
        type: "readonly",
      },
      {
        id: "name",
        header: "产品名称",
        type: "text",
        editable: true,
      },
      {
        id: "price",
        header: "价格",
        type: "number",
        editable: true,
        suffix: "元",
      },
      {
        id: "category",
        header: "分类",
        type: "select",
        editable: true,
        options: {
          options: categoryOptions,
        },
      },
      {
        id: "total",
        header: "总价值",
        type: "calculation",
        calculation: (row) => {
          return row.price ? `${row.price * 1.1} 元` : "";
        },
      },
    ],
    []
  );

  // 数据变更处理
  const handleDataChange = React.useCallback((newData: any[]) => {
    console.log("数据已更新:", newData);
    setData(newData);
  }, []);

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>表格编辑器示例</CardTitle>
        </CardHeader>
        <CardContent>
          <TableEditor
            value={data}
            columns={columns}
            onChange={handleDataChange}
            debug={true}
            allowAdd={true}
            allowDelete={true}
            allowEdit={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}