import { describe, expect, it } from "@jest/globals"
import { render, screen, fireEvent } from "@testing-library/react"
import PromptList from "~components/PromptList"
import type { Prompt } from "~interface/Prompt"

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
    render(<PromptList prompts={mockPromptListData} />)

    expect(screen.getByText("Sample Prompt")).toBeTruthy()
    expect(screen.getByText("Another Prompt")).toBeTruthy()
    expect(screen.getByText("This is a sample prompt description.")).toBeTruthy()
    expect(screen.getByText("This is another sample prompt description.")).toBeTruthy()
    expect(screen.getByText("Test Tag")).toBeTruthy()
    expect(screen.getByText("Another Tag")).toBeTruthy()
  })

  it("should render nothing if the prompt list is empty", () => {
    render(<PromptList prompts={[]} />);
    expect(screen.queryByText("Sample Prompt")).toBeFalsy();
  });

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
    },
    {
      title: "Searchable Prompt",
      prompt: "This prompt is meant to be found.",
      tags: ["Search Tag"]
    }
  ];

  describe("PromptList", () => {
    it("should render a list of prompts", () => {
      render(<PromptList prompts={mockPromptListData} />);

      expect(screen.getByText("Sample Prompt")).toBeTruthy();
      expect(screen.getByText("Another Prompt")).toBeTruthy();
      expect(screen.getByText("This is a sample prompt description.")).toBeTruthy();
      expect(screen.getByText("This is another sample prompt description.")).toBeTruthy();
      expect(screen.getByText("Test Tag")).toBeTruthy();
      expect(screen.getByText("Another Tag")).toBeTruthy();
    });

    it("should render nothing if the prompt list is empty", () => {
      render(<PromptList prompts={[]} />);
      expect(screen.queryByText("Sample Prompt")).toBeFalsy();
    });

    it("should filter prompts based on the search query", () => {
      render(<PromptList prompts={mockPromptListData} />);

      const searchInput = screen.getByPlaceholderText("Search Saved Prompt");
      fireEvent.change(searchInput, { target: { value: "Searchable" } });

      expect(screen.getByText("Searchable Prompt")).toBeTruthy();
      expect(screen.queryByText("Sample Prompt")).toBeFalsy();
      expect(screen.queryByText("Another Prompt")).toBeFalsy();
    });

    it("should be case-insensitive when filtering prompts", () => {
      render(<PromptList prompts={mockPromptListData} />);

      const searchInput = screen.getByPlaceholderText("Search Saved Prompt");
      fireEvent.change(searchInput, { target: { value: "search tag" } });

      expect(screen.getByText("Searchable Prompt")).toBeTruthy();
      expect(screen.queryByText("Sample Prompt")).toBeFalsy();
      expect(screen.queryByText("Another Prompt")).toBeFalsy();
    });

    it("should show all prompts when the search query is cleared", () => {
      render(<PromptList prompts={mockPromptListData} />);

      const searchInput = screen.getByPlaceholderText("Search Saved Prompt");
      fireEvent.change(searchInput, { target: { value: "Searchable" } });
      fireEvent.change(searchInput, { target: { value: "" } });

      expect(screen.getByText("Sample Prompt")).toBeTruthy();
      expect(screen.getByText("Another Prompt")).toBeTruthy();
      expect(screen.getByText("Searchable Prompt")).toBeTruthy();
    });
  });
})
