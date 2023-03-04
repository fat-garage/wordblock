export type WordDataType = 'article' | 'text block' | undefined;

export interface WordData {
  content: string;
  author: string;
  tags: string[];
  url: string;
  create_at: number;
  id: string;
  type: WordDataType;
  group: string;
  items?: WordData[];
  status?: string;
  note?: string;
  htmlTags?: string[];
  htmlContent?: string;
}