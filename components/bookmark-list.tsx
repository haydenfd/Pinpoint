import { useMemo, useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { ChevronDown } from "lucide-react"

import type { BookmarkEntry } from "@types/bookmark"
import { BookmarkItem } from "@components/bookmark-item"

const PLATFORM_OPTIONS = [
  { id: "all", label: "All Platforms" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "gemini", label: "Gemini" }
]

/**
 * Main bookmark manager list with search, platform filter, and sorting.
 */
export function BookmarkList() {
  const [bookmarks, setBookmarks] =
    useStorage<BookmarkEntry[]>("my-bookmarks", [])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("all")

  /**
   * Applies platform + text filters and sorts by newest first.
   */
  const filteredBookmarks = useMemo(() => {
    return (bookmarks || [])
      .filter((b) =>
        selectedPlatform === "all" ? true : b.platform === selectedPlatform
      )
      .filter((b) =>
        b.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [bookmarks, selectedPlatform, searchQuery])

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
      {/* Search & Filter */}
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

        {/* Platform select with custom caret */}
        <div className="relative">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="
              w-full h-9
              appearance-none
              rounded-md
              bg-neutral-800 border border-neutral-700
              px-3 pr-9
              text-sm text-white
              outline-none
              focus:border-purple-500
              cursor-pointer
            "
          >
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="
              pointer-events-none
              absolute right-3 top-1/2
              -translate-y-1/2
              text-neutral-400
            "
          />
        </div>
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
            />
          ))
        )}
      </div>
    </div>
  )
}
