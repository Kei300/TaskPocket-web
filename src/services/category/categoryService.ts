import type { AssociateCategoryPayload, Category, CreateCategoryPayload, UpdateCategoryPayload } from '@/src/types/Category';
import { authApi } from '../api';

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await authApi.get<Category[]>('/category');
  return data;
}

export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  const { data } = await authApi.post<Category>('/category', payload);
  return data;
}

export async function updateCategory(payload: UpdateCategoryPayload): Promise<Category> {
  const { data } = await authApi.put<Category>('/category', payload);
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  await authApi.delete('/category', { params: { id } });
}

export async function associateCategory(payload: AssociateCategoryPayload): Promise<void> {
  await authApi.post('/category/associate', payload);
}
