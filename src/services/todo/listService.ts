import { authApi } from '../api';
import type { ListModel, CreateListPayload, UpdateListPayload } from '@/src/types/List';

export async function fetchLists(): Promise<ListModel[]> {
  const { data } = await authApi.get<ListModel[]>('/list');
  return data;
}

export async function createList(payload: CreateListPayload): Promise<ListModel> {
  const { data } = await authApi.post<ListModel>('/list', payload);
  return data;
}

export async function updateList(payload: UpdateListPayload): Promise<ListModel> {
  const { data } = await authApi.put<ListModel>('/list', payload);
  return data;
}

export async function deleteList(id: string): Promise<void> {
  await authApi.delete('/list', { params: { id } });
}
