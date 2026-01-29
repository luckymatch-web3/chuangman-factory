"use client";

import { ImageIcon, Video, Workflow, FolderOpen, TrendingUp, Clock, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const quickActions = [
  { label: "图片生成", icon: ImageIcon, href: "/create/image", color: "from-cyan-500 to-blue-500" },
  { label: "视频生成", icon: Video, href: "/create/video", color: "from-orange-500 to-red-500" },
  { label: "自动化流水线", icon: Workflow, href: "/pipeline", color: "from-purple-500 to-pink-500" },
  { label: "素材管理", icon: FolderOpen, href: "/assets", color: "from-green-500 to-emerald-500" },
];

const stats = [
  { label: "今日生成", value: "0", icon: Sparkles, change: "+0%" },
  { label: "总素材数", value: "0", icon: FolderOpen, change: "0 项" },
  { label: "剩余积分", value: "100", icon: TrendingUp, change: "体验版" },
  { label: "进行中任务", value: "0", icon: Clock, change: "空闲" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">工作台</h1>
        <p className="text-gray-400 mt-1">欢迎回到创漫工厂，开始你的创作之旅</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-3">
              <s.icon className="h-5 w-5 text-[#00f5d4]" />
              <span className="text-xs text-gray-500">{s.change}</span>
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">快速开始</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-6 hover:border-[#00f5d4]/30 transition-all"
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${a.color} mb-4`}>
                <a.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-1">{a.label}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-400 group-hover:text-[#00f5d4] transition-colors">
                开始创作 <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent tasks */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">最近任务</h2>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <Clock className="h-12 w-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">暂无生成任务</p>
          <p className="text-sm text-gray-500 mt-1">开始创作后，任务记录将显示在这里</p>
        </div>
      </div>
    </div>
  );
}
