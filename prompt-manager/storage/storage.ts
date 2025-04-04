import { Storage } from '@plasmohq/storage'
import type { Prompt } from '../interface/Prompt'

const STORAGE_KEY = "promptList";

const storage = new Storage()

// Retrieve all saved prompts from storage
export async function getPrompts(): Promise<Prompt[]> {
  const data = await storage.get<Prompt[]>(STORAGE_KEY)
  return data ?? []
}

// Append a new prompt to the storage 
export async function addPrompt(newPrompt: Prompt): Promise<void> {
  const prompts = await getPrompts()
  await storage.set(STORAGE_KEY, [...prompts, newPrompt])
}

export async function getCategories(): Promise<string[]> {
  const prompts = await getPrompts()
  const categories = Array.from(new Set(prompts.map(prompt => prompt.category || "General")))
  return ["All", ...categories]
}