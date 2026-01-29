"use client";

import { useState } from "react";
import { Upload, Sparkles, Loader2, Download, Eraser, Paintbrush, Maximize, Wand2 } from "lucide-react";

const editTools = [
  { id: "inpaint", label: "智能擦除", icon: Eraser, desc: "选区擦除并AI重绘" },
  { id: "outpaint", label: "画面扩展", icon: Maximize, desc: "向外扩展画面内容" },
  { id: "style", label: "风格转换", icon: Paintbrush, desc: "转换为其他画风" },
  { id: "enhance", label: "高清放大", icon: Wand2, desc: "AI超分辨率放大" },
];

export default function ImageEditPage() {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [tool, setTool] = useState("inpaint");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSourceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!sourceImage) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source_image: sourceImage, tool, prompt }),
      });
      const data = await res.json();
      if (data.task_id) {
        const interval = setInterval(async () => {
          const r = await fetch(`/api/tasks/${data.task_id}`);
          const d = await r.json();
          if (d.status === "completed") {
            clearInterval(interval);
            setResult(d.result_url);
            setLoading(false);
          } else if (d.status === "failed") {
            clearInterval(interval);
            setLoading(false);
          }
        }, 2000);
      }
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)]">
      <div className="w-80 flex-shrink-0 flex flex-col gap-5 overflow-y-auto pr-2">
        <div>
          <h1 className="text-xl font-bold text-white">图像编辑</h1>
          <p className="text-sm text-gray-400 mt-1">AI驱动的图像编辑工具 · 3积分/次</p>
        </div>

        {/* Upload */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">上传图片</label>
          <div
            className="rounded-lg border-2 border-dashed border-white/10 bg-white/[0.02] p-6 text-center cursor-pointer hover:border-[#00f5d4]/30 transition-colors"
            onClick={() => document.getElementById("edit-img-upload")?.click()}
          >
            {sourceImage ? (
              <img src={sourceImage} alt="源图" className="rounded-lg max-h-48 mx-auto" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">点击上传需要编辑的图片</p>
              </>
            )}
          </div>
          <input id="edit-img-upload" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>

        {/* Tools */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">编辑工具</label>
          <div className="grid grid-cols-2 gap-2">
            {editTools.map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  tool === t.id ? "border-[#00f5d4] bg-[#00f5d4]/10" : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <t.icon className={`h-5 w-5 mb-1 ${tool === t.id ? "text-[#00f5d4]" : "text-gray-400"}`} />
                <div className="font-medium text-white text-xs">{t.label}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">编辑指令</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想要的编辑效果..."
            className="w-full h-20 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#00f5d4]/50 focus:outline-none resize-none"
          />
        </div>

        <button
          onClick={handleEdit}
          disabled={loading || !sourceImage}
          className="w-full rounded-lg bg-[#00f5d4] py-3 font-semibold text-black hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="h-5 w-5 animate-spin" />处理中...</> : <><Sparkles className="h-5 w-5" />开始编辑 (3 积分)</>}
        </button>
      </div>

      {/* Right panel */}
      <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] p-6 overflow-y-auto">
        <h2 className="font-semibold text-white mb-4">编辑结果</h2>
        {result ? (
          <div className="relative rounded-lg overflow-hidden border border-white/10">
            <img src={result} alt="编辑结果" className="w-full" />
            <button className="absolute top-2 right-2 rounded-full bg-black/60 p-2 hover:bg-black/80">
              <Download className="h-4 w-4 text-white" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Paintbrush className="h-10 w-10 text-gray-600" />
            </div>
            <p className="text-gray-400">上传图片并选择编辑工具开始</p>
          </div>
        )}
      </div>
    </div>
  );
}
