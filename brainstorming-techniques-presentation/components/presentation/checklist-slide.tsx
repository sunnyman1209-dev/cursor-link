"use client"

import { SlideWrapper } from "./slide-wrapper"

const checklistItems = [
  { question: "안전 규정을 준수했는가?", checked: true },
  { question: "제조 원가가 목표 범위를 벗어나지 않았는가?", checked: true },
  { question: "사용자가 한 손으로 조작 가능한가?", checked: false },
  { question: "내구성이 5년 이상 보장되는가?", checked: true },
]

export function ChecklistSlide() {
  return (
    <SlideWrapper>
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              05
            </span>
            <p className="text-sm text-muted-foreground tracking-wide">Method Five</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-4">
            체크리스트법
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            아이디어 구상 시 누락 방지를 위해 점검 항목을 미리 정해두고 하나씩 확인하는 방법
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card p-5 rounded-lg border border-border/50">
              <h3 className="text-lg font-medium text-foreground mb-3">정의</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                특정 목적에 맞춰 미리 작성된 목록을 통해 사고의 폭을 제한하거나 유도 → 
                <span className="font-medium text-foreground"> 누락 방지</span> 및 
                <span className="font-medium text-foreground"> 구체적인 아이디어 강제 도출</span>
              </p>
            </div>
            
            <div className="bg-card p-5 rounded-lg border border-border/50">
              <h3 className="text-lg font-medium text-foreground mb-3">활용 분야</h3>
              <div className="flex flex-wrap gap-2">
                {["제품 설계", "품질 관리", "프로젝트 검토", "안전 점검", "서비스 개선"].map((tag) => (
                  <span key={tag} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-secondary/50 p-5 rounded-lg">
            <h3 className="text-sm font-medium text-foreground mb-4">
              예시: 신제품 설계 검토 체크리스트
            </h3>
            <div className="space-y-3">
              {checklistItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    item.checked 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-card border border-border"
                  }`}>
                    {item.checked && (
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{item.question}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}
