"use client";

import { useState } from "react";
import { Sparkles, Loader2, Download, RefreshCw, Upload, ImageIcon, Video } from "lucide-react";

const durations = [
  { label: "5秒", value: 5 },
  { label: "10秒", value: 10 },
];

const motionStyles = [
  "自然运动", "镜头推进", "环绕旋转", "慢动作", "镜头拉远", "固定机位",
];

export default function VideoGenerationPage() {
  const [prompt, setPrompt] = useState("");
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [duration, setDuration] = useState(5);
  const [motion, setMotion] = useState("自然运动");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSourceImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          source_image: sourceImage,
          duration,
          motion_style: motion,
        }),
      });
      const data = await res.json();
      if (data.task_id) {
        pollTask(data.task_id);
      }
    } catch {
      setLoading(false);
    }
  };

  const pollTask = async (taskId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/tasks/${taskId}`);
        const data = await res.json();
        if (data.status === "completed") {
          clearInterval(interval);
          if (data.result_url) setResults((prev) => [data.result_url, ...prev]);
          setLoading(false);
        } else if (data.status === "failed") {
          clearInterval(interval);
          setLoading(false);
        }
      } catch {
        clearInterval(interval);
        setLoading(false);
      }
    }, 3000);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)]">
      {/* Left panel */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-5 overflow-y-auto pr-2">
        <div>
          <h1 className="text-xl font-bold text-white">视频生成</h1>
          <p className="text-sm text-gray-400 mt-1">Sora 2 模型 · 20积分/条</p>
        </div>

        {/* Source image */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">参考图片（可选）</label>
          <div
            className="rounded-lg border-2 border-dashed border-white/10 bg-white/[0.02] p-6 text-center cursor-pointer hover:border-[#00f5d4]/30 transition-colors"
            onClick={() => document.getElementById("video-img-upload")?.click()}
          >
            {sourceImage ? (
              <div className="relative">
                <img src={sourceImage} alt="参考图" className="rounded-lg max-h-40 mx-auto" />
                <button
                  onClick={(e) => { e.stopPropagation(); setSourceImage(null); }}
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">点击上传参考图片</p>
                <p className="text-xs text-gray-500 mt-1">图生视频效果更佳</p>
              </>
            )}
          </div>
          <input id="video-img-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>

        {/* Prompt */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">视频描述</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述视频画面和动态效果，例如：少女在樱花树下缓缓转身，花瓣随风飘落..."
            className="w-full h-28 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#00f5d4]/50 focus:outline-none resize-none"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">视频时长</label>
          <div className="flex gap-2">
            {durations.map((d) => (
              <button
                key={d.value}
                onClick={() => setDuration(d.value)}
                className={`rounded-lg px-4 py-2 text-sm transition-all ${
                  duration === d.value
                    ? "bg-[#00f5d4] text-black font-semibold"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Motion style */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">运动方式</label>
          <div className="flex flex-wrap gap-2">
            {motionStyles.map((m) => (
              <button
                key={m}
                onClick={() => setMotion(m)}
                className={`rounded-full px-3 py-1.5 text-xs transition-all ${
                  motion === m
                    ? "bg-[#00f5d4] text-black font-semibold"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Generate */}
        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="w-full rounded-lg bg-[#00f5d4] py-3 font-semibold text-black hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Video className="h-5 w-5" />
              生成视频 (20 积分)
            </>
          )}
        </button>
      </div>

      {/* Right panel */}
      <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">生成结果</h2>
          {results.length > 0 && (
            <button onClick={() => setResults([])} className="text-sm text-gray-400 hover:text-gray-300 flex items-center gap-1">
              <RefreshCw className="h-3 w-3" /> 清空
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Video className="h-10 w-10 text-gray-600" />
            </div>
            <p className="text-gray-400">还没有生成结果</p>
            <p className="text-sm text-gray-500 mt-1">填写描述后点击生成按钮开始创作</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {results.map((url, i) => (
              <div key={i} className="group relative rounded-lg overflow-hidden border border-white/10 bg-black">
                <video src={url} controls className="w-full" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="rounded-full bg-black/60 p-2 hover:bg-black/80 transition-colors">
                    <Download className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
