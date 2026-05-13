"use client"

import { useState, useEffect, useCallback } from "react"
import { TitleSlide } from "./title-slide"
import { OverviewSlide } from "./overview-slide"
import { BrainstormingSlide } from "./brainstorming-slide"
import { MandalartSlide } from "./mandalart-slide"
import { NMMethodSlide } from "./nm-method-slide"
import { ScamperSlide } from "./scamper-slide"
import { ChecklistSlide } from "./checklist-slide"
import { SummarySlide } from "./summary-slide"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  TitleSlide,
  OverviewSlide,
  BrainstormingSlide,
  MandalartSlide,
  NMMethodSlide,
  ScamperSlide,
  ChecklistSlide,
  SummarySlide,
]

export function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const goToNextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))
  }, [])

  const goToPrevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        goToNextSlide()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        goToPrevSlide()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToNextSlide, goToPrevSlide])

  const CurrentSlideComponent = slides[currentSlide]

  return (
    <div className="relative min-h-screen bg-background">
      <CurrentSlideComponent />

      {/* Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 shadow-sm">
        <button
          onClick={goToPrevSlide}
          disabled={currentSlide === 0}
          className="p-1.5 rounded-full hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>

        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-primary w-4"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNextSlide}
          disabled={currentSlide === slides.length - 1}
          className="p-1.5 rounded-full hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Slide counter */}
      <div className="fixed top-6 right-6 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{currentSlide + 1}</span>
        <span> / {slides.length}</span>
      </div>

      {/* Keyboard hint */}
      <div className="fixed bottom-6 right-6 text-xs text-muted-foreground hidden md:block">
        <span className="bg-secondary px-2 py-1 rounded">←</span>
        <span className="mx-1">/</span>
        <span className="bg-secondary px-2 py-1 rounded">→</span>
        <span className="ml-2">키보드로 이동</span>
      </div>
    </div>
  )
}
