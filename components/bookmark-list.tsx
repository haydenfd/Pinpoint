import { useState, useMemo, useRef, useEffect } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { Pencil, Trash2, Check, X, ExternalLink } from "lucide-react"
import type { BookmarkEntry } from "@types/bookmark"
import { navigateToBookmark } from "@utils/navigation"

const PLATFORM_OPTIONS = [
  { id: "all", label: "All Platforms" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "gemini", label: "Gemini" }
]

/**
 * Renders a single bookmark with inline edit/delete actions and
 * aggressive event suppression to avoid interfering with host app shortcuts.
 */
const BookmarkItem = ({ 
  bookmark, 
  onUpdate, 
  onDelete 
}: { 
  bookmark: BookmarkEntry, 
  onUpdate: (id: string, t: string) => void, 
  onDelete: (id: string) => void 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(bookmark.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  /**
   * Persists the edited title and exits edit mode.
   * Keeps empty strings from overwriting stored titles.
   */
  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (editValue.trim()) {
      onUpdate(bookmark.id, editValue.trim())
      setIsEditing(false)
    }
  }

  /**
   * Restores the original title and exits edit mode.
   */
  const handleCancel = () => {
    setEditValue(bookmark.title)
    setIsEditing(false)
  }

  /**
   * Stops keyboard events from leaking to the host app (e.g., ChatGPT)
   * while still allowing Enter/Escape to control the inline editor.
   */
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation()
    if (e.key === "Enter") {
      e.preventDefault()
      handleSave()
    } else if (e.key === "Escape") {
      e.preventDefault()
      handleCancel()
    }
  }

  /**
   * Extra key event suppression to avoid host app hotkeys while editing.
   */
  const handleInputKeyUp = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    e.stopPropagation()
  }

  /**
   * Ensures input events don't bubble into the host page event handlers.
   */
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setEditValue(e.currentTarget.value)
  }

  return (
    <div 
      className="group relative flex flex-col rounded-lg border border-neutral-800 bg-neutral-800/30 p-3 transition-all hover:border-neutral-600 hover:bg-neutral-800/80"
      // 🔥 Stop propagation at container level when editing
      onKeyDown={(e) => isEditing && e.stopPropagation()}
      onKeyUp={(e) => isEditing && e.stopPropagation()}
      onKeyPress={(e) => isEditing && e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-tighter text-purple-400 opacity-80">
          {bookmark.platform}
        </span>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} 
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <Pencil size={13} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(bookmark.id); }} 
                className="text-neutral-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="flex items-center gap-1">
          <input
            ref={inputRef}
            className="flex-1 bg-neutral-950 border border-purple-500 rounded px-2 py-1 text-sm text-white outline-none focus:ring-0"
            value={editValue}
            onInput={handleInput}
            onKeyDown={handleInputKeyDown}
            onKeyUp={handleInputKeyUp}
            onKeyPress={handleInputKeyPress}
            onBlur={() => {
              setTimeout(() => handleSave(), 150)
            }}
          />
          <button 
            type="submit" 
            onMouseDown={(e) => e.preventDefault()} 
            className="text-green-500 hover:text-green-400 p-1"
          >
            <Check size={16} />
          </button>
          <button 
            type="button" 
            onClick={handleCancel} 
            onMouseDown={(e) => e.preventDefault()}
            className="text-neutral-500 hover:text-white p-1"
          >
            <X size={16} />
          </button>
        </form>
      ) : (
        <div 
        className="cursor-pointer flex items-start justify-between gap-2"
        onClick={() =>
          navigateToBookmark(
            bookmark.platform,
            bookmark.conversationId,
            bookmark.turnId
          )
        }        
        >
          <p className="text-sm leading-snug text-neutral-200 line-clamp-2 transition-colors group-hover:text-white">
            {bookmark.title}
          </p>
          <ExternalLink size={12} className="mt-1 text-neutral-600 group-hover:text-neutral-400 flex-shrink-0" />
        </div>
      )}
    </div>
  )
}

/**
 * Main bookmark manager list with search, platform filter, and sorting.
 */
const BookmarkList = () => {
  const [bookmarks, setBookmarks] = useStorage<BookmarkEntry[]>("my-bookmarks", [])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("all")

  /**
   * Applies platform + text filters and sorts by newest first.
   */
  const filteredBookmarks = useMemo(() => {
    return (bookmarks || [])
      .filter((b) => (selectedPlatform === "all" ? true : b.platform === selectedPlatform))
      .filter((b) => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [bookmarks, selectedPlatform, searchQuery])

  /**
   * Updates the title for a single bookmark entry.
   */
  const handleUpdate = (id: string, newTitle: string) => {
    setBookmarks(prev => prev.map(b => b.id === id ? { ...b, title: newTitle } : b))
  }

  /**
   * Confirms and removes a bookmark entry.
   */
  const handleDelete = (id: string) => {
    if (window.confirm("Delete this bookmark?")) {
      setBookmarks(prev => prev.filter(b => b.id !== id))
    }
  }

  if (!bookmarks?.length) {
    return <div className="text-center py-10 text-sm text-neutral-500 italic">No bookmarks saved yet.</div>
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Filter - Prevent keyboard bubbling here too */}
      <div className="flex flex-col gap-2" onKeyDown={(e) => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Search bookmarks..."
          className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-white focus:border-purple-500 outline-none transition-all placeholder:text-neutral-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-white outline-none focus:border-purple-500 cursor-pointer"
        >
          {PLATFORM_OPTIONS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 custom-scrollbar">
        {filteredBookmarks.length === 0 ? (
          <div className="text-center py-10 text-sm text-neutral-500">No matches found.</div>
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

export default BookmarkList
