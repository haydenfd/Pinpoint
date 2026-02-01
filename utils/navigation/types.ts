import type { Platform } from "@types/platform"

/**
 * Normalized navigation context used to locate a specific response.
 */
export type BookmarkNavContext = {
  platform: Platform
  conversationId: string
  turnId: string
}
