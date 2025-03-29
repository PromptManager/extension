import type { PlasmoCSConfig } from "plasmo"

interface PromptMessage {
    type: "prompt_captured"
    payload: {
        prompt: string
        llm: "chat.openai.com" | "chat.deepseek.com"
        url: string
        timestamp?: number
        metadata?: {
            model?: string
            conversationId?: string
        }
    }
}
 
export const config: PlasmoCSConfig = {
  matches: ["https://chat.openai.com/*", "https://chat.deepseek.com/*"],
  all_frames: true
}

const prompt_selectors = {
    "chat.openai.com": "textarea[data-id='root']",
    "chat.deepseek.com": "textarea[placeholder='Type your message']"
}

function detectLLM(): keyof typeof prompt_selectors | null {
    const hostName = window.location.host
    console.log("Detecting LLM on:", hostName)
    return Object.keys(prompt_selectors).find(
        platform => hostName.includes(platform)
    ) as keyof typeof prompt_selectors | null
}

export function getPrompt(selector: string): string | null {
    const inputElement = document.querySelector(selector) as HTMLTextAreaElement | HTMLDivElement || null

    if (!inputElement) {
        return null
    }

    if ('value' in inputElement && typeof inputElement.value === 'string') {
        return inputElement.value.trim() || null
    }

    if ('textContent' in inputElement && typeof inputElement.textContent === 'string') {
        return inputElement.textContent.trim() || null
    }
    
    return null
}

function sendPrompt(prompt: string, llm: keyof typeof prompt_selectors): void {
    try {
        const message: PromptMessage = {
            type: "prompt_captured",
            payload: {
                prompt,
                llm,
                url: window.location.href
            }
        }
        chrome.runtime.sendMessage(message)
    } catch (error) {
        console.error('Error sending prompt:', error)
    }
}

function observePromptInput(selector: string, llm: keyof typeof prompt_selectors): void {
    console.log("Observor for:", llm)
    const targetNode = document.querySelector(selector)

    if (!targetNode) {
        console.log("Prompt input not found.")
        return
    }

    const config: MutationObserverInit = {
        characterData: true,
        childList: true,
        subtree: true
    }

    const callback: MutationCallback = () => {
        const prompt = getPrompt(selector)
        if (prompt) {
            sendPrompt(prompt, llm)
        }
    }

    const observer = new MutationObserver(callback)
    observer.observe(targetNode, config)
}

function main(): void {
    if (!chrome.runtime) {
        console.error("Chrome runtime not available.")
        return
    }

    const llm = detectLLM()

    if (!llm) {
        console.log("Unsupported LLM platform.")
        return
    }

    const selector = prompt_selectors[llm]

    const initialPrompt = getPrompt(selector)
    if (initialPrompt) {
        sendPrompt(initialPrompt, llm)
    }

    observePromptInput(selector, llm)
}

if (document.readyState === "complete") {
    main()
} else {
    window.addEventListener("load", main)
}

export {}