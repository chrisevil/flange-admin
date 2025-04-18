"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

import { createTask } from "../_lib/actions";
import type { CreateTaskSchema } from "../_lib/validations";
import { createTaskSchema } from "../_lib/validations";
import { TaskForm } from "./task-form";

/**
 * CreateTaskSheet组件 - 用于创建新任务的表单弹窗
 * 
 * 功能：
 * - 提供创建新任务的表单界面
 * - 处理表单提交和状态管理
 * - 显示加载状态和操作结果反馈
 * 
 * @returns {JSX.Element} 返回包含创建任务表单的Sheet组件
 */
export function CreateTaskSheet() {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
  });

  /**
   * 处理表单提交
   * 
   * @param {CreateTaskSchema} input - 表单输入数据
   * @returns {Promise<void>} 无返回值
   */
  function onSubmit(input: CreateTaskSchema) {
    startTransition(async () => {
      const { error } = await createTask(input);

      if (error) {
        toast.error(error);
        return;
      }

      form.reset();
      setOpen(false);
      toast.success("Task created");
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus />
          New task
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Create task</SheetTitle>
          <SheetDescription>
            Fill in the details below to create a new task
          </SheetDescription>
        </SheetHeader>
        <TaskForm form={form} onSubmit={onSubmit}>
          <SheetFooter className="gap-2 pt-2 sm:space-x-0">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
            <Button disabled={isPending}>
              {isPending && <Loader className="animate-spin" />}
              Create
            </Button>
          </SheetFooter>
        </TaskForm>
      </SheetContent>
    </Sheet>
  );
}
