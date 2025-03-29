"use client"

import { ModeToggle } from "~/components/mode-toggle"

export function ThemeToggle() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <ModeToggle />
    </div>
  )
}