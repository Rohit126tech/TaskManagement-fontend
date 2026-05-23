export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';

export type TaskPriority = 'Low' | 'Medium' | 'High';
