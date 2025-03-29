import { useEffect, useState } from "react"

export function useCurrentTabUrl(): string {
  const [url, setUrl] = useState<string>("")

  useEffect(() => {
    // Helper function to fetch the current active tab URL
    async function fetchUrl() {
      try {
        const tabs = await chrome.tabs.query({
          active: true,
          currentWindow: true
        })
        if (tabs && tabs.length > 0) {
          setUrl(tabs[0].url || "")
        }
      } catch (error) {
        console.error("Error fetching active tab URL:", error)
      }
    }

    // Initial fetch of the URL when the hook mounts
    fetchUrl()

    // Listener for tab updates (e.g., URL changes)
    const handleTabUpdated = (
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab
    ) => {
      if (changeInfo.url) {
        setUrl(changeInfo.url)
      }
    }

    // Listener for tab activation (when the user switches tabs)
    const handleTabActivated = async (
      activeInfo: chrome.tabs.TabActiveInfo
    ) => {
      await fetchUrl()
    }

    // Add the listeners
    chrome.tabs.onUpdated.addListener(handleTabUpdated)
    chrome.tabs.onActivated.addListener(handleTabActivated)

    // Cleanup: Remove event listeners on unmount
    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdated)
      chrome.tabs.onActivated.removeListener(handleTabActivated)
    }
  }, [])

  return url
}
