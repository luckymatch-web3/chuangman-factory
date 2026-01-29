"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload, PenLine, Loader2, Play, CheckCircle, Circle, Bot,
  FileText, Film, Sparkles, AlertCircle, XCircle,
} from "lucide-react";
import Link from "next/link";

type InputMode = "upload_novel" | "upload_script" | "write";

interface PipelineStep {
  id: string;
  label: string;
  status: "pending" | "processing" | "completed" | "failed";
}

const inputModes = [
  { id: "upload_novel" as InputMode, label: "上传小说", icon: Upload, desc: "上传 .txt .doc .docx 小说文件" },
  { id: "upload_script" as InputMode, label: "上传剧本", icon: FileText, desc: "上传已有的剧本文件" },
  { id: "write" as InputMode, label: "在线创作", icon: PenLine, desc: "直接在这里写故事" },
];

const imageModels = [
  { id: "seedream", name: "即梦 Seedream", desc: "火山引擎 · 国产最强" },
  { id: "midjourney", name: "Midjourney", desc: "Niji 6 · 动漫专精" },
];

const videoModels = [
  { id: "kling", name: "可灵 Kling 1.6", desc: "快手 · 精品画质" },
  { id: "sora2", name: "Sora 2", desc: "OpenAI · 创意视频" },
];

