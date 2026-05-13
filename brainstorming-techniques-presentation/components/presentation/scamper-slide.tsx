"use client"

import { SlideWrapper } from "./slide-wrapper"

const scamperItems = [
  { letter: "S", title: "Substitute", korean: "대체", question: "다른 재료나 성분으로 바꿀 수 있는가?" },
  { letter: "C", title: "Combine", korean: "결합", question: "두 가지 이상의 기능을 합칠 수 있는가?" },
  { letter: "A", title: "Adapt", korean: "적용", question: "다른 분야의 원리를 가져올 수 있는가?" },
  { letter: "M", title: "Modify", korean: "수정", question: "모양이나 색깔을 바꿀 수 있는가?" },
  { letter: "P", title: "Put to other use", korean: "용도 변경", question: "다른 용도로 쓸 수 있는가?" },
  { letter: "E", title: "Eliminate", korean: "제거", question: "불필요한 부분을 뺄 수 있는가?" },
  { letter: "R", title: "Reverse", korean: "역전", question: "순서를 바꾸거나 거꾸로 할 수 있는가?" },
]

export function ScamperSlide() {
  return (
    <SlideWrapper>
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              04
            </span>
            <p className="text-sm text-muted-foreground tracking-wide">Method Four</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold text-foreground mb-4">
            스캠퍼법
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            질문 목록을 활용하여 기존의 아이디어를 다각도로 변형해보는 7가지 체크리스트 기법
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {scamperItems.map((item) => (
            <div key={item.letter} className="bg-card p-4 rounded-lg border border-border/50">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground rounded font-semibold text-sm">
                  {item.letter}
                </span>
                <div>
                  <p className="font-medium text-foreground text-sm">{item.korean}</p>
                  <p className="text-xs text-muted-foreground">{item.title}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.question}</p>
            </div>
          ))}
        </div>

        <div className="bg-secondary/50 p-5 rounded-lg">
          <h3 className="text-sm font-medium text-foreground mb-3">예시: {"\"종이컵 개선하기\""}</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 flex items-center justify-center bg-primary/20 text-primary rounded text-xs font-medium flex-shrink-0">S</span>
              <p className="text-sm text-muted-foreground">종이 대신 식용 전분으로 만들기</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 flex items-center justify-center bg-primary/20 text-primary rounded text-xs font-medium flex-shrink-0">C</span>
              <p className="text-sm text-muted-foreground">컵 홀더와 컵을 일체형으로 만들기</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-6 h-6 flex items-center justify-center bg-primary/20 text-primary rounded text-xs font-medium flex-shrink-0">E</span>
              <p className="text-sm text-muted-foreground">코팅제를 없애고 100% 재활용 가능하게</p>
            </div>
          </div>
        </div>
      </div>
    </SlideWrapper>
  )
}
