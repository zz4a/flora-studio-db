import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { User } from "@/types";
import { ensureDatabase, findUserById } from "@/lib/db";

const COOKIE_NAME = "flora_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;
const SECRET = process.env.SESSION_SECRET || "dev-only-change-this-session-secret-before-production-2026";

function signature(value: string): string {
  if (process.env.NODE_ENV === "production" && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) {
    throw new Error("SESSION_SECRET must be configured with at least 32 characters in production.");
  }
  return createHmac("sha256", SECRET).update(value).digest("base64url");
}

function isValidToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [userIdEncoded, expiryText, suppliedSignature] = parts;
  const signed = `${userIdEncoded}.${expiryText}`;
  const expected = signature(signed);
  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(suppliedSignature);
  if (expectedBuffer.length !== suppliedBuffer.length || !timingSafeEqual(expectedBuffer, suppliedBuffer)) return null;
  const expiry = Number(expiryText);
  if (!Number.isFinite(expiry) || expiry <= Math.floor(Date.now() / 1000)) return null;
  try { return Buffer.from(userIdEncoded, "base64url").toString("utf8"); } catch { return null; }
}

export function setSession(userId: string): void {
  const expiry = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const encodedId = Buffer.from(userId, "utf8").toString("base64url");
  const signed = `${encodedId}.${expiry}`;
  cookies().set(COOKIE_NAME, `${signed}.${signature(signed)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export function clearSession(): void {
  cookies().set(COOKIE_NAME, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}

export async function getAuthenticatedUser(): Promise<User | null> {
  await ensureDatabase();
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  const userId = isValidToken(token);
  if (!userId) return null;
  return findUserById(userId);
}
