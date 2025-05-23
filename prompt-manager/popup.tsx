import React, { useState, useEffect } from "react"
import PromptList from "~components/PromptList"
import type { Prompt } from "~interface/Prompt"
import { usePrompts } from "~hooks/usePrompts"
import { ImportBtn } from "~components/ImportBtn";
import { ExportBtn } from "~components/ExportBtn";

function IndexPopup() {
  const { prompts, setPrompts } = usePrompts();
  const [userInput, setUserInput] = useState("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [newCategory, setNewCategory] = useState<string>("")
  const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false)
  const [currentCategory, setCurrentCategory] = useState<string>("General")
  const [categories, setCategories] = useState<string[]>(["All", "General"])

  // Get unique categories from prompts
  useEffect(() => {
    if (prompts && prompts.length > 0) {
      const uniqueCategories = Array.from(
        new Set(prompts.map(prompt => prompt.category || "General"))
      )
      setCategories(["All", ...uniqueCategories])
    }
  }, [prompts])

  const savePrompt = () => {
    if (userInput.trim() !== "") {
      const newPrompt: Prompt = { 
        title: "", 
        tags: [], 
        prompt: userInput, 
        category: currentCategory 
      }

      setPrompts((existingPrompts) => [...existingPrompts, newPrompt])
      setUserInput("")
    }
  }

  const createNewCategory = () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory)) {
      setCurrentCategory(newCategory)
      setCategories(prev => [...prev, newCategory])
      setShowCategoryInput(false)
      setNewCategory("")
    }
  }

  return (
    <div style={{ padding: 16, fontFamily: "Arial, sans-serif", minWidth: "400px" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Prompt Manager</h2>

      <div style={{ marginBottom: 20, padding: 16, backgroundColor: "#f9f9f9", borderRadius: 8 }}>
        <h3 style={{ marginTop: 0, color: "#333" }}>Create New Prompt</h3>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter Prompt"
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 8,
            borderRadius: 4,
            border: "1px solid #ccc"
          }}
        />
        <div style={{ display: "flex", marginBottom: 8, alignItems: "center" }}>
          <label style={{ marginRight: 8 }}>Category:</label>
          {showCategoryInput ? (
            <div style={{ display: "flex", flex: 1 }}>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New Category Name"
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: "4px 0 0 4px",
                  border: "1px solid #ccc"
                }}
              />
              <button
                onClick={createNewCategory}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0 4px 4px 0",
                  cursor: "pointer"
                }}
              >
                Add
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flex: 1 }}>
              <select
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value)}
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 4,
                  border: "1px solid #ccc"
                }}
              >
                {categories.filter(cat => cat !== "All").map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowCategoryInput(true)}
                style={{
                  marginLeft: 8,
                  padding: "8px 12px",
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer"
                }}
              >
                New
              </button>
            </div>
          )}
        </div>
        <button
          onClick={savePrompt}
          style={{
            width: "100%",
            padding: 8,
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          Save Prompt
        </button>
      </div>

      <PromptList 
        prompts={prompts} 
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
        showCategoryInput={showCategoryInput}
        setShowCategoryInput={setShowCategoryInput}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        createNewCategory={createNewCategory}
      />

      <div style={{ display: "flex", gap: "10px", marginTop: 16 }}>
        <ImportBtn />
        <ExportBtn />
        <button onClick={() => (setPrompts(_ => []))}>Reset (only for testing)</button>
      </div>
    </div>
  )
}

export default IndexPopup