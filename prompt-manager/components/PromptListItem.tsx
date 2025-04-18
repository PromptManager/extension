import React from "react"

import type { Prompt } from "~/interface/Prompt"
import { sendPromptToActiveTab } from "~/services/llmIntegration"

interface PromptListItemProps {
  promptData: Prompt
}

export default function PromptListItem({ promptData }: PromptListItemProps) {
  const handleUsePrompt = async () => {
    console.log("Attempting to send prompt via llmIntegration service...")
    const result = await sendPromptToActiveTab(promptData.prompt)

    if (result.success) {
      console.log("Prompt sent successfully via service!")
      window.close() // Close the popup on success
    } else {
      console.error("Failed to send prompt via service:", result.error)
      alert(
        result.error ||
          "An unknown error occurred while sending the prompt."
      )
    }
  }

  // Styling
  const listItemStyle: React.CSSProperties = {
    border: "1px solid #eee",
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff"
  }

  const contentStyle: React.CSSProperties = {
    flexGrow: 1,
    marginRight: 8
  }

  const titleStyle: React.CSSProperties = {
    fontWeight: "bold",
    marginBottom: "4px"
  }

  const promptTextStyle: React.CSSProperties = {
    margin: "4px 0",
    color: "#555",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: "0.9em"
  }

  const metadataStyle: React.CSSProperties = {
    marginTop: "4px",
    fontSize: "0.8em",
    color: "#888"
  }

  const tagStyle: React.CSSProperties = {
    marginRight: "5px"
  }

  const buttonStyle: React.CSSProperties = {
    marginLeft: 8,
    padding: "4px 8px",
    cursor: "pointer",
    flexShrink: 0,
    border: "none",
    borderRadius: "3px",
    backgroundColor: "#007bff",
    color: "white"
  }

  return (
    <li style={listItemStyle}>
      <div style={contentStyle}>
        <div style={titleStyle}>{promptData.title || "Untitled Prompt"}</div>
        <p style={promptTextStyle}>{promptData.prompt}</p>
        {(promptData.tags?.length || promptData.category) && (
          <div style={metadataStyle}>
            {promptData.tags && promptData.tags.length > 0 && (
              <span style={tagStyle}>Tags: {promptData.tags.join(", ")}</span>
            )}
            {promptData.category && (
              <span>Category: {promptData.category}</span>
            )}
          </div>
        )}
      </div>
      <button
        onClick={handleUsePrompt}
        title="Use this prompt in a valid provider tab"
        style={buttonStyle}>
        Use
      </button>
    </li>
  )
}
