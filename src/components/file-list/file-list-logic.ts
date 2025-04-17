"use client";

import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomFamily } from "jotai/utils";
import { toast } from "sonner";

export const directoryAtom = atom<string>("D:/json");

export const filesListAtom = atom<string[]>([]);

export const fileSelectedAtomFamily = atomFamily((filename: string) =>
  atom(false),
);

export const toggleFileSelectedAtom = atom(
  null,
  (get, set, filename: string) => {
    const current = get(fileSelectedAtomFamily(filename));
    console.log(`toggleFileSelectedAtom: ${filename} ${current}`);
    set(fileSelectedAtomFamily(filename), !current);
  },
);

export const selectedFilesAtom = atom((get) => {
  const filesList = get(filesListAtom);
  // 显式建立每个文件的依赖关系
  const selections = filesList.map((filename) =>
    get(fileSelectedAtomFamily(filename)),
  );
  console.count("selectedFilesAtom updated");
  return filesList.filter((_, index) => selections[index]);
});

export const setAllFilesSelectedAtom = atom(
  null,
  (get, set, selected: boolean) => {
    const filesList = get(filesListAtom);
    filesList.forEach((filename) => {
      set(fileSelectedAtomFamily(filename), selected);
    });
  },
);

export function useFileListLogic() {
  const [directory, setDirectory] = useAtom(directoryAtom);
  const [filesList, setFilesList] = useAtom(filesListAtom);
  const selectedFiles = useAtomValue(selectedFilesAtom);
  const setAllFilesSelected = useSetAtom(setAllFilesSelectedAtom);

  const handleGetFilesList = async (data: string[]) => {
    if (!directory.trim()) {
      toast.error("请输入文件目录");
      return;
    }
    try {
      setFilesList(data);
    } catch (error) {
      toast.error(
        `获取文件列表失败: ${error instanceof Error ? error.message : "未知错误"}`,
      );
    }
  };

  const handleSelectAll = () => {
    setAllFilesSelected(true);
  };

  const handleDeselectAll = () => {
    setAllFilesSelected(false);
  };

  const toggleFileSelected = useSetAtom(toggleFileSelectedAtom);
  return {
    directory,
    setDirectory,
    filesList,
    selectedFiles,
    handleGetFilesList,
    handleSelectAll,
    handleDeselectAll,
    toggleFileSelected,
  };
}
