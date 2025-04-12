export interface Prompt {
  title: string;
  prompt: string;
  tags: string[];
  category?: string;
  createdAt: Date;   // <-- New field for timestamp
  website: string;   // <-- New field for website URL
}
