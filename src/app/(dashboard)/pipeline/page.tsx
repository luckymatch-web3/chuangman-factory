"use client";

import { useState } from "react";
import {
  FileText, BookText, ImageIcon, Video, Clapperboard, Download,
  Loader2, Zap, ChevronRight, CheckCircle, Circle, Play, Settings2
} from "lucide-react";

const pipelineSteps = [
  { id: "text_input", label: "文本输入", icon: FileText, desc: "输入小说/剧本文本" },
  { id: "scene_split", label: "场景拆分", icon: BookText, desc: "AI自动拆分为场景片段" },
  { id: "image_gen", label: "批量出图", icon: ImageIcon, desc: "为每个场景生成图片" },
  { id: "video_gen", label: "批量视频", icon: Video, desc: "将图片转化为动态视频" },
  { id: "lip_sync", label: "对口型", icon: Clapperboard, desc: "角色口型与台词同步" },
  { id: "compose", label: "视频合成", icon: Download, desc: "合成最终完整视频" },
];

type StepStatus = "pending" | "running" | "completed" | "skipped";

export default function PipelinePage() {
  const [text, setText] = useState("");
  const [imageModel, setImageModel] = useState("nanobanner");
  const [enableLipSync, setEnableLipSync] = useState(true);
  const [running, setRunning] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>(
    Object.fromEntries(pipelineSteps.map((s) => [s.id, "pending"]))
  );
  const [currentStep, setCurrentStep] = useState(-1);

  const handleRun = async () => {
    if (!text.trim()) return;
    setRunning(true);
    try {
      const res = await fetch("/api/pipeline/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          image_model: imageModel,
          enable_lip_sync: enableLipSync,
        }),
      });
      const data = await res.json();
      if (data.task_id) {
        // Simulate step progress
        for (let i = 0; i < pipelineSteps.length; i++) {
          const step = pipelineSteps[i];
          if (step.id === "lip_sync" && !enableLipSync) {
            setStepStatuses((prev) => ({ ...prev, [step.id]: "skipped" }));
            continue;
          }
          setCurrentStep(i);
          setStepStatuses((prev) => ({ ...prev, [step.id]: "running" }));
          await new Promise((r) => setTimeout(r, 2000 + Math.random() * 3000));
          setStepStatuses((prev) => ({ ...prev, [step.id]: "completed" }));
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
      case "skipped": return <Circle className="h-5 w-5 text-gray-600" />;
      default: return <Circle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Zap className="h-6 w-6 text-[#00f5d4]" />
          自动化流水线
        </h1>
        <p className="text-sm text-gray-400 mt-1">文字到成片，全自动六步创作</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left - Input */}
        <div className="col-span-2 space-y-5">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">输入文本（小说/剧本）</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="粘贴你的小说或剧本内容...&#10;&#10;AI将自动拆分场景、生成分镜、批量出图、生成视频，最终合成完整动漫短片。"
                className="w-full h-48 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#00f5d4]/50 focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-300 mb-2 block">图片模型</label>
                <div className="flex gap-2">
                  <button onClick={() => setImageModel("nanobanner")} className={`flex-1 rounded-lg py-2 text-sm ${imageModel === "nanobanner" ? "bg-[#00f5d4] text-black font-semibold" : "bg-white/5 text-gray-400"}`}>
                    NanoBanner
                  </button>
                  <button onClick={() => setImageModel("midjourney")} className={`flex-1 rounded-lg py-2 text-sm ${imageModel === "midjourney" ? "bg-[#00f5d4] text-black font-semibold" : "bg-white/5 text-gray-400"}`}>
                    Midjourney
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">对口型</label>
                <button
                  onClick={() => setEnableLipSync(!enableLipSync)}
                  className={`rounded-lg px-4 py-2 text-sm ${enableLipSync ? "bg-[#00f5d4] text-black font-semibold" : "bg-white/5 text-gray-400"}`}
                >
                  {enableLipSync ? "开启" : "关闭"}
                </button>
              </div>
            </div>

            <button
              onClick={handleRun}
              disabled={running || !text.trim()}
              className="w-full rounded-lg bg-[#00f5d4] py-3 font-semibold text-black hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {running ? <><Loader2 className="h-5 w-5 animate-spin" />流水线运行中...</> : <><Play className="h-5 w-5" />启动流水线</>}
            </button>
          </div>
        </div>

        {/* Right - Steps */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-[#00f5d4]" />流水线步骤
          </h2>
          <div className="space-y-1">
            {pipelineSteps.map((step, i) => (
              <div key={step.id} className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${currentStep === i ? "bg-[#00f5d4]/5" : ""}`}>
                {getStepIcon(stepStatuses[step.id])}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${stepStatuses[step.id] === "running" ? "text-[#00f5d4]" : stepStatuses[step.id] === "completed" ? "text-green-400" : "text-gray-300"}`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{step.desc}</div>
                </div>
                {i < pipelineSteps.length - 1 && <ChevronRight className="h-3 w-3 text-gray-600" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
