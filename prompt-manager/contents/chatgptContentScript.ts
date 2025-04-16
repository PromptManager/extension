import type { PlasmoCSConfig } from "plasmo"
import { findInputElement, setElementValue, simulateEnterKey } from "~/utils/domUtils"

interface FillPromptMessage {
  type: "FILL_CHATGPT_PROMPT";
  prompt: string;
}

interface ScriptResponse {
  success: boolean;
  error?: string;
}

export const config: PlasmoCSConfig = {
  matches: ["https://chatgpt.com/*", "https://chat.openai.com/*"],
  all_frames: true,
  run_at: "document_end"
}

// console.log("Prompt Manager Content Script Loaded for ChatGPT.")

/**
 * Type guard to check if a message matches the FillPromptMessage interface.
 * @param msg The message to check.
 * @returns Boolean indicating if the message is a valid FillPromptMessage.
 */
const isFillPromptMessage = (msg: unknown): msg is FillPromptMessage => {
  return typeof msg === 'object' && msg !== null &&
         'type' in msg && msg.type === "FILL_CHATGPT_PROMPT" &&
         'prompt' in msg && typeof msg.prompt === 'string';
};

/**
 * Handles incoming messages from other parts of the extension (e.g., the popup).
 * Listens for 'FILL_CHATGPT_PROMPT' messages, fills the chat input,
 * and simulates an Enter key press.
 *
 * @param message The message object received.
 * @param sender Information about the script/extension sending the message.
 * @param sendResponse Function to call to send a response back to the sender.
 * @returns True if the response will be sent asynchronously, otherwise false.
 */
const handleMessage = (
    message: unknown,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: ScriptResponse) => void
): boolean => {

  if (!isFillPromptMessage(message)) {
    return false;
  }

  // 2. Find the textarea element using the utility function
  const textareaSelector = '#prompt-textarea';
  const textarea = findInputElement(textareaSelector);

  if (!textarea) {
    console.error("Prompt Manager: Could not find ChatGPT textarea. Autofill failed.");
    sendResponse({ success: false, error: `Required DOM element (${textareaSelector}) not found` });
    return false;
  }

  // Set the value and simulate Enter key press
  try {
    setElementValue(textarea, message.prompt);

    // smol delay
    setTimeout(() => {
      if (document.body.contains(textarea)) {
        simulateEnterKey(textarea);
        sendResponse({ success: true });
      } else {
        console.warn("Prompt Manager: Textarea element disappeared before Enter simulation.");
        sendResponse({ success: false, error: "Textarea disappeared" });
      }
    }, 100);

    return true;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Prompt Manager: Error during prompt fill/send:", errorMessage);
    sendResponse({ success: false, error: errorMessage });
    return false;
  }
};

// Register the message listener
try {
    chrome.runtime.onMessage.addListener(handleMessage);
    // console.log("Prompt Manager: Message listener added successfully.");
} catch (error) {
    console.error("Prompt Manager: Error adding message listener:",
                 error instanceof Error ? error.message : String(error));
}
