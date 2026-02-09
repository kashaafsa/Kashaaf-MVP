import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const Body = z.object({
  full_name: z.string().min(1).max(80),
  phone_number: z.string().min(6).max(25).optional().or(z.literal("")),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_.]+$/),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  let createdUserId: string | null = null;

  try {
    const parsed = Body.parse(await req.json());
    const username = parsed.username.toLowerCase().trim();
    const phone = parsed.phone_number?.trim() || null;

    const { data: existing, error: e0 } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (e0) return NextResponse.json({ ok: false, message: e0.message }, { status: 500 });
    if (existing) return NextResponse.json({ ok: false, message: "Username already taken." }, { status: 409 });

    const { data: created, error: e1 } = await supabaseAdmin.auth.admin.createUser({
      email: parsed.email,
      password: parsed.password,
      email_confirm: true,
      user_metadata: {
        full_name: parsed.full_name.trim(),
        username,
        phone_number: phone,
      },
    });

    if (e1) return NextResponse.json({ ok: false, message: e1.message }, { status: 400 });

    createdUserId = created.user?.id ?? null;
    if (!createdUserId) return NextResponse.json({ ok: false, message: "Auth user not created." }, { status: 500 });

    const { error: e2 } = await supabaseAdmin.from("profiles").insert({
      id: createdUserId,
      full_name: parsed.full_name.trim(),
      phone_number: phone,
      username,
    });

    if (e2) {
      await supabaseAdmin.auth.admin.deleteUser(createdUserId);
      return NextResponse.json(
        { ok: false, message: e2.message, code: (e2 as any).code ?? null },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (createdUserId) await supabaseAdmin.auth.admin.deleteUser(createdUserId);
    return NextResponse.json({ ok: false, message: e?.message ?? "Bad request" }, { status: 400 });
  }
}
