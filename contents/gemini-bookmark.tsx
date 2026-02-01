import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchorList
} from "plasmo"
import { useMemo } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { Bookmark, BookmarkCheck } from "lucide-react"
import type { BookmarkEntry } from "@types/bookmark"

export const config: PlasmoCSConfig = {
  matches: ["https://gemini.google.com/*"]
}

/**
 * Targets the Gemini response footer container for button injection.
 */
export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
  return document.querySelectorAll(".buttons-container-v2")
}

/**
 * Extracts Gemini message context from a footer button anchor.
 * This matches the real Gemini DOM structure exactly.
 */
function extractGeminiContext(anchorEl: HTMLElement) {
  const conversationContainer = anchorEl.closest(
    ".conversation-container"
  ) as HTMLElement | null

  if (!conversationContainer) {
    console.warn("[Bookmark] No conversation-container found")
    return null
  }

  const baseId = conversationContainer.id
  if (!baseId) {
    console.warn("[Bookmark] conversation-container has no id")
    return null
  }

  const turnId = `r_${baseId}`

  const markdown = document.getElementById(
    `model-response-message-content${turnId}`
  ) as HTMLElement | null

  if (!markdown) {
    console.warn("[Bookmark] Markdown container not found for", turnId)
    return null
  }

  const text = markdown.innerText.trim()
  if (!text) {
    console.warn("[Bookmark] Empty response text")
    return null
  }

  const title = text.split(/\s+/).slice(0, 12).join(" ")

  return {
    platform: "gemini" as const,
    conversationId: baseId, 
    turnId,
    title
  }
}

const BookmarkButton = ({ anchor }) => {
  const element = anchor?.element as HTMLElement | undefined

  const [bookmarks, setBookmarks] =
    useStorage<BookmarkEntry[]>("my-bookmarks", [])

  const context = useMemo(() => {
    if (!element) {
      console.warn("[Bookmark] No anchor element")
      return null
    }

    const ctx = extractGeminiContext(element)

    if (ctx) {
      console.log("[Bookmark] Context resolved", ctx)
    }

    return ctx
  }, [element])

  const isBookmarked = useMemo(() => {
    if (!context) return false

    return bookmarks.some(
      (b) =>
        b.platform === "gemini" &&
        b.turnId === context.turnId &&
        b.conversationId === context.conversationId
    )
  }, [bookmarks, context])

  /**
   * Toggles a bookmark entry for a Gemini response.
   */
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    console.log("[Bookmark] Button clicked")

    if (!context) {
      console.warn("[Bookmark] Clicked but context missing")
      return
    }

    setBookmarks((prev = []) => {
      const existing = prev.find(
        (b) =>
          b.platform === "gemini" &&
          b.turnId === context.turnId &&
          b.conversationId === context.conversationId
      )

      if (existing) {
        console.log("[Bookmark] Removing bookmark", existing.id)
        return prev.filter((b) => b.id !== existing.id)
      }

      const entry: BookmarkEntry = {
        id: crypto.randomUUID(),
        platform: "gemini",
        conversationId: context.conversationId,
        turnId: context.turnId,
        messageId: null,
        title: context.title,
        createdAt: Date.now()
      }

      console.log("[Bookmark] Adding bookmark", entry)
      window.dispatchEvent(new Event("llm-bookmark-added"))      
      return [...prev, entry]
    })
  }

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        marginLeft: "auto",
        paddingLeft: "4px",
        pointerEvents: "auto"
      }}
    >
      <button
        onClick={handleClick}
        aria-label="Bookmark"
        aria-pressed={isBookmarked}
        title={isBookmarked ? "Remove bookmark" : "Bookmark response"}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "6px",
          borderRadius: "50%",
          color: isBookmarked ? "#a855f7" : "#444746",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s ease, color 0.2s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor =
            "rgba(150,150,150,0.1)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent"
        }}
      >
        {isBookmarked ? (
          <BookmarkCheck size={20} />
        ) : (
          <Bookmark size={20} />
        )}
      </button>
    </div>
  )
}

export default BookmarkButton
