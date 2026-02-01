const CHATGPT_ORIGIN = "https://chatgpt.com"

/**
 * Navigates to a ChatGPT conversation and scrolls to the target turn.
 * Handles external origins, cross-conversation jumps, and in-page scrolling.
 */
export function navigateChatGPT(
  conversationId: string,
  turnId: string
) {
  const targetUrl =
    `${CHATGPT_ORIGIN}/c/${conversationId}?bookmark=${turnId}`

  if (window.location.origin !== CHATGPT_ORIGIN) {
    window.location.href = targetUrl
    return
  }

  const currentConversation =
    window.location.pathname.split("/c/")[1]?.split("/")[0] ?? null

  if (currentConversation !== conversationId) {
    window.location.href = `/c/${conversationId}?bookmark=${turnId}`
    return
  }

  scrollChatGPT(turnId)
}

/**
 * Attempts to locate and center the target turn, retrying if it isn't rendered yet.
 */
function scrollChatGPT(turnId: string) {
  const el = document.querySelector(
    `article[data-turn-id="${turnId}"]`
  ) as HTMLElement | null

  if (!el) {
    retry(turnId)
    return
  }

  el.scrollIntoView({ behavior: "smooth", block: "center" })
  highlight(el)
}

/**
 * Retries locating the target turn to accommodate lazy rendering.
 */
function retry(turnId: string, attempts = 10) {
  if (attempts <= 0) return

  setTimeout(() => {
    const el = document.querySelector(
      `article[data-turn-id="${turnId}"]`
    ) as HTMLElement | null

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
      highlight(el)
    } else {
      retry(turnId, attempts - 1)
    }
  }, 300)
}

/**
 * Briefly highlights the target turn to make it easy to spot.
 */
function highlight(el: HTMLElement) {
  const original = el.style.backgroundColor
  el.style.transition = "background-color 0.3s ease"
  el.style.backgroundColor = "rgba(253,224,71,0.35)"
  setTimeout(() => {
    el.style.backgroundColor = original || ""
  }, 3000)
}
