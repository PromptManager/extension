import PromptListItem from "./PromptListItem";
import type { Prompt } from "../interface/Prompt";
import { useState } from "react";

export default function PromptList({ prompts }: { prompts: Prompt[] }) {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [selectedCategory, setSelectedCategory] = useState<string>("All")
    const [newCategory, setNewCategory] = useState<string>("")
    const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false)
    const [currentCategory, setCurrentCategory] = useState<string>("General")
    const [categories, setCategories] = useState<string[]>(["All", "General"])
    const [searchMethod, setSearchMethod] = useState<"keyword" | "category">("keyword")

    const searchedPrompts: Prompt[] = (prompts != undefined ? prompts : []).filter(({ title, prompt, tags }: Prompt) => {
        const query = searchQuery.toLowerCase()
        return (
            title.toLowerCase().includes(query) ||
            prompt.toLowerCase().includes(query) ||
            tags.some((tag) => tag.toLowerCase().includes(query))
        )
    })

    const createNewCategory = () => {
        if (newCategory.trim() !== "" && !categories.includes(newCategory)) {
          setCurrentCategory(newCategory)
          setCategories(prev => [...prev, newCategory])
          setShowCategoryInput(false)
          setNewCategory("")
        }
      }
    
      const filteredPrompts = prompts.filter((promptData) => {
        if (searchMethod === "keyword" && searchQuery) {
          return (
            (promptData.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
            promptData.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            promptData.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        } else if (searchMethod === "category") {
          return selectedCategory === "All" || promptData.category === selectedCategory;
        }
        return true;
      });

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h3 style={{ margin: 0, color: "#333" }}>Search Prompts</h3>
            <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: 8 }}>Search by:</span>
                <div style={{ display: "flex", border: "1px solid #ccc", borderRadius: 4 }}>
                <button
                    onClick={() => setSearchMethod("keyword")}
                    style={{
                    padding: "5px 8px",
                    backgroundColor: searchMethod === "keyword" ? "#007bff" : "#f0f0f0",
                    color: searchMethod === "keyword" ? "#fff" : "#333",
                    border: "none",
                    borderRadius: "4px 0 0 4px",
                    cursor: "pointer",
                    }}
                >
                    Keyword
                </button>
                <button
                    onClick={() => setSearchMethod("category")}
                    style={{
                    padding: "5px 8px",
                    backgroundColor: searchMethod === "category" ? "#007bff" : "#f0f0f0",
                    color: searchMethod === "category" ? "#fff" : "#333",
                    border: "none",
                    borderRadius: "0 4px 4px 0",
                    cursor: "pointer",
                    }}
                >
                    Category
                </button>
                </div>
            </div>
            </div>

            <div style={{ marginBottom: 16 }}>
            {searchMethod === "keyword" ? (
                <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword..."
                style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 4,
                    border: "1px solid #ccc"
                }}
                />
            ) : (
                <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 4,
                    border: "1px solid #ccc"
                }}
                >
                {categories.map((category) => (
                    <option key={category} value={category}>
                    {category}
                    </option>
                ))}
                </select>
            )}
            </div>

            {filteredPrompts.length > 0 ? (
            <PromptList prompts={filteredPrompts} />
            ) : (
            <div style={{ textAlign: "center", padding: 20, color: "#666" }}>
                No prompts found. Try a different search or create a new prompt.
            </div>
            )}
        </div>
    );
}
