/**
 * 创漫Agent 各环节专业提示词模板
 */

/** 小说→剧本：将原文转换为结构化剧本 */
export const NOVEL_TO_SCRIPT_PROMPT = `你是一位专业的动漫编剧。请将以下小说文本改编为动漫剧本。

要求：
1. 保留原作核心情节和人物性格
2. 将叙述转换为场景描述+对话形式
3. 每个场景包含：场景编号、场景标题、场景描述（环境/氛围）、出场角色、对话和动作
4. 适当增加视觉化描述，适合动漫表现
5. 控制节奏，每个场景2-5句对话为宜

请严格按JSON格式输出：
{
  "title": "作品标题",
  "genre": "类型（如：奇幻/校园/热血）",
  "characters": [
    { "name": "角色名", "description": "外貌+性格描述（用于后续角色设计）", "role": "主角/配角" }
  ],
  "scenes": [
    {
      "id": 1,
      "title": "场景标题",
      "location": "场景地点",
      "time": "时间（白天/黄昏/夜晚）",
      "mood": "氛围（紧张/温馨/悲伤/热血）",
      "description": "场景环境描述",
      "characters_present": ["角色名"],
      "actions": [
        { "type": "dialogue", "character": "角色名", "text": "台词内容", "emotion": "表情/语气" },
        { "type": "action", "character": "角色名", "text": "动作描述" },
        { "type": "narration", "text": "旁白/内心独白" }
      ]
    }
  ]
}

小说原文：
`;

/** 剧本→分镜：将剧本场景拆分为具体画面 */
export const SCRIPT_TO_STORYBOARD_PROMPT = `你是一位专业的动漫分镜师。请将以下剧本场景拆解为逐帧分镜。

要求：
1. 每个分镜是一个独立画面，对应一张静态图片
2. 描述要足够具体，可以直接用于AI绘图
3. 包含构图、镜头角度、人物姿态、表情、光影
4. 动漫风格描述，使用英文关键词辅助（用于AI绘图prompt）
5. 每个场景拆分为3-8个分镜

请严格按JSON格式输出：
{
  "scene_id": 1,
  "storyboards": [
    {
      "id": "1-1",
      "shot_type": "镜头类型（全景/中景/近景/特写/俯瞰/仰拍）",
      "description_cn": "中文画面描述",
      "prompt_en": "English prompt for AI image generation, anime style, detailed visual description, include character appearance, pose, expression, background, lighting, camera angle. Use tags like: masterpiece, best quality, anime style, detailed background",
      "negative_prompt": "low quality, blurry, deformed, extra limbs, bad anatomy, watermark, text",
      "characters_in_frame": ["角色名"],
      "dialogue": "该画面对应的台词（如有）",
      "duration_seconds": 3,
      "transition": "切换方式（cut/fade/dissolve）"
    }
  ]
}

剧本场景数据：
`;

/** 角色设计prompt：基于角色描述生成角色立绘 */
export function characterDesignPrompt(character: { name: string; description: string; role: string }): string {
  return `masterpiece, best quality, anime character design sheet, full body, front view and side view, ${character.description}, anime style, clean background, white background, character reference sheet, detailed face, detailed eyes, consistent design, high resolution, 4k`;
}

/** 角色设计反向prompt */
export const CHARACTER_NEGATIVE_PROMPT = "low quality, blurry, deformed, extra limbs, bad anatomy, watermark, text, multiple views overlapping, inconsistent design, realistic style, photo";

/** 场景图片prompt增强：为分镜prompt添加质量标签 */
export function enhanceScenePrompt(basePrompt: string): string {
  const qualityTags = "masterpiece, best quality, anime style, detailed, vibrant colors, dramatic lighting, cinematic composition";
  return `${qualityTags}, ${basePrompt}`;
}

/** 场景图片反向prompt */
export const SCENE_NEGATIVE_PROMPT = "low quality, worst quality, blurry, deformed, bad anatomy, watermark, text, logo, signature, extra fingers, mutated hands, poorly drawn face, ugly, realistic photo";
