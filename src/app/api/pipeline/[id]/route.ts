import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: pipeline } = await supabase
    .from("pipeline_runs")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!pipeline) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: pipeline.id,
    name: pipeline.name,
    status: pipeline.status,
    current_step: pipeline.current_step,
    steps: JSON.parse(pipeline.steps || "[]"),
    created_at: pipeline.created_at,
  });
}
