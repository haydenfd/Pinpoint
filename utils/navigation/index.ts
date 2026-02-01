import type { Platform } from "@types/platform"
import { navigateChatGPT } from "@utils/navigation/chatgpt"
import { navigateGemini } from "@utils/navigation/gemini"

/**
 * Platform-aware navigation entry point used by the sidebar list.
 */
export function navigateToBookmark(
  platform: Platform,
  conversationId: string,
  turnId: string
) {
  if (platform === "chatgpt") {
    navigateChatGPT(conversationId, turnId)
    return
  }

  if (platform === "gemini") {
    navigateGemini(conversationId, turnId)
    return
  }
}
