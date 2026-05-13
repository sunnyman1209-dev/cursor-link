# 학급 정부 시스템 (Next.js)

학급 **예산/결재**, **상벌점**, **감사 로그**를 Next.js + Supabase로 관리합니다.

## 로컬 실행

```bash
npm i
npm run dev
```

## 환경변수

`.env.example`을 참고해 `.env.local`을 만들거나, Vercel Environment Variables에 설정하세요.

- `APP_PASSWORDS`: 역할별 비밀번호(JSON) — `교사/총무/부장/감사원`
- `APP_DEPT_PASSWORDS`: 부처별 2차 비밀번호(JSON)
- `SESSION_SECRET`: 세션 쿠키 서명용 비밀값(길고 랜덤하게)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (**서버에서만** 사용)
- `CLASS_CODE` (예: `1-1`)

> `SUPABASE_SERVICE_ROLE_KEY`는 브라우저에 노출하면 안 됩니다. 이 프로젝트는 서버 액션/Route Handler에서만 사용합니다.

## Vercel 배포

- GitHub 레포를 Vercel에 Import
- 위 환경변수를 Vercel에 동일하게 설정

## `brainstorming-techniques-presentation/` (발상 기법 슬라이드)

같은 레포 안의 **별도 Next.js 앱**입니다. 기존 `cursor-link` Vercel 프로젝트(루트)와는 무관하게, Vercel에서 **새 Project**를 만들고 **Root Directory**를 `brainstorming-techniques-presentation` 로 지정하면 `main` 푸시 시 자동 배포됩니다.

가져오기 바로가기: `https://vercel.com/new/import?s=https://github.com/sunnyman1209-dev/cursor-link` → **Root Directory** → `Edit` → `brainstorming-techniques-presentation` 입력 → **Deploy**.

### 배포 후 404일 때 (Vercel 설정)

- **Build & Development Settings**에서 **Output Directory**가 비어 있는지 확인합니다. (Next 기본 배포는 비워 둠. `out` 등으로 바꾸면 404가 날 수 있음)
- **Install Command**는 비우거나 `npm install`
- **Framework Preset**은 **Next.js**
- 변경 후 **Redeploy** (Deployments → 해당 배포 → Redeploy)

### UI 대신 API로 「루트 외부 파일 포함」 끄기

이 PC/에이전트에는 `VERCEL_TOKEN`이 없어 대신 실행할 스크립트를 넣어 두었습니다.

**로컬 PowerShell (토큰은 채팅에 붙이지 말 것):**

```powershell
cd C:\Users\sunny\Desktop\cursor-link
$env:VERCEL_TOKEN="여기에_토큰"
node brainstorming-techniques-presentation/scripts/vercel-disable-outside-root.mjs
```

자동으로 못 찾으면: `$env:VERCEL_PROJECT_NAME="vercel-프로젝트-이름"` 추가.

**GitHub Actions:** 저장소 **Settings → Secrets → Actions**에 `VERCEL_TOKEN` 추가 후, **Actions** 탭에서 `Vercel — 루트 외부 파일 포함 끄기` 워크플로를 **Run workflow**.

## Supabase SQL (필수)

Supabase SQL Editor에서 아래를 실행하세요.

```sql
-- 상벌점
create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  class_code text not null,
  name text not null,
  number int,
  created_at timestamptz not null default now()
);

create index if not exists students_class_code_idx on students (class_code);

create table if not exists point_ledger (
  id uuid primary key default gen_random_uuid(),
  class_code text not null,
  student_id uuid not null references students(id) on delete cascade,
  delta int not null,
  reason text not null,
  created_at timestamptz not null default now(),
  created_by text
);

create index if not exists point_ledger_student_idx on point_ledger (student_id);
create index if not exists point_ledger_class_code_idx on point_ledger (class_code);

-- 예산/결재
create table if not exists budget_accounts (
  class_code text not null,
  department text not null,
  allocated_amount bigint not null default 0,
  spent_amount bigint not null default 0,
  fine_amount bigint not null default 0,
  updated_at timestamptz not null default now(),
  primary key (class_code, department)
);

create table if not exists budget_requests (
  id uuid primary key default gen_random_uuid(),
  class_code text not null,
  department text not null,
  item text not null,
  amount bigint not null,
  status text not null default '대기', -- 대기/승인/반려
  created_at timestamptz not null default now()
);

create index if not exists budget_requests_class_status_idx on budget_requests (class_code, status);

create table if not exists budget_events (
  id uuid primary key default gen_random_uuid(),
  class_code text not null,
  created_at timestamptz not null default now(),
  actor_role text not null,
  action text not null,
  department text,
  amount bigint,
  item text,
  status text,
  note text
);

create index if not exists budget_events_class_created_idx on budget_events (class_code, created_at desc);
```

> 운영 환경에서는 RLS/정책을 반드시 설계하세요. (교실용 PoC라면 일단 비공개 배포 + 강한 비밀번호 조합을 권장)
