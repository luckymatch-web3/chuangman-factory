/**
 * 可灵 Kling 1.6 API（图生视频）
 * 文档：https://platform.kuaishou.com/aigc/open-platform
 */

import jwt from "jsonwebtoken";

interface KlingVideoRequest {
  image_url: string; // 源图片URL
  prompt?: string;
  duration: 5 | 10;
  mode?: "std" | "pro";
}

interface KlingResponse {
  code: number;
  message: string;
  data: {
    task_id: string;
    task_status: string;
    videos?: Array<{ url: string; duration: number }>;
  };
}

function getKlingToken(): string {
  const accessKey = process.env.KLING_ACCESS_KEY;
  const secretKey = process.env.KLING_SECRET_KEY;
  if (!accessKey || !secretKey) throw new Error("KLING_ACCESS_KEY/KLING_SECRET_KEY not configured");

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: accessKey,
    exp: now + 1800, // 30分钟过期
    nbf: now - 5,
  };
  return jwt.sign(payload, secretKey, { algorithm: "HS256", header: { alg: "HS256", typ: "JWT" } });
}

export async function generateVideo(req: KlingVideoRequest): Promise<{ taskId: string }> {
  const token = getKlingToken();

  const res = await fetch("https://api.klingai.com/v1/videos/image2video", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({
      model_name: "kling-v1-6",
      image: req.image_url,
      prompt: req.prompt || "",
      cfg_scale: 0.5,
      mode: req.mode || "std",
      duration: String(req.duration),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Kling API error ${res.status}: ${err}`);
  }

  const data: KlingResponse = await res.json();
  if (data.code !== 0) throw new Error(`Kling error: ${data.message}`);

  return { taskId: data.data.task_id };
}

export async function queryVideoTask(taskId: string): Promise<{
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl?: string;
}> {
  const token = getKlingToken();

  const res = await fetch(`https://api.klingai.com/v1/videos/image2video/${taskId}`, {
    headers: { "Authorization": `Bearer ${token}` },
  });

  const data: KlingResponse = await res.json();
  const s = data.data.task_status;

  if (s === "succeed" && data.data.videos?.[0]) {
    return { status: "completed", videoUrl: data.data.videos[0].url };
  }
  if (s === "failed") return { status: "failed" };
  return { status: "processing" };
}
