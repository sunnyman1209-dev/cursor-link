"use client"

import { SlideWrapper } from "./slide-wrapper"

const methods = [
  { number: "01", title: "브레인스토밍", subtitle: "Brainstorming" },
  { number: "02", title: "만다라트", subtitle: "Mandal-Art" },
  { number: "03", title: "NM법", subtitle: "Nakayama Method" },
  { number: "04", title: "스캠퍼법", subtitle: "SCAMPER" },
  { number: "05", title: "체크리스트법", subtitle: "Checklist Method" },
]

export function OverviewSlide() {
  return (
    <SlideWrapper>
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-12">
          <p className="text-sm text-muted-foreground tracking-widest uppercase mb-3">Overview</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            학습 목차
          </h2>
        </div>
        
        <div className="grid gap-4">
          {methods.map((method) => (
            <div
              key={method.number}
              className="flex items-center gap-6 p-5 bg-card rounded-lg border border-border/50 hover:border-border transition-colors"
            >
              <span className="text-2xl md:text-3xl font-light text-primary/60 font-serif">
                {method.number}
              </span>
              <div className="flex-1">
                <h3 className="text-lg md:text-xl font-medium text-foreground">
                  {method.title}
                </h3>
                <p className="text-sm text-muted-foreground">{method.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}
