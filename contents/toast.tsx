import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"
import { BookmarkCheck } from "lucide-react"
import { MATCHES } from "../utils/matches"

export const config: PlasmoCSConfig = {
  matches: MATCHES
}

const TOAST_DURATION = 1200
const SLIDE_IN_MS = 450
const SLIDE_OUT_MS = 280

/**
 * Lightweight toast notification for new bookmark events.
 * Listens for a custom DOM event fired by content scripts.
 */
export default function BookmarkToast() {
  const [visible, setVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  const exitTimerRef = useRef<number | null>(null)
  const hideTimerRef = useRef<number | null>(null)

  /**
   * Handles lifecycle timers for the enter/exit animation window.
   */
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
      style={{
        position: "fixed",
        bottom: "140px", // higher than before
        right: "24px",
        zIndex: 2147483647,
        pointerEvents: "none",
        transform: isExiting ? "translateX(120%)" : "translateX(0)",
        opacity: isExiting ? 0 : 1,
        transition: `transform ${isExiting ? SLIDE_OUT_MS : SLIDE_IN_MS}ms cubic-bezier(0.16, 1, 0.3, 1), opacity ${isExiting ? SLIDE_OUT_MS : SLIDE_IN_MS}ms ease-out`
      }}
    >
      <div
        style={{
          backgroundColor: "#18181b",
          color: "#ffffff",
          padding: "12px 20px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow:
            "0 10px 25px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0, 0, 0, 0.25)",
          border: "1px solid rgb(107 33 168)" // purple-800
        }}
      >
        <BookmarkCheck size={18} strokeWidth={2} />
        <span>Bookmarked</span>
      </div>
    </div>
  )
}
