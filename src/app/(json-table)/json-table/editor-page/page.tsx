// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "~/components/ui/button";
// import { toast } from "sonner";
// import { KeyValueEditor } from "~/components/json-editors/key-value-editor";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
// // import { AnalysisPanel } from "./_components/analysis-panel";
// import { useAtom } from "jotai";
// import { jsonDataAtom, jsonMetaAtom, isSavingAtom } from "~/atoms/json-editor";
// // import { LoadingOverlay } from "~/components/ui/loading-overlay";
// // import { validateJson } from "./utils/validate";
// // import { PermissionGuard } from "./components/permission-guard";
// // import { getCurrentUser } from "./utils/auth";

// import { FileList } from "./_components/file-list";
// import { Sidebar } from "./_components/sidebar";
// import { createDataPreprocessor } from "./utils/preprocess";

// interface FileInfo {
//   name: string;
//   path: string;
//   modifiedDate: string; // 添加修改日期字段
// }

// export default function JsonTablePage() {
//   const router = useRouter();
//   const [data, setData] = useAtom(jsonDataAtom);
//   const [meta, setMeta] = useAtom(jsonMetaAtom);
//   // const [, setCalculationData] = useAtom(calculationDataAtom);
//   const [files, setFiles] = useState<FileInfo[]>([]);
//   const [selectedFile, setSelectedFile] = useState<string | null>(null);
//   const [analysis, setAnalysis] = useState<any>(null);
//   const [isSaving, setIsSaving] = useAtom(isSavingAtom);
//   const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
//   const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);

//   // 创建数据预处理器
//   const dataPreprocessor = useRef(createDataPreprocessor()).current;

//   useEffect(() => {
//     void fetchFileList();
//   }, []);

//   const fetchFileList = async () => {
//     try {
//       const response = await fetch("/api/files");
//       const data: FileInfo[] = await response.json();
//       setFiles(data);
//     } catch (error) {
//       toast.error("获取文件列表失败");
//     }
//   };

//   const handleFileSelect = async (path: string) => {
//     try {
//       const response = await fetch(`/api/files/${encodeURIComponent(path)}`);
//       const content = await response.json();
//       setSelectedFile(path);
//       // 使用 atom 设置数据和元数据
//       const {
//         meta: metaData,
//         data: jsonData,
//         analysis: analysisData,
//       } = content;

//       // 数据预处理：确保数据结构与元数据一致
//       const processedData = await dataPreprocessor(
//         jsonData,
//         metaData,
//         async (updatedData) => {
//           // 保存预处理后的数据
//           const saveContent = {
//             meta: metaData,
//             data: updatedData,
//           };
//           await fetch(`/api/files/${encodeURIComponent(path)}`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(saveContent),
//           });
//         },
//         async () => {
//           // 重新加载数据（这里不需要实际操作，因为我们会在下面设置状态）
//           return;
//         },
//       );
//       console.log(processedData);

//       // 设置预处理后的数据
//       setData(processedData);
//       setMeta(metaData);
//       setAnalysis(analysisData);

//       // 初始化计算数据
//       // const initialCalculations = initializeCalculations(processedData, metaData);
//       // setCalculationData(initialCalculations);
//       // console.log(
//       //   "已初始化计算数据，共",
//       //   Object.keys(initialCalculations).length,
//       //   "个结果",
//       // );
//     } catch (error) {
//       console.error("读取文件失败:", error);
//       toast.error("读取文件失败");
//     }
//   };

//   const handleSave = async () => {
//     if (!selectedFile) return;
//     setIsSaving(true);
//     try {
//       // 添加保存前验证, 启用调试模式
//       const validation = validateJson(data, meta, true);
//       console.log("验证结果:", validation);
//       if (!validation.isValid) {
//         validation.errors.forEach((error) => {
//           toast.error(error);
//           console.error(error);
//         });
//         setIsSaving(false);
//         return;
//       }

//       // 其余保存逻辑
//       // const content = {
//       //   meta,
//       //   data,
//       // };

//       // await fetch(`/api/files/${encodeURIComponent(selectedFile)}`, {
//       //   method: "POST",
//       //   headers: {
//       //     "Content-Type": "application/json",
//       //   },
//       //   body: JSON.stringify(content),
//       // });
//       // toast.success("保存成功");
//     } catch (error) {
//       console.error("保存失败:", error);
//       toast.error("保存失败");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleExecutePython = async (scriptName: string) => {
//     if (!selectedFile) {
//       toast.error("请先选择一个JSON文件");
//       return;
//     }

