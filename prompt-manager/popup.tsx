import { useState, useEffect } from "react"
import PromptList from "~components/PromptList"
import React from "~node_modules/@types/react"
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

  const searchedPrompts: Prompt[] = savedData.filter((promptData) => {
    return promptData.title.toLowerCase().includes(searchQuery.toLowerCase())
      || promptData.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      || promptData.tags.find(tag => tag.includes(searchQuery))
  })

  return (
    <div style={{ padding: 16, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Prompt Manager</h2>

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter Prompt"
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 8,
            borderRadius: 4,
            border: "1px solid #ccc"
          }}
        />
        <button
          onClick={savePrompt}
          style={{
            width: "100%",
            padding: 8,
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          Save Prompt
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <h2 style={{ color: "#333" }}>Search Prompts</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search Saved Prompt"
          style={{
            width: "100%",
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ccc"
          }}
        />
      </div>

      <div>
        <h2 style={{ color: "#333" }}>Saved Prompts</h2>
        <PromptList promptListData={searchedPrompts} />
      </div>
    </div>
  )
}

export default IndexPopup
