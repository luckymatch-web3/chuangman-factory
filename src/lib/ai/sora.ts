/**
 * OpenAI Sora 2 API（视频生成）
 * 支持文生视频和图生视频
 */

interface SoraVideoRequest {
  prompt: string;
  image_url?: string; // 图生视频时传入
  duration?: number; // 5 | 10 | 15 | 20
  resolution?: "480p" | "720p" | "1080p";
  aspect_ratio?: "16:9" | "9:16" | "1:1";
}

interface SoraResponse {
  id: string;
  status: "queued" | "in_progress" | "completed" | "failed";
  video?: { url: string };
  error?: { message: string };
}

export async function generateSoraVideo(req: SoraVideoRequest): Promise<{ taskId: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const body: Record<string, unknown> = {
    model: "sora",
    prompt: req.prompt,
    duration: req.duration || 5,
    resolution: req.resolution || "1080p",
    aspect_ratio: req.aspect_ratio || "16:9",
  };

  if (req.image_url) {
    body.image = { url: req.image_url };
  }

  const res = await fetch("https://api.openai.com/v1/videos/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sora API error ${res.status}: ${err}`);
  }

  const data: SoraResponse = await res.json();
  return { taskId: data.id };
}

export async function querySoraTask(taskId: string): Promise<{
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl?: string;
}> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const res = await fetch(`https://api.openai.com/v1/videos/generations/${taskId}`, {
    headers: { "Authorization": `Bearer ${apiKey}` },
  });

  const data: SoraResponse = await res.json();

  if (data.status === "completed" && data.video?.url) {
    return { status: "completed", videoUrl: data.video.url };
  }
  if (data.status === "failed") return { status: "failed" };
  return { status: "processing" };
}
