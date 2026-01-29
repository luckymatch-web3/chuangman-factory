"use client";

import {
  ImageIcon, Video, Scissors, FolderOpen, TrendingUp, Clock, Sparkles,
  ArrowRight, Bot, Play,
} from "lucide-react";
import Link from "next/link";

const quickTools = [
  { label: "图片生成", icon: ImageIcon, href: "/create/image", desc: "高品质动漫图片" },
  { label: "视频生成", icon: Video, href: "/create/video", desc: "动漫视频生成" },
  { label: "图像编辑", icon: Scissors, href: "/create/edit", desc: "智能编辑修图" },
  { label: "素材管理", icon: FolderOpen, href: "/assets", desc: "管理所有素材" },
];

const stats = [
  { label: "今日生成", value: "0", icon: Sparkles, sub: "+0%" },
  { label: "总素材数", value: "0", icon: FolderOpen, sub: "0 项" },
  { label: "剩余积分", value: "100", icon: TrendingUp, sub: "体验版" },
  { label: "进行中任务", value: "0", icon: Clock, sub: "空闲" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">工作台</h1>
        <p className="text-gray-400 mt-1">欢迎回到创漫工厂</p>
      </div>

      {/* 创漫Agent CTA */}
      <Link
        href="/pipeline"
        className="block rounded-2xl border border-[#00f5d4]/20 bg-gradient-to-r from-[#00f5d4]/5 to-purple-500/5 p-8 hover:border-[#00f5d4]/40 transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#00f5d4]/20 flex items-center justify-center">
              <Bot className="h-7 w-7 text-[#00f5d4]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">创漫Agent</h2>
              <p className="text-gray-400 mt-1">上传小说或剧本，AI自动生成动漫视频</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#00f5d4] px-5 py-2.5 text-black font-semibold group-hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all">
            <Play className="h-4 w-4" />
            开始创作
          </div>
        </div>
      </Link>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div className="flex items-center justify-between mb-3">
              <s.icon className="h-5 w-5 text-[#00f5d4]" />
              <span className="text-xs text-gray-500">{s.sub}</span>
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Tools */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">单项工具</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickTools.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 hover:border-[#00f5d4]/30 transition-all"
            >
              <t.icon className="h-8 w-8 text-gray-400 group-hover:text-[#00f5d4] transition-colors mb-3" />
              <h3 className="font-semibold text-white text-sm">{t.label}</h3>
              <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
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
