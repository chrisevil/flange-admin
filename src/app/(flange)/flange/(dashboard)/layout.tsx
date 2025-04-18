"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LayoutDashboard, BarChart2, Menu, X, Settings, User, LogOut, Settings2, ChevronLeft, ChevronRight } from "lucide-react";

const sidebarNavItems = [
  {
    title: "仪表盘",
    href: "/flange/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "基础数据（暂未完成）",
    href: "/flange/base-data",
    icon: <BarChart2 className="h-5 w-5" />,
  },
  {
    title: "系统设置（暂未完成）",
    href: "/flange/setting",
    icon: <Settings2 className="h-5 w-5" />,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">考勤分析月报</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 移动端侧边栏遮罩 */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* 侧边栏 */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 border-r bg-card shadow-lg transition-all duration-300 md:static md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            sidebarCollapsed ? "w-16 p-2" : "w-64 p-6"
          )}
        >
          <div className={cn("flex items-center justify-between", sidebarCollapsed ? "mb-4" : "")}>
            {!sidebarCollapsed && <h2 className="text-lg font-semibold md:block">导航</h2>}
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                title={sidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
              >
                {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <nav className={cn("flex flex-col gap-2", sidebarCollapsed ? "mt-0" : "mt-8")}>
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  sidebarCollapsed ? "justify-center" : "gap-3",
                  pathname.includes(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                title={sidebarCollapsed ? item.title : ""}
              >
                {item.icon}
                {!sidebarCollapsed && item.title}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-4">
            <Button 
              variant="outline" 
              className={cn(
                "w-full", 
                sidebarCollapsed ? "justify-center" : "justify-start gap-2"
              )}
              title={sidebarCollapsed ? "退出登录" : ""}
            >
              <LogOut className="h-4 w-4" />
              {!sidebarCollapsed && "退出登录"}
            </Button>
          </div>
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 overflow-y-auto p-0">
          {children}
        </main>
      </div>
    </div>
  );
}