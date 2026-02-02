import "~style.css"
import { useStorage } from "@plasmohq/storage/hook"
import { useEffect, useState } from "react"

function IndexPopup() {
  const [bookmarks] = useStorage("my-bookmarks", [])
  const [isMac, setIsMac] = useState(false)

  // Check OS on mount to show correct shortcut icons
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0)
  }, [])

  const openManager = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    })

    if (!tab?.id) return

    chrome.tabs.sendMessage(tab.id, {
      type: "TOGGLE_BOOKMARK_MANAGER"
    })
    
    window.close()
  }

  return (
    <div className="min-w-[280px] bg-neutral-950 text-neutral-100 border border-neutral-800 shadow-2xl overflow-hidden rounded-none">
      <div className="p-5 flex flex-col items-center gap-4">
        
        <div className="text-center w-full">
          <span className="text-sm font-semibold text-neutral-200 block">
            Pinpoint
          </span>
          <span className="text-[11px] text-neutral-400">
            LLM chat bookmark manager
          </span>
        </div>

        <button
          onClick={openManager}
          className="w-full px-6 py-3 bg-purple-800 hover:bg-purple-400 active:scale-[0.98]
                     text-white text-sm font-semibold rounded-md transition-all shadow-lg shadow-purple-500/20"
        >
          Open Bookmark Manager
        </button>

        {/* Shortcut Hint Section */}
        <div className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
          <span>or</span>
          <div className="flex gap-1.5 items-center">
            {isMac ? (
              <>
                <kbd className="px-1.5 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-xs font-sans">⌘</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-xs font-sans">⇧</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-xs font-sans">P</kbd>
              </>
            ) : (
              <>
                <kbd className="px-1.5 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-[10px]">Ctrl</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-[10px]">Shift</kbd>
                <kbd className="px-1.5 py-0.5 rounded border border-neutral-700 bg-neutral-900 text-[10px]">P</kbd>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
