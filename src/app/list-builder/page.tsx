'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { List, ListItem, Category, CreateListItemInput, SubGenre } from '@/types';
import { listStore } from '@/lib/listStore';
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
    sub_genres: [
      { id: '1-1', name: 'horror', display_name: 'Horror', icon: '👻' },
      { id: '1-2', name: 'sci-fi', display_name: 'Sci-Fi', icon: '🚀' },
      { id: '1-3', name: 'action', display_name: 'Action', icon: '💥' },
      { id: '1-4', name: 'comedy', display_name: 'Comedy', icon: '😂' },
      { id: '1-5', name: 'drama', display_name: 'Drama', icon: '🎭' },
      { id: '1-6', name: 'thriller', display_name: 'Thriller', icon: '😱' },
      { id: '1-7', name: 'romance', display_name: 'Romance', icon: '💕' },
      { id: '1-8', name: 'documentary', display_name: 'Documentary', icon: '📹' },
      { id: '1-9', name: 'animation', display_name: 'Animation', icon: '🎨' },
      { id: '1-10', name: 'fantasy', display_name: 'Fantasy', icon: '🐉' }
    ]
  },
  {
    id: '2',
    name: 'song',
    display_name: 'Song',
    description: 'Your top tracks of the year',
    icon: '🎵',
    sub_genres: [
      { id: '2-1', name: 'pop', display_name: 'Pop', icon: '🎤' },
      { id: '2-2', name: 'rock', display_name: 'Rock', icon: '🎸' },
      { id: '2-3', name: 'hip-hop', display_name: 'Hip-Hop', icon: '🎧' },
      { id: '2-4', name: 'electronic', display_name: 'Electronic', icon: '🎛️' },
      { id: '2-5', name: 'country', display_name: 'Country', icon: '🤠' },
      { id: '2-6', name: 'jazz', display_name: 'Jazz', icon: '🎷' },
      { id: '2-7', name: 'classical', display_name: 'Classical', icon: '🎻' },
      { id: '2-8', name: 'r&b', display_name: 'R&B', icon: '🎹' },
      { id: '2-9', name: 'indie', display_name: 'Indie', icon: '🎪' },
      { id: '2-10', name: 'folk', display_name: 'Folk', icon: '🪕' }
    ]
  },
  {
    id: '3',
    name: 'comic',
    display_name: 'Comic Book',
    description: 'Your favorite comics of the year',
    icon: '📚',
    sub_genres: [
      { id: '3-1', name: 'superhero', display_name: 'Superhero', icon: '🦸' },
      { id: '3-2', name: 'manga', display_name: 'Manga', icon: '🗾' },
      { id: '3-3', name: 'graphic-novel', display_name: 'Graphic Novel', icon: '📖' },
      { id: '3-4', name: 'webcomic', display_name: 'Webcomic', icon: '💻' },
      { id: '3-5', name: 'indie-comic', display_name: 'Indie Comic', icon: '🎨' },
      { id: '3-6', name: 'horror-comic', display_name: 'Horror Comic', icon: '👻' },
      { id: '3-7', name: 'sci-fi-comic', display_name: 'Sci-Fi Comic', icon: '🚀' },
      { id: '3-8', name: 'fantasy-comic', display_name: 'Fantasy Comic', icon: '🐉' },
      { id: '3-9', name: 'slice-of-life', display_name: 'Slice of Life', icon: '☕' },
      { id: '3-10', name: 'crime-comic', display_name: 'Crime Comic', icon: '🕵️' }
    ]
  },
  {
    id: '4',
    name: 'tv-show',
    display_name: 'TV Show',
    description: 'Your top television series of the year',
    icon: '📺',
    sub_genres: [
      { id: '4-1', name: 'drama', display_name: 'Drama', icon: '🎭' },
      { id: '4-2', name: 'comedy', display_name: 'Comedy', icon: '😂' },
      { id: '4-3', name: 'sci-fi', display_name: 'Sci-Fi', icon: '🚀' },
      { id: '4-4', name: 'horror', display_name: 'Horror', icon: '👻' },
      { id: '4-5', name: 'thriller', display_name: 'Thriller', icon: '😱' },
      { id: '4-6', name: 'reality', display_name: 'Reality TV', icon: '📺' },
      { id: '4-7', name: 'documentary', display_name: 'Documentary', icon: '📹' },
      { id: '4-8', name: 'animation', display_name: 'Animation', icon: '🎨' },
      { id: '4-9', name: 'crime', display_name: 'Crime', icon: '🕵️' },
      { id: '4-10', name: 'fantasy', display_name: 'Fantasy', icon: '🐉' }
    ]
  },
  {
    id: '5',
    name: 'book',
    display_name: 'Book',
    description: 'Your favorite books of the year',
    icon: '📖',
    sub_genres: [
      { id: '5-1', name: 'fiction', display_name: 'Fiction', icon: '📚' },
      { id: '5-2', name: 'non-fiction', display_name: 'Non-Fiction', icon: '📖' },
      { id: '5-3', name: 'mystery', display_name: 'Mystery', icon: '🕵️' },
      { id: '5-4', name: 'romance', display_name: 'Romance', icon: '💕' },
      { id: '5-5', name: 'fantasy', display_name: 'Fantasy', icon: '🐉' },
      { id: '5-6', name: 'sci-fi', display_name: 'Sci-Fi', icon: '🚀' },
      { id: '5-7', name: 'horror', display_name: 'Horror', icon: '👻' },
      { id: '5-8', name: 'biography', display_name: 'Biography', icon: '👤' },
      { id: '5-9', name: 'self-help', display_name: 'Self-Help', icon: '💪' },
      { id: '5-10', name: 'poetry', display_name: 'Poetry', icon: '✍️' }
    ]
  },
  {
    id: '6',
    name: 'game',
    display_name: 'Video Game',
    description: 'Your top games of the year',
    icon: '🎮',
    sub_genres: [
      { id: '6-1', name: 'action', display_name: 'Action', icon: '💥' },
      { id: '6-2', name: 'rpg', display_name: 'RPG', icon: '⚔️' },
      { id: '6-3', name: 'strategy', display_name: 'Strategy', icon: '🧠' },
      { id: '6-4', name: 'adventure', display_name: 'Adventure', icon: '🗺️' },
      { id: '6-5', name: 'sports', display_name: 'Sports', icon: '⚽' },
      { id: '6-6', name: 'racing', display_name: 'Racing', icon: '🏎️' },
      { id: '6-7', name: 'puzzle', display_name: 'Puzzle', icon: '🧩' },
      { id: '6-8', name: 'horror', display_name: 'Horror', icon: '👻' },
      { id: '6-9', name: 'indie', display_name: 'Indie', icon: '🎪' },
      { id: '6-10', name: 'multiplayer', display_name: 'Multiplayer', icon: '👥' }
    ]
  },
];

