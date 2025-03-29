import { useState } from "react"
import type { Prompt } from "~interface/Prompt"
import PromptList from "~components/PromptList"
import { usePrompts } from "~hooks/usePrompts"

function IndexPopup() {
  const {prompts, setPrompts} = usePrompts();
  const [userInput, setUserInput] = useState("")

  const savePrompt = async () => {
    if (userInput.trim() !== "") {
      const newPrompt: Prompt = { title: "", tags: [], prompt: userInput }

      setPrompts((prompts) => [...prompts, newPrompt])
      setUserInput("")
    }
  }

  return (
    <div style={{ padding: 16, fontFamily: "Arial, sans-serif", minWidth: "350px" }}>
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
            cursor: "pointer",
          }}
        >
          Save Prompt
        </button>
      </div>

      <PromptList prompts={prompts} />
    </div>
  )
}

export default IndexPopup
