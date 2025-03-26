import PromptListItem from "./PromptListItem";
import type { Prompt } from "../types/Prompt";


export default function PromptList({ promptListData }: { promptListData: Prompt[] }) {
    return <ul>
        {promptListData.map(item => <PromptListItem promptData={item} />)}
    </ul>
}