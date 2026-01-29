"use client";

import { useState } from "react";
import { User, CreditCard, Bell, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [nickname, setNickname] = useState("User");
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({
    taskComplete: true,
    lowCredits: true,
    newFeature: false,
  });

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ nickname }).eq("id", user.id);
    }
    setSaving(false);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">设置</h1>
        <p className="text-sm text-gray-400 mt-1">管理你的账户和偏好</p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2"><User className="h-5 w-5 text-[#00f5d4]" />个人信息</h2>
        <div>
          <label className="text-sm text-gray-400 block mb-1">昵称</label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full max-w-sm rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-[#00f5d4]/50 focus:outline-none"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[#00f5d4] px-4 py-2 text-sm font-semibold text-black disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          保存修改
        </button>
      </div>

      {/* Credits */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2"><CreditCard className="h-5 w-5 text-[#00f5d4]" />积分管理</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-[#00f5d4]">100</div>
            <div className="text-sm text-gray-400">当前积分余额</div>
          </div>
          <Link href="/credits" className="rounded-lg bg-[#00f5d4] px-6 py-2.5 font-semibold text-black hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all">
            充值积分
          </Link>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
        <h2 className="font-semibold text-white flex items-center gap-2"><Bell className="h-5 w-5 text-[#00f5d4]" />通知设置</h2>
        {[
          { key: "taskComplete" as const, label: "任务完成通知" },
          { key: "lowCredits" as const, label: "积分不足提醒" },
          { key: "newFeature" as const, label: "新功能通知" },
        ].map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-300">{label}</span>
            <button
              onClick={() => toggleNotification(key)}
              className={`relative h-6 w-11 rounded-full transition-colors ${notifications[key] ? "bg-[#00f5d4]" : "bg-white/10"}`}
            >
              <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${notifications[key] ? "translate-x-5.5" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
