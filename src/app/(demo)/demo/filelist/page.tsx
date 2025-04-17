"use client";

import { FileList } from "~/components/file-list";
import { useFileListLogic } from "~/components/file-list/file-list-logic";
import { api } from "~/trpc/react";

export default function FileListPage() {
  const {
    directory,
    setDirectory,
    selectedFiles,
    handleSelectAll,
    handleDeselectAll,
    toggleFileSelected
  } = useFileListLogic();

  const { data: filesList, isLoading } = api.files.getFilesList.useQuery({ directory });

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">文件列表</h1>

      {/* 使用封装好的FileList组件 */}
      <FileList
        title="文件列表"
        showDirectoryInput={true}
        directory={directory}
        onDirectoryChange={setDirectory}
        filesList={filesList ?? []}
        selectedFiles={selectedFiles}
        isLoading={isLoading}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onToggleFile={toggleFileSelected}
      />

      {/* 可以在这里添加其他使用selectedFiles的UI或逻辑 */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">组件使用示例</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          这个页面展示了如何使用FileList组件。您可以通过导入selectedFilesAtom来获取选中的文件列表。
        </p>
        <pre className="mt-4 rounded-md bg-muted p-4">
          <code>
            {`// 导入组件和相关atom
              import { FileList, selectedFilesAtom } from "~/components/file-list";

              // 获取选中的文件
              const selectedFiles = useAtomValue(selectedFilesAtom);

              // 使用组件
              <FileList 
                title="自定义标题" 
                showDirectoryInput={true}
              />`}
          </code>
        </pre>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">当前选中文件</h2>
        <div className="mt-2 rounded-md bg-muted p-4">
          {selectedFiles.length > 0 ? (
            <ul className="space-y-1">
              {selectedFiles.map((file) => (
                <li key={file}>{file}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">暂无选中文件</p>
          )}
        </div>
      </div>
    </div>
  );
}