/**
 * Vercel 프로젝트에서 "루트 외부 파일 포함"을 끕니다 (sourceFilesOutsideRootDirectory: false).
 * 상위 레포 middleware 등이 섞여 404가 날 때 사용.
 *
 * 사용:
 *   set VERCEL_TOKEN=발급한_토큰
 *   node scripts/vercel-disable-outside-root.mjs
 *
 * 선택: 특정 프로젝트만 지정
 *   set VERCEL_PROJECT_NAME=프로젝트-슬러그
 */

const token = process.env.VERCEL_TOKEN
if (!token) {
  console.error("VERCEL_TOKEN 환경 변수가 없습니다. https://vercel.com/account/tokens")
  process.exit(1)
}

const explicitName = process.env.VERCEL_PROJECT_NAME

async function api(path, opts = {}) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...opts.headers,
    },
  })
  const text = await res.text()
  let json
  try {
    json = text ? JSON.parse(text) : {}
  } catch {
    json = { raw: text }
  }
  if (!res.ok) {
    console.error(res.status, path, json)
    process.exit(1)
  }
  return json
}

const teams = await api("/v2/teams")
const teamList = teams.teams ?? []
if (!teamList.length) {
  console.error("팀이 없습니다.")
  process.exit(1)
}

/** @type {{ id: string; slug: string }} */
let team = teamList[0]
const wantSlug = process.env.VERCEL_TEAM_SLUG
if (wantSlug) {
  const found = teamList.find((t) => t.slug === wantSlug)
  if (found) team = found
}

const teamId = team.id
const teamParam = `teamId=${encodeURIComponent(teamId)}`

let project
if (explicitName) {
  project = await api(`/v9/projects/${encodeURIComponent(explicitName)}?${teamParam}`)
} else {
  const list = await api(`/v9/projects?${teamParam}&limit=100`)
  const projects = list.projects ?? []
  project = projects.find(
    (p) =>
      p.rootDirectory === "brainstorming-techniques-presentation" ||
      (p.link?.type === "github" &&
        p.link?.repo === "cursor-link" &&
        p.rootDirectory === "brainstorming-techniques-presentation")
  )
  if (!project) {
    project = projects.find((p) =>
      String(p.name ?? "")
        .toLowerCase()
        .includes("brainstorm")
    )
  }
  if (!project) {
    console.error(
      "대상 프로젝트를 자동으로 찾지 못했습니다. VERCEL_PROJECT_NAME=슬러그 로 지정하세요.",
      projects.map((p) => ({ name: p.name, id: p.id, rootDirectory: p.rootDirectory }))
    )
    process.exit(1)
  }
}

const projectId = project.id
const name = project.name
console.log("대상:", name, projectId, "현재 sourceFilesOutsideRootDirectory=", project.sourceFilesOutsideRootDirectory)

const updated = await api(`/v9/projects/${projectId}?${teamParam}`, {
  method: "PATCH",
  body: JSON.stringify({
    sourceFilesOutsideRootDirectory: false,
  }),
})

console.log("완료:", updated.name, "sourceFilesOutsideRootDirectory=", updated.sourceFilesOutsideRootDirectory)
console.log("Vercel 대시보드 → Deployments → 최신 배포 → Redeploy 를 한 번 실행하세요.")
