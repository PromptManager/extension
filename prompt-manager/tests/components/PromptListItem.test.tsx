import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import PromptListItem from "../../components/PromptListItem";
import type { Prompt } from "../../interface/Prompt";

const mockPrompt: Prompt = {
  title: "Test Prompt",
  prompt: "This is a test prompt description.",
  tags: ["Tag1", "Tag2"],
};

describe("PromptListItem", () => {
  it("should render the title, description, and tags correctly", () => {
    render(<PromptListItem promptData={mockPrompt} />);

    expect(screen.getByText("Test Prompt")).toBeTruthy();
    expect(screen.getByText("This is a test prompt description.")).toBeTruthy();
    expect(screen.getByText("Tag1, Tag2")).toBeTruthy();
  });

  it("should render correctly with empty tags", () => {
    const mockPromptWithNoTags = { ...mockPrompt, tags: [] };
    render(<PromptListItem promptData={mockPromptWithNoTags} />);

    expect(screen.getByText("Test Prompt")).toBeTruthy();
    expect(screen.getByText("This is a test prompt description.")).toBeTruthy();
    expect(screen.queryByText("Tag1, Tag2")).toBeFalsy();
  });
});