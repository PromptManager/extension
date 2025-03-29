chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "prompt_captured") {
      console.log("Prompt captured:", message.payload)
      // Handle storing the prompt
      chrome.storage.local.set({
        [`prompt_${Date.now()}`]: message.payload
      })
    }
  })
  
  export {}