import type { Platform } from "@types/platform"

type PlatformConfig = {
  id: Platform
  hosts: string[]
}

/**
 * Source of truth for host detection and platform metadata.
 */
export const PLATFORMS: PlatformConfig[] = [
  {
    id: "chatgpt",
    hosts: ["chatgpt.com", "openai.com"]
  }
]
