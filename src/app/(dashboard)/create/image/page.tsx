"use client";

import { useState } from "react";
import { Sparkles, Loader2, Download, RefreshCw, Settings2, ChevronDown } from "lucide-react";

const models = [
  { id: "nanobanner", name: "NanoBanner", desc: "极速出图·2积分", speed: "~2秒" },
  { id: "midjourney", name: "Midjourney", desc: "精品画质·5积分", speed: "~30秒" },
];

const styles = [
  "日漫风", "国漫仙侠", "CG写实", "赛博朋克", "水墨国风",
  "奇幻卡通", "极细线条", "厚涂油画",
];

const ratios = [
  { label: "1:1", w: 1024, h: 1024 },
  { label: "16:9", w: 1280, h: 720 },
  { label: "9:16", w: 720, h: 1280 },
  { label: "4:3", w: 1024, h: 768 },
  { label: "3:4", w: 768, h: 1024 },
];

export default function ImageGenerationPage() {
  const [model, setModel] = useState("nanobanner");
  const [prompt, setPrompt] = useState("");
  const [negPrompt, setNegPrompt] = useState("");
  const [style, setStyle] = useState("日漫风");
  const [ratio, setRatio] = useState("1:1");
  const [batchSize, setBatchSize] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt,
          negative_prompt: negPrompt,
          style,
          ratio,
          batch_size: batchSize,
        }),
      });
      const data = await res.json();
      if (data.task_id) {
        // Poll for result
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
          setResults((prev) => [...(data.result_urls || []), ...prev]);
          setLoading(false);
        } else if (data.status === "failed") {
          clearInterval(interval);
          setLoading(false);
        }
      } catch {
        clearInterval(interval);
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)]">
      {/* Left panel - Config */}
      <div className="w-80 flex-shrink-0 flex flex-col gap-5 overflow-y-auto pr-2">
        <div>
          <h1 className="text-xl font-bold text-white">图片生成</h1>
          <p className="text-sm text-gray-400 mt-1">使用AI模型生成高质量动漫图片</p>
        </div>

        {/* Model selection */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">选择模型</label>
          <div className="grid grid-cols-2 gap-2">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  model === m.id
                    ? "border-[#00f5d4] bg-[#00f5d4]/10"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <div className="font-semibold text-white text-sm">{m.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{m.desc}</div>
                <div className="text-xs text-gray-500 mt-1">{m.speed}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Prompt */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">提示词</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="描述你想要生成的画面，例如：一个穿着白色连衣裙的少女站在樱花树下..."
            className="w-full h-28 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#00f5d4]/50 focus:outline-none resize-none"
          />
        </div>

        {/* Style */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">画面风格</label>
          <div className="flex flex-wrap gap-2">
            {styles.map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`rounded-full px-3 py-1.5 text-xs transition-all ${
                  style === s
                    ? "bg-[#00f5d4] text-black font-semibold"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Ratio */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">画面比例</label>
          <div className="flex gap-2">
            {ratios.map((r) => (
              <button
                key={r.label}
                onClick={() => setRatio(r.label)}
                className={`rounded-lg px-3 py-2 text-xs transition-all ${
                  ratio === r.label
                    ? "bg-[#00f5d4] text-black font-semibold"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Batch size */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">生成数量</label>
          <div className="flex gap-2">
            {[1, 2, 4].map((n) => (
              <button
                key={n}
                onClick={() => setBatchSize(n)}
                className={`rounded-lg px-4 py-2 text-sm transition-all ${
                  batchSize === n
                    ? "bg-[#00f5d4] text-black font-semibold"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {n}张
              </button>
            ))}
          </div>
        </div>

        {/* Advanced */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          <Settings2 className="h-4 w-4" />
          高级设置
          <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
        </button>
        {showAdvanced && (
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">反向提示词</label>
            <textarea
              value={negPrompt}
              onChange={(e) => setNegPrompt(e.target.value)}
              placeholder="不希望出现的元素，如：模糊, 低质量, 变形..."
              className="w-full h-20 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#00f5d4]/50 focus:outline-none resize-none"
            />
          </div>
        )}

        {/* Generate button */}
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
              <Sparkles className="h-5 w-5" />
              生成图片 ({model === "nanobanner" ? 2 * batchSize : 5 * batchSize} 积分)
            </>
          )}
        </button>
      </div>

      {/* Right panel - Results */}
      <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">生成结果</h2>
          {results.length > 0 && (
            <button
              onClick={() => setResults([])}
              className="text-sm text-gray-400 hover:text-gray-300 flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> 清空
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Sparkles className="h-10 w-10 text-gray-600" />
            </div>
            <p className="text-gray-400">还没有生成结果</p>
            <p className="text-sm text-gray-500 mt-1">填写提示词后点击生成按钮开始创作</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {results.map((url, i) => (
              <div key={i} className="group relative rounded-lg overflow-hidden border border-white/10 bg-black aspect-square">
                <img src={url} alt={`生成结果 ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors">
                    <Download className="h-5 w-5 text-white" />
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
