/**
 * 创漫Agent 专业提示词系统
 * 基于「巨日禄AI短剧提示词实用手册」标准
 *
 * 核心结构：两行结构法
 *   第一行：镜头语言（景别+视角+运镜+风格）
 *   第二行：主体描述（人物动作+环境+画面内容）
 */

// ============ 词典 ============

export const SHOT_TYPES = {
  远景: "展示环境全貌，场景交代、氛围铺垫",
  全景: "人物全身+环境，动作戏、位置关系",
  中景: "人物膝盖以上，对话、日常互动",
  近景: "人物胸部以上，情绪表达、对话特写",
  特写: "面部或局部，情绪高潮、细节展示",
  大特写: "眼睛/物品等，强调、悬念",
} as const;

export const CAMERA_ANGLES = ["平视", "低角度", "高角度", "鸟瞰镜头", "45度侧面", "正面", "右侧面", "左侧面", "背面"] as const;

export const CAMERA_MOVEMENTS = [
  "镜头固定", "镜头推进", "镜头拉远", "镜头向左移动", "镜头向右移动",
  "镜头向上移动", "镜头向下移动", "跟镜头", "顺时针环绕镜头", "逆时针环绕镜头",
  "旋转镜头", "摇镜头", "镜头向左慢移", "镜头缓慢推进",
] as const;

export const COMPOSITIONS = ["对角线构图", "三分构图", "对称构图", "越肩镜头", "荷兰角镜头"] as const;

export const MOTION_LEVELS = {
  大: "大动态、大动效、快速运动 — 打斗、追逐、爆发",
  中: "中动态、中等动态 — 日常动作、走路",
  小: "小动态、小幅动态 — 静态场景、微表情",
} as const;

export const QUALITY_TAGS = "高清，4K，精细，细节丰富，电影级画质，高质量渲染";

export const LIGHT_EFFECTS = ["逆光", "侧光", "顶光", "柔光", "硬光", "丁达尔效应", "镜头光晕", "光斑", "金色斜射光", "暮色深蓝"] as const;

export const MOOD_TAGS = ["史诗感", "神秘感", "压迫感", "温馨", "悲伤", "紧张", "宏大", "唯美", "凄凉", "热血"] as const;

export const ART_STYLES = [
  "2D动漫", "日漫风格", "90年代日本动漫", "韩漫", "乙游风格", "二次元",
  "游戏原画", "中国古风", "中国武侠风", "卡通", "绘本风",
  "赛博朋克", "科技风", "黑暗幻想", "黑暗恐怖风",
] as const;

// ============ 小说→剧本 ============

export const NOVEL_TO_SCRIPT_PROMPT = `你是一位顶级动漫编剧，精通将小说改编为精品漫剧剧本。

核心要求：
1. 保留原作核心情节、人物性格和情感张力
2. 每个场景必须包含详细的环境描述（时间、天气、光线、色调）
3. 对话要精炼有力，每个场景2-5句核心对话
4. 动作描述要具体到姿态、表情、肢体语言
5. 角色描述必须详尽：身份、性别、年龄、身高、体型、发型、发色、脸型、瞳色、肤色、服装、饰品、性格

角色描述模板：
[身份]，[性别]，[年龄]岁，[身高]，[体型]，[发型+发色]，[脸型]，[眼睛/瞳色]，[肤色]，[服装详描]，[饰品]，[性格特征]

请严格按JSON格式输出：
{
  "title": "作品标题",
  "genre": "类型",
  "art_style": "绘画风格（如：日漫风格/中国古风/2D动漫）",
  "characters": [
    {
      "name": "角色名",
      "identity": "身份（如：剑客/学生/公主）",
      "gender": "性别",
      "age": "年龄",
      "height": "身高",
      "body_type": "体型（纤瘦/健壮/丰满/宽肩窄腰等）",
      "hair": "发型+发色（如：黑色长发及腰/银白短发）",
      "face": "脸型+五官特征",
      "eyes": "瞳色+眼型",
      "skin": "肤色",
      "outfit": "服装详细描述",
      "accessories": "饰品",
      "personality": "性格特征",
      "role": "主角/配角/反派",
      "full_prompt": "完整角色描述（将以上所有特征整合为一段流畅的中文描述，用于AI生图）"
    }
  ],
  "scenes": [
    {
      "id": 1,
      "title": "场景标题",
      "location": "场景地点（详细描述）",
      "time": "具体时间（黎明/上午/正午/下午/黄昏/夜晚）",
      "weather": "天气（晴天/阴天/下雨/下雪/起雾等）",
      "lighting": "光线描述（如：金色斜射光/暮色深蓝/霓虹招牌）",
      "color_tone": "色调（暖色调/冷色调/高对比度/电影感色调等）",
      "mood": "氛围（紧张/温馨/悲伤/热血/神秘/史诗感）",
      "environment": "环境描述（前景+背景元素）",
      "characters_present": ["角色名"],
      "actions": [
        { "type": "dialogue", "character": "角色名", "text": "台词", "emotion": "表情/语气", "body_language": "肢体语言" },
        { "type": "action", "character": "角色名", "text": "动作描述（具体到姿态）" },
        { "type": "narration", "text": "旁白" }
      ]
    }
  ]
}

小说原文：
`;

