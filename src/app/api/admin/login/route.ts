import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ratelimit } from "@/lib/ratelimit";
import { ADMIN_COOKIE, adminSessionToken, verifyAdminPassword } from "@/lib/admin-auth";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 dage

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success: rateLimitSuccess } = await ratelimit.limit(`admin-login:${ip}`);

    if (!rateLimitSuccess) {
      return NextResponse.json({ error: "For mange forsøg — prøv igen om lidt" }, { status: 429 });
    }

    const body = await req.json();
    const password = typeof body?.password === "string" ? body.password : "";

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "ADMIN_PASSWORD er ikke konfigureret på serveren" }, { status: 500 });
    }

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Forkert adgangskode" }, { status: 401 });
    }

    cookies().set(ADMIN_COOKIE, adminSessionToken()!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
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
