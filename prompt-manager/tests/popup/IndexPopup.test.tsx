import { describe, expect, it, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import IndexPopup from "~popup";
import { usePrompts } from "~hooks/usePrompts";

jest.mock("~hooks/usePrompts");

describe("IndexPopup - Saving and Searching Prompts", () => {
  const mockSetPrompts = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (usePrompts as jest.Mock).mockReturnValue({
      prompts: [],
      setPrompts: mockSetPrompts
    });
  });

  describe("Saving Prompts", () => {
    it("should add a new prompt when save button is clicked", () => {
      render(<IndexPopup />);

      const promptInput = screen.getByPlaceholderText("Enter Prompt");
      fireEvent.change(promptInput, { target: { value: "New Test Prompt" } });

      const saveButton = screen.getByText("Save Prompt");
      fireEvent.click(saveButton);

      expect(mockSetPrompts).toHaveBeenCalled();
    });

    it("should not add a prompt if the input is empty", () => {
      render(<IndexPopup />);

      const saveButton = screen.getByText("Save Prompt");
      fireEvent.click(saveButton);

      expect(mockSetPrompts).not.toHaveBeenCalled();
    });
  });

  describe("Searching Prompts", () => {
    it("should render search input", () => {
      (usePrompts as jest.Mock).mockReturnValue({
        prompts: [
          { title: "Work Prompt", prompt: "This is for work", tags: ["work"], category: "Work" },
          { title: "Personal Prompt", prompt: "This is personal", tags: ["personal"], category: "Personal" }
        ],
        setPrompts: mockSetPrompts
      });

      render(<IndexPopup />);

      const searchInput = screen.getByPlaceholderText("Search Saved Prompt");
      expect(searchInput).toBeTruthy();
    });
  });
});