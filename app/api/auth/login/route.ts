import { NextResponse, type NextRequest } from "next/server";

import { getAppPasswords, parseRole } from "@/lib/auth/passwords";
import { buildSessionCookie, signSession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const role = parseRole(String(form.get("role") ?? ""));
  const password = String(form.get("password") ?? "");
  const nextRaw = String(form.get("next") ?? "/");
  const nextPath = nextRaw.startsWith("/") ? nextRaw : "/";

  const passwords = getAppPasswords();
  if (password !== passwords[role]) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }

  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 8;
  const token = await signSession({ role, exp });
  const cookie = buildSessionCookie(token);

  const res = NextResponse.redirect(new URL(nextPath, req.url));
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
