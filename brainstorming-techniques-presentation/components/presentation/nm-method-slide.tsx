"use client"

import { SlideWrapper } from "./slide-wrapper"

export function NMMethodSlide() {
  return (
    <SlideWrapper>
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              03
            </span>
            <p className="text-sm text-muted-foreground tracking-wide">Method Three</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-4">
            NM법
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            일본의 나카야마 마사카즈가 창안한 기법으로, 유추(Analogy)를 통해 해결책을 찾는 창의적 문제 해결 방식
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-card p-5 rounded-lg border border-border/50">
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="text-lg font-medium text-foreground mb-2">정의</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              해결하려는 문제의 본질(키워드) 추출 후, 그 본질과 닮은 &apos;자연물&apos;이나 &apos;사물&apos;에서 아이디어 차용
            </p>
          </div>
          
          <div className="lg:col-span-2 bg-secondary/50 p-5 rounded-lg">
            <h3 className="text-lg font-medium text-foreground mb-4">예시</h3>
            <p className="text-sm font-medium text-foreground mb-4">
              {"\"더 가볍고 튼튼한 자전거 프레임 만들기\""}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-20 text-right">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    키워드
                  </span>
                </div>
                <p className="text-sm text-foreground">가벼움 + 견고함</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-20 text-right">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    유추 대상
                  </span>
                </div>
                <p className="text-sm text-foreground">새의 뼈</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-20 text-right">
                  <span className="text-xs font-medium text-accent bg-accent/20 px-2 py-1 rounded">
                    아이디어
                  </span>
                </div>
                <p className="text-sm text-foreground">
                  새의 뼈가 속이 비어있으면서도 구조적으로 튼튼한 점에 착안하여, 
                  프레임 내부를 벌집 구조(Honeycomb)로 설계
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}
