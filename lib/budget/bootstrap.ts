import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { CLASS_TOTAL_DEPARTMENT, DEPARTMENTS } from "./depts";

export async function ensureBudgetAccounts(sb: SupabaseClient, classCode: string) {
  const { data, error } = await sb.from("budget_accounts").select("department").eq("class_code", classCode);
  if (error) throw error;

  const existing = new Set((data ?? []).map((r) => String((r as { department: unknown }).department)));

  const rows: Array<Record<string, unknown>> = [];
  if (!existing.has(CLASS_TOTAL_DEPARTMENT)) {
    rows.push({ class_code: classCode, department: CLASS_TOTAL_DEPARTMENT, allocated_amount: 0, spent_amount: 0, fine_amount: 0 });
  }
  for (const d of DEPARTMENTS) {
    if (!existing.has(d)) {
      rows.push({ class_code: classCode, department: d, allocated_amount: 0, spent_amount: 0, fine_amount: 0 });
    }
  }

  if (rows.length === 0) return;

  const ins = await sb.from("budget_accounts").insert(rows);
  if (ins.error) throw ins.error;
}
