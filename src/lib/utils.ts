import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ValidationError {
  path: string;
  message: string;
}

export function validateJSONStructure(
  data: any,
  schema: any,
  path: string = ''
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (typeof schema === 'object' && schema !== null) {
    // 检查必填字段
    if (schema.required) {
      for (const field of schema.required) {
        if (!(field in data)) {
          errors.push({
            path: path ? `${path}.${field}` : field,
            message: `缺少必填字段: ${field}`
          });
        }
      }
    }

    // 递归检查嵌套属性
    for (const [key, value] of Object.entries(schema.properties || {})) {
      const currentPath = path ? `${path}.${key}` : key;
      if (data[key] !== undefined) {
        errors.push(...validateJSONStructure(data[key], value, currentPath));
      }
    }

    // 检查数组类型
    if (schema.type === 'array' && Array.isArray(data)) {
      data.forEach((item, index) => {
        errors.push(...validateJSONStructure(item, schema.items, `${path}[${index}]`));
      });
    }

    // 格式验证（正则表达式）
    if (schema.pattern && typeof data === 'string') {
      const regex = new RegExp(schema.pattern);
      if (!regex.test(data)) {
        errors.push({
          path,
          message: `格式不符合要求: ${schema.pattern}`
        });
      }
    }
  }

  return errors;
}
