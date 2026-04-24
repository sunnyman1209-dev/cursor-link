import { getSession } from "@/lib/auth/session";
import { CLASS_TOTAL_DEPARTMENT, DEPARTMENTS } from "@/lib/budget/depts";
import { ensureBudgetAccounts } from "@/lib/budget/bootstrap";
import { getClassCode } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

import {
  addFine,
  amnestyFine,
  approveBudgetRequest,
  assignDeptBudget,
  reduceFine,
  rejectBudgetRequest,
  setClassTotal,
  submitBudgetRequest
} from "./actions";

function money(n: number) {
  return `${n.toLocaleString("ko-KR")}원`;
}

export default async function BudgetPage() {
  const session = await getSession();
  if (!session) return null;

  const classCode = getClassCode();
  const sb = getSupabaseAdmin();
  await ensureBudgetAccounts(sb, classCode);

  const accRes = await sb
    .from("budget_accounts")
    .select("department,allocated_amount,spent_amount,fine_amount")
    .eq("class_code", classCode);
  if (accRes.error) throw accRes.error;
  const accounts = accRes.data ?? [];

  const accByDept = new Map<string, { allocated_amount: number; spent_amount: number; fine_amount: number }>();
  for (const row of accounts) {
    const dept = String((row as { department: unknown }).department);
    accByDept.set(dept, {
      allocated_amount: Number((row as { allocated_amount: unknown }).allocated_amount),
      spent_amount: Number((row as { spent_amount: unknown }).spent_amount),
      fine_amount: Number((row as { fine_amount: unknown }).fine_amount)
    });
  }

  const totalBudget = accByDept.get(CLASS_TOTAL_DEPARTMENT)?.allocated_amount ?? 0;
  const assignedSum = DEPARTMENTS.map((d) => accByDept.get(d)?.allocated_amount ?? 0).reduce((a, b) => a + b, 0);

  const pendingRes = await sb
    .from("budget_requests")
    .select("id,department,item,amount,status,created_at")
    .eq("class_code", classCode)
    .eq("status", "대기")
    .order("created_at", { ascending: false });
  if (pendingRes.error) throw pendingRes.error;
  const pending = pendingRes.data ?? [];

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
        <h2 className="text-2xl font-black">💰 예산/결재</h2>
        <p className="mt-2 text-sm text-slate-300">
          학급: <span className="font-semibold text-slate-100">{classCode}</span> · 역할:{" "}
          <span className="font-semibold text-slate-100">{session.role}</span>
        </p>
      </header>

      {session.role === "교사" ? (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
          <h3 className="text-lg font-extrabold">학급 총 운영비</h3>
          <form action={setClassTotal} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="text-sm font-semibold text-slate-200">총액</label>
              <input
                name="total"
                type="number"
                step={1000}
                defaultValue={totalBudget}
                className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                required
              />
            </div>
            <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-blue-500" type="submit">
              저장
            </button>
          </form>
        </section>
      ) : null}

      {session.role === "총무" ? (
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
            <h3 className="text-lg font-extrabold">요약</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="text-xs font-bold text-slate-300">학급 총 예산</div>
                <div className="mt-2 text-2xl font-black">{money(totalBudget)}</div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="text-xs font-bold text-slate-300">배정 가능 잔액</div>
                <div className="mt-2 text-2xl font-black">{money(totalBudget - assignedSum)}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
            <h3 className="text-lg font-extrabold">부처별 예산 배정</h3>
            <form action={assignDeptBudget} className="mt-4 grid gap-3 sm:grid-cols-3 sm:items-end">
              <div className="sm:col-span-1">
                <label className="text-sm font-semibold text-slate-200">부처</label>
                <select name="department" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm">
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="text-sm font-semibold text-slate-200">배정 금액</label>
                <input
                  name="allocated"
                  type="number"
                  step={1000}
                  className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
                  required
                />
              </div>
              <button className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-blue-500" type="submit">
                저장
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
            <h3 className="text-lg font-extrabold">결재 대기</h3>
            <div className="mt-4 space-y-3">
              {pending.length === 0 ? <div className="text-sm text-slate-300">대기 중인 신청이 없습니다.</div> : null}
              {pending.map((r) => {
                const id = String((r as { id: unknown }).id);
                const dept = String((r as { department: unknown }).department);
                const item = String((r as { item: unknown }).item);
                const amount = Number((r as { amount: unknown }).amount);
                const createdAt = String((r as { created_at: unknown }).created_at);
                return (
                  <div key={id} className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
                    <div className="text-sm text-slate-300">{createdAt}</div>
                    <div className="mt-1 text-base font-extrabold text-slate-100">
                      [{dept}] {item}
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-200">{money(amount)}</div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <form action={approveBudgetRequest}>
                        <input type="hidden" name="request_id" value={id} />
                        <button className="w-full rounded-xl bg-emerald-600 px-3 py-2 text-sm font-extrabold text-white hover:bg-emerald-500" type="submit">
                          승인
                        </button>
                      </form>
                      <form action={rejectBudgetRequest}>
                        <input type="hidden" name="request_id" value={id} />
                        <button className="w-full rounded-xl bg-rose-600 px-3 py-2 text-sm font-extrabold text-white hover:bg-rose-500" type="submit">
                          반려
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {session.role === "부장" ? (
        <section className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
            <h3 className="text-lg font-extrabold">예산 신청</h3>
            <form action={submitBudgetRequest} className="mt-4 grid gap-3 sm:grid-cols-3 sm:items-end">
              <div className="sm:col-span-1">
                <label className="text-sm font-semibold text-slate-200">내 부처</label>
                <select name="department" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm">
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="text-sm font-semibold text-slate-200">구입 항목</label>
                <input name="item" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm" required />
              </div>
              <div className="sm:col-span-1">
                <label className="text-sm font-semibold text-slate-200">금액</label>
                <input name="amount" type="number" step={100} className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm" required />
              </div>
              <button className="sm:col-span-3 rounded-xl bg-blue-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-blue-500" type="submit">
                신청
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
            <h3 className="text-lg font-extrabold">부처 특수 권한(2차 비밀번호)</h3>
            <p className="mt-2 text-sm text-slate-300">인성예절부/봉사부/선교부만 해당 폼이 의미가 있습니다.</p>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              <form action={addFine} className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-sm font-extrabold text-slate-100">인성예절부: 벌금 부과</div>
                <input type="hidden" name="chair_department" value="인성예절부" />
                <label className="mt-3 block text-xs font-bold text-slate-300">2차 비밀번호</label>
                <input name="dept_password" type="password" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm" />
                <label className="mt-3 block text-xs font-bold text-slate-300">대상 부처</label>
                <select name="target_department" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm">
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <label className="mt-3 block text-xs font-bold text-slate-300">금액</label>
                <input name="amount" type="number" step={500} className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm" />
                <button className="mt-4 w-full rounded-xl bg-amber-600 px-3 py-2 text-sm font-extrabold text-white hover:bg-amber-500" type="submit">
                  부과
                </button>
              </form>

              <form action={reduceFine} className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-sm font-extrabold text-slate-100">봉사부: 벌금 탕감</div>
                <input type="hidden" name="chair_department" value="봉사부" />
                <label className="mt-3 block text-xs font-bold text-slate-300">2차 비밀번호</label>
                <input name="dept_password" type="password" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm" />
                <label className="mt-3 block text-xs font-bold text-slate-300">대상 부처</label>
                <select name="target_department" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm">
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <label className="mt-3 block text-xs font-bold text-slate-300">금액</label>
                <input name="amount" type="number" step={500} className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm" />
                <button className="mt-4 w-full rounded-xl bg-emerald-600 px-3 py-2 text-sm font-extrabold text-white hover:bg-emerald-500" type="submit">
                  탕감
                </button>
              </form>

              <form action={amnestyFine} className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
                <div className="text-sm font-extrabold text-slate-100">선교부: 사면</div>
                <input type="hidden" name="chair_department" value="선교부" />
                <label className="mt-3 block text-xs font-bold text-slate-300">2차 비밀번호</label>
                <input name="dept_password" type="password" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm" />
                <label className="mt-3 block text-xs font-bold text-slate-300">대상 부처</label>
                <select name="target_department" className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm">
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <button className="mt-4 w-full rounded-xl bg-indigo-600 px-3 py-2 text-sm font-extrabold text-white hover:bg-indigo-500" type="submit">
                  사면
                </button>
              </form>
            </div>
          </div>
        </section>
      ) : null}

      {session.role === "감사원" ? (
        <section className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6">
          <h3 className="text-lg font-extrabold">감찰 리포트</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {DEPARTMENTS.map((d) => {
              const a = accByDept.get(d);
              const allocated = a?.allocated_amount ?? 0;
              const spent = a?.spent_amount ?? 0;
              const fine = a?.fine_amount ?? 0;
              const balance = allocated - spent - fine;
              return (
                <div key={d} className="rounded-2xl border border-slate-800 bg-slate-950/30 p-4">
                  <div className="text-sm font-extrabold text-slate-100">{d}</div>
                  <div className="mt-2 text-xs text-slate-300">배정 {money(allocated)}</div>
                  <div className="mt-1 text-xs text-slate-300">지출 {money(spent)}</div>
                  <div className="mt-1 text-xs text-slate-300">벌금 {money(fine)}</div>
                  <div className="mt-2 text-lg font-black text-yellow-300">잔액 {money(balance)}</div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}

