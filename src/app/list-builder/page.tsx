'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { List, ListItem, Category, CreateListItemInput } from '@/types';
import CategorySelector from '@/components/categories/CategorySelector';
import DraggableList from '@/components/lists/DraggableList';
import AddItemForm from '@/components/lists/AddItemForm';
import ShareButtons from '@/components/sharing/ShareButtons';
import { LogOut, ArrowLeft } from 'lucide-react';

// Mock data - replace with actual API calls
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'movie',
    display_name: 'Movie',
    description: 'Your favorite films of the year',
    icon: '🎬',
  },
  {
    id: '2',
    name: 'song',
    display_name: 'Song',
    description: 'Your top tracks of the year',
    icon: '🎵',
  },
  {
    id: '3',
    name: 'comic',
    display_name: 'Comic Book',
    description: 'Your favorite comics of the year',
    icon: '📚',
  },
  {
    id: '4',
    name: 'tv-show',
    display_name: 'TV Show',
    description: 'Your top television series of the year',
    icon: '📺',
  },
  {
    id: '5',
    name: 'book',
    display_name: 'Book',
    description: 'Your favorite books of the year',
    icon: '📖',
  },
  {
    id: '6',
    name: 'game',
    display_name: 'Video Game',
    description: 'Your top games of the year',
    icon: '🎮',
  },
];

export default function ListBuilderPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [list, setList] = useState<List | null>(null);
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    // Initialize or load existing list for this category and year
    setList({
      id: 'temp-list',
      user_id: user?.id || '',
      category_id: category.id,
      year,
      title: `My Top ${category.display_name}s of ${year}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [],
    });
  };

  const handleAddItem = (itemData: Omit<CreateListItemInput, 'position'>) => {
    if (!list) return;

    const newItem: ListItem = {
      id: `temp-${Date.now()}`,
      ...itemData,
      position: list.items.length + 1,
      list_id: list.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newItems = [...list.items, newItem];
    
    // If list is full, remove the last item
    if (newItems.length > 10) {
      newItems.pop();
    }

    // Update positions
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    setList({
      ...list,
      items: updatedItems,
      updated_at: new Date().toISOString(),
    });
  };

  const handleReorder = (items: ListItem[]) => {
    if (!list) return;
    setList({
      ...list,
      items,
      updated_at: new Date().toISOString(),
    });
  };

  const handleRemoveItem = (itemId: string) => {
    if (!list) return;
    
    const newItems = list.items
      .filter(item => item.id !== itemId)
      .map((item, index) => ({
        ...item,
        position: index + 1,
      }));

    setList({
      ...list,
      items: newItems,
      updated_at: new Date().toISOString(),
    });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setList(null);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {selectedCategory && (
                <button
                  onClick={handleBackToCategories}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <h1 className="text-xl font-semibold text-gray-900">
                {selectedCategory ? `${selectedCategory.display_name} List Builder` : 'List Builder'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCategory ? (
          <CategorySelector
            categories={mockCategories}
            onSelectCategory={handleCategorySelect}
          />
        ) : (
          <div className="space-y-8">
            {/* List Header */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {list?.title || `My Top ${selectedCategory.display_name}s of ${year}`}
              </h2>
              <p className="text-gray-600">
                Drag and drop to reorder your items. Maximum of 10 items allowed.
              </p>
            </div>

            {/* Add Item Form */}
            <AddItemForm
              onAddItem={handleAddItem}
              disabled={list?.items.length === 10}
            />

            {/* Draggable List */}
            {list && (
              <DraggableList
                items={list.items}
                onReorder={handleReorder}
                onRemoveItem={handleRemoveItem}
                maxItems={10}
              />
            )}

            {/* Share Buttons */}
            {list && list.items.length > 0 && (
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Share Your List</h3>
                <ShareButtons
                  list={list}
                  category={selectedCategory}
                  year={year}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
