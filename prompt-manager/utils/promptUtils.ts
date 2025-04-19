import { Prompt } from "~interface/Prompt";

/**
 * Exports the given prompts as a JSON file.
 * @param prompts - The list of prompts to export.
 * @param fileName - The name of the file to save (default: "prompts.json").
 */
export function exportPrompts(prompts: Prompt[], fileName = "prompts.json"): void {
  const dataStr = JSON.stringify(prompts, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Imports prompts from a JSON file.
 * @param file - The file to import.
 * @returns A promise that resolves to the imported prompts.
 */
export function importPrompts(file: File): Promise<Prompt[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const result = event.target?.result as string;
        const rawPrompts = JSON.parse(result);
        const importedPrompts: Prompt[] = rawPrompts.map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt)
        }));
        resolve(importedPrompts);
      } catch (error) {
        reject(new Error("Invalid JSON file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the file"));
    };

    reader.readAsText(file);
  });
}
