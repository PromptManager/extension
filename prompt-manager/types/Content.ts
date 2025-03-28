import exp from "constants"
import type { PlasmoCSConfig } from "plasmo"
 
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
    return Object.keys(prompt_selectors).find(
        platform => hostName.includes(platform)
    ) as keyof typeof prompt_selectors | null
}

function getPrompt(selector: string): string | null {
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

function main() {
    const llm = detectLLM()

    if (!llm) {
        console.log("Unsupported LLM platform.")
        return
    }

    const selector = prompt_selectors[llm]

    const sendPrompt = (prompt: string) => {
        chrome.runtime.sendMessage({
            type: "prompt_captured",
            payload: {
                prompt,
                llm,
                url: window.location.href
            }
        })
    }

    const observePromptInput = () => {
        const targetNode = document.querySelector(selector)
    
        if (!targetNode) {
            console.log("Prompt input not found.")
            return
        }
    
        const config = {
            characterData: true,
            childList: true,
            subtree: true
        }
    
        const callback: MutationCallback = (mutationsList) => {
            for (const mutation of mutationsList) {
                const prompt = getPrompt(selector)
                if (prompt) {
                    sendPrompt(prompt)
                }
            }
        }
    
        const observer = new MutationObserver(callback)
        observer.observe(targetNode, config)
    }
    
    const initialPrompt = getPrompt(selector)
    if (initialPrompt) {
        sendPrompt(initialPrompt)
    }

    observePromptInput()
}

main()

export {}