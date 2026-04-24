import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

export type BudgetEventAction =
  | "SET_CLASS_TOTAL"
  | "ASSIGN_DEPT_BUDGET"
  | "REQUEST_CREATE"
  | "REQUEST_APPROVE"
  | "REQUEST_REJECT"
  | "FINE_ADD"
  | "FINE_REDUCE"
  | "FINE_AMNESTY";

export async function insertBudgetEvent(
  sb: SupabaseClient,
  input: {
    classCode: string;
    actorRole: string;
    action: BudgetEventAction;
    department?: string | null;
    amount?: bigint | number | null;
    item?: string | null;
    status?: string | null;
    note?: string | null;
  }
) {
  const row = {
    class_code: input.classCode,
    actor_role: input.actorRole,
    action: input.action,
    department: input.department ?? null,
    amount: input.amount === null || input.amount === undefined ? null : Number(input.amount),
    item: input.item ?? null,
    status: input.status ?? null,
    note: input.note ?? null
  };

  const res = await sb.from("budget_events").insert(row);
  if (res.error) throw res.error;
}
