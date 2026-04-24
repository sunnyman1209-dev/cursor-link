import "server-only";

import { z } from "zod";

const RoleSchema = z.enum(["교사", "총무", "부장", "감사원"]);
export type AppRole = z.infer<typeof RoleSchema>;

const PasswordMapSchema = z.record(z.string(), z.string());

export function getAppPasswords(): Record<AppRole, string> {
  const raw = process.env.APP_PASSWORDS ?? "";
  if (!raw.trim()) {
    throw new Error("APP_PASSWORDS is not set");
  }

  const parsed = JSON.parse(raw) as unknown;
  const map = PasswordMapSchema.parse(parsed);

  const roles: AppRole[] = ["교사", "총무", "부장", "감사원"];
  const out: Partial<Record<AppRole, string>> = {};
  for (const r of roles) {
    const v = map[r];
    if (typeof v !== "string" || v.length === 0) {
      throw new Error(`APP_PASSWORDS missing role: ${r}`);
    }
    out[r] = v;
  }

  return out as Record<AppRole, string>;
}

export function getDeptPasswords(): Record<string, string> {
  const raw = process.env.APP_DEPT_PASSWORDS ?? "";
  if (!raw.trim()) return {};
  const parsed = JSON.parse(raw) as unknown;
  return PasswordMapSchema.parse(parsed);
}

export function parseRole(input: string): AppRole {
  return RoleSchema.parse(input);
}
