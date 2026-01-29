/**
 * 创漫Agent 端到端Pipeline编排
 * 小说 → 剧本 → 分镜 → 角色设计图 → 场景图 → 视频
 */

import { callClaude, extractJSON } from "./claude";
import {
  NOVEL_TO_SCRIPT_PROMPT,
  SCRIPT_TO_STORYBOARD_PROMPT,
  characterDesignPrompt,
  CHARACTER_NEGATIVE_PROMPT,
  enhanceScenePrompt,
  SCENE_NEGATIVE_PROMPT,
} from "./prompts";
import { generateImage } from "./seedream";
import { generateVideo } from "./kling";

// ============ Types ============

export interface Character {
  name: string;
  description: string;
  role: string;
}

export interface SceneAction {
  type: "dialogue" | "action" | "narration";
  character?: string;
  text: string;
  emotion?: string;
}

export interface Scene {
  id: number;
  title: string;
  location: string;
  time: string;
  mood: string;
  description: string;
  characters_present: string[];
  actions: SceneAction[];
}

export interface Script {
  title: string;
  genre: string;
  characters: Character[];
  scenes: Scene[];
}

export interface Storyboard {
  id: string;
  shot_type: string;
  description_cn: string;
  prompt_en: string;
  negative_prompt: string;
  characters_in_frame: string[];
  dialogue: string;
  duration_seconds: number;
  transition: string;
}

export interface StoryboardScene {
  scene_id: number;
  storyboards: Storyboard[];
}

export type PipelineStage =
  | "novel_to_script"
  | "script_to_storyboard"
  | "character_design"
  | "scene_generation"
  | "video_generation"
  | "completed"
  | "failed";

export interface PipelineState {
  stage: PipelineStage;
  progress: number; // 0-100
  script?: Script;
  storyboardScenes?: StoryboardScene[];
  characterImages?: Record<string, string>; // name → imageUrl
  sceneImages?: Record<string, string>; // storyboard id → imageUrl
  videoClips?: Record<string, string>; // storyboard id → videoUrl
  error?: string;
}

type ProgressCallback = (state: PipelineState) => void | Promise<void>;

// ============ Pipeline Steps ============

/** Step 1: 小说 → 剧本 */
export async function novelToScript(novelText: string): Promise<Script> {
  const { text } = await callClaude(
    "你是一位专业的动漫编剧，擅长将小说改编为结构化的动漫剧本。只输出JSON，不要输出其他任何内容。",
    NOVEL_TO_SCRIPT_PROMPT + novelText,
    { maxTokens: 8192, temperature: 0.7 }
  );
  return extractJSON<Script>(text);
}

/** Step 2: 剧本 → 分镜 */
export async function scriptToStoryboard(scene: Scene): Promise<StoryboardScene> {
  const { text } = await callClaude(
    "你是一位专业的动漫分镜师。只输出JSON，不要输出其他任何内容。",
    SCRIPT_TO_STORYBOARD_PROMPT + JSON.stringify(scene, null, 2),
    { maxTokens: 4096, temperature: 0.6 }
  );
  return extractJSON<StoryboardScene>(text);
}

/** Step 3: 角色设计图 */
export async function designCharacter(character: Character): Promise<string> {
  const prompt = characterDesignPrompt(character);
  const { taskId } = await generateImage({
    prompt,
    negative_prompt: CHARACTER_NEGATIVE_PROMPT,
    width: 1024,
    height: 1024,
  });
  return taskId;
}

/** Step 4: 场景分镜图 */
export async function generateSceneImage(storyboard: Storyboard): Promise<string> {
  const prompt = enhanceScenePrompt(storyboard.prompt_en);
  const { taskId } = await generateImage({
    prompt,
    negative_prompt: storyboard.negative_prompt || SCENE_NEGATIVE_PROMPT,
    width: 1280,
    height: 720,
  });
  return taskId;
}

/** Step 5: 图生视频 */
export async function generateSceneVideo(
  imageUrl: string,
  storyboard: Storyboard
): Promise<string> {
  const { taskId } = await generateVideo({
    image_url: imageUrl,
    prompt: storyboard.description_cn,
    duration: (storyboard.duration_seconds <= 5 ? 5 : 10) as 5 | 10,
    mode: "std",
  });
  return taskId;
}

// ============ Full Pipeline ============

/**
 * 执行完整Pipeline
 * @param novelText 小说/剧本原文
 * @param onProgress 进度回调（写入数据库用）
 */
export async function runFullPipeline(
  novelText: string,
  onProgress: ProgressCallback
): Promise<PipelineState> {
  const state: PipelineState = { stage: "novel_to_script", progress: 0 };

  try {
    // === Step 1: 小说 → 剧本 ===
    state.stage = "novel_to_script";
    state.progress = 5;
    await onProgress(state);

    state.script = await novelToScript(novelText);
    state.progress = 20;
    await onProgress(state);

    // === Step 2: 剧本 → 分镜（逐场景） ===
    state.stage = "script_to_storyboard";
    state.storyboardScenes = [];
    const totalScenes = state.script.scenes.length;

    for (let i = 0; i < totalScenes; i++) {
      const sbScene = await scriptToStoryboard(state.script.scenes[i]);
      state.storyboardScenes.push(sbScene);
      state.progress = 20 + Math.round(((i + 1) / totalScenes) * 20);
      await onProgress(state);
    }

    // === Step 3: 角色设计 ===
    state.stage = "character_design";
    state.characterImages = {};

    const charTasks: Array<{ name: string; taskId: string }> = [];
    for (const char of state.script.characters) {
      const taskId = await designCharacter(char);
      charTasks.push({ name: char.name, taskId });
    }
    // 角色设计任务已提交，后续需要轮询
    state.progress = 50;
    await onProgress(state);

    // === Step 4: 场景图生成 ===
    state.stage = "scene_generation";
    state.sceneImages = {};

    const allStoryboards = state.storyboardScenes.flatMap((s) => s.storyboards);
    const sceneTasks: Array<{ id: string; taskId: string }> = [];

    for (const sb of allStoryboards) {
      const taskId = await generateSceneImage(sb);
      sceneTasks.push({ id: sb.id, taskId });
    }
    state.progress = 70;
    await onProgress(state);

    // === Step 5: 视频生成 ===
    // 注意：实际运行时需要等图片生成完成后拿到URL再生成视频
    // 这里先标记stage，实际轮询逻辑在API route中处理
    state.stage = "video_generation";
    state.videoClips = {};
    state.progress = 85;
    await onProgress(state);

    state.stage = "completed";
    state.progress = 100;
    await onProgress(state);

    return state;
  } catch (err) {
    state.stage = "failed";
    state.error = err instanceof Error ? err.message : String(err);
    await onProgress(state);
    return state;
  }
}
