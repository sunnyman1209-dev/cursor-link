"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/auth/session";
import { getClassCode } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function createStudent(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const name = String(formData.get("name") ?? "").trim();
  const numberRaw = String(formData.get("number") ?? "").trim();
  const hasNumber = String(formData.get("has_number") ?? "") === "on";

  if (!name) throw new Error("이름은 필수입니다.");

  const classCode = getClassCode();
  const sb = getSupabaseAdmin();

  const payload: Record<string, unknown> = { class_code: classCode, name };
  if (hasNumber && numberRaw) payload.number = Number(numberRaw);

  const res = await sb.from("students").insert(payload);
  if (res.error) throw res.error;

  revalidatePath("/points");
}

export async function addPoint(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const studentId = String(formData.get("student_id") ?? "");
  const kind = String(formData.get("kind") ?? "");
  const points = Number(String(formData.get("points") ?? ""));
  const reason = String(formData.get("reason") ?? "").trim();

  if (!studentId) throw new Error("student_id is required");
  if (!Number.isFinite(points) || points <= 0) throw new Error("points invalid");
  if (!reason) throw new Error("사유는 필수입니다.");

  const delta = kind === "reward" ? Math.floor(points) : -Math.floor(points);

  const classCode = getClassCode();
  const sb = getSupabaseAdmin();

  const res = await sb.from("point_ledger").insert({
    class_code: classCode,
    student_id: studentId,
    delta,
    reason,
    created_by: session.role
  });
  if (res.error) throw res.error;

  revalidatePath("/points");
}
