import type { Platform } from "../types/platform"

export type Theme = {
  panelBg: string
  cardBg: string
  cardHoverBg: string
  border: string
  text: string
  textMuted: string
  accent: string
}

/**
 * Per-platform theme tokens for consistent styling across UIs.
 */
export const THEMES: Record<Platform, Theme> = {
  chatgpt: {
    panelBg: "#0f0f10",
    cardBg: "#1a1a1f",
    cardHoverBg: "#232329",
    border: "#2a2a30",
    text: "#e5e7eb",
    textMuted: "#9ca3af",
    accent: "#3b82f6"
  },
  gemini: {
    panelBg: "#0f1115",
    cardBg: "#171a21",
    cardHoverBg: "#202431",
    border: "#2a2f3d",
    text: "#e6e7eb",
    textMuted: "#a1a1aa",
    accent: "#8ab4f8"
  }
}
