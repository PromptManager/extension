import type { Prompt } from "../types/Prompt"
export default function PromptListItem({ promptData }: { promptData: Prompt }) {
    return <li>
        <div>{promptData.title}</div>
        <div>{promptData.prompt}</div>
        <div>{promptData.tags.join(', ')}</div>
    </li>
}