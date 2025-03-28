import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import IndexPopup from "~popup";
import { describe, beforeAll, expect, it } from "@jest/globals";
import { jest } from "@jest/globals";

// TODO Mock the chrome.tabs API

describe("IndexPopup", () => {
    it("should update the search query and filter prompts", () => {
        // render(<IndexPopup />);

        // // Type into the search input
        // const searchInput = screen.getByPlaceholderText("Search...");
        // fireEvent.change(searchInput, { target: { value: "Sample" } });

        // // Check if the filtered prompt is displayed
        // expect(screen.getByText("Sample Prompt")).toBeTruthy();
        // expect(screen.queryByText("Another Prompt")).toBeFalsy();
    });
});