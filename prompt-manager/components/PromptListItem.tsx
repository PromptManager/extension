import React from "react"

import type { Prompt } from "~/interface/Prompt"

const CHATGPT_URLS = ["https://chatgpt.com/", "https://chat.openai.com/"]
const MESSAGE_TYPE_FILL_PROMPT = "FILL_CHATGPT_PROMPT"

interface PromptListItemProps {
  promptData: Prompt
}

export default function PromptListItem({ promptData }: PromptListItemProps) {
  const handleUsePrompt = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      console.log("Attempting to send prompt. Active tab found:", tab)

      if (!tab?.id) {
        console.error("Could not find active tab ID.")
        alert("Could not find an active tab to send the prompt to.")
        return
      }

      const isValidChatGPTTab =
        tab.url && CHATGPT_URLS.some((url) => tab.url?.startsWith(url))

      if (!isValidChatGPTTab) {
        console.warn(`Active tab (URL: ${tab.url}) is not a ChatGPT page.`)
        alert(
          `This feature only works when a ChatGPT tab (${CHATGPT_URLS.join(" or ")}) is active. Current active tab: ${tab.url || "Unknown"}`
        )
        return
      }

      console.log(
        `Targeting ChatGPT tab (ID: ${tab.id}, URL: ${tab.url}). Sending prompt:`,
        promptData.prompt
      )
      chrome.tabs.sendMessage(
        tab.id,
        { type: MESSAGE_TYPE_FILL_PROMPT, prompt: promptData.prompt },
        (response) => {
          // Check for errors *after* the message is sent
          if (chrome.runtime.lastError) {
            const errorMessage = chrome.runtime.lastError.message
            console.error("Error sending message:", errorMessage)
            if (errorMessage?.includes("Receiving end does not exist")) {
              alert(
                `Error: Could not connect to the Prompt Manager script on the ChatGPT page. Please ensure the ChatGPT tab is fully loaded and try again. Reloading the tab might help.`
              )
            } else {
              alert(`Error sending prompt: ${errorMessage}.`)
            }
            return
          }

          if (response?.success) {
            console.log("Prompt sent successfully!")
            window.close()
          } else {
            console.error("Failed to send prompt. Response:", response)
            alert(
              `Failed to send prompt: ${response?.error || "Content script did not report success."}. Check the console on the ChatGPT page for more details.`
            )
          }
        }
      )
    } catch (error: any) {
      const errorMessage = error.message || String(error)
      console.error("Error querying tabs:", error)
      alert(`Error accessing tabs: ${errorMessage}`)
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
        title="Use this prompt in the active ChatGPT tab"
        style={buttonStyle}>
        Use
      </button>
    </li>
  )
}
