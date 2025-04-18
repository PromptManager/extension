import type { ScriptResponse } from "~/interface/ScriptResponse";

interface LlmProvider {
  urls: string[]
  messageType: string
  name: string
  // @panda: We can add a contentScriptSelector if needed in the future
  // contentScriptSelector?: string;
}

const providers: Record<string, LlmProvider> = {
  chatgpt: {
    name: "ChatGPT",
    urls: ["https://chatgpt.com/", "https://chat.openai.com/"],
    messageType: "FILL_CHATGPT_PROMPT"
  }
}

/**
 * Sends a prompt to the content script of the currently active tab if it matches a supported LLM provider.
 * @param prompt The text prompt to send.
 * @returns A promise resolving with the success status and optional error message.
 */
export async function sendPromptToActiveTab(
  prompt: string
): Promise<ScriptResponse> {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    })

    if (!tab?.id || !tab.url) {
      console.error("LLM Integration: Could not find active tab ID or URL.")
      return {
        success: false,
        error: "Could not find an active tab to send the prompt to."
      }
    }

    // Find the matching provider based on the tab's URL
    const providerKey = Object.keys(providers).find((key) =>
      providers[key].urls.some((url) => tab.url?.startsWith(url))
    )

    if (!providerKey) {
      const supportedUrls = Object.values(providers)
        .flatMap((p) => p.urls)
        .join(", ")
      console.warn(
        `LLM Integration: Active tab (URL: ${tab.url}) is not a supported LLM page.`
      )
      return {
        success: false,
        error: `This feature only works when a supported LLM tab (${supportedUrls}) is active. Current active tab: ${tab.url}`
      }
    }

    const provider = providers[providerKey]
    console.log(
      `LLM Integration: Targeting ${provider.name} tab (ID: ${tab.id}, URL: ${tab.url}). Sending prompt.`
    )

    return new Promise<ScriptResponse>((resolve) => {
      chrome.tabs.sendMessage(
        tab.id,
        { type: provider.messageType, prompt: prompt },
        (response: ScriptResponse | undefined) => {
          if (chrome.runtime.lastError) {
            const errorMessage = chrome.runtime.lastError.message
            console.error(
              `LLM Integration: Error sending message to ${provider.name}:`,
              errorMessage
            )
            resolve({
              success: false,
              error: errorMessage?.includes("Receiving end does not exist")
                ? `Error: Could not connect to the Prompt Manager script on the ${provider.name} page. Please ensure the tab is fully loaded and try again. Reloading the tab might help.`
                : `Error sending prompt: ${errorMessage}.`
            })
            return
          }

          if (response?.success) {
            console.log(
              `LLM Integration: Prompt sent successfully to ${provider.name}!`
            )
            resolve({ success: true })
          } else {
            console.error(
              `LLM Integration: Failed to send prompt to ${provider.name}. Response:`,
              response
            )
            resolve({
              success: false,
              error:
                response?.error ||
                `Content script for ${provider.name} did not report success or sent an invalid response.`
            })
          }
        }
      )
    })
  } catch (error: any) {
    const errorMessage = error.message || String(error)
    console.error("LLM Integration: Error querying tabs:", error)
    return { success: false, error: `Error accessing tabs: ${errorMessage}` }
  }
}
