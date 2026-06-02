import type { CreateTodoPayload, Todo, UpdateTodoPayload } from '@/src/types/Todo';
import { authApi } from '../api';

export const fetchTodos = async (full: boolean = true) => {
  const response = await authApi.get('/todo', { params: { full } });
  return response.data;
};

export async function fetchTodosByList(listUuid: string, full = false): Promise<Todo[]> {
  const { data } = await authApi.get<Todo[]>('/todo/list', {
    params: { id: listUuid, full },
  });
  return data;
}

export async function createTodo(payload: CreateTodoPayload): Promise<Todo> {
  const { data } = await authApi.post<Todo>('/todo', payload);
  return data;
}

export async function updateTodo(payload: UpdateTodoPayload): Promise<Todo> {
  const { data } = await authApi.put<Todo>('/todo', payload);
  return data;
}

export async function deleteTodo(id: string): Promise<void> {
  await authApi.delete('/todo', { params: { id } });
}
