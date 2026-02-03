import type { BookmarkEntry } from "@types/bookmark"
import { log } from "@utils/logger"
import { navigateToBookmark } from "@utils/navigation"
import { Check, Pencil, Trash2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

type BookmarkItemProps = {
  bookmark: BookmarkEntry
  onUpdate: (id: string, title: string) => void
  onDelete: (id: string) => void
  openInNewTab: boolean
}

export function BookmarkItem({
  bookmark,
  onUpdate,
  onDelete,
  openInNewTab
}: BookmarkItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(bookmark.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      const timer = setTimeout(() => inputRef.current?.select(), 10)
      return () => clearTimeout(timer)
    }
  }, [isEditing])

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (editValue.trim()) {
      onUpdate(bookmark.id, editValue.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation()
    setEditValue(bookmark.title)
    setIsEditing(false)
  }

  const stopHostCapture = (e: React.SyntheticEvent | Event | any) => {
    e.stopPropagation()
    e.nativeEvent?.stopImmediatePropagation?.()
  }

  return (
    <div
      className="group relative flex flex-col rounded-lg border border-neutral-800 bg-neutral-800/30 p-3 transition-all hover:border-neutral-600 hover:bg-neutral-800/80"
      onKeyDown={(e) => isEditing && stopHostCapture(e)}
      onKeyUp={(e) => isEditing && stopHostCapture(e)}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-tighter text-purple-400 opacity-80">
          {bookmark.platform}
        </span>

        {!isEditing && (
          <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
              className="text-neutral-500 hover:text-white"
              title="Edit title">
              <Pencil size={13} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(bookmark.id)
              }}
              className="text-neutral-500 hover:text-red-400"
              title="Delete bookmark">
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="flex w-full items-center gap-1.5"
          onClick={stopHostCapture}
          onMouseDown={stopHostCapture}>
          <input
            ref={inputRef}
            className="min-w-0 flex-1 rounded border border-purple-500 bg-neutral-950 px-2 py-1 text-sm text-white outline-none ring-0"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              stopHostCapture(e)
              if (e.key === "Enter") handleSave()
              if (e.key === "Escape") handleCancel()
            }}
          />
          <div className="ml-1 flex items-center gap-3">
            <button
              type="submit"
              className="text-green-500 hover:text-green-400"
              onMouseDown={stopHostCapture}>
              <Check size={16} />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-neutral-500 hover:text-white"
              onMouseDown={stopHostCapture}>
              <X size={16} />
            </button>
          </div>
        </form>
      ) : (
        <button
          className="w-full text-left outline-none"
          onClick={() => {
            log("Clicked Bookmark Entry:", {
              id: bookmark.id,
              title: bookmark.title
            })
            navigateToBookmark(
              bookmark.platform,
              bookmark.conversationId,
              bookmark.turnId,
              { openInNewTab }
            )
          }}>
          <p className="line-clamp-2 text-sm leading-snug text-neutral-200 transition-colors group-hover:text-white">
            {bookmark.title}
          </p>
        </button>
      )}
    </div>
  )
}
