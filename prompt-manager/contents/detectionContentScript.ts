import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
    matches: [
        "https://chat.openai.com/*",
        "https://chatgpt.com/*",
        "https://deepseek.com/*",
        "https://chat.deepseek.com/*",
    ],
    all_frames: true,
    run_at: "document_end"
}

const providers = {
    chatgpt: {
      selector: "#prompt-textarea",
      name: "ChatGPT"
    },
    deepseek: {
      selector: "textarea",
      name: "DeepSeek"
    }
}

function detectProvider(): {selector: string, name: string} | null {
    const url = window.location.href
    if (url.includes("chatgpt.com") || url.includes("chat.openai.com")) {
      return providers.chatgpt
    } else if (url.includes("deepseek.com") || url.includes("chat.deepseek.com")) {
      return providers.deepseek
    }
    return null
}

