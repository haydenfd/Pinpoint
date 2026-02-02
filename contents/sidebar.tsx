import type { PlasmoCSConfig, PlasmoGetOverlayAnchor } from "plasmo"
import { useEffect, useState } from "react"
import cssText from "data-text:./sidebar.css"
import { BookmarkList } from "@components/bookmark-list"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

/**
 * Injects the sidebar stylesheet as a content script style tag.
 * Plasmo calls this hook to scope styles to the overlay mount.
 */
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
    :host {
      all: initial;
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      pointer-events: none;
    }

    :host, :host * {
      box-sizing: border-box;
    }

    ${cssText}
  `
  return style
}

/**
 * Anchors the overlay to the document root so it doesn't participate
 * in any site-owned layout containers.
 */
export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () => {
  return document.documentElement
}

const SIDEBAR_WIDTH = 420

/**
 * Sidebar overlay that hosts the bookmark manager UI.
 * It listens for runtime messages so other extension entry points can toggle it.
 */
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleMessage = (request: any) => {
      if (request.type === "TOGGLE_BOOKMARK_MANAGER") {
        setIsOpen((prev) => !prev)
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

return (
    <div className="fixed inset-0 pointer-events-none">
      <div
        className={`
          absolute top-0 right-0 h-screen flex flex-col
          bg-neutral-900 text-neutral-100
          shadow-2xl
          transition-transform duration-500 ease-in-out
          pointer-events-auto
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        style={{
          width: SIDEBAR_WIDTH
        }}
      >
        {/* Header: shrink-0 ensures it doesn't get squished */}
        <div className="flex-shrink-0 px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">LLM Bookmarks</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition"
          >
            ✕
          </button>
        </div>

        {/* Content Area: flex-1 takes remaining space, overflow-hidden keeps scrollbar at this level */}
        <div className="flex-1 overflow-hidden flex flex-col px-4 py-4">
          <BookmarkList />
        </div>
      </div>
    </div>
)
}

export default Sidebar
