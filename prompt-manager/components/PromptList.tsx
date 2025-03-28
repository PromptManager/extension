import React from "react";
import PromptListItem from "./PromptListItem";
import type { Prompt } from "../types/Prompt";


export default function PromptList({ promptListData }: { promptListData: Prompt[] }) {
    return (
        <ul style={{ listStyleType: "none", padding: 0 }}>
            {promptListData.map((item, index) => (
                <PromptListItem key={index} promptData={item} />
            ))}
        </ul>
    );
}