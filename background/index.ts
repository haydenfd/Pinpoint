export {}

/**
 * Background command handler that toggles the sidebar on the active tab.
 * Used for the keyboard shortcut registered in the extension manifest.
 */
chrome.commands.onCommand.addListener(async (command) => {
  // This should show up in the Service Worker console
  console.log("Command received in background:", command)

  if (command === "toggle-sidebar") {
    console.log("DETECTED: Command Shift P (toggle-sidebar) triggered!")

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })

      if (!tab?.id) {
        console.warn("No active tab found to send message to.")
        return
      }

      console.log(`Sending message to Tab ID: ${tab.id}`)
      
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: "TOGGLE_BOOKMARK_MANAGER"
      })
      
      console.log("Message sent successfully. Sidebar response:", response)
    } catch (error) {
      console.error("Error during sidebar toggle:", error)
    }
  }
})
