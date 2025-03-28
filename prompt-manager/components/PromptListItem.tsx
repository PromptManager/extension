import React from "~node_modules/@types/react"
import type { Prompt } from "../interface/Prompt"

export default function PromptListItem({ promptData }: { promptData: Prompt }) {
    return (
        <li style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.2em' }}>{promptData.title}</div>
            <div style={{ margin: '10px 0' }}>{promptData.prompt}</div>
            <div style={{ color: '#555' }}>{promptData.tags.join(', ')}</div>
        </li>
    )
}
