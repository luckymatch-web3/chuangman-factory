import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, trigger_word, images } = body;

  if (!name?.trim() || !images?.length || images.length < 5) {
    return NextResponse.json({ error: "Name and at least 5 images required" }, { status: 400 });
  }

  const creditsCost = 50;

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (!profile || profile.credits < creditsCost) {
    return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
  }

  await supabase.from("profiles").update({ credits: profile.credits - creditsCost }).eq("id", user.id);

  // Create LoRA model record
  const { data: lora } = await supabase
    .from("lora_models")
    .insert({
      user_id: user.id,
      name,
      status: "pending",
      training_images: images.map((_: string, i: number) => `image_${i}`),
    })
    .select("id")
    .single();

  // Create task
  const { data: task, error } = await supabase
    .from("generation_tasks")
    .insert({
      user_id: user.id,
      type: "lora_train",
      model: "lora",
      status: "pending",
      params: { name, trigger_word, image_count: images.length, lora_id: lora?.id },
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
    description: `LoRA训练 - ${name}`,
    task_id: task.id,
  });

  return NextResponse.json({ task_id: task.id, lora_id: lora?.id, credits_cost: creditsCost });
}
