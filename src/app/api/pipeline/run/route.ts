import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { text, image_model = "nanobanner", enable_lip_sync = true } = body;

  if (!text?.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  // Estimate credits: scene_split(free) + images + videos + lip_sync
  const estimatedScenes = Math.max(3, Math.min(20, Math.ceil(text.length / 200)));
  const imgCost = image_model === "midjourney" ? 5 : 2;
  const estimatedCredits = estimatedScenes * imgCost + estimatedScenes * 20 + (enable_lip_sync ? estimatedScenes * 10 : 0);

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

  const steps = [
    { id: "text_input", status: "completed" },
    { id: "scene_split", status: "pending" },
    { id: "image_gen", status: "pending" },
    { id: "video_gen", status: "pending" },
    ...(enable_lip_sync ? [{ id: "lip_sync", status: "pending" }] : []),
    { id: "compose", status: "pending" },
  ];

  const { data: pipeline, error } = await supabase
    .from("pipeline_runs")
    .insert({
      user_id: user.id,
      name: `流水线 - ${new Date().toLocaleString("zh-CN")}`,
      status: "pending",
      steps: JSON.stringify(steps),
      current_step: 0,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create pipeline" }, { status: 500 });
  }

  // Create generation task for tracking
  const { data: task } = await supabase
    .from("generation_tasks")
    .insert({
      user_id: user.id,
      type: "pipeline",
      model: image_model,
      status: "pending",
      params: { text_length: text.length, image_model, enable_lip_sync, estimated_scenes: estimatedScenes, pipeline_id: pipeline.id },
      credits_cost: estimatedCredits,
    })
    .select("id")
    .single();

  // Deduct credits
  await supabase.from("profiles").update({ credits: profile.credits - estimatedCredits }).eq("id", user.id);

  await supabase.from("credit_transactions").insert({
    user_id: user.id,
    amount: -estimatedCredits,
    type: "consume",
    description: `自动化流水线 (${estimatedScenes}场景)`,
    task_id: task?.id,
  });

  return NextResponse.json({
    task_id: task?.id,
    pipeline_id: pipeline.id,
    estimated_scenes: estimatedScenes,
    credits_cost: estimatedCredits,
  });
}
