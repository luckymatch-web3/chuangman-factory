/**
 * 火山引擎 Seedream 4.5 API（图片生成：角色设计、场景分镜）
 * 文档：https://www.volcengine.com/docs/82379/1541523
 */

import crypto from "crypto";

interface SeedreamRequest {
  prompt: string;
  negative_prompt?: string;
  width?: number;
  height?: number;
  seed?: number;
  ref_image?: string; // base64 参考图（角色一致性用）
}

interface SeedreamResponse {
  code: number;
  message: string;
  data: {
    task_id: string;
    status: string;
    images?: Array<{ url: string; seed: number }>;
  };
}

function signRequest(method: string, path: string, body: string, date: string): string {
  const accessKey = process.env.VOLC_ACCESS_KEY!;
  const secretKey = process.env.VOLC_SECRET_KEY!;
  const service = "cv";
  const region = "cn-north-1";

  const dateStamp = date.split("T")[0].replace(/-/g, "");
  const credentialScope = `${dateStamp}/${region}/${service}/request`;

  const hashedPayload = crypto.createHash("sha256").update(body).digest("hex");
  const canonicalRequest = `${method}\n${path}\n\nhost:visual.volcengineapi.com\nx-date:${date}\n\nhost;x-date\n${hashedPayload}`;
  const hashedCanonical = crypto.createHash("sha256").update(canonicalRequest).digest("hex");

  const stringToSign = `HMAC-SHA256\n${date}\n${credentialScope}\n${hashedCanonical}`;

  const kDate = crypto.createHmac("sha256", secretKey).update(dateStamp).digest();
  const kRegion = crypto.createHmac("sha256", kDate).update(region).digest();
  const kService = crypto.createHmac("sha256", kRegion).update(service).digest();
  const kSigning = crypto.createHmac("sha256", kService).update("request").digest();
  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");

  return `HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=host;x-date, Signature=${signature}`;
}

export async function generateImage(req: SeedreamRequest): Promise<{ taskId: string }> {
  if (!process.env.VOLC_ACCESS_KEY || !process.env.VOLC_SECRET_KEY) {
    throw new Error("VOLC_ACCESS_KEY/VOLC_SECRET_KEY not configured");
  }

  const path = "/v1/images/generations";
  const body = JSON.stringify({
    model: "seedream-4.5",
    prompt: req.prompt,
    negative_prompt: req.negative_prompt || "",
    width: req.width || 1024,
    height: req.height || 1024,
    num_images: 1,
    seed: req.seed || -1,
    ...(req.ref_image ? { ref_image: req.ref_image } : {}),
  });

  const date = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const authorization = signRequest("POST", path, body, date);

  const res = await fetch(`https://visual.volcengineapi.com${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Host": "visual.volcengineapi.com",
      "X-Date": date,
      "Authorization": authorization,
    },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Seedream API error ${res.status}: ${err}`);
  }

  const data: SeedreamResponse = await res.json();
  if (data.code !== 0) throw new Error(`Seedream error: ${data.message}`);

  return { taskId: data.data.task_id };
}

export async function queryImageTask(taskId: string): Promise<{
  status: "pending" | "processing" | "completed" | "failed";
  images?: string[];
}> {
  const path = `/v1/images/tasks/${taskId}`;
  const date = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const authorization = signRequest("GET", path, "", date);

  const res = await fetch(`https://visual.volcengineapi.com${path}`, {
    headers: {
      "Host": "visual.volcengineapi.com",
      "X-Date": date,
      "Authorization": authorization,
    },
  });

  const data: SeedreamResponse = await res.json();
  if (data.data.status === "success" && data.data.images) {
    return { status: "completed", images: data.data.images.map((i) => i.url) };
  }
  if (data.data.status === "failed") return { status: "failed" };
  return { status: "processing" };
}
