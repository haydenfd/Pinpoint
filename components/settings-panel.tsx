import { useStorage } from "@plasmohq/storage/hook"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import type { BookmarkEntry } from "@types/bookmark"
import type { BookmarkSettings } from "@types/settings"

const SETTINGS_KEY = "llm-bookmark-settings"
const BOOKMARKS_KEY = "my-bookmarks"

/**
 * Lightweight settings panel for destructive actions and navigation preferences.
 */
type SettingsPanelProps = {
  onBack: () => void
}

export function SettingsPanel({ onBack }: SettingsPanelProps) {
  const [settings, setSettings] = useStorage<BookmarkSettings>(
    SETTINGS_KEY,
    {
      openInNewTab: true
    }
  )
  const [, setBookmarks] = useStorage<BookmarkEntry[]>(BOOKMARKS_KEY, [])
  const [confirmingClear, setConfirmingClear] = useState(false)

  const handleClearAll = () => {
    if (!confirmingClear) {
      setConfirmingClear(true)
      return
    }

    setBookmarks([])
    setConfirmingClear(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={onBack}
        className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
        aria-label="Back to bookmarks"
      >
        <ChevronLeft size={16} />
      </button>

      <section className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Navigation
        </h3>
        <div className="flex flex-col gap-2 text-sm text-neutral-200">
          <div className="font-medium">Open bookmarked message in</div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="open-target"
              checked={!settings?.openInNewTab}
              onChange={() =>
                setSettings((prev) => ({
                  ...(prev ?? { openInNewTab: true }),
                  openInNewTab: false
                }))
              }
              className="
                h-4 w-4
                appearance-none
                rounded-full
                border border-neutral-600
                bg-neutral-900
                transition
                checked:border-purple-500
                checked:ring-2
                checked:ring-purple-500/30
                checked:bg-purple-500
              "
            />
            Same tab
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="open-target"
              checked={!!settings?.openInNewTab}
              onChange={() =>
                setSettings((prev) => ({
                  ...(prev ?? { openInNewTab: true }),
                  openInNewTab: true
                }))
              }
              className="
                h-4 w-4
                appearance-none
                rounded-full
                border border-neutral-600
                bg-neutral-900
                transition
                checked:border-purple-500
                checked:ring-2
                checked:ring-purple-500/30
                checked:bg-purple-500
              "
            />
            New tab
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-md border border-red-900/40 bg-red-950/10 p-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          Clear bookmarks
        </h3>
        <p className="text-xs text-neutral-400">
          This removes all saved bookmarks. Settings are preserved.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearAll}
            className="rounded-md border border-red-500/70 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-900/30"
          >
            {confirmingClear ? "Confirm clear all" : "Clear all bookmarks"}
          </button>
          {confirmingClear && (
            <button
              onClick={() => setConfirmingClear(false)}
              className="text-xs text-neutral-400 hover:text-neutral-200"
            >
              Cancel
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
