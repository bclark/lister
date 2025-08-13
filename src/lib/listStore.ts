import { List, ListItem, CreateListItemInput } from '@/types';

const LISTS_STORAGE_KEY = 'lister-user-lists';

export interface ListStore {
  getLists: (userId: string) => List[];
  saveList: (list: List) => void;
  deleteList: (listId: string) => void;
  updateList: (list: List) => void;
  addItemToList: (listId: string, item: Omit<CreateListItemInput, 'position'>) => void;
  removeItemFromList: (listId: string, itemId: string) => void;
  reorderListItems: (listId: string, items: ListItem[]) => void;
}

class LocalListStore implements ListStore {
  private getStorageKey(userId: string): string {
    return `${LISTS_STORAGE_KEY}-${userId}`;
  }

  private getListsFromStorage(userId: string): List[] {
    try {
      const stored = localStorage.getItem(this.getStorageKey(userId));
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading lists from storage:', error);
      return [];
    }
  }

  private saveListsToStorage(userId: string, lists: List[]): void {
    try {
      localStorage.setItem(this.getStorageKey(userId), JSON.stringify(lists));
    } catch (error) {
      console.error('Error saving lists to storage:', error);
    }
  }

  getLists(userId: string): List[] {
    return this.getListsFromStorage(userId);
  }

  saveList(list: List): void {
    const lists = this.getListsFromStorage(list.user_id);
    const existingIndex = lists.findIndex(l => l.id === list.id);
    
    if (existingIndex >= 0) {
      lists[existingIndex] = list;
    } else {
      lists.push(list);
    }
    
    this.saveListsToStorage(list.user_id, lists);
  }

  deleteList(listId: string): void {
    // We need to find the list first to get the user_id
    const allUsers = this.getAllUsers();
    for (const userId of allUsers) {
      const lists = this.getListsFromStorage(userId);
      const filteredLists = lists.filter(l => l.id !== listId);
      if (filteredLists.length !== lists.length) {
        this.saveListsToStorage(userId, filteredLists);
        break;
      }
    }
  }

  updateList(list: List): void {
    this.saveList(list);
  }

  addItemToList(listId: string, item: Omit<CreateListItemInput, 'position'>): void {
    const allUsers = this.getAllUsers();
    for (const userId of allUsers) {
      const lists = this.getListsFromStorage(userId);
      const listIndex = lists.findIndex(l => l.id === listId);
      
      if (listIndex >= 0) {
        const list = lists[listIndex];
        const newItem: ListItem = {
          id: `item-${Date.now()}`,
          ...item,
          position: list.items.length + 1,
          list_id: list.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        list.items.push(newItem);
        list.updated_at = new Date().toISOString();
        
        // If list is full, remove the last item
        if (list.items.length > 10) {
          list.items.pop();
        }
        
        // Update positions
        list.items = list.items.map((item, index) => ({
          ...item,
          position: index + 1,
        }));
        
        this.saveListsToStorage(userId, lists);
        break;
      }
    }
  }

  removeItemFromList(listId: string, itemId: string): void {
    const allUsers = this.getAllUsers();
    for (const userId of allUsers) {
      const lists = this.getListsFromStorage(userId);
      const listIndex = lists.findIndex(l => l.id === listId);
      
      if (listIndex >= 0) {
        const list = lists[listIndex];
        list.items = list.items
          .filter(item => item.id !== itemId)
          .map((item, index) => ({
            ...item,
            position: index + 1,
          }));
        
        list.updated_at = new Date().toISOString();
        this.saveListsToStorage(userId, lists);
        break;
      }
    }
  }

  reorderListItems(listId: string, items: ListItem[]): void {
    const allUsers = this.getAllUsers();
    for (const userId of allUsers) {
      const lists = this.getListsFromStorage(userId);
      const listIndex = lists.findIndex(l => l.id === listId);
      
      if (listIndex >= 0) {
        const list = lists[listIndex];
        list.items = items.map((item, index) => ({
          ...item,
          position: index + 1,
        }));
        
        list.updated_at = new Date().toISOString();
        this.saveListsToStorage(userId, lists);
        break;
      }
    }
  }

  private getAllUsers(): string[] {
    const users: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(LISTS_STORAGE_KEY)) {
        const userId = key.replace(`${LISTS_STORAGE_KEY}-`, '');
        if (userId) {
          users.push(userId);
        }
      }
    }
    return users;
  }
}

export const listStore = new LocalListStore();
