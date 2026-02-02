import { error, log, warn } from "@utils/logger"

export {}

/**
 * Background command handler that toggles the sidebar on the active tab.
 * Used for the keyboard shortcut registered in the extension manifest.
 */
chrome.commands.onCommand.addListener(async (command) => {
  // This should show up in the Service Worker console
  log("Command received in background:", command)

  if (command === "toggle-sidebar") {
    log("DETECTED: Command Shift P (toggle-sidebar) triggered!")

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })

      if (!tab?.id) {
        warn("No active tab found to send message to.")
        return
      }

      log(`Sending message to Tab ID: ${tab.id}`)
      
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: "TOGGLE_BOOKMARK_MANAGER"
      })
      
      log("Message sent successfully. Sidebar response:", response)
    } catch (error) {
      error("Error during sidebar toggle:", error)
    }
  }
})
