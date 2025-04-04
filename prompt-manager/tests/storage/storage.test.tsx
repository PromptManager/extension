import { describe, it, expect, jest, beforeEach } from "@jest/globals"
import type { Prompt } from "~interface/Prompt"


// Setup mocks for the Storage module
const mockGet = jest.fn<(key: string) => Promise<Prompt[] | null>>()
const mockSet = jest.fn<(key: string, prompts: Prompt[]) => Promise<void>>()

// Mock the Storage class from @plasmohq/storage
jest.mock("@plasmohq/storage", () => ({
  Storage: jest.fn().mockImplementation(() => ({
    get: mockGet,
    set: mockSet
  }))
}))



// Import the functions to be tested
import { getPrompts, addPrompt, getCategories } from "~storage/storage"

describe("getPrompts", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns an empty array if no data is stored", async () => {
    mockGet.mockResolvedValueOnce(null)
    const prompts = await getPrompts()
    expect(prompts).toEqual([])
  })

  it("returns stored prompts if any exist", async () => {
    const fakePrompts: Prompt[] = [{ title: "Test", prompt: "Mock prompt", tags: [] }]
    mockGet.mockResolvedValueOnce(fakePrompts)
    const prompts = await getPrompts()
    expect(prompts).toEqual(fakePrompts)
  })
})

describe("addPrompt", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("appends a new prompt to existing prompts", async () => {
    const existingPrompts: Prompt[] = [{ title: "Old", prompt: "Old prompt", tags: [] }]
    const newPrompt: Prompt = { title: "New", prompt: "New prompt", tags: [] }
    mockGet.mockResolvedValueOnce(existingPrompts)

    await addPrompt(newPrompt)

    expect(mockSet).toHaveBeenCalledWith("promptList", [...existingPrompts, newPrompt])
  })
})

describe("getCategories", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("returns default categories if no categories are stored", async () => {
    mockGet.mockResolvedValueOnce(null)
    const categories = await getCategories()
    expect(categories).toEqual(["All"])
  })

  it("returns stored categories if any exist", async () => {
    const storedPrompts: Prompt[] = [
      { title: "Test1", prompt: "Prompt 1", tags: [], category: "General" },
      { title: "Test2", prompt: "Prompt 2", tags: [], category: "Work" },
      { title: "Test3", prompt: "Prompt 3", tags: [], category: "General" }
    ]
    mockGet.mockResolvedValueOnce(storedPrompts)
    
    const categories = await getCategories()
    expect(categories).toEqual(["All", "General", "Work"])
  })

  it("handles prompts with undefined category", async () => {
    const storedPrompts: Prompt[] = [
      { title: "Test1", prompt: "Prompt 1", tags: [], category: "General" },
      { title: "Test2", prompt: "Prompt 2", tags: [] } // No category
    ]
    mockGet.mockResolvedValueOnce(storedPrompts)
    
    const categories = await getCategories()
    expect(categories).toEqual(["All", "General"])
  })
})
