import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ecohus_admin_session";

// Deterministic session token derived from the admin password. Changing
// ADMIN_PASSWORD invalidates all existing sessions.
export function adminSessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("ecohus-admin-session-v1").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !password) return false;
  return safeEqual(password, expected);
}

export function isAdminAuthenticated(): boolean {
  const expected = adminSessionToken();
  if (!expected) return false;
  const token = cookies().get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return safeEqual(token, expected);
}
