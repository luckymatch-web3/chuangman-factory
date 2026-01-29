"use client";

import { useState } from "react";
import { CreditCard, Check, Sparkles, Zap, Crown } from "lucide-react";

const packages = [
  { id: "starter", name: "入门包", credits: 500, price: 19, perCredit: "0.038", popular: false },
  { id: "pro", name: "专业包", credits: 2000, price: 59, perCredit: "0.030", popular: true },
  { id: "team", name: "团队包", credits: 5000, price: 129, perCredit: "0.026", popular: false },
  { id: "enterprise", name: "企业包", credits: 20000, price: 399, perCredit: "0.020", popular: false },
];

const subscriptions = [
  {
    name: "专业版",
    price: 99,
    period: "月",
    credits: 5000,
    features: ["每月5000积分", "优先生成队列", "无水印导出", "创漫Agent无限制", "专属客服"],
  },
  {
    name: "企业版",
    price: 299,
    period: "月",
    credits: 20000,
    features: ["每月20000积分", "团队协作 (5人)", "API接口调用", "私有模型部署", "数据看板", "专属技术支持"],
  },
];

const costTable = [
  ["创漫Agent (全流程)", "按内容长度计算"],
  ["图片生成", "2-3积分/张"],
  ["视频生成", "10-20积分/条"],
  ["图像编辑", "3积分/次"],
];

export default function CreditsPage() {
  const [tab, setTab] = useState<"package" | "subscription">("package");
  const [selectedPkg, setSelectedPkg] = useState("pro");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-[#00f5d4]" />
          积分充值
        </h1>
        <p className="text-sm text-gray-400 mt-1">选择适合你的方案</p>
      </div>

      {/* Current Balance */}
      <div className="rounded-xl border border-[#00f5d4]/20 bg-[#00f5d4]/5 p-6 flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">当前积分余额</div>
          <div className="text-4xl font-bold text-[#00f5d4] mt-1">100</div>
        </div>
        <Sparkles className="h-10 w-10 text-[#00f5d4]/30" />
      </div>

      {/* Tab */}
      <div className="flex gap-2 p-1 rounded-lg bg-white/5">
        <button
          onClick={() => setTab("package")}
          className={`flex-1 rounded-md py-2.5 text-sm font-medium transition-all ${tab === "package" ? "bg-[#00f5d4] text-black" : "text-gray-400 hover:text-gray-300"}`}
        >
          <Zap className="inline h-4 w-4 mr-1 -mt-0.5" />积分包
        </button>
        <button
          onClick={() => setTab("subscription")}
          className={`flex-1 rounded-md py-2.5 text-sm font-medium transition-all ${tab === "subscription" ? "bg-[#00f5d4] text-black" : "text-gray-400 hover:text-gray-300"}`}
        >
          <Crown className="inline h-4 w-4 mr-1 -mt-0.5" />订阅方案
        </button>
      </div>

      {tab === "package" ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPkg(pkg.id)}
                className={`relative rounded-xl border p-5 text-left transition-all ${
                  selectedPkg === pkg.id
                    ? "border-[#00f5d4] bg-[#00f5d4]/5"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2.5 right-3 bg-[#00f5d4] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">推荐</span>
                )}
                <div className="text-lg font-bold text-white">{pkg.name}</div>
                <div className="text-3xl font-extrabold text-white mt-2">¥{pkg.price}</div>
                <div className="text-sm text-[#00f5d4] mt-1">{pkg.credits} 积分</div>
                <div className="text-xs text-gray-500 mt-2">约 ¥{pkg.perCredit}/积分</div>
              </button>
            ))}
          </div>
          <button className="w-full rounded-xl bg-[#00f5d4] py-3.5 font-semibold text-black hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all text-base">
            立即购买
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {subscriptions.map((sub) => (
            <div key={sub.name} className="rounded-xl border border-white/10 bg-white/[0.02] p-6 flex flex-col">
              <h3 className="text-lg font-bold text-white">{sub.name}</h3>
              <div className="mt-3">
                <span className="text-3xl font-extrabold text-white">¥{sub.price}</span>
                <span className="text-gray-400 text-sm">/{sub.period}</span>
              </div>
              <div className="text-sm text-[#00f5d4] mt-1">每月 {sub.credits} 积分</div>
              <ul className="mt-5 space-y-2.5 flex-grow">
                {sub.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="h-4 w-4 text-[#00f5d4] flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full rounded-lg border border-[#00f5d4] text-[#00f5d4] py-2.5 font-semibold text-sm hover:bg-[#00f5d4] hover:text-black transition-all">
                订阅
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Cost Table */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
        <h3 className="font-semibold text-white mb-4">积分消耗参考</h3>
        <div className="space-y-2">
          {costTable.map(([k, v]) => (
            <div key={k} className="flex justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-sm text-gray-400">{k}</span>
              <span className="text-sm text-[#00f5d4] font-medium">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
