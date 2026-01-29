"use client";

import {
  ImageIcon, Video, Scissors, FolderOpen, TrendingUp, Clock, Sparkles,
  ArrowRight, Bot, BookOpen, Users, Clapperboard, Paintbrush, Film,
} from "lucide-react";
import Link from "next/link";

const agentSteps = [
  { icon: BookOpen, label: "小说输入", desc: "粘贴或上传小说文本", color: "from-blue-500 to-cyan-500" },
  { icon: Clapperboard, label: "剧本改编", desc: "AI自动改编为动漫剧本", color: "from-cyan-500 to-teal-500" },
  { icon: Users, label: "角色设计", desc: "生成角色立绘与设定", color: "from-teal-500 to-green-500" },
  { icon: Paintbrush, label: "分镜生成", desc: "自动生成分镜画面", color: "from-green-500 to-emerald-500" },
  { icon: ImageIcon, label: "场景绘制", desc: "高质量场景图片生成", color: "from-emerald-500 to-[#00f5d4]" },
  { icon: Film, label: "视频合成", desc: "生成最终动漫视频", color: "from-[#00f5d4] to-purple-500" },
];

const quickTools = [
  { label: "图片生成", icon: ImageIcon, href: "/create/image", desc: "即梦/可灵模型" },
  { label: "视频生成", icon: Video, href: "/create/video", desc: "可灵/Sora 2模型" },
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
        <p className="text-gray-400 mt-1">欢迎回到创漫工厂，开始你的AI动漫创作之旅</p>
      </div>

      {/* Agent Workflow CTA */}
      <Link
        href="/pipeline"
        className="block rounded-2xl border border-[#00f5d4]/20 bg-gradient-to-r from-[#00f5d4]/5 to-purple-500/5 p-6 hover:border-[#00f5d4]/40 transition-all group"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#00f5d4]/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-[#00f5d4]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Agent 智能流水线</h2>
              <p className="text-sm text-gray-400">输入小说 → 自动生成完整动漫视频</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#00f5d4] text-sm font-medium group-hover:gap-3 transition-all">
            立即开始 <ArrowRight className="h-4 w-4" />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {agentSteps.map((step, i) => (
            <div key={step.label} className="flex flex-col items-center text-center">
              <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center mb-2`}>
                <step.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-medium text-gray-300">{step.label}</span>
              {i < agentSteps.length - 1 && (
                <ArrowRight className="h-3 w-3 text-gray-600 absolute" style={{ display: "none" }} />
              )}
            </div>
          ))}
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
