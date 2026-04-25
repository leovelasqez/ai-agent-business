import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  createAnonymousSession,
  createSignedSessionValue,
  getSessionCookieOptions,
  verifySignedSessionValue,
} from "@/lib/session";

const LANG_COOKIE = "mf_lang";
const SUPPORTED_LANGS = ["en", "es", "fr", "pt", "de"] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function resolveLang(acceptLanguage: string | null): SupportedLang {
  if (!acceptLanguage) return "en";
  const primary = acceptLanguage.split(",")[0]?.trim().toLowerCase() ?? "";
  const base = primary.split("-")[0] as SupportedLang;
  return (SUPPORTED_LANGS as readonly string[]).includes(base) ? base : "en";
}

export async function proxy(request: NextRequest) {
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.NEXT_PUBLIC_ENABLE_DEBUG_UPLOAD_PAGE &&
    (request.nextUrl.pathname === "/debug/upload" || request.nextUrl.pathname === "/api/debug/upload")
  ) {
    return NextResponse.json({ ok: false, error: "NOT_FOUND" }, { status: 404 });
  }

  // --- Supabase auth session refresh ---
  let supabaseResponse = NextResponse.next({ request });

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // Refresh session so it doesn't expire mid-session.
    await supabase.auth.getUser();
  }

  // --- Anonymous session cookie (mf_session) ---
  const rawSessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const trustedSessionId = verifySignedSessionValue(rawSessionCookie);
  if (!trustedSessionId) {
    const nextSession =
      rawSessionCookie && /^[a-z0-9-]{16,128}$/i.test(rawSessionCookie)
        ? { sessionId: rawSessionCookie, cookieValue: createSignedSessionValue(rawSessionCookie) }
        : createAnonymousSession();

    request.cookies.set(SESSION_COOKIE, nextSession.cookieValue);
    supabaseResponse.cookies.set(SESSION_COOKIE, nextSession.cookieValue, getSessionCookieOptions());
  }

  // --- Language cookie (mf_lang) ---
  // Seed on first visit from Accept-Language so SSR and client agree.
  if (!request.cookies.has(LANG_COOKIE)) {
    const lang = resolveLang(request.headers.get("accept-language"));
    supabaseResponse.cookies.set(LANG_COOKIE, lang, {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: ONE_YEAR_SECONDS,
      path: "/",
    });
    request.cookies.set(LANG_COOKIE, lang);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and images.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
