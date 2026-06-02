export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Todo {
  uuid: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
  dueDate: string;
  listUuid: string;
  priority: Priority;
  ownerId: string;
  categories?: string[];
}

export interface CreateTodoPayload {
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  listUuid: string;
}

export interface UpdateTodoPayload {
  uuid: string;
  title?: string;
  description?: string;
  completed?: boolean;
  completedAt?: string | null;
  dueDate?: string;
  listUuid?: string;
  priority?: Priority;
  ownerId?: string;
}
