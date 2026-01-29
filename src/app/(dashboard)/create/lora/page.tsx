"use client";

import { useState } from "react";
import { Upload, Loader2, BrainCircuit, Plus, X, CheckCircle, Clock, AlertCircle } from "lucide-react";

type LoraStatus = "idle" | "uploading" | "training" | "completed" | "failed";

export default function LoraTrainingPage() {
  const [name, setName] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [triggerWord, setTriggerWord] = useState("");
  const [status, setStatus] = useState<LoraStatus>("idle");
  const [models, setModels] = useState<Array<{ id: string; name: string; status: string; created: string }>>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleTrain = async () => {
    if (!name.trim() || images.length < 5) return;
    setStatus("uploading");
    try {
      const res = await fetch("/api/lora/train", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, trigger_word: triggerWord, images }),
      });
      const data = await res.json();
      setStatus("training");
      if (data.task_id) {
        const interval = setInterval(async () => {
          const r = await fetch(`/api/tasks/${data.task_id}`);
          const d = await r.json();
          if (d.status === "completed") {
            clearInterval(interval);
            setStatus("completed");
            setModels((prev) => [{ id: data.task_id, name, status: "completed", created: new Date().toLocaleDateString() }, ...prev]);
          } else if (d.status === "failed") {
            clearInterval(interval);
            setStatus("failed");
          }
        }, 5000);
      }
    } catch {
      setStatus("failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">LoRA训练</h1>
        <p className="text-sm text-gray-400 mt-1">训练你的自定义风格模型 · 50积分/次</p>
      </div>

      {/* Training form */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">模型名称</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：我的日漫风格"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#00f5d4]/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">触发词（可选）</label>
          <input
            value={triggerWord}
            onChange={(e) => setTriggerWord(e.target.value)}
            placeholder="在提示词中使用该词触发风格"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#00f5d4]/50 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">训练图片（至少5张，推荐10-20张）</label>
          <div className="grid grid-cols-5 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removeImage(i)} className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <div
              className="aspect-square rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#00f5d4]/30 transition-colors"
              onClick={() => document.getElementById("lora-img-upload")?.click()}
            >
              <Plus className="h-6 w-6 text-gray-500" />
              <span className="text-xs text-gray-500 mt-1">添加</span>
            </div>
          </div>
          <input id="lora-img-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
          <p className="text-xs text-gray-500 mt-2">已上传 {images.length} 张 · 建议使用同风格、高清、无水印图片</p>
        </div>

        <button
          onClick={handleTrain}
          disabled={status === "training" || status === "uploading" || !name.trim() || images.length < 5}
          className="w-full rounded-lg bg-[#00f5d4] py-3 font-semibold text-black hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "uploading" ? <><Loader2 className="h-5 w-5 animate-spin" />上传中...</> :
           status === "training" ? <><Loader2 className="h-5 w-5 animate-spin" />训练中...</> :
           <><BrainCircuit className="h-5 w-5" />开始训练 (50 积分)</>}
        </button>

        {status === "completed" && (
          <div className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="h-4 w-4" /> 训练完成！可在图片生成中使用该模型
          </div>
        )}
        {status === "failed" && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" /> 训练失败，请检查图片质量后重试
          </div>
        )}
      </div>

      {/* My models */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">我的模型</h2>
        {models.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center">
            <BrainCircuit className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">暂无训练模型</p>
          </div>
        ) : (
          <div className="space-y-3">
            {models.map((m) => (
              <div key={m.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{m.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{m.created}</div>
                </div>
                <div className="flex items-center gap-2">
                  {m.status === "completed" ? (
                    <span className="text-xs text-green-400 flex items-center gap-1"><CheckCircle className="h-3 w-3" />可用</span>
                  ) : (
                    <span className="text-xs text-yellow-400 flex items-center gap-1"><Clock className="h-3 w-3" />训练中</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
