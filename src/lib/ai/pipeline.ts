/**
 * 创漫Agent 端到端Pipeline编排
 * 小说 → 剧本 → 分镜 → 角色设计图 → 场景图 → 视频
 *
 * 支持模型选择：
 *   图片：即梦Seedream / Midjourney
 *   视频：可灵Kling / Sora 2
 */

import { callClaude, extractJSON } from "./claude";
import {
  NOVEL_TO_SCRIPT_PROMPT,
  SCRIPT_TO_STORYBOARD_PROMPT,
  characterDesignPrompt,
  CHARACTER_NEGATIVE_PROMPT,
  sceneImagePrompt,
  SCENE_NEGATIVE_PROMPT,
  videoPrompt,
} from "./prompts";
import { generateImage as seedreamGenerate } from "./seedream";
import { generateVideo as klingGenerate } from "./kling";
import { generateSoraVideo } from "./sora";
import { submitMJImagine } from "./midjourney";

// ============ Types ============

export interface Character {
  name: string;
  identity: string;
  gender: string;
  age: string;
  height: string;
  body_type: string;
  hair: string;
  face: string;
  eyes: string;
  skin: string;
  outfit: string;
  accessories: string;
  personality: string;
  role: string;
  full_prompt: string;
  // legacy compat
  description?: string;
}

export interface SceneAction {
  type: "dialogue" | "action" | "narration";
  character?: string;
  text: string;
  emotion?: string;
  body_language?: string;
}

export interface Scene {
  id: number;
  title: string;
  location: string;
  time: string;
  weather: string;
  lighting: string;
  color_tone: string;
  mood: string;
  environment: string;
  characters_present: string[];
  actions: SceneAction[];
}

export interface Script {
  title: string;
  genre: string;
  art_style: string;
  characters: Character[];
  scenes: Scene[];
}

export interface Storyboard {
  id: string;
  camera_line: string;
  subject_line: string;
  full_prompt: string;
  shot_type: string;
  camera_angle: string;
  camera_movement: string;
  composition: string;
  motion_level: string;
  characters_in_frame: string[];
  character_descriptions: string[];
  dialogue: string;
  emotion: string;
  lighting: string;
  color_tone: string;
  mood: string;
  duration_seconds: number;
  transition: string;
  special_effects: string;
}

export interface StoryboardScene {
  scene_id: number;
  storyboards: Storyboard[];
}

export type ImageModel = "seedream" | "midjourney";
export type VideoModel = "kling" | "sora2";

export type PipelineStage =
  | "novel_to_script"
  | "script_to_storyboard"
  | "character_design"
  | "scene_generation"
  | "video_generation"
  | "completed"
  | "failed";

export interface PipelineConfig {
  imageModel: ImageModel;
  videoModel: VideoModel;
  artStyle?: string;
}

// ============ Pipeline Steps ============

/** Step 1: 小说 → 剧本（含详细角色卡） */
export async function novelToScript(novelText: string): Promise<Script> {
  const { text } = await callClaude(
    "你是一位顶级动漫编剧，精通将小说改编为精品漫剧剧本。只输出JSON，不要输出其他任何内容。",
    NOVEL_TO_SCRIPT_PROMPT + novelText,
    { maxTokens: 8192, temperature: 0.7 }
  );
  return extractJSON<Script>(text);
}

/** Step 2: 剧本 → 分镜（两行结构法） */
export async function scriptToStoryboard(
  scene: Scene,
  characters: Character[],
  artStyle: string
): Promise<StoryboardScene> {
  // 将角色信息一起传给分镜师，确保分镜中包含角色外貌
  const input = {
    scene,
    characters: characters.filter((c) =>
      scene.characters_present.includes(c.name)
    ),
    art_style: artStyle,
  };

  const { text } = await callClaude(
    "你是一位顶级动漫分镜师，精通精品漫剧分镜设计。只输出JSON，不要输出其他任何内容。",
    SCRIPT_TO_STORYBOARD_PROMPT + JSON.stringify(input, null, 2),
    { maxTokens: 8192, temperature: 0.6 }
  );
  return extractJSON<StoryboardScene>(text);
}

/** Step 3: 角色设计图 */
export async function designCharacter(
  character: Character,
  imageModel: ImageModel,
  artStyle: string
): Promise<string> {
  const prompt = characterDesignPrompt(character, artStyle);

  if (imageModel === "midjourney") {
    const { taskId } = await submitMJImagine(`${prompt} --ar 1:1 --niji 6`);
    return taskId;
  }

  // 默认即梦 Seedream
  const { taskId } = await seedreamGenerate({
    prompt,
    negative_prompt: CHARACTER_NEGATIVE_PROMPT,
    width: 1024,
    height: 1024,
  });
  return taskId;
}

/** Step 4: 场景分镜图 */
export async function generateSceneImage(
  storyboard: Storyboard,
  imageModel: ImageModel,
  artStyle: string
): Promise<string> {
  const prompt = sceneImagePrompt(storyboard, artStyle);

  if (imageModel === "midjourney") {
    const { taskId } = await submitMJImagine(`${prompt} --ar 16:9 --niji 6`);
    return taskId;
  }

  // 默认即梦 Seedream
  const { taskId } = await seedreamGenerate({
    prompt,
    negative_prompt: SCENE_NEGATIVE_PROMPT,
    width: 1280,
    height: 720,
  });
  return taskId;
}

/** Step 5: 图生视频 */
export async function generateSceneVideo(
  imageUrl: string,
  storyboard: Storyboard,
  videoModel: VideoModel
): Promise<string> {
  const prompt = videoPrompt(storyboard);

  if (videoModel === "sora2") {
    const { taskId } = await generateSoraVideo({
      prompt,
      image_url: imageUrl,
      duration: storyboard.duration_seconds <= 5 ? 5 : 10,
      resolution: "1080p",
    });
    return taskId;
  }

  // 默认可灵 Kling
  const { taskId } = await klingGenerate({
    image_url: imageUrl,
    prompt,
    duration: (storyboard.duration_seconds <= 5 ? 5 : 10) as 5 | 10,
    mode: "pro", // 精品漫剧用pro模式
  });
  return taskId;
}
