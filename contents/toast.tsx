import cssText from "data-text:~style.css"
import { BookmarkCheck } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"

import { MATCHES } from "~utils/matches"

export const config: PlasmoCSConfig = {
  matches: MATCHES
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const TOAST_DURATION = 1200
const SLIDE_IN_MS = 450
const SLIDE_OUT_MS = 280

export function BookmarkToast() {
  const [visible, setVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const exitTimerRef = useRef<number | null>(null)
  const hideTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const handler = () => {
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current)
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)

      setVisible(true)
      setIsExiting(false)

      exitTimerRef.current = window.setTimeout(() => {
        setIsExiting(true)
      }, TOAST_DURATION)

      hideTimerRef.current = window.setTimeout(() => {
        setVisible(false)
      }, TOAST_DURATION + SLIDE_OUT_MS)
    }

    window.addEventListener("llm-bookmark-added", handler)
    return () => {
      window.removeEventListener("llm-bookmark-added", handler)
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current)
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed bottom-[140px] right-[24px] z-[2147483647] pointer-events-none font-sans antialiased"
      style={{
        transform: isExiting ? "translateX(120%)" : "translateX(0)",
        opacity: isExiting ? 0 : 1,
        transition: `transform ${isExiting ? SLIDE_OUT_MS : SLIDE_IN_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${isExiting ? SLIDE_OUT_MS : SLIDE_IN_MS}ms ease-out`
      }}>
      <div className="flex items-center gap-[10px] px-5 py-3 bg-neutral-900 text-white rounded-xl text-sm font-medium border border-purple-900 shadow-2xl">
        <BookmarkCheck
          size={18}
          strokeWidth={2.5}
          className="text-purple-400"
        />
        <span>Bookmarked</span>
      </div>
    </div>
  )
}

export default BookmarkToast
