export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface CreateCategoryPayload {
  name: string;
  color: string;
}

export interface UpdateCategoryPayload {
  id: string;
  name?: string;
  color?: string;
}

export interface AssociateCategoryPayload {
  todoId: string;
  categoryId: string;
}
