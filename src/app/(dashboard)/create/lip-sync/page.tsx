"use client";

import { useState } from "react";
import { Upload, Loader2, Clapperboard, Mic, Video, Download } from "lucide-react";

const voiceOptions = [
  { id: "female_1", label: "女声·温柔" },
  { id: "female_2", label: "女声·活泼" },
  { id: "male_1", label: "男声·磁性" },
  { id: "male_2", label: "男声·少年" },
];

export default function LipSyncPage() {
  const [sourceVideo, setSourceVideo] = useState<string | null>(null);
  const [audioMode, setAudioMode] = useState<"text" | "upload">("text");
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("female_1");
  const [audioFile, setAudioFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSourceVideo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setAudioFile(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!sourceVideo) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate/lip-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_video: sourceVideo,
          audio_mode: audioMode,
          text,
          voice,
          audio_file: audioFile,
        }),
      });
      const data = await res.json();
      if (data.task_id) {
        const interval = setInterval(async () => {
          const r = await fetch(`/api/tasks/${data.task_id}`);
          const d = await r.json();
          if (d.status === "completed") { clearInterval(interval); setResult(d.result_url); setLoading(false); }
          else if (d.status === "failed") { clearInterval(interval); setLoading(false); }
        }, 3000);
      }
    } catch { setLoading(false); }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-7rem)]">
      <div className="w-80 flex-shrink-0 flex flex-col gap-5 overflow-y-auto pr-2">
        <div>
          <h1 className="text-xl font-bold text-white">对口型</h1>
          <p className="text-sm text-gray-400 mt-1">角色口型与语音同步 · 10积分/次</p>
        </div>

        {/* Video upload */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">上传视频/图片</label>
          <div
            className="rounded-lg border-2 border-dashed border-white/10 bg-white/[0.02] p-6 text-center cursor-pointer hover:border-[#00f5d4]/30 transition-colors"
            onClick={() => document.getElementById("lip-video-upload")?.click()}
          >
            {sourceVideo ? (
              <video src={sourceVideo} className="rounded-lg max-h-40 mx-auto" controls />
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400">上传角色视频或图片</p>
              </>
            )}
          </div>
          <input id="lip-video-upload" type="file" accept="video/*,image/*" className="hidden" onChange={handleVideoUpload} />
        </div>

        {/* Audio mode */}
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">音频来源</label>
          <div className="flex gap-2">
            <button onClick={() => setAudioMode("text")} className={`flex-1 rounded-lg py-2 text-sm ${audioMode === "text" ? "bg-[#00f5d4] text-black font-semibold" : "bg-white/5 text-gray-400"}`}>
              <Mic className="h-4 w-4 inline mr-1" />文本转语音
            </button>
            <button onClick={() => setAudioMode("upload")} className={`flex-1 rounded-lg py-2 text-sm ${audioMode === "upload" ? "bg-[#00f5d4] text-black font-semibold" : "bg-white/5 text-gray-400"}`}>
              <Upload className="h-4 w-4 inline mr-1" />上传音频
            </button>
          </div>
        </div>

        {audioMode === "text" ? (
          <>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">台词文本</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="输入角色台词..."
                className="w-full h-24 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#00f5d4]/50 focus:outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">选择音色</label>
              <div className="grid grid-cols-2 gap-2">
                {voiceOptions.map((v) => (
                  <button key={v.id} onClick={() => setVoice(v.id)} className={`rounded-lg px-3 py-2 text-xs transition-all ${voice === v.id ? "bg-[#00f5d4] text-black font-semibold" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">上传音频</label>
            <div
              className="rounded-lg border-2 border-dashed border-white/10 bg-white/[0.02] p-4 text-center cursor-pointer hover:border-[#00f5d4]/30 transition-colors"
              onClick={() => document.getElementById("lip-audio-upload")?.click()}
            >
              {audioFile ? <p className="text-sm text-[#00f5d4]">音频已上传</p> : <p className="text-sm text-gray-400">点击上传 MP3/WAV</p>}
            </div>
            <input id="lip-audio-upload" type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !sourceVideo}
          className="w-full rounded-lg bg-[#00f5d4] py-3 font-semibold text-black hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="h-5 w-5 animate-spin" />处理中...</> : <><Clapperboard className="h-5 w-5" />生成对口型 (10 积分)</>}
        </button>
      </div>

      <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] p-6 overflow-y-auto">
        <h2 className="font-semibold text-white mb-4">对口型结果</h2>
        {result ? (
          <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black">
            <video src={result} controls className="w-full" />
            <button className="absolute top-2 right-2 rounded-full bg-black/60 p-2">
              <Download className="h-4 w-4 text-white" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Clapperboard className="h-10 w-10 text-gray-600" />
            </div>
            <p className="text-gray-400">上传视频并配置音频后开始</p>
          </div>
        )}
      </div>
    </div>
  );
}
