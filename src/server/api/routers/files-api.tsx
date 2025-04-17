import { z } from "zod";
import fs from "fs";
import path from "path";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// 定义JSON文件存储的基础路径
const JSON_FILES_DIR = path.join(process.cwd(), "data");

// 确保目录存在
if (!fs.existsSync(JSON_FILES_DIR)) {
  fs.mkdirSync(JSON_FILES_DIR, { recursive: true });
}

export const filesApiRouter = createTRPCRouter({
  // 获取JSON文件列表
  getFilesList: publicProcedure
    .input(z.object({ directory: z.string().optional() }))
    .query(async ({ input }) => {
      try {
        // 使用用户提供的目录路径或默认路径
        const dirPath = input.directory 
          ? path.resolve(input.directory) 
          : JSON_FILES_DIR;
        
        // 确保目录存在
        if (!fs.existsSync(dirPath)) {
          throw new Error(`目录 ${dirPath} 不存在`);
        }
        
        const files = fs.readdirSync(dirPath);
        return files.filter(file => file.endsWith(".json"));
      } catch (error) {
        console.error("Error reading files directory:", error);
        return [];
      }
    }),

  // 获取JSON文件内容
  getFileContent: publicProcedure
    .input(z.object({ 
      filename: z.string(),
      directory: z.string().optional() 
    }))
    .query(async ({ input }) => {
      try {
        // 使用用户提供的目录路径或默认路径
        const dirPath = input.directory 
          ? path.resolve(input.directory) 
          : JSON_FILES_DIR;
        
        const filePath = path.join(dirPath, input.filename);
        if (!fs.existsSync(filePath)) {
          throw new Error(`文件 ${input.filename} 不存在`);
        }
        const content = fs.readFileSync(filePath, "utf-8");
        return { content };
      } catch (error) {
        console.error(`Error reading file ${input.filename}:`, error);
        throw error;
      }
    }),

  // 保存JSON文件内容
  saveFileContent: publicProcedure
    .input(z.object({ 
      filename: z.string(),
      content: z.string(),
      directory: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      try {
        // 验证JSON格式
        JSON.parse(input.content);
        
        // 使用用户提供的目录路径或默认路径
        const dirPath = input.directory 
          ? path.resolve(input.directory) 
          : JSON_FILES_DIR;
        
        // 确保目录存在
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }
        
        const filePath = path.join(dirPath, input.filename);
        fs.writeFileSync(filePath, input.content, "utf-8");
        return { success: true, message: "文件保存成功" };
      } catch (error) {
        console.error(`Error saving file ${input.filename}:`, error);
        if (error instanceof SyntaxError) {
          return { success: false, message: "Invalid JSON format" };
        }
        return { success: false, message: `Error: ${error instanceof Error ? error.message : String(error)}` };
      }
    })
});
