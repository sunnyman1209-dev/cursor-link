"use server";

import { revalidatePath } from "next/cache";

import { getDeptPasswords } from "@/lib/auth/passwords";
import { getSession } from "@/lib/auth/session";
import { CLASS_TOTAL_DEPARTMENT, DEPARTMENTS, type Department } from "@/lib/budget/depts";
import { ensureBudgetAccounts } from "@/lib/budget/bootstrap";
import { insertBudgetEvent } from "@/lib/budget/events";
import { getClassCode } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

function requireRole(sessionRole: string, allowed: string[]) {
  if (!allowed.includes(sessionRole)) throw new Error("Forbidden");
}

function parseDept(input: string): Department | typeof CLASS_TOTAL_DEPARTMENT {
  if (input === CLASS_TOTAL_DEPARTMENT) return CLASS_TOTAL_DEPARTMENT;
  if ((DEPARTMENTS as readonly string[]).includes(input)) return input as Department;
  throw new Error("invalid_department");
}

function verifyDeptPassword(chairDept: string, deptPassword: string) {
  const deptPasswords = getDeptPasswords();
  if (!deptPasswords[chairDept]) throw new Error("dept_password_not_configured");
  if (deptPasswords[chairDept] !== deptPassword) throw new Error("invalid_dept_password");
}

export async function setClassTotal(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  requireRole(session.role, ["교사"]);

  const total = BigInt(Math.floor(Number(String(formData.get("total") ?? ""))));

  const classCode = getClassCode();
  const sb = getSupabaseAdmin();
  await ensureBudgetAccounts(sb, classCode);

  const up = await sb
    .from("budget_accounts")
    .update({ allocated_amount: Number(total), updated_at: new Date().toISOString() })
    .eq("class_code", classCode)
    .eq("department", CLASS_TOTAL_DEPARTMENT);
  if (up.error) throw up.error;

  await insertBudgetEvent(sb, {
    classCode,
    actorRole: session.role,
    action: "SET_CLASS_TOTAL",
    department: CLASS_TOTAL_DEPARTMENT,
    amount: total,
    note: "학급 총 운영비 설정"
  });

  revalidatePath("/budget");
}

export async function assignDeptBudget(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  requireRole(session.role, ["총무"]);

  const dept = parseDept(String(formData.get("department") ?? ""));
  if (dept === CLASS_TOTAL_DEPARTMENT) throw new Error("invalid_department");

  const allocated = BigInt(Math.floor(Number(String(formData.get("allocated") ?? ""))));

  const classCode = getClassCode();
  const sb = getSupabaseAdmin();
  await ensureBudgetAccounts(sb, classCode);

  const up = await sb
    .from("budget_accounts")
    .update({ allocated_amount: Number(allocated), updated_at: new Date().toISOString() })
    .eq("class_code", classCode)
    .eq("department", dept);
  if (up.error) throw up.error;

  await insertBudgetEvent(sb, {
    classCode,
    actorRole: session.role,
    action: "ASSIGN_DEPT_BUDGET",
    department: dept,
    amount: allocated,
    note: "부처 예산 배정"
  });

  revalidatePath("/budget");
}

export async function submitBudgetRequest(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  requireRole(session.role, ["부장"]);

  const dept = parseDept(String(formData.get("department") ?? ""));
  if (dept === CLASS_TOTAL_DEPARTMENT) throw new Error("invalid_department");

  const item = String(formData.get("item") ?? "").trim();
  const amount = BigInt(Math.floor(Number(String(formData.get("amount") ?? ""))));
  if (!item) throw new Error("item_required");

  const classCode = getClassCode();
  const sb = getSupabaseAdmin();
  await ensureBudgetAccounts(sb, classCode);

  const ins = await sb.from("budget_requests").insert({
    class_code: classCode,
    department: dept,
    item,
    amount: Number(amount),
    status: "대기"
  });
  if (ins.error) throw ins.error;

  await insertBudgetEvent(sb, {
    classCode,
    actorRole: session.role,
    action: "REQUEST_CREATE",
    department: dept,
    amount,
    item,
    status: "대기"
  });

  revalidatePath("/budget");
}

export async function approveBudgetRequest(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  requireRole(session.role, ["총무"]);

  const requestId = String(formData.get("request_id") ?? "");
  if (!requestId) throw new Error("request_id_required");

  const classCode = getClassCode();
  const sb = getSupabaseAdmin();
  await ensureBudgetAccounts(sb, classCode);

  const reqRes = await sb.from("budget_requests").select("id,department,item,amount,status").eq("id", requestId).single();
  if (reqRes.error) throw reqRes.error;
  const req = reqRes.data as { id: string; department: string; item: string; amount: number; status: string };
  if (req.status !== "대기") throw new Error("not_pending");

  const upReq = await sb.from("budget_requests").update({ status: "승인" }).eq("id", requestId).eq("class_code", classCode);
  if (upReq.error) throw upReq.error;

  const acc = await sb.from("budget_accounts").select("spent_amount").eq("class_code", classCode).eq("department", req.department).single();
  if (acc.error) throw acc.error;
  const spent = BigInt(Math.floor(Number((acc.data as { spent_amount: unknown }).spent_amount)));
  const nextSpent = spent + BigInt(Math.floor(req.amount));

  const upAcc = await sb
    .from("budget_accounts")
    .update({ spent_amount: Number(nextSpent), updated_at: new Date().toISOString() })
    .eq("class_code", classCode)
    .eq("department", req.department);
  if (upAcc.error) throw upAcc.error;

  await insertBudgetEvent(sb, {
    classCode,
    actorRole: session.role,
    action: "REQUEST_APPROVE",
    department: req.department,
    amount: BigInt(Math.floor(req.amount)),
    item: req.item,
    status: "승인"
  });

  revalidatePath("/budget");
}