export default function ListBuilderPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubGenre, setSelectedSubGenre] = useState<SubGenre | null>(null);
  const [list, setList] = useState<List | null>(null);
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubGenre(null);
    setList(null);
  };

  const handleSubGenreSelect = (subGenre: SubGenre) => {
    setSelectedSubGenre(subGenre);
    
    // Create a new list or load existing one
    const listId = `list-${Date.now()}`;
    const newList: List = {
      id: listId,
      user_id: user?.id || '',
      category_id: selectedCategory?.id || '',
      year,
      title: `My Top ${subGenre.display_name} ${selectedCategory?.display_name}s of ${year}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [],
    };
    
    // Save the list to storage
    listStore.saveList(newList);
    setList(newList);
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

    const updatedList = {
      ...list,
      items: updatedItems,
      updated_at: new Date().toISOString(),
    };

    // Save to storage
    listStore.saveList(updatedList);
    setList(updatedList);
  };

  const handleReorder = (items: ListItem[]) => {
    if (!list) return;
    
    const updatedList = {
      ...list,
      items,
      updated_at: new Date().toISOString(),
    };
    
    // Save to storage
    listStore.saveList(updatedList);
    setList(updatedList);
  };

  const handleRemoveItem = (itemId: string) => {
    if (!list) return;
    
    const newItems = list.items
      .filter(item => item.id !== itemId)
      .map((item, index) => ({
        ...item,
        position: index + 1,
      }));

    const updatedList = {
      ...list,
      items: newItems,
      updated_at: new Date().toISOString(),
    };
    
    // Save to storage
    listStore.saveList(updatedList);
    setList(updatedList);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubGenre(null);
    setList(null);
  };

  const handleBackToSubGenres = () => {
    setSelectedSubGenre(null);
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:h-20 gap-4 sm:gap-0">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {selectedCategory && (
                <button
                  onClick={selectedSubGenre ? handleBackToSubGenres : handleBackToCategories}
                  className="p-2 sm:p-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0"
                >
                  <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                </button>
              )}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <Star className="h-6 w-6 sm:h-8 sm:w-8 text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text" />
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent truncate">
                  {selectedSubGenre 
                    ? `${selectedSubGenre.display_name} ${selectedCategory?.display_name} List Builder`
                    : selectedCategory 
                    ? `${selectedCategory.display_name} List Builder` 
                    : 'List Builder'
                  }
                </h1>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-600 bg-white/80 px-3 sm:px-4 py-2 rounded-full border border-gray-200 w-full sm:w-auto text-center sm:text-left truncate">
                {user.email}
              </span>
              <button
                onClick={() => router.push('/my-lists')}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-105 border border-purple-200 w-full sm:w-auto text-sm sm:text-base"
              >
                <Trophy size={16} />
                <span>My Lists</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-8 sm:pt-16">
        {!selectedCategory ? (
          <div className="animate-slide-in-up">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6 border border-pink-200">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-pink-600" />
                <span className="text-pink-700 font-medium text-sm sm:text-base">✨ Choose Your Adventure ✨</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                What&apos;s Your Passion?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
                Pick a category and start building your amazing top 10 list! 🚀
              </p>
            </div>
            <CategorySelector
              categories={mockCategories}
              onSelectCategory={handleCategorySelect}
            />
          </div>
        ) : !selectedSubGenre ? (
          <div className="animate-slide-in-up">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6 border border-blue-200">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <span className="text-blue-700 font-medium text-sm sm:text-base">🎯 Pick Your Sub-Genre 🎯</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                {selectedCategory.display_name} Sub-Genres
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
                Choose a specific sub-genre or go with the general category! 🚀
              </p>
            </div>
            
            {/* Sub-Genre Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* General Category Option */}
              <button
                onClick={() => handleSubGenreSelect({
                  id: `${selectedCategory.id}-general`,
                  name: selectedCategory.name,
                  display_name: `All ${selectedCategory.display_name}s`,
                  icon: selectedCategory.icon || '🎯'
                })}
                className="group p-4 sm:p-6 rounded-2xl border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 hover:border-purple-400 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                    {selectedCategory.icon || '🎯'}
                  </div>
                  <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 text-purple-700">
                    All {selectedCategory.display_name}s
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-600">
                    General category
                  </p>
                </div>
              </button>
              
              {/* Sub-Genres */}
              {selectedCategory.sub_genres?.map((subGenre) => (
                <button
                  key={subGenre.id}
                  onClick={() => handleSubGenreSelect(subGenre)}
                  className="group p-4 sm:p-6 rounded-2xl border-2 border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                      {subGenre.icon}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 text-gray-800">
                      {subGenre.display_name}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-12 animate-slide-in-up">
            {/* List Header */}
            <div className="text-center">
              <div className="bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/50 shadow-xl">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-4 sm:mb-6 border border-yellow-200">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                  <span className="text-yellow-700 font-medium text-sm sm:text-base">🏆 Your Top 10 List 🏆</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  {list?.title || `My Top ${selectedSubGenre.display_name} ${selectedCategory.display_name}s of ${year}`}
                </h2>
                <p className="text-base sm:text-lg text-gray-600">
                  Drag and drop to reorder your items. Maximum of 10 items allowed.
                </p>
                {list && list.items.length > 0 && (
                  <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-teal-100 px-3 sm:px-4 py-2 rounded-full">
                    <span className="text-green-700 font-medium text-sm sm:text-base">
                      {list.items.length}/10 items added
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Add Item Form */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50">
              <AddItemForm
                onAddItem={handleAddItem}
                disabled={list?.items.length === 10}
              />
            </div>

            {/* Draggable List */}
            {list && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/50">
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
              <div className="text-center bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-white/50 shadow-xl">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Share Your Amazing List! 🎉</h3>
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
