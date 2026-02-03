import type { BookmarkEntry } from "@types/bookmark"
import { Bookmark } from "lucide-react"
import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"
import { useMemo } from "react"

import { useStorage } from "@plasmohq/storage/hook"

export const config: PlasmoCSConfig = {
  matches: ["https://chatgpt.com/*", "https://chat.openai.com/*"]
}

/**
 * Injects ChatGPT-matching CSS so the bookmark control looks native.
 */
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
    /* Reset toolbar constraints */
    div[role="toolbar"] {
      background: transparent !important;
      border: none !important;
      display: flex !important;
      align-items: center !important;
    }

    .custom-bookmark-action {
      /* Perfect sizing to match ChatGPT buttons */
      width: 32px !important;
      height: 32px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      
      /* Resetting defaults */
      background-color: transparent !important;
      border: none !important;
      outline: none !important;
      padding: 0 !important;
      margin: 0 !important;
      cursor: pointer !important;
      
      /* MATCH NATIVE ROUNDING */
      border-radius: 8px !important; 
      transition: background-color 0.15s ease;
    }

    /* MATCH NATIVE HOVER SHADOW/BOX */
    .custom-bookmark-action:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
    }

    /* Light mode support just in case */
    html:not(.dark) .custom-bookmark-action:hover {
      background-color: rgba(0, 0, 0, 0.05) !important;
    }

    /* Ensure icon is centered and correct size */
    .custom-bookmark-action svg {
      width: 20px !important;
      height: 20px !important;
      display: block !important;
    }
  `
  return style
}

/**
 * Targets the per-message action toolbar so each response gets a bookmark control.
 */
export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  return document.querySelectorAll(
    'button[data-testid="copy-turn-action-button"]'
  )
}

/**
 * Bookmark button inserted next to the ChatGPT response action buttons.
 * Resolves message metadata from the surrounding DOM and toggles storage.
 */
export function BookmarkButton({ anchor }) {
  const [bookmarks, setBookmarks] = useStorage<BookmarkEntry[]>("bookmarks", [])

  const buildTitleExcerpt = (text: string, maxChars = 160) => {
    const trimmed = text.trim()
    if (trimmed.length <= maxChars) return trimmed
    const slice = trimmed.slice(0, maxChars)
    const lastSpace = slice.lastIndexOf(" ")
    if (lastSpace > 40) {
      return `${slice.slice(0, lastSpace)}…`
    }
    return `${slice}…`
  }

  /**
   * Extracts the conversation + message identifiers needed to locate a response later.
   */
  const context = useMemo(() => {
    const article = anchor.element.closest("article")
    if (!article) return null

    const turnId = article.getAttribute("data-turn-id")
    if (!turnId) return null

    const messageNode = article.querySelector("[data-message-id]")
    const messageId = messageNode?.getAttribute("data-message-id") ?? null

    const conversationId =
      window.location.pathname.split("/c/")[1]?.split("/")[0] ?? "unknown"

    const rawText =
      article.querySelector(".markdown")?.textContent?.trim() ?? ""

    const title = rawText ? buildTitleExcerpt(rawText) : "Untitled response"

    return {
      conversationId,
      turnId,
      messageId,
      title
    }
  }, [anchor.element])

  const isBookmarked = useMemo(() => {
    if (!context) return false
    return bookmarks.some(
      (b) =>
        b.platform === "chatgpt" &&
        b.turnId === context.turnId &&
        b.conversationId === context.conversationId
    )
  }, [bookmarks, context])

  /**
   * Toggles a bookmark entry while blocking host page pointer handling.
   */
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    if (!context) return

    setBookmarks((prev = []) => {
      const existing = prev.find(
        (b) =>
          b.platform === "chatgpt" &&
          b.turnId === context.turnId &&
          b.conversationId === context.conversationId
      )

      if (existing) {
        return prev.filter((b) => b.id !== existing.id)
      }

      const entry: BookmarkEntry = {
        id: crypto.randomUUID(),
        platform: "chatgpt",
        conversationId: context.conversationId,
        turnId: context.turnId,
        messageId: context.messageId,
        title: context.title,
        createdAt: Date.now()
      }

      window.dispatchEvent(new CustomEvent("llm-bookmark-added"))

      return [...prev, entry]
    })
  }

  return (
    <button
      onPointerDown={handlePointerDown}
      aria-label="Bookmark"
      aria-pressed={isBookmarked}
      title={isBookmarked ? "Remove bookmark" : "Bookmark message"}
      className={`
        custom-bookmark-action
        ${isBookmarked ? "text-token-text-primary" : "text-token-text-secondary"}
      `}>
      <Bookmark strokeWidth={2} fill={isBookmarked ? "currentColor" : "none"} />
    </button>
  )
}

export default BookmarkButton
