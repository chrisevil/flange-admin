"use client";

import { api } from "~/trpc/react";

export default function ClientApiRequestDemo() {
  const { data: filesList, isLoading } = api.files.getFilesList.useQuery({ directory: "D:\\json" });

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">文件列表API请求演示</h1>
      
      {isLoading ? (
        <p>加载中...</p>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">文件列表</h2>
          <ul className="space-y-2">
            {filesList?.map((file) => (
              <li key={file} className="p-2 border rounded">
                {file}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}