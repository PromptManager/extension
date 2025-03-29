import PromptListItem from "./PromptListItem";
import type { Prompt } from "../interface/Prompt";
import { useState } from "react";

export default function PromptList({ prompts }: { prompts: Prompt[] }) {
    const [searchQuery, setSearchQuery] = useState<string>("")

    const searchedPrompts: Prompt[] = (prompts != undefined ? prompts : []).filter(({ title, prompt, tags }: Prompt) => {
        const query = searchQuery.toLowerCase()
        return (
            title.toLowerCase().includes(query) ||
            prompt.toLowerCase().includes(query) ||
            tags.some((tag) => tag.toLowerCase().includes(query))
        )
    })

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <h2 style={{ color: "#333" }}>Search Prompts</h2>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Saved Prompt"
                    style={{
                        width: "100%",
                        padding: 8,
                        borderRadius: 4,
                        border: "1px solid #ccc"
                    }}
                />
            </div>

            <div>
                <h2 style={{ color: "#333" }}>Saved Prompts</h2>
                <ul style={{ listStyleType: "none", padding: 0 }}>
                    {searchedPrompts.map((item, index) => (
                        <PromptListItem key={index} promptData={item} />
                    ))}
                </ul>
            </div>
        </div>
    );
}
