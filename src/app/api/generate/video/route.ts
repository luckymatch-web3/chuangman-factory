import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { prompt, source_image, duration = 5, motion_style } = body;

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const creditsCost = 20;

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (!profile || profile.credits < creditsCost) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  await supabase.from("profiles").update({ credits: profile.credits - creditsCost }).eq("id", user.id);

  const { data: task, error } = await supabase
    .from("generation_tasks")
    .insert({
      user_id: user.id,
      type: "video",
      model: "sora2",
      status: "pending",
      params: { prompt, source_image: !!source_image, duration, motion_style },
      credits_cost: creditsCost,
    })
    .select("id")
    .single();

  if (error) {
    await supabase.from("profiles").update({ credits: profile.credits }).eq("id", user.id);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }

  await supabase.from("credit_transactions").insert({
    user_id: user.id,
    amount: -creditsCost,
    type: "consume",
    description: `Sora 2 视频生成 ${duration}s`,
    task_id: task.id,
  });

  return NextResponse.json({ task_id: task.id, credits_cost: creditsCost });
}
