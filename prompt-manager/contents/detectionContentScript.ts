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

function createSavePromptPopup() {
  const existingPopup = document.getElementById("prompt-manager-popup")
  if (existingPopup) {
    existingPopup.remove()
  }

  const popup = document.createElement("div")
  popup.id = "prompt-manager-popup"
  popup.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 12px;
    z-index: 9999;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    display: flex;
    flex-direction: column;
    min-width: 250px;
    animation: slideIn 0.3s ease-out;
  `

  const header = document.createElement("div")
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  `

  const title = document.createElement("h4")
  title.textContent = "Save this prompt?"
  title.style.cssText = `
    margin: 0;
    font-size: 14px;
    color: #333;
  `

  const closeButton = document.createElement("button")
  closeButton.innerHTML = "✕"
  closeButton.style.cssText = `
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: #666;
  `
  closeButton.onclick = () => popup.remove()

  header.appendChild(title)
  header.appendChild(closeButton)
  popup.appendChild(header)

  const categoryLabel = document.createElement("label")
  categoryLabel.textContent = "Category:"
  categoryLabel.style.cssText = `
    font-size: 12px;
    margin-bottom: 4px;
  `
  popup.appendChild(categoryLabel)

  const categorySelect = document.createElement("select")
  categorySelect.id = "prompt-manager-category"
  categorySelect.style.cssText = `
    width: 100%;
    padding: 6px;
    margin-bottom: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 12px;
  `

  const loadingOption = document.createElement("option")
  loadingOption.textContent = "Loading categories..."
  categorySelect.appendChild(loadingOption)
  popup.appendChild(categorySelect)

  const createNewCategoryDiv = document.createElement("div")
  createNewCategoryDiv.id = "create-new-category"
  createNewCategoryDiv.style.cssText = `
    display: none;
    margin-bottom: 8px;
  `

  const newCategoryInput = document.createElement("input")
  newCategoryInput.type = "text"
  newCategoryInput.id = "new-category-input"
  newCategoryInput.placeholder = "New category name"
  newCategoryInput.style.cssText = `
    width: 100%;
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 12px;
  `
  createNewCategoryDiv.appendChild(newCategoryInput)
  popup.appendChild(createNewCategoryDiv)

  const buttonContainer = document.createElement("div")
  buttonContainer.style.cssText = `
    display: flex;
    justify-content: space-between;
    margin-top: 4px;
  `

  const newCategoryButton = document.createElement("button")
  newCategoryButton.textContent = "New Category"
  newCategoryButton.style.cssText = `
    padding: 6px 10px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  `
  newCategoryButton.onclick = () => {
    const newCategoryDiv = document.getElementById("create-new-category")
    if (newCategoryDiv) {
      if (newCategoryDiv.style.display === "none") {
        newCategoryDiv.style.display = "block"
        newCategoryButton.textContent = "Cancel"
      } else {
        newCategoryDiv.style.display = "none"
        newCategoryButton.textContent = "New Category"
      }
    }
  }

  const saveButton = document.createElement("button")
  saveButton.textContent = "Save Prompt"
  saveButton.style.cssText = `
    padding: 6px 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  `
  saveButton.onclick = savePrompt

  buttonContainer.appendChild(newCategoryButton)
  buttonContainer.appendChild(saveButton)
  popup.appendChild(buttonContainer)

  document.body.appendChild(popup)

  const style = document.createElement("style")
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `
  document.head.appendChild(style)

  chrome.runtime.sendMessage({ type: "GET_CATEGORIES" }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error fetching categories:", chrome.runtime.lastError)
      return
    }

    const categorySelect = document.getElementById("prompt-manager-category") as HTMLSelectElement
    if (!categorySelect) return
    
    categorySelect.innerHTML = ""
    
    if (response && response.categories) {
      response.categories.forEach((category: string) => {
        if (category !== "All") {
          const option = document.createElement("option")
          option.value = category
          option.textContent = category
          categorySelect.appendChild(option)
        }
      })
    }
  })
}

function savePrompt() {
  const provider = detectProvider()
  if (!provider) return

  const inputElement = document.querySelector(provider.selector) as HTMLTextAreaElement | null
  if (!inputElement) return

  const promptText = inputElement.value.trim()
  if (!promptText) {
    alert("No prompt text found to save.")
    return
  }

  const newCategoryDiv = document.getElementById("create-new-category")
  const newCategoryInput = document.getElementById("new-category-input") as HTMLInputElement
  const categorySelect = document.getElementById("prompt-manager-category") as HTMLSelectElement
  
  let category = ""
  if (newCategoryDiv && newCategoryDiv.style.display !== "none" && newCategoryInput && newCategoryInput.value.trim()) {
    category = newCategoryInput.value.trim()
  } else if (categorySelect) {
    category = categorySelect.value
  }

  chrome.runtime.sendMessage({
    type: "SAVE_PROMPT",
    data: {
      prompt: promptText,
      category: category || "General",
      title: "",  
      tags: []    
    }
  }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error saving prompt:", chrome.runtime.lastError)
      alert("Failed to save prompt. Please try again.")
      return
    }

    if (response && response.success) {
      const popup = document.getElementById("prompt-manager-popup")
      if (popup) {
        popup.remove()
      }
      
      showNotification("Prompt saved successfully!")
    } else {
      alert("Failed to save prompt. Please try again.")
    }
  })
}

function showNotification(message: string) {
  const notification = document.createElement("div")
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #28a745;
    color: white;
    padding: 10px 16px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 10000;
    animation: fadeIn 0.3s ease-out;
  `
  
  document.body.appendChild(notification)
  
  const style = document.createElement("style")
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `
  document.head.appendChild(style)
  
  setTimeout(() => {
    notification.style.animation = "fadeOut 0.3s ease-in"
    notification.style.opacity = "0"
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

function setupInputWatcher() {
  const provider = detectProvider()
  if (!provider) return
  
  const watchForInput = () => {
    const inputElement = document.querySelector(provider.selector) as HTMLTextAreaElement | null
    if (!inputElement) {
      setTimeout(watchForInput, 1000)
      return
    }
    
    let typingTimer: number | null = null
    const doneTypingInterval = 1500  
    
    inputElement.addEventListener('keyup', function() {
      if (typingTimer) clearTimeout(typingTimer)
      
      if (this.value.trim().length > 10) { 
        typingTimer = setTimeout(createSavePromptPopup, doneTypingInterval) as unknown as number
      }
    })
    
    inputElement.addEventListener('keydown', function() {
      if (typingTimer) clearTimeout(typingTimer)
    })
  }
  
  watchForInput()
}

document.addEventListener('DOMContentLoaded', setupInputWatcher)
setupInputWatcher()

