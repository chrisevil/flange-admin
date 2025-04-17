"use client";

import { ListEditor } from "~/components/list-editor";

export default function ListFormDemoPage() {
  const initialItems = [
    {
      id: "1",
      title: "示例项目1",
      content: {
        name: {
          type: "text",
          label: "名称",
          value: "示例1",
          onChange: () => {}
        },
        description: {
          type: "textarea",
          label: "描述",
          value: "这是一个示例项目",
          onChange: () => {}
        }
      },
      isExpanded: false
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">列表编辑器演示</h1>
      <div className="rounded-lg border p-6 shadow-sm">
        <ListEditor 
          listId="demo-list" 
          initialItems={initialItems}
          debug={true}
        />
      </div>
    </div>
  );
}