import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = String(body?.username ?? "").toLowerCase().trim();

    if (username.length < 3) {
      return NextResponse.json({ ok: false, message: "username too short" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({ ok: true, available: !data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e?.message ?? "server error" }, { status: 500 });
  }
}
