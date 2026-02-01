import "~style.css"
import { useStorage } from "@plasmohq/storage/hook"

/**
 * Popup UI for the extension toolbar icon.
 * Keeps the popup lightweight while delegating the real UI to the content sidebar.
 */
function IndexPopup() {
  const [bookmarks] = useStorage("my-bookmarks", [])

  /**
   * Requests the active tab to toggle the sidebar overlay, then closes the popup
   * to keep the browser UI uncluttered after the click.
   */
  const openManager = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    })

    if (!tab?.id) return

    chrome.tabs.sendMessage(tab.id, {
      type: "TOGGLE_BOOKMARK_MANAGER"
    })
    
    // Optional: Close the popup window after clicking
    window.close()
  }

  return (
    <div className="min-w-[260px] bg-neutral-950 text-neutral-100 border border-neutral-800 shadow-2xl">
      <div className="p-4 flex flex-col items-center gap-4">
        <div className="text-center w-full">
          <span className="text-sm font-semibold block">
            LLM Bookmarks
          </span>
        </div>

        <button
          onClick={openManager}
          className="w-full px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 
                     text-xs font-bold tracking-wide transition-colors"
        >
          Open Bookmark Manager
        </button>
      </div>
    </div>
  )
}

export default IndexPopup
