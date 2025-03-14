import { useState, useEffect} from "react"

function IndexPopup() {
  const [data, setData] = useState("")
  const [currentUrl, setCurrentUrl] = useState<string>("")

  const getCurrentUrl = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const tab = tabs[0]
    setCurrentUrl(tab.url)
  }

  useEffect(() => {
    getCurrentUrl()
  }, [])

  return (
    <div
      style={{
        padding: 16
      }}>
      <h2>
        You are currently on:
        {currentUrl}
      </h2>
    </div>
  )
}

export default IndexPopup
