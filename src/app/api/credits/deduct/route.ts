import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { amount, description, task_id } = body;

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (!profile || profile.credits < amount) {
    return NextResponse.json({ error: "Insufficient credits", current: profile?.credits || 0 }, { status: 402 });
  }

  const newCredits = profile.credits - amount;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ credits: newCredits, updated_at: new Date().toISOString() })
    .eq("id", user.id)
    .eq("credits", profile.credits); // Optimistic locking

  if (updateError) {
    return NextResponse.json({ error: "Failed to deduct credits, please retry" }, { status: 409 });
  }

  await supabase.from("credit_transactions").insert({
    user_id: user.id,
    amount: -amount,
    type: "consume",
    description: description || "积分消费",
    task_id,
  });

  return NextResponse.json({ remaining: newCredits });
}
