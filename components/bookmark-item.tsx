import { useEffect, useRef, useState } from "react"
import { Check, Pencil, Trash2 } from "lucide-react"
import type { BookmarkEntry } from "@types/bookmark"
import { navigateToBookmark } from "@utils/navigation"

type BookmarkItemProps = {
  bookmark: BookmarkEntry
  onUpdate: (id: string, title: string) => void
  onDelete: (id: string) => void
}

/**
 * Renders a single bookmark with inline edit/delete actions and
 * aggressive event suppression to avoid interfering with host app shortcuts.
 */
/**
 * Updated BookmarkItem: 
 * - Replaces the separate link icon with a full-card button interaction.
 * - Optimized for a cleaner sidebar look.
 */
export function BookmarkItem({
  bookmark,
  onUpdate,
  onDelete
}: BookmarkItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(bookmark.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (editValue.trim()) {
      onUpdate(bookmark.id, editValue.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setEditValue(bookmark.title)
    setIsEditing(false)
  }

  // Event suppression for the input field to prevent LLM host shortcuts
  const stopProp = (e: React.KeyboardEvent) => e.stopPropagation()

  return (
    <div
      className="group relative flex flex-col rounded-lg border border-neutral-800 bg-neutral-800/30 p-3 transition-all hover:border-neutral-600 hover:bg-neutral-800/80"
      onKeyDown={(e) => isEditing && e.stopPropagation()}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-tighter text-purple-400 opacity-80">
          {bookmark.platform}
        </span>
        
        {/* Actions - visible only on hover */}
        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          {!isEditing && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                className="text-neutral-500 hover:text-white"
                title="Edit title"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(bookmark.id)
                }}
                className="text-neutral-500 hover:text-red-400"
                title="Delete bookmark"
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
            className="flex-1 rounded border border-purple-500 bg-neutral-950 px-2 py-1 text-sm text-white outline-none focus:ring-0"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              stopProp(e)
              if (e.key === "Enter") handleSave()
              if (e.key === "Escape") handleCancel()
            }}
            onKeyUp={stopProp}
            onBlur={() => setTimeout(() => handleSave(), 150)}
          />
          <button type="submit" className="text-green-500"><Check size={16} /></button>
        </form>
      ) : (
        <button
          className="w-full text-left outline-none"
          onClick={() => {
                      // --- INSPECTION LOG ---
                      console.log("Clicked Bookmark Entry:", {
                        id: bookmark.id,
                        title: bookmark.title,
                        platform: bookmark.platform,
                        conversationId: bookmark.conversationId,
                        turnId: bookmark.turnId,
                        fullData: bookmark 
                      })
                      
                      navigateToBookmark(
                        bookmark.platform,
                        bookmark.conversationId,
                        bookmark.turnId
                      )
                    }}
        >
          <p className="line-clamp-2 text-sm leading-snug text-neutral-200 transition-colors group-hover:text-white">
            {bookmark.title}
          </p>
        </button>
      )}
    </div>
  )
}