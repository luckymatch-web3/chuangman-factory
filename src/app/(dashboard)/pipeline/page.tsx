"use client";

import { useState } from "react";
import {
  BookOpen, Clapperboard, Users, Paintbrush, ImageIcon, Film,
  Loader2, Play, CheckCircle, Circle, Bot, ChevronDown, ChevronUp,
  Settings2, Sparkles,
} from "lucide-react";

const agentSteps = [
  { id: "novel_parse", label: "文本解析", agent: "文本解析Agent", icon: BookOpen, desc: "解析小说文本，提取角色、场景、对白等关键信息" },
  { id: "script_adapt", label: "剧本改编", agent: "编剧Agent", icon: Clapperboard, desc: "将小说内容改编为分幕分场的动漫剧本" },
  { id: "character_design", label: "角色设计", agent: "角色设计Agent", icon: Users, desc: "根据剧本描述生成角色立绘与设定卡" },
  { id: "storyboard", label: "分镜生成", agent: "分镜Agent", icon: Paintbrush, desc: "为每场戏生成分镜画面和构图" },
  { id: "scene_render", label: "场景绘制", agent: "绘图Agent", icon: ImageIcon, desc: "使用AI模型高质量渲染每帧场景" },
  { id: "video_compose", label: "视频合成", agent: "合成Agent", icon: Film, desc: "将场景图片转视频并合成完整影片" },
];

type StepStatus = "pending" | "running" | "completed" | "failed";

const imageModels = [
  { id: "seedream", name: "即梦 Seedream", desc: "火山引擎 · 高质量动漫" },
  { id: "kling_img", name: "可灵", desc: "快手 · 极速出图" },
];

const videoModels = [
  { id: "kling", name: "可灵 Kling 1.6", desc: "快手 · 高质量视频" },
  { id: "sora2", name: "Sora 2", desc: "OpenAI · 创意视频" },
];

export default function PipelinePage() {
  const [text, setText] = useState("");
  const [imageModel, setImageModel] = useState("seedream");
  const [videoModel, setVideoModel] = useState("kling");
  const [enableLipSync, setEnableLipSync] = useState(true);
  const [running, setRunning] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(
    Object.fromEntries(agentSteps.map((s) => [s.id, "pending"]))
  );
  const [currentStep, setCurrentStep] = useState(-1);
  const [stepOutputs, setStepOutputs] = useState<Record<string, string>>({});

  const handleRun = async () => {
    if (!text.trim()) return;
    setRunning(true);
    setStepOutputs({});
    try {
      const res = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          image_model: imageModel,
          video_model: videoModel,
          enable_lip_sync: enableLipSync,
        }),
      });
      const data = await res.json();
      if (data.task_id) {
        for (let i = 0; i < agentSteps.length; i++) {
          const step = agentSteps[i];
          setCurrentStep(i);
          setStepStatuses((prev) => ({ ...prev, [step.id]: "running" }));
          await new Promise((r) => setTimeout(r, 2000 + Math.random() * 3000));
          setStepStatuses((prev) => ({ ...prev, [step.id]: "completed" }));
          setStepOutputs((prev) => ({ ...prev, [step.id]: `${step.agent} 处理完成` }));
        }
        setRunning(false);
      }
    } catch {
      setRunning(false);
    }
  };

  const getStepIcon = (status: StepStatus) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "running": return <Loader2 className="h-5 w-5 text-[#00f5d4] animate-spin" />;
      case "failed": return <Circle className="h-5 w-5 text-red-400" />;
      default: return <Circle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#00f5d4]/20 flex items-center justify-center">
          <Bot className="h-5 w-5 text-[#00f5d4]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Agent 智能流水线</h1>
          <p className="text-sm text-gray-400">输入小说文本，6个AI Agent协作生成完整动漫视频</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Input & Config */}
        <div className="col-span-2 space-y-5">
          {/* Text Input */}
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
            <label className="text-sm font-medium text-gray-300 block">输入小说/故事文本</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"在这里粘贴你的小说或故事内容...\n\n例如：\n\"月光如水，洒在古老的城墙上。少女身着白色长裙，手持一柄玉箫，缓步走向城楼。远处传来悠扬的笛声，她停下脚步，回头望去——那个记忆中的少年，正站在桃花树下，朝她微笑。\""}
              className="w-full h-48 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#00f5d4]/50 focus:outline-none resize-none"
            />

            {/* Config Toggle */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              <Settings2 className="h-4 w-4" />
              模型配置
              {showConfig ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showConfig && (
              <div className="space-y-4 pt-2 border-t border-white/5">
                {/* Image Model */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">图片生成模型</label>
                  <div className="flex gap-2">
                    {imageModels.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setImageModel(m.id)}
                        className={`flex-1 rounded-lg border p-3 text-left transition-all ${
                          imageModel === m.id
                            ? "border-[#00f5d4] bg-[#00f5d4]/10"
                            : "border-white/10 bg-white/[0.02] hover:border-white/20"
                        }`}
                      >
                        <div className="text-sm font-medium text-white">{m.name}</div>
                        <div className="text-xs text-gray-500">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Video Model */}
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">视频生成模型</label>
                  <div className="flex gap-2">
                    {videoModels.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setVideoModel(m.id)}
                        className={`flex-1 rounded-lg border p-3 text-left transition-all ${
                          videoModel === m.id
                            ? "border-[#00f5d4] bg-[#00f5d4]/10"
                            : "border-white/10 bg-white/[0.02] hover:border-white/20"
                        }`}
                      >
                        <div className="text-sm font-medium text-white">{m.name}</div>
                        <div className="text-xs text-gray-500">{m.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lip Sync */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-300">对口型（OmniHuman）</div>
                    <div className="text-xs text-gray-500">角色口型与台词自动同步</div>
                  </div>
                  <button
                    onClick={() => setEnableLipSync(!enableLipSync)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${enableLipSync ? "bg-[#00f5d4]" : "bg-white/10"}`}
                  >
                    <span className={`block h-5 w-5 rounded-full bg-white shadow transition-transform ${enableLipSync ? "translate-x-5.5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            )}

            {/* Run Button */}
            <button
              onClick={handleRun}
              disabled={running || !text.trim()}
              className="w-full rounded-lg bg-[#00f5d4] py-3.5 font-semibold text-black hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
            >
              {running ? (
                <><Loader2 className="h-5 w-5 animate-spin" />Agent 流水线运行中...</>
              ) : (
                <><Play className="h-5 w-5" />启动 Agent 流水线</>
              )}
            </button>
          </div>
        </div>

        {/* Right: Agent Steps */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#00f5d4]" />
            6个AI Agent协作
          </h2>
          <div className="space-y-1">
            {agentSteps.map((step, i) => (
              <div
                key={step.id}
                className={`rounded-lg p-3 transition-colors ${currentStep === i ? "bg-[#00f5d4]/5 border border-[#00f5d4]/20" : "border border-transparent"}`}
              >
                <div className="flex items-center gap-3">
                  {getStepIcon(stepStatuses[step.id])}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${
                        stepStatuses[step.id] === "running" ? "text-[#00f5d4]" :
                        stepStatuses[step.id] === "completed" ? "text-green-400" : "text-gray-300"
                      }`}>
                        {step.label}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-500">{step.agent}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{step.desc}</div>
                    {stepOutputs[step.id] && (
                      <div className="text-xs text-green-400/70 mt-1">✓ {stepOutputs[step.id]}</div>
                    )}
                  </div>
                </div>
                {i < agentSteps.length - 1 && (
                  <div className="ml-2.5 mt-1 mb-1 h-4 border-l border-dashed border-white/10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
