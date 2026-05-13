"use client"

import { cn } from "@/lib/utils"

interface SlideWrapperProps {
  children: React.ReactNode
  className?: string
}

export function SlideWrapper({ children, className }: SlideWrapperProps) {
  return (
    <div
      className={cn(
        "min-h-screen w-full flex flex-col justify-center px-8 py-12 md:px-16 lg:px-24",
        className
      )}
    >
      {children}
    </div>
  )
}
