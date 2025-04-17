"use client";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FileItem } from "./file-item";

interface FileListProps {
  title?: string;
  showDirectoryInput?: boolean;
  directory?: string;
  onDirectoryChange?: (value: string) => void;
  filesList?: string[];
  selectedFiles?: string[];
  isLoading?: boolean;
  onGetFilesList?: () => void;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  onToggleFile?: (file: string) => void;
  className?: string;
}

export function FileList({
  title = "文件列表",
  showDirectoryInput = true,
  directory = "",
  onDirectoryChange,
  filesList = [],
  selectedFiles = [],
  isLoading = false,
  onGetFilesList,
  onSelectAll,
  onDeselectAll,
  className = "",
  onToggleFile
}: FileListProps) {
  return (
    <div className={className}>
      {showDirectoryInput && (
        <div className="mb-6 flex items-end gap-4">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium">文件目录</label>
            <input
              type="text"
              value={directory}
              onChange={(e) => onDirectoryChange?.(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="输入文件目录路径"
            />
          </div>
          <Button
            onClick={onGetFilesList}
            disabled={isLoading}
          >
            获取文件列表
          </Button>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              disabled={filesList.length === 0}
            >
              全选
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDeselectAll}
              disabled={filesList.length === 0}
            >
              取消全选
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filesList.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {isLoading ? "加载中..." : "暂无文件"}
            </p>
          ) : (
            <div>
              <ul className="space-y-2">
                {filesList.map((file) => (
                  <FileItem
                    key={file}
                    filename={file}
                    isSelected={selectedFiles.includes(file)}
                    onToggle={() => onToggleFile?.(file)}
                  />
                ))}
              </ul>

              <div className="mt-4 rounded-md border p-4">
                <h3 className="mb-2 font-medium">已选择的文件 ({selectedFiles.length})</h3>
                {selectedFiles.length > 0 ? (
                  <ul className="list-inside list-disc">
                    {selectedFiles.map((file) => (
                      <li key={file}>{file}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">未选择任何文件</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}