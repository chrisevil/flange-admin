/**
 * 表格编辑器类型定义
 */

export type CellType =
  | "text"
  | "number"
  | "select"
  | "readonly"
  | "calculation";

export type CellOption = {
  value: string;
  label: string;
};

export type CellOptionsSource = {
  /** 静态选项 */
  options?: CellOption[];
  /** 从根数据加载选项的路径 */
  optionsFrom?: string;
  /** 从当前数据加载选项的路径 */
  optionsFromData?: string;
};

export interface ColumnDef<T = Record<string, unknown>, D = unknown> {
  /** 列ID */
  id: string;
  /** 列标题 */
  header: string;
  /** 单元格类型 */
  type: CellType;
  /** 是否可编辑 */
  editable?: boolean;
  /** 下拉选项配置 */
  options?: CellOptionsSource;
  /** 是否多选 */
  multi?: boolean;
  /** 自定义后缀 */
  suffix?: React.ReactNode;
  /** 计算字段的表达式 */
  calculation?: (row: T, data?: D) => unknown;
  /** 宽度 */
  width?: number;
  /** 最小宽度 */
  minWidth?: number;
  /** 最大宽度 */
  maxWidth?: number;
  /** 是否可见 */
  visible?: boolean;
  /** 其他自定义属性 */
  [key: string]: unknown;
}

export interface TableEditorProps<T = Record<string, unknown>, D = unknown> {
  /** 表格数据 */
  value: T[];
  /** 列配置 */
  columns: Array<ColumnDef<T, D>>;
  /** 数据变更回调 */
  onChange?: (value: T[]) => void;
  /** 关联数据 */
  data?: D;
  /** 父级数据 */
  parentData?: unknown;
  /** 元数据配置 */
  meta?: Record<string, unknown>;
  /** 是否显示调试信息 */
  debug?: boolean;
  /** 防抖延迟(毫秒) */
  debounceMs?: number;
  /** 是否显示工具栏 */
  showToolbar?: boolean;
  /** 是否显示分页 */
  showPagination?: boolean;
  /** 每页行数 */
  pageSize?: number;
  /** 是否允许添加行 */
  allowAdd?: boolean;
  /** 是否允许删除行 */
  allowDelete?: boolean;
  /** 是否允许编辑 */
  allowEdit?: boolean;
  /** 自定义类名 */
  className?: string;
}

export interface CellEditorProps<T = Record<string, unknown>, D = unknown> {
  /** 单元格值 */
  value: string | number;
  /** 值变更回调 */
  onChange: (value: unknown) => void;
  /** 开始编辑回调 */
  onStartEdit?: () => void;
  /** 列定义 */
  column: ColumnDef;
  /** 行数据 */
  row: T;
  /** 表格数据 */
  data?: D;
  /** 是否正在编辑 */
  isEditing?: boolean;
  /** 是否可编辑 */
  isEditable?: boolean;
}

export interface TableToolbarProps {
  /** 添加行回调 */
  onAddRow?: () => void;
  /** 是否允许添加行 */
  allowAdd?: boolean;
}

export interface RowActionsProps<T = Record<string, unknown>> {
  /** 行数据 */
  row: T;
  /** 删除行回调 */
  onDeleteRow: (row: T) => void;
  /** 是否允许删除行 */
  allowDelete?: boolean;
  /** 是否允许编辑 */
  allowEdit?: boolean;
  /** 编辑状态切换回调 */
  onToggleEdit?: (row: T) => void;
  /** 是否正在编辑 */
  isEditing?: boolean;
}
