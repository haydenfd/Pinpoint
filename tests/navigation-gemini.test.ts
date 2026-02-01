import { describe, expect, it, vi } from "vitest"
import { navigateGemini } from "../utils/navigation/gemini"

describe("navigateGemini", () => {
  it("redirects to gemini.google.com when on a different origin", () => {
    Object.defineProperty(window, "location", {
      value: { origin: "https://example.com", href: "https://example.com" },
      writable: true
    })

    navigateGemini("conv-1", "r_1")

    expect(window.location.href).toBe(
      "https://gemini.google.com/app/conv-1"
    )
  })

  it("pushes state when navigating within Gemini", () => {
    Object.defineProperty(window, "location", {
      value: {
        origin: "https://gemini.google.com",
        href: "https://gemini.google.com/app/old",
        pathname: "/app/old"
      },
      writable: true
    })

    const pushSpy = vi
      .spyOn(window.history, "pushState")
      .mockImplementation(() => {})

    navigateGemini("new", "r_2")

    expect(pushSpy).toHaveBeenCalledWith({}, "", "/app/new")
  })

  it("scrolls to the target response when already in the conversation", () => {
    Object.defineProperty(window, "location", {
      value: {
        origin: "https://gemini.google.com",
        href: "https://gemini.google.com/app/conv",
        pathname: "/app/conv"
      },
      writable: true
    })

    const el = document.createElement("div")
    el.id = "model-response-message-contentr_3"
    const scrollSpy = vi.fn()
    el.scrollIntoView = scrollSpy
    document.body.appendChild(el)

    navigateGemini("conv", "r_3")

    expect(scrollSpy).toHaveBeenCalled()
  })
})
