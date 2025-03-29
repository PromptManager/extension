export type Prompt = {
    title: string;
    tags: string[];
    prompt: string;
    timestamp?: number;
    source?: string;
    llm?: string
};