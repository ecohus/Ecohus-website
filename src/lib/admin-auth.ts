import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ecohus_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 dage

// Login verificeres mod Supabase Auth (se /api/admin/login). Herefter udstedes
// en egen HMAC-signeret session-cookie, signeret med service role-nøglen, så
// der ikke kræves en separat session-secret.
function signingSecret(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// Valgfri allowlist: ADMIN_ALLOWED_EMAILS="a@b.dk, c@d.dk". Hvis den ikke er
// sat, har alle brugere i Supabase Auth adgang — offentlig signup skal i så
// fald være slået fra i Supabase (se SUPABASE-OPSAETNING.md).
export function isEmailAllowed(email: string): boolean {
  const allowlist = process.env.ADMIN_ALLOWED_EMAILS;
  if (!allowlist) return true;
  return allowlist
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}

export function createAdminSession(email: string): string | null {
  const secret = signingSecret();
  if (!secret) return null;
  const exp = Date.now() + ADMIN_SESSION_MAX_AGE * 1000;
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function isAdminAuthenticated(): boolean {
  const secret = signingSecret();
  if (!secret) return false;

  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  if (!safeEqual(signature, sign(payload, secret))) return false;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof data.exp !== "number" || Date.now() > data.exp) return false;
    if (typeof data.email !== "string" || !isEmailAllowed(data.email)) return false;
    return true;
  } catch {
    return false;
  }
}
