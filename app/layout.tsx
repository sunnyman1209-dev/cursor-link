import "./globals.css";
import type { Metadata } from "next";

import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "학급 정부 시스템",
  description: "학급 예산/결재, 상벌점, 감사 로그 관리"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

