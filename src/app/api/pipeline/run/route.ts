import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { novelToScript, scriptToStoryboard } from "@/lib/ai/pipeline";
import type { PipelineStage } from "@/lib/ai/pipeline";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { text, input_type = "novel" } = body;
  // input_type: "novel" | "script" | "original"

  if (!text?.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  // 估算积分：文本处理(5) + 角色设计(每个5) + 分镜图(每张3) + 视频(每段10)
  const estimatedScenes = Math.max(3, Math.min(20, Math.ceil(text.length / 200)));
  const estimatedCharacters = Math.max(2, Math.min(6, Math.ceil(estimatedScenes / 3)));
  const estimatedStoryboards = estimatedScenes * 4; // 平均每场景4个分镜
  const estimatedCredits =
    5 + // 文本处理
    estimatedCharacters * 5 + // 角色设计
    estimatedStoryboards * 3 + // 分镜图片
    estimatedStoryboards * 10; // 视频

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

  // 创建pipeline记录
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

  // 扣积分
  await supabase.from("profiles").update({ credits: profile.credits - estimatedCredits }).eq("id", user.id);
  await supabase.from("credit_transactions").insert({
    user_id: user.id,
    amount: -estimatedCredits,
    type: "consume",
    description: `创漫Agent (${estimatedScenes}场景, ${estimatedStoryboards}分镜)`,
  });

  // 异步执行pipeline（不阻塞响应）
  executePipeline(pipeline.id, user.id, text, input_type, supabase).catch(console.error);

  return NextResponse.json({
    pipeline_id: pipeline.id,
    estimated_scenes: estimatedScenes,
    estimated_storyboards: estimatedStoryboards,
    credits_cost: estimatedCredits,
  });
}

/** 异步执行完整pipeline */
async function executePipeline(
  pipelineId: string,
  userId: string,
  text: string,
  inputType: string,
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
      // 标记之前步骤为completed
      for (let i = 0; i < stepIndex; i++) steps[i].status = "completed";
      steps[stepIndex].status = status;
      await supabase
        .from("pipeline_runs")
        .update({ steps: JSON.stringify(steps), current_step: stepIndex, status: stage === "failed" ? "failed" : "processing" })
        .eq("id", pipelineId);
    }
  };

  try {
    // Step 1: 小说/剧本 → 结构化剧本
    await updateStep(0, "novel_to_script", "processing");
    const script = await novelToScript(text);

    // 保存剧本到assets
    await supabase.from("assets").insert({
      user_id: userId,
      type: "text",
      name: `${script.title} - 剧本`,
      url: "", // 文本类型存储在metadata
      metadata: { content: script, pipeline_id: pipelineId },
    });

    await updateStep(0, "novel_to_script", "completed");

    // Step 2: 剧本 → 分镜
    await updateStep(1, "script_to_storyboard", "processing");
    const storyboardScenes = [];
    for (const scene of script.scenes) {
      const sb = await scriptToStoryboard(scene);
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

    // Step 3-5: 图片和视频生成（需要真实API Key才能运行）
    // 先标记为pending，等API Key配置后自动执行
    await updateStep(2, "character_design", "pending");

    // 完成文本阶段后更新状态
    await supabase
      .from("pipeline_runs")
      .update({
        status: "partial",
        current_step: 2,
      })
      .eq("id", pipelineId);

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    await supabase
      .from("pipeline_runs")
      .update({ status: "failed", error_message: errorMsg })
      .eq("id", pipelineId);
  }
}
