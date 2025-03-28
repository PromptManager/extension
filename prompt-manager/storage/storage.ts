import { storage } from '@plasmohq/storage'
import type { Prompt } from '../types/Prompt'

const STORAGE_KEY = "promptList";

// Retrieve all saved prompts from storage
export async function getPrompts(): Promise<Prompt[]> {
  const data = await storage.get(STORAGE_KEY)
  return (data as Prompt[]) || []
}

// Append a new prompt to the storage
export async function addPrompt(newPrompt: Prompt): Promise<void> {
  const prompts = await getPrompts()
  prompts.push(newPrompt)
  await storage.set(STORAGE_KEY, prompts)
}
