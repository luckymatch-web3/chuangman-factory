import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  novelToScript,
  scriptToStoryboard,
  designCharacter,
  generateSceneImage,
  generateSceneVideo,
} from "@/lib/ai/pipeline";
import type { ImageModel, VideoModel, PipelineStage } from "@/lib/ai/pipeline";

export const maxDuration = 300; // 5分钟超时

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    text,
    input_type = "novel",
    image_model = "seedream",
    video_model = "kling",
  } = body;

  if (!text?.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  // 估算积分
  const estimatedScenes = Math.max(3, Math.min(20, Math.ceil(text.length / 200)));
  const estimatedCharacters = Math.max(2, Math.min(6, Math.ceil(estimatedScenes / 3)));
  const estimatedStoryboards = estimatedScenes * 5;
  const imgCost = image_model === "midjourney" ? 8 : 3;
  const vidCost = video_model === "sora2" ? 20 : 10;
  const estimatedCredits =
    5 +
    estimatedCharacters * imgCost +
    estimatedStoryboards * imgCost +
    estimatedStoryboards * vidCost;

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (!profile || profile.credits < estimatedCredits) {
    return NextResponse.json({
      error: "Insufficient credits",
      estimated_credits: estimatedCredits,
      current_credits: profile?.credits || 0,
    }, { status: 402 });
  }

  const { data: pipeline, error } = await supabase
    .from("pipeline_runs")
    .insert({
      user_id: user.id,
      name: `创漫Agent - ${new Date().toLocaleString("zh-CN")}`,
      status: "processing",
      steps: JSON.stringify([
        { id: "novel_to_script", label: "剧本生成", status: "processing" },
        { id: "script_to_storyboard", label: "分镜拆解", status: "pending" },
        { id: "character_design", label: "角色设计", status: "pending" },
        { id: "scene_generation", label: "场景绘制", status: "pending" },
        { id: "video_generation", label: "视频合成", status: "pending" },
      ]),
      current_step: 0,
    })
    .select("id")
    .single();

  if (error || !pipeline) {
    return NextResponse.json({ error: "Failed to create pipeline" }, { status: 500 });
  }

  await supabase.from("profiles").update({ credits: profile.credits - estimatedCredits }).eq("id", user.id);
  await supabase.from("credit_transactions").insert({
    user_id: user.id,
    amount: -estimatedCredits,
    type: "consume",
    description: `创漫Agent (${image_model}+${video_model}, ${estimatedScenes}场景)`,
  });

  // 异步执行
  executePipeline(
    pipeline.id, user.id, text, input_type,
    image_model as ImageModel, video_model as VideoModel, supabase
  ).catch(console.error);

  return NextResponse.json({
    pipeline_id: pipeline.id,
    estimated_scenes: estimatedScenes,
    estimated_storyboards: estimatedStoryboards,
    credits_cost: estimatedCredits,
    image_model,
    video_model,
  });
}

async function executePipeline(
  pipelineId: string,
  userId: string,
  text: string,
  inputType: string,
  imageModel: ImageModel,
  videoModel: VideoModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any
) {
  const updateStep = async (stepIndex: number, stage: PipelineStage, status: string) => {
    const { data: run } = await supabase
      .from("pipeline_runs")
      .select("steps")
      .eq("id", pipelineId)
      .single();

    if (run) {
      const steps = JSON.parse(run.steps);
      for (let i = 0; i < stepIndex; i++) steps[i].status = "completed";
      steps[stepIndex].status = status;
      await supabase
        .from("pipeline_runs")
        .update({
          steps: JSON.stringify(steps),
          current_step: stepIndex,
          status: stage === "failed" ? "failed" : "processing",
        })
        .eq("id", pipelineId);
    }
  };

  try {
    // Step 1: 小说 → 剧本（含详细角色卡）
    await updateStep(0, "novel_to_script", "processing");
    const script = await novelToScript(text);
    const artStyle = script.art_style || "日漫风格";

    await supabase.from("assets").insert({
      user_id: userId,
      type: "text",
      name: `${script.title} - 剧本`,
      url: "",
      metadata: { content: script, pipeline_id: pipelineId },
    });
    await updateStep(0, "novel_to_script", "completed");

    // Step 2: 剧本 → 分镜（两行结构法，角色外貌传入）
    await updateStep(1, "script_to_storyboard", "processing");
    const storyboardScenes = [];
    for (const scene of script.scenes) {
      const sb = await scriptToStoryboard(scene, script.characters, artStyle);
      storyboardScenes.push(sb);
    }

    await supabase.from("assets").insert({
      user_id: userId,
      type: "text",
      name: `${script.title} - 分镜脚本`,
      url: "",
      metadata: { content: storyboardScenes, pipeline_id: pipelineId },
    });
    await updateStep(1, "script_to_storyboard", "completed");

    // Step 3: 角色设计
    await updateStep(2, "character_design", "processing");
    const charTasks: Array<{ name: string; taskId: string }> = [];
    for (const char of script.characters) {
      try {
        const taskId = await designCharacter(char, imageModel, artStyle);
        charTasks.push({ name: char.name, taskId });
      } catch (err) {
        console.error(`Character design failed for ${char.name}:`, err);
      }
    }

    await supabase.from("assets").insert({
      user_id: userId,
      type: "text",
      name: `${script.title} - 角色设计任务`,
      url: "",
      metadata: { tasks: charTasks, model: imageModel, pipeline_id: pipelineId },
    });
    await updateStep(2, "character_design", charTasks.length > 0 ? "completed" : "failed");

    // Step 4: 场景分镜图
    await updateStep(3, "scene_generation", "processing");
    const allStoryboards = storyboardScenes.flatMap((s) => s.storyboards);
    const sceneTasks: Array<{ id: string; taskId: string }> = [];
    for (const sb of allStoryboards) {
      try {
        const taskId = await generateSceneImage(sb, imageModel, artStyle);
        sceneTasks.push({ id: sb.id, taskId });
      } catch (err) {
        console.error(`Scene image failed for ${sb.id}:`, err);
      }
    }

    await supabase.from("assets").insert({
      user_id: userId,
      type: "text",
      name: `${script.title} - 场景图任务`,
      url: "",
      metadata: { tasks: sceneTasks, model: imageModel, pipeline_id: pipelineId },
    });
    await updateStep(3, "scene_generation", sceneTasks.length > 0 ? "completed" : "failed");

    // Step 5: 视频生成（需要等图片完成拿到URL）
    // 标记状态，实际需要轮询图片完成后再执行
    await updateStep(4, "video_generation", "pending");

    await supabase
      .from("pipeline_runs")
      .update({ status: "partial", current_step: 4 })
      .eq("id", pipelineId);

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Pipeline failed:", errorMsg);
    await supabase
      .from("pipeline_runs")
      .update({ status: "failed" })
      .eq("id", pipelineId);
  }
}
