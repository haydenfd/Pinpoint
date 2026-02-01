import type { Platform } from "./platform"

/**
 * Stored bookmark payload for a specific LLM response.
 * Keeps only identifiers/metadata — no response content.
 */
export type BookmarkEntry = {
  id: string
  platform: Platform
  conversationId: string
  turnId: string
  messageId: string | null
  title: string
  createdAt: number
}
