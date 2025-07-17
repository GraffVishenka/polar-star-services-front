export interface Ticket {
  id: string;
  number: number;
  title: string;
  theme: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  creator: string;
  department: string;
  room: string;
  createdAt: Date;
  deadline: Date;
  assignee: string;
  comments: Comment[];
  attachments: Attachment[];
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  url: string;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  parentId: string | null;
  level: number;
  createdAt: string;
  updatedAt: string;
  images?: string[];
  isExpanded?: boolean;
}