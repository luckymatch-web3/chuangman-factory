/**
 * Claude API 调用（文本生成：小说→剧本、剧本→分镜）
 */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

interface ClaudeResponse {
  id: string;
  content: Array<{ type: "text"; text: string }>;
  usage: { input_tokens: number; output_tokens: number };
}

export async function callClaude(
  systemPrompt: string,
  userContent: string,
  options?: { maxTokens?: number; temperature?: number }
): Promise<{ text: string; usage: { input: number; output: number } }> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const messages: ClaudeMessage[] = [{ role: "user", content: userContent }];

  const res = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5-20250514",
      max_tokens: options?.maxTokens ?? 8192,
      temperature: options?.temperature ?? 0.7,
      system: systemPrompt,
      messages,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data: ClaudeResponse = await res.json();
  return {
    text: data.content[0].text,
    usage: { input: data.usage.input_tokens, output: data.usage.output_tokens },
  };
}

/** 从Claude响应中提取JSON（处理markdown代码块包裹的情况） */
export function extractJSON<T>(text: string): T {
  let cleaned = text.trim();
  // 去除 ```json ... ``` 包裹
  const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) cleaned = match[1].trim();
  return JSON.parse(cleaned);
}
