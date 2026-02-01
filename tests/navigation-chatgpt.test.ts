import { describe, expect, it, vi } from "vitest"
import { navigateChatGPT } from "@utils/navigation/chatgpt"

describe("navigateChatGPT", () => {
  it("redirects to chatgpt.com when on a different origin", () => {
    Object.defineProperty(window, "location", {
      value: { origin: "https://example.com", href: "https://example.com" },
      writable: true
    })

    navigateChatGPT("abc123", "turn-1")

    expect(window.location.href).toBe(
      "https://chatgpt.com/c/abc123?bookmark=turn-1"
    )
  })

  it("updates location to the target conversation when needed", () => {
    Object.defineProperty(window, "location", {
      value: {
        origin: "https://chatgpt.com",
        href: "https://chatgpt.com/c/old",
        pathname: "/c/old"
      },
      writable: true
    })

    navigateChatGPT("new-id", "turn-2")

    expect(window.location.href).toBe("/c/new-id?bookmark=turn-2")
  })

  it("scrolls to the target turn when already in the conversation", () => {
    Object.defineProperty(window, "location", {
      value: {
        origin: "https://chatgpt.com",
        href: "https://chatgpt.com/c/abc",
        pathname: "/c/abc"
      },
      writable: true
    })

    const article = document.createElement("article")
    article.setAttribute("data-turn-id", "turn-3")
    const scrollSpy = vi.fn()
    // jsdom doesn't implement scrollIntoView; stub to verify.
    article.scrollIntoView = scrollSpy
    document.body.appendChild(article)

    navigateChatGPT("abc", "turn-3")

    expect(scrollSpy).toHaveBeenCalled()
  })
})
