import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { model, prompt, negative_prompt, style, ratio, batch_size = 1 } = body;

  if (!prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const creditsCost = model === "midjourney" ? 5 * batch_size : 2 * batch_size;

  // Check credits
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (!profile || profile.credits < creditsCost) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  // Deduct credits
  await supabase.from("profiles").update({ credits: profile.credits - creditsCost }).eq("id", user.id);

  // Create task
  const { data: task, error } = await supabase
    .from("generation_tasks")
    .insert({
      user_id: user.id,
      type: "image",
      model,
      status: "pending",
      params: { prompt, negative_prompt, style, ratio, batch_size },
      credits_cost: creditsCost,
    })
    .select("id")
    .single();

  if (error) {
    // Refund credits on failure
    await supabase.from("profiles").update({ credits: profile.credits }).eq("id", user.id);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }

  // Record transaction
  await supabase.from("credit_transactions").insert({
    user_id: user.id,
    amount: -creditsCost,
    type: "consume",
    description: `${model} 图片生成 x${batch_size}`,
    task_id: task.id,
  });

  // TODO: Trigger actual AI generation via external API
  // For now, simulate by updating task status after delay
  setTimeout(async () => {
    await supabase
      .from("generation_tasks")
      .update({ status: "processing", updated_at: new Date().toISOString() })
      .eq("id", task.id);
  }, 1000);

  return NextResponse.json({ task_id: task.id, credits_cost: creditsCost });
}
