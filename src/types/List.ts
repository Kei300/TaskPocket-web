export interface ListModel {
  id: string;
  title: string;
  description: string;
  owner_id: string;
  visibility: boolean;
  comments?: string[];
}

export interface CreateListPayload {
  title: string;
  description: string;
  visibility: boolean;
}

export interface UpdateListPayload {
  id: string;
  title?: string;
  description?: string;
  visibility?: boolean;
}
