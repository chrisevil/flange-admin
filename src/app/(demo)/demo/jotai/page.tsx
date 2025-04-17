"use client";

import { useEffect, useState } from "react";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import {
  atomFamily,
  atomWithDefault,
  loadable,
  selectAtom,
  splitAtom,
} from "jotai/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ModeToggle } from "~/components/mode-toggle";
import React from "react";

import { MathUtils } from "~/lib/math-utils";

// 基础原子 - 计数器
const counterAtom = atom("0");

// 派生原子 - 计数器的两倍
const doubleCounterAtom = atom((get) =>
  MathUtils.multiply(get(counterAtom), "2"),
);

// 可写派生原子 - 计数器的平方
const squareCounterAtom = atom(
  (get) => MathUtils.multiply(get(counterAtom), get(counterAtom)),
  (get, set, newValue: string) => {
    // 当设置平方值时，计算并设置原始计数器的值
    set(counterAtom, MathUtils.sqrt(newValue));
  },
);

// 异步原子 - 模拟API调用
const baseDataAtom = atom<{ type?: string; id?: number } | null>(null);

const fetchDataAtom = atom(
  async (get) => {
    const params = get(baseDataAtom);
    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 根据参数生成不同的响应内容
    let message = "异步数据加载成功！";
    if (params?.type === "error") {
      toast.error("异步数据加载失败！");
    } else if (params?.type === "custom") {
      message = `自定义消息 #${params.id ?? 0}`;
    }

    return {
      message,
      timestamp: new Date().toISOString(),
      params: params ?? "无参数",
    };
  },
  (_get, set, params: { type?: string; id?: number } | null) => {
    set(baseDataAtom, params);
  },
);

// 使用loadable包装异步原子，处理加载状态
const loadableDataAtom = loadable(fetchDataAtom);

// 原子家族 - 为每个ID创建一个原子
const userAtomFamily = atomFamily((userId: number) =>
  atom(async () => {
    // 模拟API调用获取用户数据
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { id: userId, name: `用户 ${userId}`, age: 20 + userId };
  }),
);

// 使用loadable包装原子家族
const loadableUserFamily = atomFamily((userId: number) =>
  loadable(userAtomFamily(userId)),
);

// 表单状态原子
const formAtom = atom({ name: "", email: "", message: "" });

// 表单验证原子
const formValidationAtom = atom((get) => {
  const form = get(formAtom);
  const errors: Record<string, string> = {};

  if (!form.name) errors.name = "姓名不能为空";
  if (!form.email) errors.email = "邮箱不能为空";
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "邮箱格式不正确";
  if (!form.message) errors.message = "留言不能为空";

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
});

// 使用selectAtom选择formAtom的特定字段
const nameAtom = selectAtom(formAtom, (state) => state.name);
const emailAtom = selectAtom(formAtom, (state) => state.email);
const messageAtom = selectAtom(formAtom, (state) => state.message);

// 使用atomWithStorage进行本地存储
const themeAtom = atomWithStorage("theme", "light");

// 使用splitAtom拆分数组
const todosAtom = atom([
  { id: 1, text: "学习Jotai基础", completed: true },
  { id: 2, text: "掌握派生原子", completed: false },
  { id: 3, text: "实践异步原子", completed: false },
]);

const todoAtomsAtom = splitAtom(todosAtom);

// 基础计数器组件
function CounterDemo() {
  const [count, setCount] = useAtom(counterAtom);
  const doubleCount = useAtomValue(doubleCounterAtom);
  const [squareCount, setSquareCount] = useAtom(squareCounterAtom);

  const handleDecrement = () => {
    setCount((c) => MathUtils.subtract(c, "1"));
  };

  const handleIncrement = () => {
    setCount((c) => MathUtils.add(c, "1"));
  };

  const handleSqrt2 = () => {
    // 设置当前值的平方值
    setSquareCount(MathUtils.sqrt(squareCount));
  };

  const handleSqrt3 = () => {
    // 设置当前值的立方值
    setSquareCount(MathUtils.cbrt(squareCount));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>基础原子与派生原子</CardTitle>
        <CardDescription>展示基础原子状态和只读/可写派生原子</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center rounded-md border p-4">
            <h3 className="text-lg font-medium">基础计数器</h3>
            <p className="my-2 text-3xl font-bold">{count}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleDecrement}>
                -
              </Button>
              <Button size="sm" onClick={handleIncrement}>
                +
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center rounded-md border p-4">
            <h3 className="text-lg font-medium">两倍值（只读）</h3>
            <p className="my-2 text-3xl font-bold">{doubleCount}</p>
            <p className="text-sm text-muted-foreground">自动从计数器派生</p>
          </div>

          <div className="flex flex-col items-center rounded-md border p-4">
            <h3 className="text-lg font-medium">平方值（可写）</h3>
            <p className="my-2 text-3xl font-bold">{squareCount}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSqrt2}>
                x²
              </Button>
              <Button size="sm" onClick={handleSqrt3}>
                x³
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 错误边界组件
import { toast } from "sonner";

