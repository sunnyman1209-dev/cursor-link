import Link from "next/link";

const Card = ({
  title,
  desc,
  href
}: {
  title: string;
  desc: string;
  href: string;
}) => {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition hover:border-slate-600"
    >
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-1 text-sm text-slate-300">{desc}</div>
    </Link>
  );
};

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6">
        <h1 className="text-2xl font-black tracking-tight">🛡️ 학급 정부 시스템</h1>
        <p className="mt-2 text-sm text-slate-300">
          Next.js + TypeScript + Supabase 기반으로 전환 중입니다.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card title="상벌점" desc="학생 상벌점 조회/기록" href="/points" />
        <Card title="예산/결재" desc="예산 배정/신청/승인 기록" href="/budget" />
        <Card title="감사로그" desc="예산/결재 이벤트 기록" href="/audit" />
      </section>

      <section className="rounded-2xl border border-amber-900/60 bg-amber-900/10 p-5 text-sm text-amber-200">
        <div className="font-semibold">필수 환경변수</div>
        <ul className="mt-2 list-disc pl-5">
          <li>
            <code className="text-amber-100">SUPABASE_URL</code>
          </li>
          <li>
            <code className="text-amber-100">SUPABASE_SERVICE_ROLE_KEY</code>
          </li>
          <li>
            <code className="text-amber-100">SESSION_SECRET</code>
          </li>
          <li>
            <code className="text-amber-100">APP_PASSWORDS</code>
          </li>
        </ul>
      </section>
    </main>
  );
}

