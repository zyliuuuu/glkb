
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export enum SidebarTab {
  New = 'new',
  History = 'history',
  Explore = 'explore',
  API = 'api',
  Library = 'library'
}