//     setIsSaving(true);
//     try {
//       const response = await fetch("/api/python", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           scriptPath: scriptName,
//           jsonPath: selectedFile,
//         }),
//       });

//       if (!response.ok) {
//         const error = await response.json();
//         throw new Error(error.error || "执行失败");
//       }

//       const result = await response.json();

//       if (result.error) {
//         toast.error(`Python执行错误: ${result.error}`);
//         return;
//       }

//       toast.success("Python脚本执行成功");
//       console.log("Python输出:", result.output);

//       // 重新加载当前文件
//       await handleFileSelect(selectedFile);
//     } catch (error) {
//       toast.error(
//         `执行失败: ${error instanceof Error ? error.message : "未知错误"}`,
//       );
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const formatDate = (dateString: string): string => {
//     const date = new Date(dateString);
//     return date.toLocaleString("zh-CN", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="fixed inset-0 mx-auto flex size-full flex-col">
//       {/* {isSaving && <LoadingOverlay className="fixed" />} */}
//       <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between bg-white p-4 shadow">
//         <div className="flex items-center gap-4">
//           <h1 className="text-2xl font-bold">JSON文件编辑器</h1>
//           <div className="text-sm text-gray-500">
//             {/* 当前用户: {getCurrentUser()} */}
//             demo
//           </div>
//         </div>
//         <div className="space-x-2">
//           {/* <PermissionGuard
//             permission="write"
//             fallback={
//               <Button variant="outline" disabled title="无权限">
//                 保存
//               </Button>
//             }
//           >
//             <Button variant="outline" onClick={handleSave}>
//               保存
//             </Button>
//           </PermissionGuard>

//           <PermissionGuard
//             permission="execute"
//             fallback={
//               <Button variant="outline" disabled title="无权限">
//                 执行Python脚本
//               </Button>
//             }
//           >
//             <Button
//               variant="outline"
//               onClick={() => handleExecutePython("example.py")}
//             >
//               执行Python脚本
//             </Button>
//           </PermissionGuard> */}

//           <Button
//             variant="outline"
//             onClick={() => router.push("/examples/demo/form")}
//           >
//             返回编辑器
//           </Button>
//         </div>
//       </div>

//       <div className="mt-20 flex h-[calc(100vh-6rem)]">
//         <FileList
//           files={files}
//           selectedFile={selectedFile}
//           onFileSelect={handleFileSelect}
//           onCollapseChange={setLeftSidebarCollapsed}
//         />

//         <div className="flex-grow overflow-auto px-2">
//           <div className="min-h-full rounded border p-4">
//             {/* <PermissionGuard
//               permission="read"
//               fallback={
//                 <div className="text-center text-gray-500">无权限查看内容</div>
//               }
//             > */}
//               {selectedFile && data && meta && (
//                 <Tabs defaultValue="editor">
//                   <TabsList>
//                     <TabsTrigger value="editor">编辑器</TabsTrigger>
//                     <TabsTrigger value="analysis">数据分析</TabsTrigger>
//                   </TabsList>
//                   <TabsContent
//                     value="editor"
//                     className="h-[calc(100%-3rem)] overflow-auto p-2"
//                   >
//                     {/* <KeyValueEditor
//                       data={data}
//                       meta={meta}
//                       analysis={analysis}
//                       onAnalysisChange={setAnalysis}
//                     /> */}
//                     <div className="text-center text-gray-500">
//                       编辑器功能暂未实现
//                     </div>
//                   </TabsContent>
//                   <TabsContent value="analysis">
//                     {/* <AnalysisPanel /> */}
//                     <div className="text-center text-gray-500">
//                       数据分析功能暂未实现
//                     </div>
//                   </TabsContent>
//                 </Tabs>
//               )}
//               {!selectedFile && (
//                 <div className="text-center text-gray-500">
//                   请从左侧选择要编辑的JSON文件
//                 </div>
//               )}
//               {selectedFile && !data && (
//                 <div className="text-center text-gray-500">
//                   缺少数据，请检查文件格式
//                 </div>
//               )}
//               {selectedFile && !meta && (
//                 <div className="text-center text-gray-500">
//                   缺少元数据，请检查文件格式
//                 </div>
//               )}
//             {/* </PermissionGuard> */}
//           </div>
//         </div>

//         <Sidebar
//           onCollapseChange={setRightSidebarCollapsed}
//           selectedFile={selectedFile}
//           data={data}
//           meta={meta}
//         />
//       </div>
//     </div>
//   );
// }
