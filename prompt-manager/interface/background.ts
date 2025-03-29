import { Storage } from "@plasmohq/storage"
import type { Prompt } from "../interface/Prompt"

const storage = new Storage()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "prompt_captured") {
    const newPrompt: Prompt = {
      title: `Captured from ${message.payload.llm}`,
      prompt: message.payload.prompt,
      tags: [message.payload.llm]
    }
    storage.get<Prompt[]>("promptList").then(prompts => {
      storage.set("promptList", [...(prompts || []), newPrompt])
    })
  }
})

export {}