// ============ 剧本→分镜 ============

export const SCRIPT_TO_STORYBOARD_PROMPT = `你是一位顶级动漫分镜师。请将以下剧本场景拆解为精品漫剧分镜。

## 分镜提示词标准（两行结构法）

第一行：镜头语言 = 角度 + 景别 + 视角 + 运镜方式
第二行：主体描述 = 人物动作 + 环境 + 画面内容

## 景别参考
- 远景：展示环境全貌
- 全景：人物全身+环境
- 中景：人物膝盖以上
- 近景：人物胸部以上
- 特写：面部或局部
- 大特写：眼睛/物品等

## 运镜参考
镜头固定 / 镜头推进 / 镜头拉远 / 镜头向左移动 / 镜头向右移动
跟镜头 / 环绕镜头 / 摇镜头 / 镜头缓慢推进

## 构图参考
对角线构图 / 三分构图 / 对称构图 / 越肩镜头

## 动作幅度
大动态（打斗/追逐）/ 中动态（日常）/ 小动态（静态/微表情）

## 要求
1. 每个分镜必须使用两行结构法
2. 分镜prompt必须是中文（用于即梦/可灵等国产模型）
3. 画面描述要包含角色完整外貌特征（从角色卡复制）
4. 光线、色调、氛围要从场景信息继承
5. 每个场景拆分为4-8个分镜
6. 注明动态幅度（大/中/小）用于视频生成参数控制
7. 台词要标注在对应分镜上

请严格按JSON格式输出：
{
  "scene_id": 1,
  "storyboards": [
    {
      "id": "1-1",
      "camera_line": "镜头语言行（如：正面，中景，平视，镜头缓慢推进）",
      "subject_line": "主体描述行（如：黑发少年手持长剑，剑身散发蓝色光芒，目光坚定直视前方，衣袍被风吹起飘动）",
      "full_prompt": "完整生图提示词（合并两行+风格+质量标签，如：正面，中景，平视，镜头缓慢推进，黑发少年手持长剑...，日漫风格，高清，4K，电影级画质）",
      "shot_type": "景别",
      "camera_angle": "视角",
      "camera_movement": "运镜",
      "composition": "构图方式",
      "motion_level": "动态幅度（大/中/小）",
      "characters_in_frame": ["角色名"],
      "character_descriptions": ["角色在该镜头中的完整外貌描述"],
      "dialogue": "该画面对应的台词",
      "emotion": "情绪/表情",
      "lighting": "光线",
      "color_tone": "色调",
      "mood": "氛围",
      "duration_seconds": 5,
      "transition": "转场（cut/fade/dissolve）",
      "special_effects": "特效描述（如有，法阵/光柱/粒子等）"
    }
  ]
}

剧本场景数据（含角色信息）：
`;

// ============ 角色设计 ============

/** 角色设计prompt：基于角色卡生成角色立绘 */
export function characterDesignPrompt(
  character: {
    name: string;
    full_prompt?: string;
    description?: string;
    outfit?: string;
    hair?: string;
    eyes?: string;
  },
  artStyle: string = "日漫风格"
): string {
  const charDesc = character.full_prompt || character.description || "";
  return `${artStyle}，角色设计表，全身正面+侧面，${charDesc}，白色背景，角色设定参考图，精细面部，精细眼睛，一致的设计，高清，4K，电影级画质`;
}

/** 角色设计反向prompt */
export const CHARACTER_NEGATIVE_PROMPT = "低质量，模糊，变形，多余肢体，解剖错误，水印，文字，多视图重叠，不一致设计，写实照片风格";

// ============ 场景分镜图 ============

/** 场景图prompt：直接使用分镜的full_prompt */
export function sceneImagePrompt(storyboard: {
  full_prompt?: string;
  camera_line?: string;
  subject_line?: string;
}, artStyle: string = "日漫风格"): string {
  if (storyboard.full_prompt) return storyboard.full_prompt;
  // fallback: 手动拼接两行
  return `${storyboard.camera_line || ""}，${storyboard.subject_line || ""}，${artStyle}，${QUALITY_TAGS}`;
}

/** 场景图反向prompt */
export const SCENE_NEGATIVE_PROMPT = "低质量，最差质量，模糊，变形，解剖错误，水印，文字，logo，签名，多余手指，畸形手部，丑陋面部，写实照片";

// ============ 视频生成 ============

/** 视频提示词：基于分镜的两行结构 + 运动控制 */
export function videoPrompt(storyboard: {
  camera_line?: string;
  subject_line?: string;
  camera_movement?: string;
  motion_level?: string;
  special_effects?: string;
}): string {
  const parts: string[] = [];
  if (storyboard.camera_line) parts.push(storyboard.camera_line);
  if (storyboard.subject_line) parts.push(`主体：${storyboard.subject_line}`);
  if (storyboard.special_effects) parts.push(storyboard.special_effects);
  // 动态幅度控制
  if (storyboard.motion_level === "大") parts.push("大动态，大动效，快速运动");
  else if (storyboard.motion_level === "小") parts.push("小动态，小幅动态");
  else parts.push("中动态");
  return parts.join("，");
}
