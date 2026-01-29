"use client";

import {
  Sparkles,
  BookText,
  Wand2,
  Download,
  Check,
  Image as ImageIcon,
  Video,
  Scissors,
  BrainCircuit,
  FileText,
  SearchCode,
  ArrowRight,
  Clapperboard,
  Menu,
  X,
  Zap,
  Workflow,
} from "lucide-react";
import { useState } from "react";

export default function ChuangManLandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-200 font-sans overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#00f5d4]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#7c3aed]/10 rounded-full blur-[120px]" />
      </div>

      <Header />
      <main>
        <HeroSection />
        <CoreWorkflowsSection />
        <ModelsSection />
        <ToolsGridSection />
        <PipelineSection />
        <HowItWorksSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-[#0a0e1a]/70 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-7 w-7 text-[#00f5d4]" />
          <span className="text-xl font-bold tracking-wider text-white">创漫工厂</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a href="#workflows" className="hover:text-[#00f5d4] transition-colors">工作流</a>
          <a href="#models" className="hover:text-[#00f5d4] transition-colors">模型</a>
          <a href="#tools" className="hover:text-[#00f5d4] transition-colors">工具</a>
          <a href="#pipeline" className="hover:text-[#00f5d4] transition-colors">流水线</a>
          <a href="#pricing" className="hover:text-[#00f5d4] transition-colors">定价</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-gray-300 hover:text-[#00f5d4] transition-colors text-sm">登录</button>
          <button className="rounded-full bg-[#00f5d4] px-5 py-2 font-semibold text-black text-sm hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all">免费试用</button>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t border-white/5 bg-[#0a0e1a]/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-4 text-sm">
          <a href="#workflows" className="hover:text-[#00f5d4]" onClick={() => setOpen(false)}>工作流</a>
          <a href="#models" className="hover:text-[#00f5d4]" onClick={() => setOpen(false)}>模型</a>
          <a href="#tools" className="hover:text-[#00f5d4]" onClick={() => setOpen(false)}>工具</a>
          <a href="#pipeline" className="hover:text-[#00f5d4]" onClick={() => setOpen(false)}>流水线</a>
          <a href="#pricing" className="hover:text-[#00f5d4]" onClick={() => setOpen(false)}>定价</a>
        </nav>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-24 md:py-36 text-center">
      <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-[#00f5d4]/30 bg-[#00f5d4]/5 text-[#00f5d4] text-sm font-medium">
        NanoBanner · Midjourney · Sora 2 多模型驱动
      </div>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
        创漫工厂
      </h1>
      <h2 className="mt-2 text-2xl md:text-4xl font-bold text-white/80">
        AI动漫创作流水线
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
        从文字到成片，全自动化AI动漫生产。NanoBanner极速出图、Midjourney精品画质、Sora 2动态视频，三大模型联合驱动，一键完成动漫创作全流程。
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button className="w-full sm:w-auto rounded-full bg-[#00f5d4] px-8 py-3.5 font-semibold text-black hover:shadow-[0_0_30px_rgba(0,245,212,0.5)] transition-all hover:scale-105">
          免费试用
        </button>
        <button className="w-full sm:w-auto rounded-full border border-white/20 px-8 py-3.5 font-semibold text-white hover:bg-white/5 hover:border-[#00f5d4]/40 transition-all">
          了解更多
        </button>
      </div>
    </section>
  );
}

function CoreWorkflowsSection() {
  const workflows = [
    {
      title: "快速成片",
      tag: "推荐",
      tagColor: "bg-[#00f5d4]/10 text-[#00f5d4]",
      desc: "上传剧本或小说，AI自动拆解分镜、生成画面，分钟级产出高质量动漫短片。支持NanoBanner极速出图。",
      gradient: "from-[#00f5d4]/60 to-[#00f5d4]/10",
    },
    {
      title: "精品动漫",
      tag: "Midjourney",
      tagColor: "bg-purple-500/10 text-purple-400",
      desc: "导演视角的精细创作模式。灵感→小说→剧本三种输入，Midjourney高品质画面生成，打造专业级AI动漫。",
      gradient: "from-purple-500/40 to-purple-500/5",
    },
    {
      title: "自动化流水线",
      tag: "全自动",
      tagColor: "bg-orange-500/10 text-orange-400",
      desc: "文本输入→场景拆分→批量图片生成→批量视频生成→对口型→视频合成，全流程自动化，无需人工干预。",
      gradient: "from-orange-500/40 to-orange-500/5",
    },
  ];

  return (
    <section id="workflows" className="container mx-auto px-4 py-20">
      <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">核心工作流</h2>
      <p className="mb-12 text-center text-gray-400 max-w-xl mx-auto">三大创作模式，从快速出片到全自动流水线</p>
      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {workflows.map((w) => (
          <div key={w.title} className="group relative rounded-2xl p-px bg-gradient-to-b from-white/20 to-transparent hover:from-[#00f5d4]/60 transition-all duration-500">
            <div className="h-full rounded-[15px] bg-[#0d1225] p-8 flex flex-col">
              <div className={`absolute top-0 left-0 right-0 h-32 rounded-t-[15px] bg-gradient-to-b ${w.gradient} opacity-30`} />
              <div className="relative flex items-center gap-3 mb-4">
                <h3 className="text-xl font-bold text-white">{w.title}</h3>
                {w.tag && <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${w.tagColor}`}>{w.tag}</span>}
              </div>
              <p className="relative text-gray-400 text-sm leading-relaxed flex-grow">{w.desc}</p>
              <div className="relative mt-6 flex items-center gap-2 text-[#00f5d4] text-sm font-medium group-hover:gap-3 transition-all">
                去创作 <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ModelsSection() {
  const models = [
    {
      name: "NanoBanner",
      type: "图片生成",
      desc: "极速出图，2秒生成高清动漫图片，适合批量生产和快速迭代",
      features: ["2秒极速出图", "2K分辨率", "多风格支持", "批量生成"],
      color: "from-cyan-500 to-blue-500",
      cost: "2积分/张",
    },
    {
      name: "Midjourney",
      type: "图片生成",
      desc: "顶级画质，细腻精致的艺术级动漫画面，适合精品创作",
      features: ["艺术级画质", "4K分辨率", "风格可控", "精细调参"],
      color: "from-purple-500 to-pink-500",
      cost: "5积分/张",
    },
    {
      name: "Sora 2",
      type: "视频生成",
      desc: "业界领先的AI视频生成模型，将静态画面转化为流畅动态视频",
      features: ["720P高清", "5-10秒视频", "动态自然", "画面连贯"],
      color: "from-orange-500 to-red-500",
      cost: "20积分/条",
    },
  ];

  return (
    <section id="models" className="container mx-auto px-4 py-20">
      <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">三大AI模型</h2>
      <p className="mb-12 text-center text-gray-400 max-w-xl mx-auto">图片+视频双引擎，覆盖速度与品质全需求</p>
      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {models.map((m) => (
          <div key={m.name} className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 hover:border-[#00f5d4]/30 transition-colors">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${m.color} text-white mb-4`}>{m.type}</div>
            <h3 className="text-2xl font-bold text-white mb-2">{m.name}</h3>
            <p className="text-gray-400 text-sm mb-6">{m.desc}</p>
            <ul className="space-y-2 mb-6">
              {m.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <Check className="h-4 w-4 text-[#00f5d4] flex-shrink-0" />{f}
                </li>
              ))}
            </ul>
            <div className="text-[#00f5d4] font-semibold text-sm">{m.cost}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ToolsGridSection() {
  const tools = [
    { name: "图片生成", icon: ImageIcon, desc: "NanoBanner/MDJ双模型" },
    { name: "视频生成", icon: Video, desc: "Sora 2，720P动态视频" },
    { name: "图像编辑", icon: Scissors, desc: "画布工具+AI编辑" },
    { name: "LoRA训练", icon: BrainCircuit, desc: "自定义风格模型" },
    { name: "小说拆解", icon: BookText, desc: "AI自动结构化拆解" },
    { name: "剧本创作", icon: FileText, desc: "AI辅助剧本撰写" },
    { name: "视频解析", icon: SearchCode, desc: "视频内容智能分析" },
    { name: "对口型", icon: Clapperboard, desc: "角色口型与语音同步" },
  ];

  return (
    <section id="tools" className="container mx-auto px-4 py-20">
      <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">强大的AI工具箱</h2>
      <p className="mb-12 text-center text-gray-400 max-w-xl mx-auto">8大专业AI工具，覆盖图片、视频、文本全链路创作需求</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {tools.map((t) => (
          <div key={t.name} className="group flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm hover:border-[#00f5d4]/40 hover:bg-[#00f5d4]/5 transition-all duration-300 cursor-pointer">
            <t.icon className="h-8 w-8 text-[#00f5d4] group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-white text-sm">{t.name}</h3>
            <p className="text-xs text-gray-500 text-center">{t.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PipelineSection() {
  const steps = [
    { label: "文本输入", icon: FileText },
    { label: "场景拆分", icon: BookText },
    { label: "批量出图", icon: ImageIcon },
    { label: "批量视频", icon: Video },
    { label: "对口型", icon: Clapperboard },
    { label: "视频合成", icon: Download },
  ];

  return (
    <section id="pipeline" className="container mx-auto px-4 py-20">
      <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">
        <Workflow className="inline h-8 w-8 mr-2 text-[#00f5d4]" />
        自动化流水线
      </h2>
      <p className="mb-12 text-center text-gray-400 max-w-xl mx-auto">文字到成片，全自动六步流水线，无需人工干预</p>
      <div className="relative max-w-5xl mx-auto">
        <div className="hidden md:block absolute top-10 left-[8%] right-[8%] h-px bg-gradient-to-r from-[#00f5d4]/50 via-[#00f5d4]/20 to-[#00f5d4]/50" />
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
          {steps.map((s, i) => (
            <div key={s.label} className="relative text-center">
              <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#00f5d4]/30 bg-[#0a0e1a] relative z-10">
                <s.icon className="h-8 w-8 text-[#00f5d4]" />
              </div>
              <span className="inline-block mb-1 text-[#00f5d4] text-xs font-bold">STEP {i + 1}</span>
              <h3 className="text-sm font-bold text-white">{s.label}</h3>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-12 text-center">
        <button className="rounded-full bg-[#00f5d4] px-8 py-3 font-semibold text-black hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all inline-flex items-center gap-2">
          <Zap className="h-5 w-5" />开始自动化创作
        </button>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    { icon: BookText, title: "上传创意", desc: "输入文本、上传小说/剧本" },
    { icon: Wand2, title: "选择模型", desc: "NanoBanner极速 / MDJ精品" },
    { icon: Clapperboard, title: "AI生成", desc: "自动分镜、出图、生成视频" },
    { icon: Download, title: "导出成片", desc: "编辑微调，导出完整动漫" },
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">创作只需四步</h2>
      <p className="mb-16 text-center text-gray-400 max-w-xl mx-auto">从文字到动漫，极简创作流程</p>
      <div className="relative grid gap-8 md:grid-cols-4 max-w-5xl mx-auto">
        <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#00f5d4]/50 via-[#00f5d4]/20 to-[#00f5d4]/50" />
        {steps.map((s, i) => (
          <div key={s.title} className="relative text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#00f5d4]/30 bg-[#0a0e1a] relative z-10">
              <s.icon className="h-8 w-8 text-[#00f5d4]" />
            </div>
            <span className="inline-block mb-2 text-[#00f5d4] text-xs font-bold">STEP {i + 1}</span>
            <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
            <p className="text-sm text-gray-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    {
      name: "体验版", price: "免费", unit: "", desc: "适合个人体验用户",
      features: ["100积分赠送", "NanoBanner图片生成", "基础工具", "社区支持"],
      cta: "立即体验", highlight: false,
    },
    {
      name: "专业版", price: "¥99", unit: "/月", desc: "适合独立创作者",
      features: ["5000积分/月", "NanoBanner + MDJ双模型", "Sora 2视频生成", "LoRA训练", "自动化流水线", "优先渲染队列"],
      cta: "立即订阅", highlight: true,
    },
    {
      name: "企业版", price: "定制", unit: "", desc: "适合专业团队与工作室",
      features: ["无限积分", "全部模型解锁", "团队协作管理", "私有模型部署", "API接入", "专属技术支持"],
      cta: "联系我们", highlight: false,
    },
  ];

  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <h2 className="mb-4 text-center text-3xl font-bold text-white md:text-4xl">灵活的积分定价</h2>
      <p className="mb-12 text-center text-gray-400 max-w-xl mx-auto">按需购买积分，用多少付多少</p>
      <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
        {plans.map((p) => (
          <div key={p.name} className={`relative rounded-2xl p-px ${p.highlight ? "bg-gradient-to-b from-[#00f5d4] to-[#00f5d4]/20" : "bg-gradient-to-b from-white/20 to-transparent"}`}>
            {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00f5d4] text-black text-xs font-bold px-3 py-1 rounded-full">最受欢迎</span>}
            <div className="h-full rounded-[15px] bg-[#0d1225] p-8 flex flex-col">
              <h3 className="text-lg font-bold text-white">{p.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{p.desc}</p>
              <div className="mt-6 mb-6">
                <span className="text-4xl font-extrabold text-white">{p.price}</span>
                {p.unit && <span className="text-gray-400 text-sm">{p.unit}</span>}
              </div>
              <ul className="space-y-3 flex-grow">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="h-4 w-4 text-[#00f5d4] flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button className={`mt-8 w-full rounded-full py-3 font-semibold text-sm transition-all ${p.highlight ? "bg-[#00f5d4] text-black hover:shadow-[0_0_20px_rgba(0,245,212,0.4)]" : "border border-white/20 text-white hover:bg-white/5"}`}>
                {p.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#080b16]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-[#00f5d4]" />
              <span className="text-lg font-bold text-white">创漫工厂</span>
            </div>
            <p className="text-sm text-gray-500">AI驱动的动漫创作流水线</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">产品</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#00f5d4] transition-colors">快速成片</a></li>
              <li><a href="#" className="hover:text-[#00f5d4] transition-colors">精品动漫</a></li>
              <li><a href="#" className="hover:text-[#00f5d4] transition-colors">自动化流水线</a></li>
              <li><a href="#" className="hover:text-[#00f5d4] transition-colors">LoRA训练</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">AI模型</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#00f5d4] transition-colors">NanoBanner</a></li>
              <li><a href="#" className="hover:text-[#00f5d4] transition-colors">Midjourney</a></li>
              <li><a href="#" className="hover:text-[#00f5d4] transition-colors">Sora 2</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">支持</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#00f5d4] transition-colors">帮助中心</a></li>
              <li><a href="#" className="hover:text-[#00f5d4] transition-colors">商务合作</a></li>
              <li><a href="#" className="hover:text-[#00f5d4] transition-colors">隐私政策</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
          © 2026 创漫工厂. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
