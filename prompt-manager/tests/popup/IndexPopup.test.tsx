import { describe, expect, it, jest } from "@jest/globals";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // Add this import for toBeInTheDocument and other matchers
import IndexPopup from "~popup";
import { usePrompts } from "~hooks/usePrompts";

// Mock the usePrompts hook
jest.mock("~hooks/usePrompts", () => ({
  usePrompts: jest.fn()
}));

describe("IndexPopup - Saving and Searching Prompts", () => {
  // Setup mock implementation for usePrompts
  const mockSetPrompts = jest.fn();
  const setupMockUsePrompts = (initialPrompts = []) => {
    (usePrompts as jest.Mock).mockImplementation(() => ({
      prompts: initialPrompts,
      setPrompts: mockSetPrompts
    }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupMockUsePrompts();
  });

  describe("Saving Prompts", () => {
    it("should add a new prompt when save button is clicked", () => {
      setupMockUsePrompts();
      render(<IndexPopup />);

      // Fill the input field
      const promptInput = screen.getByPlaceholderText("Enter Prompt") as HTMLInputElement;
      fireEvent.change(promptInput, { target: { value: "New Test Prompt" } });

      // Click the save button
      const saveButton = screen.getByText("Save Prompt");
      fireEvent.click(saveButton);

      // Check if setPrompts was called with the correct argument
      expect(mockSetPrompts).toHaveBeenCalled();
      const setPromptsFn = mockSetPrompts.mock.calls[0][0];
      const result = setPromptsFn([]);
      
      expect(result).toEqual([
        expect.objectContaining({
          prompt: "New Test Prompt",
          category: "General",
          title: "",
          tags: []
        })
      ]);

      // Check if the input field was cleared
      expect(promptInput.value).toBe("");
    });

    it("should not add a prompt if the input is empty", () => {
      setupMockUsePrompts();
      render(<IndexPopup />);

      // Click the save button without entering text
      const saveButton = screen.getByText("Save Prompt");
      fireEvent.click(saveButton);

      // Check that setPrompts was not called
      expect(mockSetPrompts).not.toHaveBeenCalled();
    });

    it("should allow creating a new category", () => {
      setupMockUsePrompts();
      render(<IndexPopup />);

      // Click the "New" button to show category input
      const newCategoryButton = screen.getByText("New");
      fireEvent.click(newCategoryButton);

      // Enter new category name and click Add
      const categoryInput = screen.getByPlaceholderText("New Category Name") as HTMLInputElement;
      fireEvent.change(categoryInput, { target: { value: "Test Category" } });
      
      const addButton = screen.getByText("Add");
      fireEvent.click(addButton);

      // Now save a prompt with this category
      const promptInput = screen.getByPlaceholderText("Enter Prompt") as HTMLInputElement;
      fireEvent.change(promptInput, { target: { value: "Test Prompt with Custom Category" } });
      
      const saveButton = screen.getByText("Save Prompt");
      fireEvent.click(saveButton);

      // Check that the prompt was saved with the correct category
      expect(mockSetPrompts).toHaveBeenCalled();
      const setPromptsFn = mockSetPrompts.mock.calls[0][0];
      const result = setPromptsFn([]);
      
      expect(result).toEqual([
        expect.objectContaining({
          prompt: "Test Prompt with Custom Category",
          category: "Test Category"
        })
      ]);
    });
  });

  describe("Searching Prompts", () => {
    const mockPrompts = [
      { title: "Work Prompt", prompt: "This is for work", tags: ["work"], category: "Work" },
      { title: "Personal Prompt", prompt: "This is personal", tags: ["personal"], category: "Personal" },
      { title: "Another Work Prompt", prompt: "Another work item", tags: ["work", "important"], category: "Work" }
    ];

    it("should filter prompts by keyword", async () => {
      setupMockUsePrompts(mockPrompts);
      render(<IndexPopup />);

      // Get the PromptList's search input
      const searchInput = screen.getByPlaceholderText("Search Saved Prompt") as HTMLInputElement;
      
      // Search for "work"
      fireEvent.change(searchInput, { target: { value: "work" } });

      // Wait for component to update
      await waitFor(() => {
        // Check that only work prompts are shown
        expect(screen.queryByText("Work Prompt")).toBeInTheDocument();
        expect(screen.queryByText("Another Work Prompt")).toBeInTheDocument();
        expect(screen.queryByText("Personal Prompt")).not.toBeInTheDocument();
      });
    });

    it("should filter prompts by category", async () => {
      setupMockUsePrompts(mockPrompts);
      render(<IndexPopup />);

      // Switch to category search
      const categoryButton = screen.getByText("Category");
      fireEvent.click(categoryButton);

      // Select "Work" category
      const categorySelect = screen.getByRole("combobox") as HTMLSelectElement;
      fireEvent.change(categorySelect, { target: { value: "Work" } });

      // Wait for component to update
      await waitFor(() => {
        // Check that only Work category prompts are shown
        expect(screen.queryByText("Work Prompt")).toBeInTheDocument();
        expect(screen.queryByText("Another Work Prompt")).toBeInTheDocument();
        expect(screen.queryByText("Personal Prompt")).not.toBeInTheDocument();
      });
    });

    it("should show all prompts when search is cleared", async () => {
      setupMockUsePrompts(mockPrompts);
      render(<IndexPopup />);

      // Get the search input
      const searchInput = screen.getByPlaceholderText("Search Saved Prompt") as HTMLInputElement;
      
      // Search for something specific
      fireEvent.change(searchInput, { target: { value: "work" } });
      
      // Then clear the search
      fireEvent.change(searchInput, { target: { value: "" } });

      // Wait for component to update
      await waitFor(() => {
        // Check that all prompts are shown again
        expect(screen.queryByText("Work Prompt")).toBeInTheDocument();
        expect(screen.queryByText("Another Work Prompt")).toBeInTheDocument();
        expect(screen.queryByText("Personal Prompt")).toBeInTheDocument();
      });
    });
  });
});