export async function rejectBudgetRequest(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  requireRole(session.role, ["총무"]);

  const requestId = String(formData.get("request_id") ?? "");
  if (!requestId) throw new Error("request_id_required");

  const classCode = getClassCode();
  const sb = getSupabaseAdmin();
  await ensureBudgetAccounts(sb, classCode);

  const reqRes = await sb.from("budget_requests").select("id,department,item,amount,status").eq("id", requestId).single();
  if (reqRes.error) throw reqRes.error;
  const req = reqRes.data as { id: string; department: string; item: string; amount: number; status: string };
  if (req.status !== "대기") throw new Error("not_pending");

  const upReq = await sb.from("budget_requests").update({ status: "반려" }).eq("id", requestId).eq("class_code", classCode);
  if (upReq.error) throw upReq.error;

  await insertBudgetEvent(sb, {
    classCode,
    actorRole: session.role,
    action: "REQUEST_REJECT",
    department: req.department,
    amount: BigInt(Math.floor(req.amount)),
    item: req.item,
    status: "반려"
  });

  revalidatePath("/budget");
}

export async function addFine(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  requireRole(session.role, ["부장"]);

  const chairDept = String(formData.get("chair_department") ?? "");
  if (chairDept !== "인성예절부") throw new Error("Forbidden");

  verifyDeptPassword(chairDept, String(formData.get("dept_password") ?? ""));

  const target = parseDept(String(formData.get("target_department") ?? ""));
  if (target === CLASS_TOTAL_DEPARTMENT) throw new Error("invalid_department");

  const amt = BigInt(Math.floor(Number(String(formData.get("amount") ?? ""))));

  const classCode = getClassCode();
  const sb = getSupabaseAdmin();
  await ensureBudgetAccounts(sb, classCode);

  const acc = await sb.from("budget_accounts").select("fine_amount").eq("class_code", classCode).eq("department", target).single();
  if (acc.error) throw acc.error;
  const fine = BigInt(Math.floor(Number((acc.data as { fine_amount: unknown }).fine_amount)));
  const nextFine = fine + amt;

  const up = await sb
    .from("budget_accounts")
    .update({ fine_amount: Number(nextFine), updated_at: new Date().toISOString() })
    .eq("class_code", classCode)
    .eq("department", target);
  if (up.error) throw up.error;

  await insertBudgetEvent(sb, {
    classCode,
    actorRole: session.role,
    action: "FINE_ADD",
    department: target,
    amount: amt,
    note: `인성예절부(인증) → ${target}`
  });

  revalidatePath("/budget");
}

export async function reduceFine(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  requireRole(session.role, ["부장"]);

  const chairDept = String(formData.get("chair_department") ?? "");
  if (chairDept !== "봉사부") throw new Error("Forbidden");

  verifyDeptPassword(chairDept, String(formData.get("dept_password") ?? ""));

  const target = parseDept(String(formData.get("target_department") ?? ""));
  if (target === CLASS_TOTAL_DEPARTMENT) throw new Error("invalid_department");

  const amt = BigInt(Math.floor(Number(String(formData.get("amount") ?? ""))));

  const classCode = getClassCode();
  const sb = getSupabaseAdmin();
  await ensureBudgetAccounts(sb, classCode);

  const acc = await sb.from("budget_accounts").select("fine_amount").eq("class_code", classCode).eq("department", target).single();
  if (acc.error) throw acc.error;
  const fine = BigInt(Math.floor(Number((acc.data as { fine_amount: unknown }).fine_amount)));
  const nextFine = fine - amt < 0n ? 0n : fine - amt;

  const up = await sb
    .from("budget_accounts")
    .update({ fine_amount: Number(nextFine), updated_at: new Date().toISOString() })
    .eq("class_code", classCode)
    .eq("department", target);
  if (up.error) throw up.error;

  await insertBudgetEvent(sb, {
    classCode,
    actorRole: session.role,
    action: "FINE_REDUCE",
    department: target,
    amount: amt,
    note: `봉사부(인증) → ${target}`
  });

  revalidatePath("/budget");
}

export async function amnestyFine(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  requireRole(session.role, ["부장"]);

  const chairDept = String(formData.get("chair_department") ?? "");
  if (chairDept !== "선교부") throw new Error("Forbidden");

  verifyDeptPassword(chairDept, String(formData.get("dept_password") ?? ""));

  const target = parseDept(String(formData.get("target_department") ?? ""));
  if (target === CLASS_TOTAL_DEPARTMENT) throw new Error("invalid_department");

  const classCode = getClassCode();
  const sb = getSupabaseAdmin();
  await ensureBudgetAccounts(sb, classCode);

  const up = await sb
    .from("budget_accounts")
    .update({ fine_amount: 0, updated_at: new Date().toISOString() })
    .eq("class_code", classCode)
    .eq("department", target);
  if (up.error) throw up.error;

  await insertBudgetEvent(sb, {
    classCode,
    actorRole: session.role,
    action: "FINE_AMNESTY",
    department: target,
    amount: 0,
    note: `선교부(인증) 사면 → ${target}`
  });

  revalidatePath("/budget");
}
