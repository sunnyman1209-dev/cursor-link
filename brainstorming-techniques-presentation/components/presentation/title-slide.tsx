"use client"

import { SlideWrapper } from "./slide-wrapper"

export function TitleSlide() {
  return (
    <SlideWrapper className="items-center text-center">
      <div className="max-w-4xl mx-auto space-y-8">
        <p className="text-muted-foreground text-sm tracking-widest uppercase">
          Creative Thinking Methods
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-tight tracking-tight text-balance">
          창의적 발상 기법
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          효과적인 아이디어 생성과 창의적 문제 해결을 위한 5가지 핵심 기법 소개
        </p>
        <div className="pt-8 flex items-center justify-center gap-3">
          <div className="w-12 h-px bg-border" />
          <span className="text-sm text-muted-foreground">5 Methods</span>
          <div className="w-12 h-px bg-border" />
        </div>
      </div>
    </SlideWrapper>
  )
}
