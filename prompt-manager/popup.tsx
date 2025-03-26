import { useState, useEffect } from "react"
import PromptList from "~components/PromptList"
import type { Prompt } from "~types/Prompt"

const mockPromptListData: Prompt[] = [{
  title: "Sample Prompt",
  prompt: "This is a sample prompt description.",
  tags: ["Test Tag"]
}]


function IndexPopup() {
  const [userInput, setUserInput] = useState("")
  const [savedData, setSavedData] = useState<Prompt[]>(mockPromptListData)
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
    if (userInput.trim() !== "") {
      const newPrompt: Prompt = { title: "", tags: [], prompt: userInput }

      setSavedData([...savedData, newPrompt])
      setUserInput("")
    }
  }

  const searchedPrompts: Prompt[] = savedData.filter((prompt) => {
    return prompt.title.toLowerCase().includes(searchQuery.toLowerCase())
      || prompt.title.toLowerCase().includes(searchQuery.toLowerCase())
      || prompt.tags.find(tag => tag.includes(searchQuery))
  })

  return (
    <div
      style={{
        padding: 16
      }}>
      <h2>Prompt Manager</h2>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter Prompt"
      />
      <button onClick={savePrompt} style={{ width: "100%", padding: 8 }}>
        Save Prompt
      </button>

      <h2>Search Prompts</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search Saved Prompt"
      />

      <h2>Saved Prompts</h2>
      <PromptList promptListData={searchedPrompts} />
    </div>
  )
}

export default IndexPopup
