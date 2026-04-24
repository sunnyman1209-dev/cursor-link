import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth/session";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await getSession();
  const sp = await searchParams;
  const nextRaw = sp.next;
  const next = typeof nextRaw === "string" && nextRaw.startsWith("/") ? nextRaw : "/";

  if (session) redirect(next);

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 p-6">
      <header>
        <h1 className="text-2xl font-black">🔐 로그인</h1>
        <p className="mt-2 text-sm text-slate-300">역할과 비밀번호를 입력하세요.</p>
      </header>

      <form action="/api/auth/login" method="post" className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
        <input type="hidden" name="next" value={next} />

        <label className="block text-sm font-semibold text-slate-200">역할</label>
        <select
          name="role"
          className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
          defaultValue="교사"
        >
          <option value="교사">교사</option>
          <option value="총무">총무</option>
          <option value="부장">부장</option>
          <option value="감사원">감사원</option>
        </select>

        <label className="mt-4 block text-sm font-semibold text-slate-200">비밀번호</label>
        <input
          name="password"
          type="password"
          className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm"
          required
        />

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-blue-500"
        >
          로그인
        </button>
      </form>
    </main>
  );
}
