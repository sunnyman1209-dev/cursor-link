import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-black tracking-tight text-slate-100">
              학급정부
            </Link>
            <nav className="hidden items-center gap-3 text-sm text-slate-300 sm:flex">
              <Link className="hover:text-white" href="/points">
                상벌점
              </Link>
              <Link className="hover:text-white" href="/budget">
                예산/결재
              </Link>
              <Link className="hover:text-white" href="/audit">
                감사로그
              </Link>
            </nav>
          </div>

          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-200 hover:border-slate-600"
            >
              로그아웃
            </button>
          </form>
        </div>
      </div>

      {children}
    </div>
  );
}
