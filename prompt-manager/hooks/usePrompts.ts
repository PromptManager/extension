import { useStorage } from "@plasmohq/storage/hook"

import type { Prompt } from "../interface/Prompt"

export function usePrompts()  {
  // Set an initial value of an empty array if there’s no data yet.
  const [promptStorage, setPromptStorage] = useStorage<Prompt[]>(
    "promptList",
    []
  )

  const prompts = promptStorage ?? []
  const setPrompts = setPromptStorage

  return {prompts, setPrompts}
}
