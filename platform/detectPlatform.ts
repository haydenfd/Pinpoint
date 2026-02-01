import { PLATFORMS } from "@platform/platforms"
import type { Platform } from "@types/platform"

/**
 * Detects which supported platform the current host matches.
 * Defaults to ChatGPT when no explicit match is found.
 */
export function detectPlatform(): Platform {
  const host = window.location.host

  const match = PLATFORMS.find((platform) =>
    platform.hosts.some((h) => host.includes(h))
  )

  return match?.id ?? "chatgpt"
}
