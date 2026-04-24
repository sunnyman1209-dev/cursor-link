import { getSession } from "@/lib/auth/session";
import { getClassCode } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export default async function AuditPage() {
  const session = await getSession();
  if (!session) return null;

  const classCode = getClassCode();
  const sb = getSupabaseAdmin();

  const res = await sb
    .from("budget_events")
    .select("created_at,actor_role,action,department,amount,item,status,note")
    .eq("class_code", classCode)
    .order("created_at", { ascending: false })
    .limit(200);
  if (res.error) throw res.error;
  const rows = res.data ?? [];

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
        <h2 className="text-2xl font-black">🧾 감사로그</h2>
        <p className="mt-2 text-sm text-slate-300">
          학급: <span className="font-semibold text-slate-100">{classCode}</span> · 최근 200건
        </p>
      </header>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-slate-300">
              <tr>
                <th className="py-2">시간</th>
                <th className="py-2">역할</th>
                <th className="py-2">액션</th>
                <th className="py-2">부서</th>
                <th className="py-2">금액</th>
                <th className="py-2">항목</th>
                <th className="py-2">상태</th>
                <th className="py-2">메모</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rows.length === 0 ? (
                <tr>
                  <td className="py-6 text-slate-300" colSpan={8}>
                    로그가 없습니다.
                  </td>
                </tr>
              ) : (
                rows.map((r, idx) => {
                  const createdAt = String((r as { created_at: unknown }).created_at);
                  const actor = String((r as { actor_role: unknown }).actor_role);
                  const action = String((r as { action: unknown }).action);
                  const dept = String((r as { department: unknown }).department ?? "");
                  const amount = (r as { amount: unknown }).amount;
                  const item = String((r as { item: unknown }).item ?? "");
                  const status = String((r as { status: unknown }).status ?? "");
                  const note = String((r as { note: unknown }).note ?? "");
                  return (
                    <tr key={`${createdAt}-${idx}`} className="text-slate-100">
                      <td className="py-3 text-slate-300">{createdAt}</td>
                      <td className="py-3 font-semibold">{actor}</td>
                      <td className="py-3 font-mono text-xs text-slate-200">{action}</td>
                      <td className="py-3 text-slate-200">{dept}</td>
                      <td className="py-3 font-bold">{amount === null || amount === undefined ? "" : String(amount)}</td>
                      <td className="py-3 text-slate-200">{item}</td>
                      <td className="py-3 text-slate-200">{status}</td>
                      <td className="py-3 text-slate-300">{note}</td>
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
