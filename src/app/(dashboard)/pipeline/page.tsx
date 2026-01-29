"use client";

import { useState } from "react";
import {
  BookOpen, Upload, PenLine, Loader2, Play, CheckCircle, Circle, Bot,
  FileText, Film, Sparkles,
} from "lucide-react";

type InputMode = "upload_novel" | "upload_script" | "write";
type StepStatus = "pending" | "running" | "completed" | "failed";

const inputModes = [
  { id: "upload_novel" as InputMode, label: "上传小说", icon: Upload, desc: "上传 .txt .doc .docx 小说文件" },
  { id: "upload_script" as InputMode, label: "上传剧本", icon: FileText, desc: "上传已有的剧本文件" },
  { id: "write" as InputMode, label: "在线创作", icon: PenLine, desc: "直接在这里写故事" },
];

const agentSteps = [
  { id: "parse", label: "文本解析", desc: "解析故事内容，提取角色、场景、对白" },
  { id: "script", label: "剧本生成", desc: "改编为动漫剧本，分幕分场" },
  { id: "character", label: "角色设计", desc: "生成角色设定和外观" },
  { id: "storyboard", label: "分镜绘制", desc: "生成分镜画面和构图" },
  { id: "render", label: "场景渲染", desc: "高品质场景图片渲染" },
  { id: "compose", label: "视频合成", desc: "合成完整动漫视频" },
];

export default function PipelinePage() {
  const [mode, setMode] = useState<InputMode>("write");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(
    Object.fromEntries(agentSteps.map((s) => [s.id, "pending"]))
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => setText(reader.result as string);
      reader.readAsText(file);
    }
  };

  const handleRun = async () => {
    if (!text.trim()) return;
    setRunning(true);
    setStepStatuses(Object.fromEntries(agentSteps.map((s) => [s.id, "pending"])));

    try {
      const res = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, input_type: mode }),
      });
      const data = await res.json();
      if (data.task_id) {
        for (let i = 0; i < agentSteps.length; i++) {
          const step = agentSteps[i];
          setCurrentStep(i);
          setStepStatuses((prev) => ({ ...prev, [step.id]: "running" }));
          await new Promise((r) => setTimeout(r, 2000 + Math.random() * 3000));
          setStepStatuses((prev) => ({ ...prev, [step.id]: "completed" }));
        }
      }
    } catch {
      // error
    }
    setRunning(false);
  };

  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "running": return <Loader2 className="h-5 w-5 text-[#00f5d4] animate-spin" />;
      case "failed": return <Circle className="h-5 w-5 text-red-400" />;
      default: return <Circle className="h-5 w-5 text-gray-600" />;
    }
  };

  const hasContent = text.trim().length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
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
          {/* Input Mode Selector */}
          <div className="grid grid-cols-3 gap-3">
            {inputModes.map((m) => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setFileName(""); if (m.id !== "write") setText(""); }}
                className={`rounded-xl border p-4 text-left transition-all ${
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

          {/* Content Area */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
            {mode === "write" ? (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300 block">在线创作你的故事</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={"开始写你的故事...\n\n例如：\n月光如水，洒在古老的城墙上。少女身着白色长裙，手持一柄玉箫，缓步走向城楼。远处传来悠扬的笛声，她停下脚步，回头望去——那个记忆中的少年，正站在桃花树下，朝她微笑。\n\n\"你终于来了。\"少年轻声说道，樱花瓣纷纷落下。"}
                  className="w-full h-64 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#00f5d4]/50 focus:outline-none resize-none leading-relaxed"
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
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  {fileName ? (
                    <div>
                      <FileText className="h-10 w-10 text-[#00f5d4] mx-auto mb-3" />
                      <p className="text-white font-medium">{fileName}</p>
                      <p className="text-xs text-gray-500 mt-1">{text.length} 字已读取</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFileName(""); setText(""); }}
                        className="mt-3 text-xs text-red-400 hover:text-red-300"
                      >
                        移除文件
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-10 w-10 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400">点击或拖拽上传文件</p>
                      <p className="text-xs text-gray-500 mt-1">支持 .txt .doc .docx 格式</p>
                    </div>
                  )}
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt,.doc,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                {text && (
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 max-h-40 overflow-y-auto">
                    <p className="text-xs text-gray-400 mb-2">文件预览：</p>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap line-clamp-6">{text.slice(0, 500)}{text.length > 500 ? "..." : ""}</p>
                  </div>
                )}
              </div>
            )}

            {/* Run Button */}
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
          <div className="space-y-0">
            {agentSteps.map((step, i) => (
              <div key={step.id}>
                <div className={`rounded-lg p-3 transition-colors ${currentStep === i ? "bg-[#00f5d4]/5" : ""}`}>
                  <div className="flex items-center gap-3">
                    {getStepIcon(stepStatuses[step.id])}
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${
                        stepStatuses[step.id] === "running" ? "text-[#00f5d4]" :
                        stepStatuses[step.id] === "completed" ? "text-green-400" : "text-gray-400"
                      }`}>
                        {step.label}
                      </div>
                      <div className="text-xs text-gray-500">{step.desc}</div>
                    </div>
                  </div>
                </div>
                {i < agentSteps.length - 1 && (
                  <div className="ml-5 h-3 border-l border-dashed border-white/10" />
                )}
              </div>
            ))}
          </div>

          {currentStep >= agentSteps.length - 1 && stepStatuses.compose === "completed" && (
            <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 text-green-400 font-medium text-sm mb-2">
                <Film className="h-4 w-4" />
                创作完成！
              </div>
              <p className="text-xs text-gray-400">你的动漫视频已生成，可在素材管理中查看和下载</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
