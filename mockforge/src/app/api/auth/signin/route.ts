import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.json(
      { ok: false, error: "AUTH_NOT_CONFIGURED", message: "Auth is not configured on this instance." },
      { status: 501 },
    );
  }

  const { email } = await request.json().catch(() => ({}));

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "INVALID_EMAIL", message: "A valid email address is required." },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: "SIGNIN_FAILED", message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Magic link sent. Check your email.",
  });
}
