import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { ratelimit } from "@/lib/ratelimit";
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSession,
  isEmailAllowed,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success: rateLimitSuccess } = await ratelimit.limit(`admin-login:${ip}`);

    if (!rateLimitSuccess) {
      return NextResponse.json({ error: "For mange forsøg — prøv igen om lidt" }, { status: 429 });
    }

    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Udfyld e-mail og adgangskode" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Supabase er ikke konfigureret på serveren" }, { status: 500 });
    }

    // Demo-login lokalt, når Supabase-URL'en er placeholderen — samme
    // konvention som formularernes mock-insert. Kan aldrig rammes i drift.
    if (url.includes("your-project.supabase.co")) {
      const demoSession = createAdminSession(email);
      if (demoSession) {
        cookies().set(ADMIN_COOKIE, demoSession, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          path: "/",
          maxAge: ADMIN_SESSION_MAX_AGE,
        });
        return NextResponse.json({ success: true, demo: true });
      }
    }

    // Samme fejlbesked uanset årsag, så gyldige e-mails ikke kan gættes
    const invalid = NextResponse.json({ error: "Forkert e-mail eller adgangskode" }, { status: 401 });

    if (!isEmailAllowed(email)) return invalid;

    // Verificér login mod Supabase Auth. Sessionen fra Supabase bruges ikke —
    // vi udsteder vores egen cookie via createAdminSession.
    const authClient = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await authClient.auth.signInWithPassword({ email, password });

    if (error || !data?.user) return invalid;

    const userEmail = data.user.email ?? email;
    if (!isEmailAllowed(userEmail)) return invalid;

    const session = createAdminSession(userEmail);
    if (!session) {
      return NextResponse.json({ error: "Supabase er ikke konfigureret på serveren" }, { status: 500 });
    }

    cookies().set(ADMIN_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: ADMIN_SESSION_MAX_AGE,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Der skete en fejl — prøv igen" }, { status: 500 });
  }
}

export async function DELETE() {
  cookies().delete(ADMIN_COOKIE);
  return NextResponse.json({ success: true });
}
