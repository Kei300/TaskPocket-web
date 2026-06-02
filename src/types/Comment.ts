export interface Comment {
  content: string;
  authorName: string;
}

export interface CreateCommentPayload {
  listId: string;
  comment: string;
}
