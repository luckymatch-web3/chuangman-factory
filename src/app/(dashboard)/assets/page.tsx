"use client";

import { useState } from "react";
import { ImageIcon, Video, Music, Filter, Grid3x3, List, Download, Trash2, Search, FolderOpen } from "lucide-react";

type AssetType = "all" | "image" | "video" | "audio";

const mockAssets: Array<{ id: string; name: string; type: string; url: string; date: string }> = [];

export default function AssetsPage() {
  const [filter, setFilter] = useState<AssetType>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  const typeFilters: Array<{ key: AssetType; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { key: "all", label: "全部", icon: FolderOpen },
    { key: "image", label: "图片", icon: ImageIcon },
    { key: "video", label: "视频", icon: Video },
    { key: "audio", label: "音频", icon: Music },
  ];

  const filteredAssets = mockAssets.filter((a) => {
    if (filter !== "all" && a.type !== filter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">素材管理</h1>
          <p className="text-sm text-gray-400 mt-1">管理所有生成的图片、视频和音频素材</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {typeFilters.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-all ${
                filter === t.key ? "bg-[#00f5d4] text-black font-semibold" : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索素材..."
              className="rounded-lg border border-white/10 bg-white/[0.03] pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#00f5d4]/50 focus:outline-none w-60"
            />
          </div>
          <div className="flex gap-1 rounded-lg border border-white/10 p-0.5">
            <button onClick={() => setView("grid")} className={`rounded p-1.5 ${view === "grid" ? "bg-white/10 text-white" : "text-gray-500"}`}>
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button onClick={() => setView("list")} className={`rounded p-1.5 ${view === "list" ? "bg-white/10 text-white" : "text-gray-500"}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {filteredAssets.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-16 text-center">
          <FolderOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">暂无素材</p>
          <p className="text-sm text-gray-500 mt-2">生成的图片和视频将自动保存到这里</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((a) => (
            <div key={a.id} className="group rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="aspect-square bg-black relative">
                {a.type === "video" ? (
                  <video src={a.url} className="w-full h-full object-cover" />
                ) : (
                  <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button className="rounded-full bg-white/20 p-2"><Download className="h-4 w-4 text-white" /></button>
                  <button className="rounded-full bg-white/20 p-2"><Trash2 className="h-4 w-4 text-white" /></button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-white truncate">{a.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.date}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAssets.map((a) => (
            <div key={a.id} className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <div className="h-12 w-12 rounded bg-black overflow-hidden flex-shrink-0">
                <img src={a.url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{a.name}</p>
                <p className="text-xs text-gray-500">{a.type} · {a.date}</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded p-2 hover:bg-white/5"><Download className="h-4 w-4 text-gray-400" /></button>
                <button className="rounded p-2 hover:bg-white/5"><Trash2 className="h-4 w-4 text-gray-400" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