export default function PipelinePage() {
  const [mode, setMode] = useState<InputMode>("write");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [imageModel, setImageModel] = useState("seedream");
  const [videoModel, setVideoModel] = useState("kling");
  const [running, setRunning] = useState(false);
  const [pipelineId, setPipelineId] = useState<string | null>(null);
  const [steps, setSteps] = useState<PipelineStep[]>([]);
  const [pipelineStatus, setPipelineStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [costInfo, setCostInfo] = useState<{ scenes: number; storyboards: number; credits: number } | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => setText(reader.result as string);
      reader.readAsText(file);
    }
  };

  const pollPipeline = useCallback((id: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/pipeline/${id}`);
        const data = await res.json();
        if (data.steps) setSteps(data.steps);
        setPipelineStatus(data.status);

        if (data.status === "completed" || data.status === "partial" || data.status === "failed") {
          if (pollRef.current) clearInterval(pollRef.current);
          setRunning(data.status === "processing");
        }
      } catch {
        // keep polling
      }
    }, 3000);
  }, []);

  const handleRun = async () => {
    if (!text.trim()) return;
    setRunning(true);
    setError("");
    setPipelineStatus("");
    setCostInfo(null);
    setSteps([]);

    try {
      const res = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, input_type: mode, image_model: imageModel, video_model: videoModel }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError("请先登录后再使用");
        } else if (res.status === 402) {
          setError(`积分不足，需要 ${data.estimated_credits} 积分，当前 ${data.current_credits} 积分`);
        } else {
          setError(data.error || "创作失败，请重试");
        }
        setRunning(false);
        return;
      }

      setPipelineId(data.pipeline_id);
      setCostInfo({ scenes: data.estimated_scenes, storyboards: data.estimated_storyboards, credits: data.credits_cost });
      pollPipeline(data.pipeline_id);
    } catch {
      setError("网络错误，请重试");
      setRunning(false);
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "processing": return <Loader2 className="h-5 w-5 text-[#00f5d4] animate-spin" />;
      case "failed": return <XCircle className="h-5 w-5 text-red-400" />;
      default: return <Circle className="h-5 w-5 text-gray-600" />;
    }
  };

  const hasContent = text.trim().length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#00f5d4]/20 flex items-center justify-center">
          <Bot className="h-5 w-5 text-[#00f5d4]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">创漫Agent</h1>
          <p className="text-sm text-gray-400">上传小说、剧本，或在线创作，AI自动生成动漫视频</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Input */}
        <div className="col-span-2 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {inputModes.map((m) => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setFileName(""); if (m.id !== "write") setText(""); }}
                disabled={running}
                className={`rounded-xl border p-4 text-left transition-all disabled:opacity-50 ${
                  mode === m.id
                    ? "border-[#00f5d4] bg-[#00f5d4]/5"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                <m.icon className={`h-5 w-5 mb-2 ${mode === m.id ? "text-[#00f5d4]" : "text-gray-500"}`} />
                <div className={`text-sm font-medium ${mode === m.id ? "text-white" : "text-gray-300"}`}>{m.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{m.desc}</div>
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
            {mode === "write" ? (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300 block">在线创作你的故事</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={running}
                  placeholder={"开始写你的故事...\n\n例如：\n月光如水，洒在古老的城墙上。少女身着白色长裙，手持一柄玉箫，缓步走向城楼。远处传来悠扬的笛声，她停下脚步，回头望去——那个记忆中的少年，正站在桃花树下，朝她微笑。\n\n\"你终于来了。\"少年轻声说道，樱花瓣纷纷落下。"}
                  className="w-full h-64 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#00f5d4]/50 focus:outline-none resize-none leading-relaxed disabled:opacity-50"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>支持中文创作，AI将自动处理</span>
                  <span>{text.length} 字</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-300 block">
                  {mode === "upload_novel" ? "上传小说文件" : "上传剧本文件"}
                </label>
                <div
                  className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center cursor-pointer hover:border-[#00f5d4]/30 transition-colors"
                  onClick={() => !running && document.getElementById("file-upload")?.click()}
                >
                  {fileName ? (
                    <div>
                      <FileText className="h-10 w-10 text-[#00f5d4] mx-auto mb-3" />
                      <p className="text-white font-medium">{fileName}</p>
                      <p className="text-xs text-gray-500 mt-1">{text.length} 字已读取</p>
                      {!running && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setFileName(""); setText(""); }}
                          className="mt-3 text-xs text-red-400 hover:text-red-300"
                        >移除文件</button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-10 w-10 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400">点击或拖拽上传文件</p>
                      <p className="text-xs text-gray-500 mt-1">支持 .txt .doc .docx 格式</p>
                    </div>
                  )}
                </div>
                <input id="file-upload" type="file" accept=".txt,.doc,.docx" className="hidden" onChange={handleFileUpload} />
                {text && !running && (
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 max-h-40 overflow-y-auto">
                    <p className="text-xs text-gray-400 mb-2">文件预览：</p>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-6">{text.slice(0, 500)}{text.length > 500 ? "..." : ""}</p>
                  </div>
                )}
              </div>
            )}

            {/* Model Selection */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block">图片模型</label>
                <div className="space-y-2">
                  {imageModels.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setImageModel(m.id)}
                      disabled={running}
                      className={`w-full rounded-lg border p-2.5 text-left transition-all text-sm disabled:opacity-50 ${
                        imageModel === m.id
                          ? "border-[#00f5d4] bg-[#00f5d4]/5"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <div className={`font-medium ${imageModel === m.id ? "text-white" : "text-gray-300"}`}>{m.name}</div>
                      <div className="text-xs text-gray-500">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 mb-2 block">视频模型</label>
                <div className="space-y-2">
                  {videoModels.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setVideoModel(m.id)}
                      disabled={running}
                      className={`w-full rounded-lg border p-2.5 text-left transition-all text-sm disabled:opacity-50 ${
                        videoModel === m.id
                          ? "border-[#00f5d4] bg-[#00f5d4]/5"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                      }`}
                    >
                      <div className={`font-medium ${videoModel === m.id ? "text-white" : "text-gray-300"}`}>{m.name}</div>
                      <div className="text-xs text-gray-500">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-400">{error}</span>
                {error.includes("积分不足") && (
                  <Link href="/credits" className="ml-auto text-xs text-[#00f5d4] hover:underline">去充值</Link>
                )}
                {error.includes("登录") && (
                  <Link href="/login" className="ml-auto text-xs text-[#00f5d4] hover:underline">去登录</Link>
                )}
              </div>
            )}

            <button
              onClick={handleRun}
              disabled={running || !hasContent}
              className="mt-5 w-full rounded-xl bg-[#00f5d4] py-4 font-semibold text-black hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {running ? (
                <><Loader2 className="h-5 w-5 animate-spin" />创漫Agent 创作中...</>
              ) : (
                <><Play className="h-5 w-5" />开始创作</>
              )}
            </button>
          </div>
        </div>

        {/* Right: Progress */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#00f5d4]" />
            创作进度
          </h2>

          {costInfo && (
            <div className="mb-5 p-3 rounded-lg bg-white/[0.03] border border-white/5 text-xs text-gray-400 space-y-1">
              <div className="flex justify-between"><span>预估场景</span><span className="text-white">{costInfo.scenes} 场</span></div>
              <div className="flex justify-between"><span>预估分镜</span><span className="text-white">{costInfo.storyboards} 帧</span></div>
              <div className="flex justify-between"><span>消耗积分</span><span className="text-[#00f5d4]">{costInfo.credits}</span></div>
            </div>
          )}

          {steps.length > 0 ? (
            <div className="space-y-0">
              {steps.map((step, i) => (
                <div key={step.id}>
                  <div className={`rounded-lg p-3 transition-colors ${step.status === "processing" ? "bg-[#00f5d4]/5" : ""}`}>
                    <div className="flex items-center gap-3">
                      {getStepIcon(step.status)}
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${
                          step.status === "processing" ? "text-[#00f5d4]" :
                          step.status === "completed" ? "text-green-400" :
                          step.status === "failed" ? "text-red-400" : "text-gray-400"
                        }`}>
                          {step.label}
                        </div>
                      </div>
                    </div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="ml-5 h-3 border-l border-dashed border-white/10" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-gray-700 mx-auto mb-3" />
              <p className="text-sm text-gray-500">输入内容后点击「开始创作」</p>
              <p className="text-xs text-gray-600 mt-1">创漫Agent将自动完成所有步骤</p>
            </div>
          )}

          {(pipelineStatus === "completed" || pipelineStatus === "partial") && (
            <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 text-green-400 font-medium text-sm mb-2">
                <Film className="h-4 w-4" />
                {pipelineStatus === "completed" ? "创作完成！" : "文本阶段完成"}
              </div>
              <p className="text-xs text-gray-400">
                {pipelineStatus === "completed"
                  ? "你的动漫视频已生成，可在素材管理中查看和下载"
                  : "剧本和分镜已生成，图片和视频待API Key配置后自动处理"}
              </p>
              <Link href="/assets" className="inline-block mt-2 text-xs text-[#00f5d4] hover:underline">查看素材 →</Link>
            </div>
          )}

          {pipelineStatus === "failed" && (
            <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 text-red-400 font-medium text-sm">
                <XCircle className="h-4 w-4" />创作失败
              </div>
              <p className="text-xs text-gray-400 mt-1">请检查输入内容后重试</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
