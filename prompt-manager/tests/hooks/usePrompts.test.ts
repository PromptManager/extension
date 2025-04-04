import { describe, expect, it, jest } from "@jest/globals"
import { act, renderHook } from "@testing-library/react"

import { useStorage } from "@plasmohq/storage/hook"

import { usePrompts } from "../../hooks/usePrompts"
import type { Prompt } from "../../interface/Prompt"

// Mock the useStorage hook from @plasmohq/storage/hook
jest.mock("@plasmohq/storage/hook", () => ({
  useStorage: jest.fn()
}))

const newPrompt = { title: "Test Title", prompt: "Test Prompt", tags: [] }

describe("usePrompts", () => {
  it("should return an empty array as the initial value for prompts", () => {
    const mockUseStorage = jest.fn(() => [[], jest.fn()])
    ;(useStorage as jest.Mock).mockImplementation(mockUseStorage)

    const { result } = renderHook(() => usePrompts())

    expect(result.current.prompts).toEqual([])
    expect(mockUseStorage).toHaveBeenCalledWith("promptList", [])
  })

  it("should return the stored prompts from the list if they exist", () => {
    const mockPrompts: Prompt[] = [
      { title: "Test Title", prompt: "Test Prompt", tags: [] }
    ]
    const mockUseStorage = jest.fn(() => [mockPrompts, jest.fn()])
    ;(useStorage as jest.Mock).mockImplementation(mockUseStorage)

    const { result } = renderHook(() => usePrompts())

    expect(result.current.prompts).toEqual(mockPrompts)
  })

  it("should allow updating the prompts list", () => {
    const mockSetPromptStorage = jest.fn()
    const mockUseStorage = jest.fn(() => [[], mockSetPromptStorage])
    ;(useStorage as jest.Mock).mockImplementation(mockUseStorage)

    const { result } = renderHook(() => usePrompts())

    act(() => {
      result.current.setPrompts([newPrompt])
    })

    expect(mockSetPromptStorage).toHaveBeenCalledWith([newPrompt])
  })
})
