import { Storage } from "@plasmohq/storage"
import type { Prompt } from "~/interface/Prompt"

const storage = new Storage()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_CATEGORIES") {
    getCategories().then(categories => {
      sendResponse({ categories })
    })
    return true 
  }
  
  if (message.type === "SAVE_PROMPT") {
    savePrompt(message.data).then(result => {
      sendResponse(result)
    })
    return true 
  }
  
  return false
})

async function getCategories(): Promise<string[]> {
  const prompts = await storage.get<Prompt[]>("promptList") || []
  
  const uniqueCategories = Array.from(
    new Set(prompts.map(prompt => prompt.category || "General"))
  )
  
  return ["All", ...uniqueCategories]
}

async function savePrompt(promptData: Prompt): Promise<{ success: boolean, error?: string }> {
  try {
    const prompts = await storage.get<Prompt[]>("promptList") || []
    
    // Add the new prompt to the list
    const updatedPrompts = [...prompts, promptData]
    
    // Save to storage
    await storage.set("promptList", updatedPrompts)
    
    return { success: true }
  } catch (error) {
    console.error("Error saving prompt:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error saving prompt" 
    }
  }
}