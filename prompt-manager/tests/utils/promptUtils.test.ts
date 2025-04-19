import { describe, it, jest, expect, beforeEach } from "@jest/globals";
import { exportPrompts, importPrompts } from "../../utils/promptUtils";
import { Prompt } from "~interface/Prompt";

describe("promptUtils", () => {
  const mockPrompts: Prompt[] = [
    { title: "Test Prompt", prompt: "This is a test prompt.", tags: ["Tag1"], createdAt: new Date(),
    website: "https://chatgpt.com/"  },
    { title: "Another Prompt", prompt: "This is another test prompt.", tags: ["Tag2"], createdAt: new Date(),
    website: "https://chatgpt.com/"  },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

    it("should import prompts from a valid JSON file", async () => {
    const file = new File([JSON.stringify(mockPrompts)], "prompts.json", { type: "application/json" });

    const importedPrompts = await importPrompts(file);

    expect(importedPrompts).toEqual(mockPrompts);
  });

  it("should throw an error for an invalid JSON file", async () => {
    const file = new File(["invalid json"], "prompts.json", { type: "application/json" });

    await expect(importPrompts(file)).rejects.toThrow("Invalid JSON file");
  });

  it("should export prompts as a JSON file", () => {

  });

  it("should export prompts as a JSON file", () => {
    const mockCreateObjectURL = jest.fn<() => string>(() => "mocked-url");
    const mockRevokeObjectURL = jest.fn();
    const mockClick = jest.fn();

    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    // Mock document.createElement to return a mock anchor element
    const mockAnchor = { click: mockClick, href: "", download: "" } as unknown as HTMLAnchorElement;
    jest.spyOn(document, "createElement").mockReturnValue(mockAnchor);

    exportPrompts(mockPrompts, "test-prompts.json");

    expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
    expect(mockCreateObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(mockAnchor.href).toBe(mockCreateObjectURL.mock.results[0].value);
    expect(mockAnchor.download).toBe("test-prompts.json");
    expect(mockClick).toHaveBeenCalledTimes(1);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith(mockCreateObjectURL.mock.results[0].value);
  });
});
