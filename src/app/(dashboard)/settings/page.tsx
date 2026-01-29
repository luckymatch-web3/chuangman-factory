"use client";

import { User, CreditCard, Bell, Shield, ExternalLink } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">设置</h1>
        <p className="text-sm text-gray-400 mt-1">管理你的账户和偏好</p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2"><User className="h-5 w-5 text-[#00f5d4]" />个人信息</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">昵称</label>
            <input defaultValue="User" className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-[#00f5d4]/50 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">邮箱</label>
            <input defaultValue="" placeholder="your@email.com" className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#00f5d4]/50 focus:outline-none" />
          </div>
        </div>
        <button className="rounded-lg bg-[#00f5d4] px-4 py-2 text-sm font-semibold text-black">保存修改</button>
      </div>

      {/* Credits */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2"><CreditCard className="h-5 w-5 text-[#00f5d4]" />积分管理</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-[#00f5d4]">100</div>
            <div className="text-sm text-gray-400">当前积分余额</div>
          </div>
          <button className="rounded-lg bg-[#00f5d4] px-6 py-2.5 font-semibold text-black">充值积分</button>
        </div>
        <div className="border-t border-white/5 pt-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">积分消耗标准</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              ["NanoBanner图片", "2积分/张"],
              ["Midjourney图片", "5积分/张"],
              ["Sora 2视频", "20积分/条"],
              ["图像编辑", "3积分/次"],
              ["对口型", "10积分/次"],
              ["LoRA训练", "50积分/次"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-gray-400 py-1">
                <span>{k}</span><span className="text-[#00f5d4]">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2"><Bell className="h-5 w-5 text-[#00f5d4]" />通知设置</h2>
        {["任务完成通知", "积分不足提醒", "新功能通知"].map((label) => (
          <div key={label} className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-300">{label}</span>
            <button className="h-6 w-11 rounded-full bg-[#00f5d4] relative">
              <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
