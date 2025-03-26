import { useState, useEffect} from "react"

function IndexPopup() {
  const [data, setData] = useState("")
  const [savedData, setSavedData] = useState<string[]>([])
  const [currentUrl, setCurrentUrl] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const getCurrentUrl = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const tab = tabs[0]
    setCurrentUrl(tab.url)
  }

  useEffect(() => {
    getCurrentUrl()
  }, [])

  const savePrompt = () => {
    if (data.trim() !== "") {
      setSavedData([...savedData, data])
      setData("")
    }
  }

  const searchedPrompts = savedData.filter((prompt: string) => {
    return prompt.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div
      style={{
        padding: 16
      }}>
      <h2>Prompt Manager</h2>

      <input
        type = "text"
        value = {data}
        onChange = {(e) => setData(e.target.value)}
        placeholder = "Enter Prompt"
      />
      <button onClick = {savePrompt} style = {{width: "100%", padding: 8}}>
        Save Prompt
      </button>

      <h2>Search Prompts</h2>
      <input
        type = "text"
        value = {searchQuery}
        onChange = {(e) => setSearchQuery(e.target.value)}
        placeholder = "Search Saved Prompt"
      />

      <h2>Saved Prompts</h2>
      <ul>
        {searchedPrompts.map((prompt, index) => (
          <li key = {index}>{prompt}</li>
        ))}
      </ul>

      <p>
        You are currently on:
        {currentUrl}
      </p>
    </div>
  )
}

export default IndexPopup
