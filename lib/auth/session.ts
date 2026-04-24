import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";

const RoleSchema = z.enum(["교사", "총무", "부장", "감사원"]);
export type AppRole = z.infer<typeof RoleSchema>;

const COOKIE_NAME = "classgov_session";

export interface SessionPayload {
  role: AppRole;
  exp: number; // unix seconds
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET ?? "";
  if (!secret) {
    throw new Error("SESSION_SECRET is not set");
  }
  return secret;
}

function toBase64Url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function fromBase64Url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Buffer.from(sig).toString("hex");
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const secret = getSessionSecret();
  const body = toBase64Url(JSON.stringify(payload));
  const sig = await hmacSha256Hex(secret, body);
  return `${body}.${sig}`;
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  const secret = getSessionSecret();
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = await hmacSha256Hex(secret, body);
  if (sig !== expected) return null;

  try {
    const parsed = JSON.parse(fromBase64Url(body)) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const obj = parsed as { role?: unknown; exp?: unknown };
    const role = RoleSchema.parse(String(obj.role));
    const exp = Number(obj.exp);
    if (!Number.isFinite(exp)) return null;
    if (Math.floor(Date.now() / 1000) > exp) return null;
    return { role, exp };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function buildSessionCookie(token: string): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8
    }
  };
}

export function buildClearSessionCookie(): { name: string; value: string; options: Record<string, unknown> } {
  return {
    name: COOKIE_NAME,
    value: "",
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0
    }
  };
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  const c = buildSessionCookie(token);
  cookieStore.set(c.name, c.value, c.options);
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  const c = buildClearSessionCookie();
  cookieStore.set(c.name, c.value, c.options);
}
