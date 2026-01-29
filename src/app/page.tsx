"use client";

import {
  Sparkles,
  Wand2,
  Download,
  Check,
  ArrowRight,
  Menu,
  X,
  Play,
  Star,
  Zap,
  Shield,
  Clock,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-gray-200 font-sans overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#00f5d4]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#7c3aed]/8 rounded-full blur-[120px]" />
      </div>

      <Header />
      <main>
        <HeroSection />
        <ShowcaseSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
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
          <a href="#showcase" className="hover:text-[#00f5d4] transition-colors">作品展示</a>
          <a href="#features" className="hover:text-[#00f5d4] transition-colors">产品特色</a>
          <a href="#pricing" className="hover:text-[#00f5d4] transition-colors">定价</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden sm:block text-gray-300 hover:text-[#00f5d4] transition-colors text-sm">
            登录
          </Link>
          <Link href="/register" className="rounded-full bg-[#00f5d4] px-5 py-2 font-semibold text-black text-sm hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all">
            免费注册
          </Link>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t border-white/5 bg-[#0a0e1a]/95 backdrop-blur-xl px-4 py-4 flex flex-col gap-4 text-sm">
          <a href="#showcase" className="hover:text-[#00f5d4]" onClick={() => setOpen(false)}>作品展示</a>
          <a href="#features" className="hover:text-[#00f5d4]" onClick={() => setOpen(false)}>产品特色</a>
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
        <Zap className="inline h-4 w-4 mr-1.5 -mt-0.5" />
        全新上线 · 限时免费体验
      </div>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
        一篇小说，一部动漫
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-gray-400 leading-relaxed">
        上传你的小说或剧本，创漫工厂自动将文字变成完整的动漫视频。<br className="hidden md:block" />
        不需要任何设计经验，只需要一个好故事。
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/register" className="w-full sm:w-auto rounded-full bg-[#00f5d4] px-8 py-3.5 font-semibold text-black hover:shadow-[0_0_30px_rgba(0,245,212,0.5)] transition-all hover:scale-105 text-center flex items-center justify-center gap-2">
          <Play className="h-5 w-5" />
          免费开始创作
        </Link>
        <a href="#showcase" className="w-full sm:w-auto rounded-full border border-white/20 px-8 py-3.5 font-semibold text-white hover:bg-white/5 hover:border-[#00f5d4]/40 transition-all text-center">
          查看作品
        </a>
      </div>
      <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
        <span className="flex items-center gap-1"><Check className="h-4 w-4 text-[#00f5d4]" />注册即送100积分</span>
        <span className="flex items-center gap-1"><Check className="h-4 w-4 text-[#00f5d4]" />无需信用卡</span>
        <span className="flex items-center gap-1"><Check className="h-4 w-4 text-[#00f5d4]" />随时取消</span>
      </div>
    </section>
  );
}

function ShowcaseSection() {
  const works = [
    { title: "《仙剑奇缘》", genre: "仙侠", desc: "小说改编 · 12集动漫短片" },
    { title: "《星际迷途》", genre: "科幻", desc: "原创剧本 · 6集连载" },
    { title: "《花间录》", genre: "古风", desc: "小说改编 · 8集动漫" },
    { title: "《末日觉醒》", genre: "热血", desc: "小说改编 · 10集短剧" },
  ];

  return (
    <section id="showcase" className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white">用户作品展示</h2>
        <p className="mt-4 text-gray-400">他们用创漫工厂将文字变成了动漫</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {works.map((w) => (
          <div key={w.title} className="group rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-[#00f5d4]/30 transition-all cursor-pointer">
            <div className="aspect-[3/4] bg-gradient-to-br from-[#0d1225] to-[#1a1040] flex items-center justify-center relative">
              <Play className="h-12 w-12 text-white/20 group-hover:text-[#00f5d4]/60 transition-colors" />
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-xs bg-[#00f5d4]/20 text-[#00f5d4] font-medium">{w.genre}</div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-white">{w.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{w.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Wand2,
      title: "一键创作",
      desc: "上传小说或剧本，AI自动完成从文字到动漫视频的全部流程，无需任何专业技能",
    },
    {
      icon: Zap,
      title: "极速生成",
      desc: "强大的AI引擎并行处理，一篇万字小说，几分钟即可生成完整动漫短片",
    },
    {
      icon: Star,
      title: "电影级画质",
      desc: "顶级AI渲染技术，输出画面精美、角色一致、动作流畅的高品质动漫作品",
    },
    {
      icon: Shield,
      title: "完整版权",
      desc: "你的故事，你的作品。生成内容完全归你所有，可自由发布和商业使用",
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white">为创作者打造</h2>
        <p className="mt-4 text-gray-400">让每个有故事的人都能成为动漫创作者</p>
      </div>
      <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
        {features.map((f) => (
          <div key={f.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 hover:border-[#00f5d4]/30 transition-colors">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#00f5d4]/10">
              <f.icon className="h-6 w-6 text-[#00f5d4]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white">三步开始创作</h2>
        <p className="mt-4 text-gray-400">简单到不可思议</p>
      </div>
      <div className="relative grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-[#00f5d4]/50 via-[#00f5d4]/20 to-[#00f5d4]/50" />
        {[
          { num: "1", title: "上传故事", desc: "上传小说、粘贴剧本，或直接在线创作你的故事" },
          { num: "2", title: "AI创作", desc: "创漫Agent自动将文字转化为动漫视频" },
          { num: "3", title: "下载发布", desc: "导出高清视频，发布到任何平台" },
        ].map((s) => (
          <div key={s.num} className="relative text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#00f5d4]/30 bg-[#0a0e1a] relative z-10">
              <span className="text-3xl font-extrabold text-[#00f5d4]">{s.num}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
            <p className="text-sm text-gray-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { name: "李明", role: "网络小说作家", text: "终于能看到自己小说里的角色动起来了！画面质量远超预期。" },
    { name: "张薇", role: "短视频创作者", text: "以前做一条动漫短视频要一周，现在几分钟就搞定了，效率太高了。" },
    { name: "王浩", role: "漫画工作室", text: "团队用它来快速出分镜和概念视频，客户汇报效率翻了好几倍。" },
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white">创作者们怎么说</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {testimonials.map((t) => (
          <div key={t.name} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-[#00f5d4] text-[#00f5d4]" />)}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
            <div>
              <div className="font-semibold text-white text-sm">{t.name}</div>
              <div className="text-xs text-gray-500">{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingSection() {
  const plans = [
    {
      name: "体验版", price: "免费", unit: "", desc: "适合个人体验",
      features: ["100积分赠送", "所有创作功能", "创漫Agent", "高清导出"],
      cta: "免费注册", ctaHref: "/register", highlight: false,
    },
    {
      name: "专业版", price: "¥99", unit: "/月", desc: "适合独立创作者",
      features: ["5000积分/月", "优先生成队列", "批量创作", "无水印导出", "项目管理", "专属客服"],
      cta: "立即订阅", ctaHref: "/register", highlight: true,
    },
    {
      name: "企业版", price: "定制", unit: "", desc: "适合团队与工作室",
      features: ["无限积分", "团队协作", "API接入", "私有部署", "数据看板", "专属技术支持"],
      cta: "联系我们", ctaHref: "#", highlight: false,
    },
  ];

  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white">简单透明的定价</h2>
        <p className="mt-4 text-gray-400">按需使用，用多少付多少</p>
      </div>
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
              <Link href={p.ctaHref} className={`mt-8 w-full rounded-full py-3 font-semibold text-sm transition-all text-center block ${p.highlight ? "bg-[#00f5d4] text-black hover:shadow-[0_0_20px_rgba(0,245,212,0.4)]" : "border border-white/20 text-white hover:bg-white/5"}`}>
                {p.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="rounded-3xl bg-gradient-to-r from-[#00f5d4]/10 to-[#7c3aed]/10 border border-[#00f5d4]/20 p-12 md:p-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">准备好将你的故事变成动漫了吗？</h2>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto">注册即送100积分，足够体验完整的创漫Agent创作流程</p>
        <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-[#00f5d4] px-8 py-3.5 font-semibold text-black hover:shadow-[0_0_30px_rgba(0,245,212,0.5)] transition-all hover:scale-105">
          免费开始创作 <ArrowRight className="h-5 w-5" />
        </Link>
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
            <p className="text-sm text-gray-500">让每个故事都能变成动漫</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">产品</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/register" className="hover:text-[#00f5d4] transition-colors">创漫Agent</Link></li>
              <li><Link href="/register" className="hover:text-[#00f5d4] transition-colors">图片生成</Link></li>
              <li><Link href="/register" className="hover:text-[#00f5d4] transition-colors">视频生成</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">资源</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#00f5d4] transition-colors">帮助中心</a></li>
              <li><a href="#pricing" className="hover:text-[#00f5d4] transition-colors">定价</a></li>
              <li><a href="#" className="hover:text-[#00f5d4] transition-colors">API文档</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">公司</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-[#00f5d4] transition-colors">关于我们</a></li>
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
