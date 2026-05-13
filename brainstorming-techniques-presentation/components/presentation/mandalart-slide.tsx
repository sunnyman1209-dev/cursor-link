"use client"

import { SlideWrapper } from "./slide-wrapper"

export function MandalartSlide() {
  return (
    <SlideWrapper>
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              02
            </span>
            <p className="text-sm text-muted-foreground tracking-wide">Method Two</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-4">
            만다라트
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            일본의 디자이너 이마이즈미 히로아키가 개발한 기법으로, 하나의 핵심 주제를 바탕으로 생각을 사방으로 확장하는 시각적 도구
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-card p-5 rounded-lg border border-border/50">
              <h3 className="text-lg font-medium text-foreground mb-3">구조</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                3×3 매트릭스 활용. 중앙에 핵심 주제, 주변 8칸에 세부 주제, 
                다시 그 세부 주제를 바탕으로 8개씩 구체적 실천 방안 확장 → 
                <span className="font-medium text-foreground"> 총 64개의 아이디어</span> 도출
              </p>
            </div>
            
            <div className="bg-secondary/50 p-5 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-3">
                예시: {"\"10km 마라톤 완주\""}
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">세부 주제</p>
                  <p className="text-sm text-foreground">기초 체력, 러닝 장비, 식이요법, 페이스 조절</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">실천 방안 (기초 체력)</p>
                  <p className="text-sm text-foreground">매일 5km 러닝, 주 3회 하체 근력 운동, 인터벌 트레이닝</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-card p-4 rounded-lg border border-border/50">
            <div className="grid grid-cols-3 gap-2">
              {[
                "식이요법", "기초 체력", "멘탈 관리",
                "러닝 장비", "10km 완주", "수면 관리",
                "페이스 조절", "휴식 계획", "동기 부여"
              ].map((item, index) => (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center p-2 rounded text-center text-xs md:text-sm ${
                    index === 4
                      ? "bg-primary text-primary-foreground font-medium"
                      : "bg-secondary/70 text-foreground"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">3×3 매트릭스 예시</p>
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}
