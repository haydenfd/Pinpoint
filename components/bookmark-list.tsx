import { useMemo, useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"

import type { BookmarkEntry } from "@types/bookmark"
import type { BookmarkSettings } from "@types/settings"
import { BookmarkItem } from "@components/bookmark-item"

/**
 * Main bookmark manager list with search, platform filter, and sorting.
 */
export function BookmarkList() {
  const [bookmarks, setBookmarks] =
    useStorage<BookmarkEntry[]>("my-bookmarks", [])
  const [settings] = useStorage<BookmarkSettings>(
    "llm-bookmark-settings",
    { openInNewTab: true }
  )
  const [searchQuery, setSearchQuery] = useState("")

  /**
   * Applies text filters and sorts by newest first.
   */
  const filteredBookmarks = useMemo(() => {
    return (bookmarks || [])
      .filter((b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [bookmarks, searchQuery])

  /**
   * Updates the title for a single bookmark entry.
   */
  const handleUpdate = (id: string, newTitle: string) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, title: newTitle } : b))
    )
  }

  /**
   * Confirms and removes a bookmark entry.
   */
  const handleDelete = (id: string) => {
    if (window.confirm("Delete this bookmark?")) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id))
    }
  }

  if (!bookmarks?.length) {
    return (
      <div className="py-10 text-center text-sm italic text-neutral-500">
        No bookmarks saved yet.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="flex flex-col gap-2" onKeyDown={(e) => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Search bookmarks..."
          className="
            w-full rounded-md
            bg-neutral-800 border border-neutral-700
            px-3 py-2
            text-sm text-white
            outline-none transition-all
            focus:border-purple-500
            placeholder:text-neutral-500
          "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex max-h-[calc(100vh-220px)] flex-col gap-2 overflow-y-auto pr-1 custom-scrollbar">
        {filteredBookmarks.length === 0 ? (
          <div className="py-10 text-center text-sm text-neutral-500">
            No matches found.
          </div>
        ) : (
          filteredBookmarks.map((b) => (
            <BookmarkItem
              key={b.id}
              bookmark={b}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              openInNewTab={!!settings?.openInNewTab}
            />
          ))
        )}
      </div>
    </div>
  )
}
