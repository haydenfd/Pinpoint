import { describe, expect, it } from "vitest"
import { MATCHES } from "@utils/matches"

describe("MATCHES", () => {
  it("includes known LLM host patterns", () => {
    expect(MATCHES).toEqual(
      expect.arrayContaining([
        "https://chatgpt.com/*",
        "https://chat.openai.com/*"
      ])
    )
  })
})
