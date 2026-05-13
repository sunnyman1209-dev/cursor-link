"use client"

import { SlideWrapper } from "./slide-wrapper"

const methods = [
  { 
    name: "브레인스토밍", 
    key: "자유로운 발산",
    description: "비판 없이 양적으로 많은 아이디어 생성"
  },
  { 
    name: "만다라트", 
    key: "체계적 확장",
    description: "핵심 주제에서 64개 아이디어로 확장"
  },
  { 
    name: "NM법", 
    key: "유추적 사고",
    description: "자연물에서 문제 해결 힌트 발견"
  },
  { 
    name: "스캠퍼법", 
    key: "변형적 접근",
    description: "7가지 관점에서 기존 아이디어 변형"
  },
  { 
    name: "체크리스트법", 
    key: "점검과 검증",
    description: "누락 방지를 위한 체계적 확인"
  },
]

export function SummarySlide() {
  return (
    <SlideWrapper className="items-center">
      <div className="max-w-5xl mx-auto w-full text-center">
        <div className="mb-12">
          <p className="text-sm text-muted-foreground tracking-widest uppercase mb-3">Summary</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            핵심 정리
          </h2>
          <p className="text-muted-foreground">
            5가지 창의적 발상 기법 핵심 요약
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {methods.map((method, index) => (
            <div
              key={method.name}
              className={`bg-card p-5 rounded-lg border border-border/50 text-left ${
                index === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-primary">0{index + 1}</span>
                <h3 className="font-medium text-foreground">{method.name}</h3>
              </div>
              <p className="text-xs text-accent font-medium mb-1">{method.key}</p>
              <p className="text-sm text-muted-foreground">{method.description}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-px bg-border" />
          <span className="text-sm text-muted-foreground">End of Presentation</span>
          <div className="w-12 h-px bg-border" />
        </div>
      </div>
    </SlideWrapper>
  )
}
