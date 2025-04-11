import { describe, expect, it, jest } from "@jest/globals";
import { render, screen, fireEvent } from "@testing-library/react";
import IndexPopup from "~popup";
import { usePrompts } from "~hooks/usePrompts";

// Mock the usePrompts hook
jest.mock("~hooks/usePrompts");

describe("IndexPopup - Saving and Searching Prompts", () => {
  const mockSetPrompts = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Setup the mock implementation
    (usePrompts as jest.Mock).mockReturnValue({
      prompts: [],
      setPrompts: mockSetPrompts
    });
  });

  describe("Saving Prompts", () => {
    it("should add a new prompt when save button is clicked", () => {
      render(<IndexPopup />);

      // Fill the input field
      const promptInput = screen.getByPlaceholderText("Enter Prompt");
      fireEvent.change(promptInput, { target: { value: "New Test Prompt" } });

      // Click the save button
      const saveButton = screen.getByText("Save Prompt");
      fireEvent.click(saveButton);

      // Check if setPrompts was called
      expect(mockSetPrompts).toHaveBeenCalled();
    });

    it("should not add a prompt if the input is empty", () => {
      render(<IndexPopup />);

      // Click the save button without entering text
      const saveButton = screen.getByText("Save Prompt");
      fireEvent.click(saveButton);

      // Check that setPrompts was not called
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

      // Verify the search input exists
      const searchInput = screen.getByPlaceholderText("Search Saved Prompt");
      expect(searchInput).toBeTruthy();
    });
  });
});