import type { PlasmoCSConfig, PlasmoGetOverlayAnchor } from "plasmo"
import { useEffect, useState } from "react"
import cssText from "data-text:./sidebar.css"
import BookmarkList from "@components/bookmark-list"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

/**
 * Injects the sidebar stylesheet as a content script style tag.
 * Plasmo calls this hook to scope styles to the overlay mount.
 */
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

/**
 * Anchors the overlay to the document body so it can be positioned fixed
 * and span the full viewport height.
 */
export const getOverlayAnchor: PlasmoGetOverlayAnchor = async () => {
  return document.body
}

const SIDEBAR_WIDTH = 360

/**
 * Sidebar overlay that hosts the bookmark manager UI.
 * It listens for runtime messages so other extension entry points can toggle it.
 */
const Sidebar = () => {
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
    <div
      className={`
        fixed top-0 right-0 h-screen
        bg-neutral-900 text-neutral-100
        shadow-2xl
        transition-transform duration-500 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
      style={{
        width: SIDEBAR_WIDTH,
        zIndex: 2147483647
      }}
    >
      <div className="flex h-full flex-col px-4 py-3">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              LLM Bookmarks
            </h2>

          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <BookmarkList />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
