import type { Comment, CreateCommentPayload } from '@/src/types/Comment';
import { authApi } from '../api';

export async function fetchComments(listId: string): Promise<Comment[]> {
  const { data } = await authApi.get<Comment[]>('/comment', { params: { listId } });
  return data;
}

export async function createComment(payload: CreateCommentPayload): Promise<Comment> {
  const { data } = await authApi.post<Comment>('/comment', payload);
  return data;
}
