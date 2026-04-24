import { getSession } from "@/lib/auth/session";
import { getClassCode } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

import { addPoint, createStudent } from "./actions";

export default async function PointsPage() {
  const session = await getSession();
  if (!session) return null;

  const classCode = getClassCode();
  const sb = getSupabaseAdmin();

  const studentsRes = await sb.from("students").select("id,name,number").eq("class_code", classCode).order("name");
  if (studentsRes.error) throw studentsRes.error;
  const students = studentsRes.data ?? [];

  const ledgerRes = await sb
    .from("point_ledger")
    .select("id,student_id,delta,reason,created_at,created_by")
    .eq("class_code", classCode)
    .order("created_at", { ascending: false })
    .limit(50);
  if (ledgerRes.error) throw ledgerRes.error;
  const ledger = ledgerRes.data ?? [];

  const nameById = new Map(students.map((s) => [String((s as { id: unknown }).id), String((s as { name: unknown }).name)]));

  const totals = new Map<string, number>();
  for (const row of ledger) {
    const sid = String((row as { student_id: unknown }).student_id);
    const d = Number((row as { delta: unknown }).delta);
    totals.set(sid, (totals.get(sid) ?? 0) + (Number.isFinite(d) ? d : 0));
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">🏅 상벌점</h2>
            <p className="mt-1 text-sm text-slate-300">
              학급: <span className="font-semibold text-slate-100">{classCode}</span> · 로그인:{" "}
              <span className="font-semibold text-slate-100">{session.role}</span>
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
          <h3 className="text-lg font-extrabold">학생 추가</h3>
          <form action={createStudent} className="mt-4 space-y-3">
            <div>
              <label className="text-sm font-semibold text-slate-200">이름</label>
              <input name="name" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm" required />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-200">
              <input type="checkbox" name="has_number" />
              번호 입력
            </label>
            <div>
              <label className="text-sm font-semibold text-slate-200">번호</label>
              <input
                name="number"
                type="number"
                min={1}
                max={100}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
              />
            </div>
            <button className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-blue-500" type="submit">
              추가
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
          <h3 className="text-lg font-extrabold">상/벌점 기록</h3>
          <form action={addPoint} className="mt-4 space-y-3">
            <div>
              <label className="text-sm font-semibold text-slate-200">학생</label>
              <select name="student_id" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm" required>
                {students.length === 0 ? <option value="">학생이 없습니다</option> : null}
                {students.map((s) => {
                  const id = String((s as { id: unknown }).id);
                  const name = String((s as { name: unknown }).name);
                  const num = (s as { number?: unknown }).number;
                  const label = typeof num === "number" && Number.isFinite(num) ? `${name} (${num}번)` : name;
                  return (
                    <option key={id} value={id}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-slate-200">구분</label>
                <select name="kind" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm">
                  <option value="reward">상점(+)</option>
                  <option value="penalty">벌점(-)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-200">점수</label>
                <input
                  name="points"
                  type="number"
                  min={1}
                  max={100}
                  defaultValue={1}
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-200">사유</label>
              <input name="reason" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm" required />
            </div>

            <button className="w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-emerald-500" type="submit">
              저장
            </button>
          </form>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
        <h3 className="text-lg font-extrabold">누적 상벌점</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-slate-300">
              <tr>
                <th className="py-2">이름</th>
                <th className="py-2">번호</th>
                <th className="py-2">합계</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {students.length === 0 ? (
                <tr>
                  <td className="py-4 text-slate-300" colSpan={3}>
                    학생이 없습니다.
                  </td>
                </tr>
              ) : (
                students.map((s) => {
                  const id = String((s as { id: unknown }).id);
                  const name = String((s as { name: unknown }).name);
                  const num = (s as { number?: unknown }).number;
                  const total = totals.get(id) ?? 0;
                  return (
                    <tr key={id} className="text-slate-100">
                      <td className="py-3 font-semibold">{name}</td>
                      <td className="py-3 text-slate-300">{typeof num === "number" ? `${num}번` : "-"}</td>
                      <td className="py-3 font-black">{total}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
        <h3 className="text-lg font-extrabold">최근 기록</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-slate-300">
              <tr>
                <th className="py-2">시간</th>
                <th className="py-2">학생</th>
                <th className="py-2">점수</th>
                <th className="py-2">사유</th>
                <th className="py-2">기록자</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ledger.length === 0 ? (
                <tr>
                  <td className="py-4 text-slate-300" colSpan={5}>
                    기록이 없습니다.
                  </td>
                </tr>
              ) : (
                ledger.map((row) => {
                  const id = String((row as { id: unknown }).id);
                  const sid = String((row as { student_id: unknown }).student_id);
                  const delta = Number((row as { delta: unknown }).delta);
                  const reason = String((row as { reason: unknown }).reason);
                  const createdAt = String((row as { created_at: unknown }).created_at);
                  const createdBy = String((row as { created_by: unknown }).created_by ?? "");
                  return (
                    <tr key={id} className="text-slate-100">
                      <td className="py-3 text-slate-300">{createdAt}</td>
                      <td className="py-3 font-semibold">{nameById.get(sid) ?? sid}</td>
                      <td className="py-3 font-black">{delta}</td>
                      <td className="py-3 text-slate-200">{reason}</td>
                      <td className="py-3 text-slate-300">{createdBy}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

