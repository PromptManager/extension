import { describe, expect, it } from "@jest/globals"
import { render, screen } from "@testing-library/react"
import PromptList from "~components/PromptList"
import type { Prompt } from "~types/Prompt"

const mockPromptListData: Prompt[] = [
  {
    title: "Sample Prompt",
    prompt: "This is a sample prompt description.",
    tags: ["Test Tag"]
  },
  {
    title: "Another Prompt",
    prompt: "This is another sample prompt description.",
    tags: ["Another Tag"]
  }
]

describe("PromptList", () => {
  it("should render a list of prompts", () => {
    render(<PromptList promptListData={mockPromptListData} />)

    expect(screen.getByText("Sample Prompt")).toBeTruthy()
    expect(screen.getByText("Another Prompt")).toBeTruthy()
    expect(screen.getByText("This is a sample prompt description.")).toBeTruthy()
    expect(screen.getByText("This is another sample prompt description.")).toBeTruthy()
    expect(screen.getByText("Test Tag")).toBeTruthy()
    expect(screen.getByText("Another Tag")).toBeTruthy()
  })

  it("should render nothing if the prompt list is empty", () => {
    render(<PromptList promptListData={[]} />);
    expect(screen.queryByText("Sample Prompt")).toBeFalsy();
  });
})
