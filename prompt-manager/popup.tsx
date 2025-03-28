import React, { useState, useEffect } from "react"
import PromptList from "~components/PromptList"
import type { Prompt } from "~types/Prompt"
import { getPrompts, addPrompt } from "~storage/storage"

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
    async function loadPrompts() {
      // Try to load stored prompts; if empty, fallback to mock data
      const storedPrompts = await getPrompts()
      if (storedPrompts.length > 0) {
        setSavedData(storedPrompts)
      }
    }
    loadPrompts()
  }, [])

  const savePrompt = async () => {
    if (userInput.trim() !== "") {
      const newPrompt: Prompt = { title: "", tags: [], prompt: userInput }
      await addPrompt(newPrompt)
      // Update local state after saving
      setSavedData(prev => [...prev, newPrompt])
      setUserInput("")
    }
  }

  const searchedPrompts: Prompt[] = savedData.filter((promptData) => {
    return promptData.title.toLowerCase().includes(searchQuery.toLowerCase())
      || promptData.prompt.toLowerCase().includes(searchQuery.toLowerCase())
      || promptData.tags.find(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  })

  return (
    <div style={{ padding: 16, fontFamily: "Arial, sans-serif", minWidth:"400px"}}>
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
