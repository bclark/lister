'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { List, ListItem, Category, CreateListItemInput } from '@/types';
import CategorySelector from '@/components/categories/CategorySelector';
import DraggableList from '@/components/lists/DraggableList';
import AddItemForm from '@/components/lists/AddItemForm';
import ShareButtons from '@/components/sharing/ShareButtons';
import { LogOut, ArrowLeft, Sparkles, Trophy, Star } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              {selectedCategory && (
                <button
                  onClick={handleBackToCategories}
                  className="p-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Star className="h-8 w-8 text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text" />
                  <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {selectedCategory ? `${selectedCategory.display_name} List Builder` : 'List Builder'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 bg-white/80 px-4 py-2 rounded-full border border-gray-200">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-105 border border-purple-200"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!selectedCategory ? (
          <div className="animate-slide-in-up">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-6 py-3 rounded-full mb-6 border border-pink-200">
                <Sparkles className="h-5 w-5 text-pink-600" />
                <span className="text-pink-700 font-medium">✨ Choose Your Adventure ✨</span>
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                What&apos;s Your Passion?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Pick a category and start building your amazing top 10 list! 🚀
              </p>
            </div>
            <CategorySelector
              categories={mockCategories}
              onSelectCategory={handleCategorySelect}
            />
          </div>
        ) : (
          <div className="space-y-12 animate-slide-in-up">
            {/* List Header */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-3 rounded-full mb-6 border border-yellow-200">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-700 font-medium">🏆 Your Top 10 List 🏆</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {list?.title || `My Top ${selectedCategory.display_name}s of ${year}`}
                </h2>
                <p className="text-lg text-gray-600">
                  Drag and drop to reorder your items. Maximum of 10 items allowed.
                </p>
                {list && list.items.length > 0 && (
                  <div className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-teal-100 px-4 py-2 rounded-full">
                    <span className="text-green-700 font-medium">
                      {list.items.length}/10 items added
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Add Item Form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
              <AddItemForm
                onAddItem={handleAddItem}
                disabled={list?.items.length === 10}
              />
            </div>

            {/* Draggable List */}
            {list && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                <DraggableList
                  items={list.items}
                  onReorder={handleReorder}
                  onRemoveItem={handleRemoveItem}
                  maxItems={10}
                />
              </div>
            )}

            {/* Share Buttons */}
            {list && list.items.length > 0 && (
              <div className="text-center bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Share Your Amazing List! 🎉</h3>
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