/**
 * 错误边界组件
 * @param {React.ReactNode} children - 子组件
 * @param {() => void} onRetry - 重试回调
 * @returns {React.ReactNode} 渲染的组件
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error) {
    toast.error(`发生错误: ${String(error)}`);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <Button
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onRetry?.();
            }}
            className="mt-2"
          >
            重试
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 异步数据组件
function AsyncDemo() {
  const [, setData] = useAtom(fetchDataAtom);
  const [requestType, setRequestType] = useState<"normal" | "error" | "custom">(
    "normal",
  );
  const [customId, setCustomId] = useState(1);

  const handleReload = () => {
    const params = {
      type: requestType === "normal" ? undefined : requestType,
      id: requestType === "custom" ? customId : undefined,
    };
    setData(params);
    if (requestType === "custom") {
      setCustomId((prev) => prev + 1);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>异步原子</CardTitle>
        <CardDescription>展示异步数据获取和加载状态处理</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={requestType === "normal" ? "default" : "outline"}
              onClick={() => setRequestType("normal")}
            >
              普通请求
            </Button>
            <Button
              variant={requestType === "error" ? "default" : "outline"}
              onClick={() => setRequestType("error")}
            >
              错误请求
            </Button>
            <Button
              variant={requestType === "custom" ? "default" : "outline"}
              onClick={() => setRequestType("custom")}
            >
              自定义请求
            </Button>
          </div>

          <div className="rounded-md border p-4">
            <ErrorBoundary onRetry={handleReload}>
              <React.Suspense
                fallback={
                  <div className="py-4 text-center">
                    <p>加载中...</p>
                  </div>
                }
              >
                <AsyncContent />
              </React.Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleReload}>重新加载</Button>
      </CardFooter>
    </Card>
  );
}

// 异步内容组件
function AsyncContent() {
  const [data] = useAtom(loadableDataAtom);

  if (data.state === "loading") {
    return (
      <div className="py-4 text-center">
        <p>加载中...</p>
      </div>
    );
  }

  if (data.state === "hasError") {
    toast.error(`加载失败: ${String(data.error)}`);
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">消息: {data.data.message}</p>
      <p className="text-sm text-muted-foreground">
        时间戳: {data.data.timestamp}
      </p>
      <p className="text-sm text-muted-foreground">
        请求参数: {JSON.stringify(data.data.params)}
      </p>
    </div>
  );
}

// 原子家族组件
function AtomFamilyDemo() {
  const [userId, setUserId] = useState(1);
  const [userData] = useAtom(loadableUserFamily(userId));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>原子家族</CardTitle>
        <CardDescription>为每个用户ID创建独立的原子状态</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((id) => (
              <Button
                key={id}
                variant={userId === id ? "default" : "outline"}
                onClick={() => setUserId(id)}
              >
                用户 {id}
              </Button>
            ))}
          </div>

          <div className="rounded-md border p-4">
            {userData.state === "loading" && "加载用户数据中..."}

            {userData.state === "hasData" && (
              <>
                <h3 className="text-lg font-medium">{userData.data.name}</h3>
                <p>ID: {userData.data.id}</p>
                <p>年龄: {userData.data.age}</p>
              </>
            )}

            {userData.state === "hasError" && (
              <p className="text-red-500">加载失败: {String(userData.error)}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 表单状态管理组件
function FormDemo() {
  const [form, setForm] = useAtom(formAtom);
  const validation = useAtomValue(formValidationAtom);

  // 使用selectAtom选择的字段
  const name = useAtomValue(nameAtom);
  const email = useAtomValue(emailAtom);
  const message = useAtomValue(messageAtom);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validation.isValid) {
      alert(`表单提交成功！\n姓名: ${name}\n邮箱: ${email}\n留言: ${message}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>表单状态管理</CardTitle>
        <CardDescription>使用原子管理表单状态和验证</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">姓名</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            />
            {validation.errors.name && (
              <p className="text-sm text-red-500">{validation.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">邮箱</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md border p-2"
            />
            {validation.errors.email && (
              <p className="text-sm text-red-500">{validation.errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">留言</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border p-2"
            />
            {validation.errors.message && (
              <p className="text-sm text-red-500">
                {validation.errors.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={!validation.isValid}>
            提交表单
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// 本地存储组件
function StorageDemo() {
  const [theme] = useAtom(themeAtom);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>持久化存储</CardTitle>
        <CardDescription>
          使用atomWithStorage在本地存储中保存状态，与系统主题同步
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            当前主题: <span className="font-medium">{theme}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            使用系统主题切换器，设置将被保留
          </p>

          <div className="flex gap-2">
            <ModeToggle />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 数组拆分组件
function SplitAtomDemo() {
  const [todoAtoms] = useAtom(todoAtomsAtom);
  const [todos, setTodos] = useAtom(todosAtom);

  // 为每个todoAtom单独调用useAtom，确保在组件顶层调用Hooks
  const todoValues = todoAtoms.map((todoAtom) => useAtom(todoAtom)[0]);
  // 为每个todoAtom创建对应的setter函数
  const todoSetters = todoAtoms.map((todoAtom) => useAtom(todoAtom)[1]);

  const addTodo = () => {
    const text = prompt("输入新的待办事项");
    if (text) {
      setTodos((prev) => [
        ...prev,
        {
          id: Math.max(0, ...prev.map((t) => t.id)) + 1,
          text,
          completed: false,
        },
      ]);
    }
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>数组拆分</CardTitle>
        <CardDescription>使用splitAtom将数组拆分为独立的原子</CardDescription>
      </CardHeader>
      <CardContent>
        {JSON.stringify(todoValues)}
        {JSON.stringify(todoSetters)}
        <div className="space-y-4">
          <Button onClick={addTodo}>添加待办事项</Button>

          <div className="space-y-2">
            {todoValues.map((todo, index) => {
              return (
                <div
                  key={todo.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-4 w-4"
                    />
                    <span
                      className={
                        todo.completed
                          ? "text-muted-foreground line-through"
                          : ""
                      }
                    >
                      {todo.text}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    删除
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 主页面组件
export default function JotaiDemo() {
  return (
    <div className="container space-y-8 py-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">Jotai 状态管理演示</h1>
        <p className="text-muted-foreground">展示Jotai的多种特性和用法</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CounterDemo />
        <AsyncDemo />
        <AtomFamilyDemo />
        <FormDemo />
        <StorageDemo />
        <SplitAtomDemo />
      </div>
    </div>
  );
}
