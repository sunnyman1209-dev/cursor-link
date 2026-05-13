"use client"

import { SlideWrapper } from "./slide-wrapper"

const principles = [
  { title: "비판 금지", description: "아이디어에 대한 비판 금지" },
  { title: "자유분방", description: "자유로운 아이디어 제시" },
  { title: "양의 추구", description: "질보다 양 중시" },
  { title: "결합과 개선", description: "타인의 아이디어 발전" },
]

export function BrainstormingSlide() {
  return (
    <SlideWrapper>
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              01
            </span>
            <p className="text-sm text-muted-foreground tracking-wide">Method One</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-4">
            브레인스토밍
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            여러 사람이 모여 비판 없이 자유롭게 최대한 많은 아이디어를 쏟아내는 가장 널리 알려진 집단 발상법
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              4대 원칙
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {principles.map((principle, index) => (
                <div key={index} className="bg-card p-4 rounded-lg border border-border/50">
                  <p className="font-medium text-foreground text-sm mb-1">{principle.title}</p>
                  <p className="text-xs text-muted-foreground">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground border-b border-border pb-2">
              예시
            </h3>
            <div className="bg-secondary/50 p-5 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-3">
                {"\"우리 학교 축제의 홍보 효과를 높이려면?\""}
              </p>
              <ul className="space-y-2">
                {["인플루언서 초청", "학교 앞 현수막 설치", "SNS 챌린지 진행", "드론을 이용한 전단지 살포"].map((idea, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {idea}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}
