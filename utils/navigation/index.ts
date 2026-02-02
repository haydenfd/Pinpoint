import type { Platform } from "@types/platform"
import { navigateChatGPT } from "@utils/navigation/chatgpt"

/**
 * Platform-aware navigation entry point used by the sidebar list.
 */
export function navigateToBookmark(
  platform: Platform,
  conversationId: string,
  turnId: string,
  options?: { openInNewTab?: boolean }
) {
  if (platform === "chatgpt") {
    navigateChatGPT(conversationId, turnId, options)
  }
}
