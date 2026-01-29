"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  ImageIcon,
  Video,
  Scissors,
  Clapperboard,
  BrainCircuit,
  Workflow,
  FolderOpen,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "工作台", icon: LayoutDashboard },
  { href: "/create/image", label: "图片生成", icon: ImageIcon },
  { href: "/create/video", label: "视频生成", icon: Video },
  { href: "/create/edit", label: "图像编辑", icon: Scissors },
  { href: "/create/lip-sync", label: "对口型", icon: Clapperboard },
  { href: "/create/lora", label: "LoRA训练", icon: BrainCircuit },
  { href: "/pipeline", label: "自动化流水线", icon: Workflow },
  { href: "/assets", label: "素材管理", icon: FolderOpen },
];

const bottomItems = [
  { href: "/settings", label: "设置", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-[#0a0e1a] text-gray-200">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-16" : "w-60"} flex flex-col border-r border-white/5 bg-[#080b16] transition-all duration-300`}>
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-4 border-b border-white/5">
          <Sparkles className="h-6 w-6 text-[#00f5d4] flex-shrink-0" />
          {!collapsed && <span className="font-bold text-white tracking-wider">创漫工厂</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-[#00f5d4]/10 text-[#00f5d4]"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/5 py-4 px-2 space-y-1">
          {bottomItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-[#00f5d4]/10 text-[#00f5d4]" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-colors"
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            {!collapsed && <span>收起侧栏</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0a0e1a]/80 backdrop-blur-sm px-6">
          <div />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-[#00f5d4]/10 px-4 py-1.5 text-sm">
              <CreditCard className="h-4 w-4 text-[#00f5d4]" />
              <span className="text-[#00f5d4] font-semibold">100</span>
              <span className="text-gray-400">积分</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00f5d4] to-[#7c3aed] flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
