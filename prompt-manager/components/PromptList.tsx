import PromptListItem from "./PromptListItem";
import type { Prompt } from "../types/Prompt";

const mockPromptListData: [Prompt] = [{
    title: "Sample Prompt",
    prompt: "This is a sample prompt description.",
    tags: ["Test Tag"]
}]

export default function PromptList() {
    return (<div>
        {mockPromptListData.map(item => PromptListItem(item))}
    </div>)
}