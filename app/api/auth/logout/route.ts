import { NextResponse, type NextRequest } from "next/server";

import { buildClearSessionCookie } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  const cookie = buildClearSessionCookie();
  const res = NextResponse.redirect(new URL("/login", req.url));
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
