/**
 * Midjourney API（通过代理服务）
 * 使用 midjourney-proxy 或兼容 API（如 goapi.ai / trueapi）
 *
 * 需要配置环境变量：
 *   MIDJOURNEY_API_URL - 代理服务地址（如 https://api.goapi.ai/mj）
 *   MIDJOURNEY_API_KEY - 代理服务的API Key
 */

interface MJSubmitResponse {
  code: number;
  description: string;
  result: string; // task_id
}

interface MJTaskResponse {
  id: string;
  status: "NOT_START" | "SUBMITTED" | "IN_PROGRESS" | "SUCCESS" | "FAILURE";
  progress: string; // "0%" ~ "100%"
  imageUrl?: string;
  failReason?: string;
}

export async function submitMJImagine(prompt: string): Promise<{ taskId: string }> {
  const apiUrl = process.env.MIDJOURNEY_API_URL;
  const apiKey = process.env.MIDJOURNEY_API_KEY;

  if (!apiUrl || !apiKey) throw new Error("MIDJOURNEY_API_URL/MIDJOURNEY_API_KEY not configured");

  const res = await fetch(`${apiUrl}/submit/imagine`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: prompt,
      // 默认参数：高质量动漫风格
      botType: "MID_JOURNEY",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Midjourney API error ${res.status}: ${err}`);
  }

  const data: MJSubmitResponse = await res.json();
  if (data.code !== 1 && data.code !== 200) {
    throw new Error(`Midjourney error: ${data.description}`);
  }

  return { taskId: data.result };
}

export async function queryMJTask(taskId: string): Promise<{
  status: "pending" | "processing" | "completed" | "failed";
  imageUrl?: string;
  progress?: string;
}> {
  const apiUrl = process.env.MIDJOURNEY_API_URL;
  const apiKey = process.env.MIDJOURNEY_API_KEY;

  if (!apiUrl || !apiKey) throw new Error("MIDJOURNEY_API_URL/MIDJOURNEY_API_KEY not configured");

  const res = await fetch(`${apiUrl}/task/${taskId}/fetch`, {
    headers: { "Authorization": `Bearer ${apiKey}` },
  });

  const data: MJTaskResponse = await res.json();

  if (data.status === "SUCCESS" && data.imageUrl) {
    return { status: "completed", imageUrl: data.imageUrl, progress: "100%" };
  }
  if (data.status === "FAILURE") return { status: "failed" };
  if (data.status === "IN_PROGRESS") {
    return { status: "processing", progress: data.progress };
  }
  return { status: "pending" };
}

/** 将中文prompt转换为MJ友好的英文prompt（由Claude翻译） */
export function buildMJPrompt(chinesePrompt: string, style: string = "anime"): string {
  // MJ使用英文效果更好，但中文prompt也支持
  // 添加MJ特有参数
  return `${chinesePrompt} --ar 16:9 --style raw --s 750 --niji 6`;
}
