export interface User {
  id: string;
  email: string;
  username?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  icon?: string;
}

export interface ListItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  position: number;
  list_id: string;
  created_at: string;
  updated_at: string;
}

export interface List {
  id: string;
  user_id: string;
  category_id: string;
  year: number;
  title?: string;
  created_at: string;
  updated_at: string;
  items: ListItem[];
}

export interface CreateListItemInput {
  title: string;
  description?: string;
  image_url?: string;
  position: number;
}

export interface UpdateListItemInput {
  title?: string;
  description?: string;
  image_url?: string;
  position?: number;
}
