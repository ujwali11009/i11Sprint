export type TaskStatus = 'IN PROGRESS' | 'SCHEDULED' | 'COMPLETED' | string;
export type TaskType = 'Operational' | 'Design' | 'Deployment' | 'Development';

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

export interface CustomStatusItem {
  id: string;
  name: string;
  color: string; // e.g. 'bg-purple-600'
}

export interface SubtaskItem {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface TaskCommentItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface AttachmentItem {
  id: string;
  name: string;
  size: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  commentsCount?: number;
  attachmentsCount?: number;
  subtasksCompleted?: number;
  subtasksTotal?: number;
  isAsap?: boolean;
  status: TaskStatus;
  type: TaskType;
  dueDate?: string; // e.g. '19 APR', '17 APR' or null
  dueDay?: string; // e.g. '19'
  dueMonth?: string; // e.g. 'APR'
  assignee: Assignee;
  isHighlighted?: boolean;
  category: 'active' | 'completed';
  subtasksList?: SubtaskItem[];
  commentsList?: TaskCommentItem[];
  attachmentsList?: AttachmentItem[];
}

export interface Project {
  id: string;
  name: string;
  parentProjectId: string | null;
  createdAt: string;
}
